# 0001. Medusa 2 comme moteur e-commerce headless

- **Statut** : Accepté
- **Date** : 2026-10-08

## Contexte

Écaille vend en ligne un catalogue court (une dizaine de conserves et de coffrets), avec des données de traçabilité par produit (port, lot, date de durabilité minimale). Il faut un catalogue avec variantes, des prix par région, un panier, un checkout avec paiement par carte, des comptes clients, la gestion des commandes et du stock, et un back-office pour l'équipe, le tout dans les délais d'un projet de cours.

## Décision

Utiliser **Medusa 2** (Node.js, TypeScript, PostgreSQL) comme backend headless, avec son admin intégré sur `/app`, et un storefront Next.js séparé, parti du starter Next.js de Medusa.

## Alternatives écartées

- **Shopify / plateforme SaaS** : rapide à lancer, mais le code métier n'est pas accessible. Le projet doit montrer une maîtrise technique du backend, et l'abonnement et les commissions pèsent sur un petit catalogue.
- **WooCommerce / PrestaShop** : monolithes PHP avec un thème couplé au back. Ils ne correspondent ni à la stack JavaScript/TypeScript visée, ni à une architecture headless.
- **Backend sur mesure** (NestJS + Postgres) : contrôle total, mais panier, taxes, promotions, paiement, retours et admin seraient à écrire. Hors de portée dans les délais, avec un risque élevé de bugs sur les flux d'argent.
- **Saleor / Vendure** : comparables, mais respectivement Python/GraphQL et moins de starters prêts. Le starter Next.js de Medusa fournit déjà un checkout complet.

## Conséquences

- Le domaine commerce (produits, prix, paniers, commandes, paiements) est fourni par des modules isolés. Chaque module possède ses tables et n'a aucune clé étrangère vers les autres : les relations entre modules passent par des tables de liens (*module links*).
- La logique métier spécifique se loge dans les extensions prévues par Medusa : workflows, subscribers, middlewares, index de recherche (`src/search/`). On ne modifie pas le cœur.
- Les données propres à Écaille (port, lot, DDM, couleur de boîte) vivent dans le `metadata` des produits plutôt que dans un module dédié : c'est suffisant tant qu'on ne filtre pas dessus côté serveur.
- Dépendance forte au rythme de Medusa : la 2.21 a rendu les options produit partageables entre produits et cassé l'indexation de recherche (#34). Chaque montée de version doit passer par la suite E2E.
