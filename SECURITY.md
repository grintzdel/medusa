# Sécurité

## Signaler une faille

Ne pas ouvrir d'issue publique. Utiliser *Security → Report a vulnerability* sur le dépôt GitHub (signalement privé), avec les étapes de reproduction et l’impact estimé.

## Protections en place

| Domaine | Mesure |
|---|---|
| Secrets | Le backend refuse de démarrer en production avec `JWT_SECRET`/`COOKIE_SECRET` absents ou égaux à `supersecret`, ou sans CORS ni Redis. |
| Authentification | Connexion : 10 tentatives / 15 min par IP. Inscription : 10 / h. Réinitialisation du mot de passe : 5 / h. Au-delà : `429` avec `Retry-After`. |
| Cookies | Jeton de session et panier en `httpOnly`, `SameSite=Strict`, `Secure` en production. |
| En-têtes HTTP | CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` sur toutes les pages du storefront. |
| Images | L'optimiseur Next.js n'accepte que le backend et les domaines déclarés dans `next.config.js`. |
| Dépendances | `pnpm audit` en CI (échec sur toute vulnérabilité critique), Dependabot hebdomadaire. Les correctifs transitifs passent par `pnpm.overrides` dans le `package.json` racine. |
| Infra locale | Postgres et Redis du `docker-compose.yml` n'écoutent que sur `127.0.0.1`. |

## Limites connues

- La CSP autorise `'unsafe-inline'` pour les scripts, car l'App Router injecte des scripts RSC inline. Passer à des nonces par requête rendrait toutes les pages dynamiques.
- La limitation de débit repose sur l'IP vue par Medusa. Exposé sans reverse proxy, le backend accepte un `X-Forwarded-For` forgé et la limite peut être contournée.
- Deux vulnérabilités « high » restent sans correctif publié, toutes deux dans des dépendances de Medusa : `braces` (via `awilix`) et `@graphql-tools/utils` 10 (codegen de la CLI).
