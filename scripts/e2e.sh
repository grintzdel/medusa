#!/usr/bin/env bash
# Runs the Playwright suite against a throwaway database, never the dev one.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PG_URL="${E2E_POSTGRES_URL:-postgres://medusa:medusa@localhost:5432}"
DB_NAME="${E2E_DB_NAME:-medusa_e2e}"
BACKEND_PORT="${E2E_BACKEND_PORT:-9001}"
STOREFRONT_PORT="${E2E_STOREFRONT_PORT:-8001}"

export DATABASE_URL="$PG_URL/$DB_NAME"
export REDIS_URL="${E2E_REDIS_URL:-redis://localhost:6379/1}"
export JWT_SECRET="${JWT_SECRET:-e2e-jwt-secret}"
export COOKIE_SECRET="${COOKIE_SECRET:-e2e-cookie-secret}"
export STORE_CORS="http://localhost:$STOREFRONT_PORT"
export ADMIN_CORS="http://localhost:$BACKEND_PORT"
export AUTH_CORS="http://localhost:$BACKEND_PORT"

sql() {
  local db="$1" query="$2"
  if command -v psql >/dev/null; then
    psql "$PG_URL/$db" -v ON_ERROR_STOP=1 -tA -c "$query"
  else
    docker compose -f "$ROOT/docker-compose.yml" exec -T postgres psql -U medusa -d "$db" -v ON_ERROR_STOP=1 -tA -c "$query"
  fi
}

wait_for() {
  for _ in $(seq 1 90); do
    curl -sf -o /dev/null "$1" && return 0
    sleep 2
  done
  echo "Timed out waiting for $1" >&2
  return 1
}

pids=()
kill_tree() {
  local child
  for child in $(pgrep -P "$1" 2>/dev/null); do kill_tree "$child"; done
  kill "$1" 2>/dev/null || true
}
cleanup() {
  for pid in ${pids[@]+"${pids[@]}"}; do kill_tree "$pid"; done
}
trap cleanup EXIT

echo "› Resetting $DB_NAME"
sql postgres "DROP DATABASE IF EXISTS \"$DB_NAME\" WITH (FORCE)"
sql postgres "CREATE DATABASE \"$DB_NAME\""

echo "› Migrating"
cd "$ROOT/apps/backend"
pnpm exec medusa db:migrate
PUBLISHABLE_KEY="$(sql "$DB_NAME" "SELECT token FROM api_key WHERE type = 'publishable' AND revoked_at IS NULL LIMIT 1")"

# The search index is only filled when the server boots, and product
# writes fail until it has an active version, so seed after the first start.
echo "› Starting backend on :$BACKEND_PORT"
pnpm exec medusa build
LOG_DIR="${E2E_LOG_DIR:-$ROOT/apps/storefront/.e2e-logs}"
mkdir -p "$LOG_DIR"
(cd .medusa/server && PORT="$BACKEND_PORT" ../../node_modules/.bin/medusa start) >"$LOG_DIR/backend.log" 2>&1 &
pids+=($!)
wait_for "http://localhost:$BACKEND_PORT/health"
for _ in $(seq 1 60); do
  status="$(curl -s -o /dev/null -w '%{http_code}' -X POST "http://localhost:$BACKEND_PORT/store/search" \
    -H "x-publishable-api-key: $PUBLISHABLE_KEY" -H 'content-type: application/json' -d '{"index":"product"}')"
  [ "$status" = "200" ] && break
  sleep 2
done

echo "› Seeding catalogue"
pnpm exec medusa exec ./src/scripts/remove-medusa-demo-products.ts
pnpm run seed

echo "› Building storefront"
cd "$ROOT/apps/storefront"
export MEDUSA_BACKEND_URL="http://localhost:$BACKEND_PORT"
export NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY="$PUBLISHABLE_KEY"
export NEXT_PUBLIC_BASE_URL="http://localhost:$STOREFRONT_PORT"
export NEXT_PUBLIC_DEFAULT_REGION=fr
export NEXT_DIST_DIR=.next-e2e
pnpm exec next build
pnpm exec next start -p "$STOREFRONT_PORT" >"$LOG_DIR/storefront.log" 2>&1 &
pids+=($!)
wait_for "http://localhost:$STOREFRONT_PORT/favicon.ico"

echo "› Running Playwright"
E2E_BASE_URL="http://localhost:$STOREFRONT_PORT" pnpm exec playwright test "$@"
