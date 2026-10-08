# Storefront Écaille

Boutique Next.js 15 (App Router) branchée sur le backend Medusa, en français, avec mode sombre.

Installation et variables d’environnement : voir le [README racine](../../README.md).

- `src/lib/data/` : server actions et lectures vers l’API Medusa.
- `src/lib/config.ts` : client du SDK Medusa (locale et IP du visiteur transmises au backend).
- `src/modules/` : composants par domaine (produits, panier, checkout, compte).
- `next.config.js` : en-têtes de sécurité et domaines d’images autorisés.
