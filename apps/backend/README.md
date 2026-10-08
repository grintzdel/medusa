# Backend Écaille

Application Medusa 2 : API store et admin, dashboard sur `/app`.

Installation, variables d’environnement et mise en production : voir le [README racine](../../README.md).

- `src/scripts/seed-ecaille-products.ts` : catalogue Écaille (`pnpm run seed`, idempotent).
- `src/scripts/remove-medusa-demo-products.ts` : supprime les produits de démo Medusa.
- `src/api/middlewares.ts` : limitation de débit sur `/auth` et configuration de la recherche produit.
