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
cp apps/storefront/.env.template apps/storefront/.env.local
cd apps/backend
pnpm exec medusa db:migrate                            # schéma + données initiales (régions, canal de vente)
pnpm exec medusa user -e admin@example.com -p <mot-de-passe>
cd ../..
pnpm backend:dev
```

Le premier démarrage remplit l'index de recherche produit : tant qu'il n'a pas eu lieu, toute création de produit échoue. Dans un second terminal, une fois le backend lancé :

```bash
cd apps/backend
pnpm exec medusa exec ./src/scripts/remove-medusa-demo-products.ts   # retire le catalogue de démo Medusa
pnpm run seed                                                        # catalogue Écaille (idempotent)
```

Ouvrir l'admin sur <http://localhost:9000/app>, copier la clé dans *Settings → Publishable API Keys* et la coller dans `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` de `apps/storefront/.env.local`. Arrêter le backend, puis :

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
| `pnpm test:e2e` | Playwright sur une base jetable (voir ci-dessous) |
| `pnpm backend:seed` | Catalogue Écaille |

La CI (`.github/workflows/ci.yml`) lance lint, typecheck, tests unitaires et E2E sur chaque PR, plus un `pnpm audit` qui échoue sur toute vulnérabilité critique.

### Tests E2E

`pnpm test:e2e` (script `scripts/e2e.sh`) ne touche jamais la base de dev. Il recrée une base `medusa_e2e` sur le Postgres du compose et utilise la base Redis n° 1. Il migre, démarre un backend de prod sur `:9001`, charge le catalogue, builde le storefront sur `:8001`, puis lance Playwright. Les arguments sont transmis à Playwright (`pnpm test:e2e --repeat-each=3`). Les logs des serveurs sont écrits dans `apps/storefront/.e2e-logs/`.

Le test de paiement par carte (`stripe-checkout.e2e.ts`) est ignoré sans clés Stripe de test, donc en CI. Pour le lancer, exporter les clés dans le shell : le backend E2E tourne en mode production et exige aussi un secret de webhook, quelconque ici.

```bash
STRIPE_API_KEY=sk_test_... STRIPE_WEBHOOK_SECRET=whsec_e2e NEXT_PUBLIC_STRIPE_KEY=pk_test_... pnpm test:e2e
```

Pour itérer sur un test contre le storefront de dev déjà lancé : `cd apps/storefront && pnpm test:e2e`. Attention, ce mode écrit dans la base de dev.

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
| `NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY`, `NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID` | Medusa Payments (Medusa Cloud) à la place d'un compte Stripe propre ; inutilisées sinon |
| `MEDUSA_CLOUD_S3_HOSTNAME`, `MEDUSA_CLOUD_S3_PATHNAME` | Domaine d'images supplémentaire autorisé |

## Mise en production

1. Postgres et Redis managés ; `REDIS_URL` est obligatoire, sans quoi les événements et workflows en cours sont perdus à chaque redémarrage.
2. Secrets forts : `openssl rand -base64 48` pour `JWT_SECRET` et `COOKIE_SECRET`.
3. CORS limités aux domaines réels, sans `localhost`.
4. Le backend doit être derrière **exactement un** reverse proxy qui renseigne `X-Forwarded-For`. Medusa fait confiance à un saut de proxy pour déterminer l'IP client, sur laquelle repose la limitation des tentatives de connexion.
5. Stripe : sur une base neuve, la migration initiale active Stripe sur la région Europe si `STRIPE_API_KEY` est défini. Sur une base existante, l'activer dans l'admin (*Réglages → Régions → Fournisseurs de paiement*). Puis déclarer le webhook `https://<backend>/hooks/payment/stripe_stripe`.
6. `pnpm exec medusa db:migrate` à chaque déploiement, avant de démarrer le serveur.

## Sécurité

Voir [SECURITY.md](./SECURITY.md) pour signaler une faille et pour la liste des protections en place.

## Documentation

| Document | Contenu |
|---|---|
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Issues, branches, commits, PR, relecture, définition de « terminé » |
| [docs/adr/](./docs/adr/README.md) | Décisions d'architecture et leurs compromis |
| [docs/dossier/](./docs/dossier/) | Dossier technique en PDF : direction artistique, stack, architecture, modèle de données |
| [SECURITY.md](./SECURITY.md) | Signalement de faille, protections en place, limites connues |
| [AGENTS.md](./AGENTS.md) | Commandes et conventions, pour les agents de code comme pour les humains |
