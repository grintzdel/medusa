# Écaille

Boutique en ligne d'une conserverie atlantique : sardines millésimées et petites pêches en boîte. Monorepo Turborepo avec un backend [Medusa](https://docs.medusajs.com) 2 et un storefront Next.js 15.

```text
apps/
├── backend/      Medusa : API, admin (/app), catalogue, paiement
└── storefront/   Next.js App Router : boutique en français, mode sombre
```

## Prérequis

- Node.js **22.22+**
- pnpm **10** (`corepack enable`)
- Docker, pour Postgres 17 et Redis 7 en local

## Démarrage local

```bash
pnpm install
docker compose up -d                                   # Postgres + Redis sur 127.0.0.1

cp apps/backend/.env.template apps/backend/.env        # pointe déjà sur le compose
cd apps/backend
pnpm exec medusa db:migrate                            # schéma + données initiales (régions, canal de vente)
pnpm run seed                                          # catalogue Écaille (idempotent)
pnpm exec medusa user -e admin@example.com -p <mot-de-passe>
cd ../..

cp apps/storefront/.env.template apps/storefront/.env.local
```

Lancer le backend (`pnpm backend:dev`), ouvrir l'admin sur <http://localhost:9000/app>, copier la clé dans *Settings → Publishable API Keys* et la coller dans `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` de `apps/storefront/.env.local`. Ensuite :

```bash
pnpm dev                                               # backend :9000 + storefront :8000
```

La boutique répond sur <http://localhost:8000>.

## Scripts

| Commande | Effet |
|---|---|
| `pnpm dev` | Les deux apps en mode développement |
| `pnpm build` | Build de production des deux apps |
| `pnpm lint` | `medusa lint` + ESLint du storefront |
| `pnpm typecheck` | `tsc --noEmit` sur les deux apps |
| `pnpm test` | Jest (backend) + Vitest (storefront) |
| `pnpm backend:seed` | Catalogue Écaille |

La CI (`.github/workflows/ci.yml`) lance lint, typecheck et tests sur chaque PR, plus un `pnpm audit` qui échoue sur toute vulnérabilité critique.

## Variables d'environnement

### Backend (`apps/backend/.env`)

| Variable | Rôle | Obligatoire en prod |
|---|---|---|
| `DATABASE_URL` | Connexion Postgres | oui |
| `REDIS_URL` | Active cache, bus d'événements, workflows et verrous Redis | oui |
| `JWT_SECRET`, `COOKIE_SECRET` | Secrets de session ; `supersecret` est refusé en prod | oui |
| `STORE_CORS` | Origine(s) du storefront | oui |
| `ADMIN_CORS`, `AUTH_CORS` | Origine(s) de l'admin | oui |
| `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET` | Active le paiement Stripe | si Stripe |
| `S3_BUCKET`, `S3_REGION`, `S3_FILE_URL`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_ENDPOINT` | Stockage des fichiers sur S3 au lieu du disque | recommandé |

Le serveur refuse de démarrer en `NODE_ENV=production` s'il manque une variable obligatoire.

### Storefront (`apps/storefront/.env.local`)

| Variable | Rôle |
|---|---|
| `MEDUSA_BACKEND_URL` | URL du backend, appelée côté serveur uniquement |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Clé publique du canal de vente (obligatoire, le build échoue sans) |
| `NEXT_PUBLIC_BASE_URL` | URL publique de la boutique |
| `NEXT_PUBLIC_DEFAULT_REGION` | Pays par défaut (ISO-2 minuscule) quand la géolocalisation échoue |
| `NEXT_PUBLIC_STRIPE_KEY` | Clé publique Stripe |
| `MEDUSA_CLOUD_S3_HOSTNAME`, `MEDUSA_CLOUD_S3_PATHNAME` | Domaine d'images supplémentaire autorisé |

## Mise en production

1. Postgres et Redis managés ; `REDIS_URL` est obligatoire, sans quoi les événements et workflows en cours sont perdus à chaque redémarrage.
2. Secrets forts : `openssl rand -base64 48` pour `JWT_SECRET` et `COOKIE_SECRET`.
3. CORS limités aux domaines réels, sans `localhost`.
4. Le backend doit être derrière **exactement un** reverse proxy qui renseigne `X-Forwarded-For`. Medusa fait confiance à un saut de proxy pour déterminer l'IP client, sur laquelle repose la limitation des tentatives de connexion.
5. Stripe : activer le provider sur chaque région dans l'admin, puis déclarer le webhook `https://<backend>/hooks/payment/stripe_stripe`.
6. `pnpm exec medusa db:migrate` à chaque déploiement, avant de démarrer le serveur.

## Sécurité

Voir [SECURITY.md](./SECURITY.md) pour signaler une faille et pour la liste des protections en place.
