# 0002. Monorepo Turborepo + pnpm

- **Statut** : Accepté
- **Date** : 2026-10-08

## Contexte

Le backend Medusa et le storefront Next.js évoluent ensemble : une fonctionnalité comme le paiement Stripe touche la configuration du backend, le seed, le checkout et les tests E2E. Les deux apps doivent rester sur les mêmes versions des paquets `@medusajs/*`.

## Décision

Un seul dépôt, avec des workspaces **pnpm** (`apps/backend`, `apps/storefront`) orchestrés par **Turborepo** (`build`, `dev`, `lint`, `typecheck`, `test`, `seed`). La version de pnpm est figée par le champ `packageManager`.

## Alternatives écartées

- **Deux dépôts** : une fonctionnalité transverse demanderait deux PR synchronisées, et les versions Medusa divergeraient (c'était déjà le cas avec `latest` côté storefront, #22).
- **npm ou yarn workspaces** : pnpm installe plus vite, utilise moins de disque et refuse les dépendances fantômes (un paquet ne peut pas importer ce qu'il ne déclare pas).
- **Nx** : plus puissant, mais plus lourd à configurer pour deux apps.

## Conséquences

- Une PR peut modifier le backend, le storefront et les tests E2E de façon atomique, et la CI les vérifie ensemble.
- Les correctifs de sécurité des dépendances transitives passent par `pnpm.overrides` dans le `package.json` racine (#24).
- Chaque tâche ajoutée à `turbo.json` doit déclarer ses `outputs`, sinon le cache de Turborepo sert des résultats faux.
- Les dépendances s'installent dans l'app qui les utilise (`cd apps/backend && pnpm add …`), jamais à la racine.
