# 0005. Tests E2E Playwright sur une base jetable

- **Statut** : Accepté
- **Date** : 2026-10-08
- **Issue** : #31

## Contexte

Le parcours d'achat (produit → panier → livraison → paiement → confirmation) traverse le storefront, le backend, Postgres et Redis. Les tests unitaires n'en couvrent qu'une petite partie. Des tests qui écrivent des commandes et des clients ne doivent jamais toucher la base de dev, et doivent donner le même résultat en local et en CI.

## Décision

`pnpm test:e2e` (`scripts/e2e.sh`) :

1. recrée une base `medusa_e2e` sur le Postgres du compose et utilise la base Redis n° 1 ;
2. migre, démarre un backend **de prod** (`medusa build` + `start`) sur `:9001`, charge le catalogue Écaille ;
3. builde le storefront dans `.next-e2e` et le sert sur `:8001` ;
4. lance Playwright (Chromium), puis arrête les serveurs, même en cas d'échec.

La CI exécute le même script avec des conteneurs de service Postgres 17 et Redis 7.

## Alternatives écartées

- **Tester contre le serveur de dev** : rapide, mais pollue la base de dev, et le résultat dépend de son état. Ce mode reste disponible pour itérer (`cd apps/storefront && pnpm test:e2e`), en le sachant.
- **Mocker l'API Medusa** : ne détecte pas les régressions du backend. C'est ainsi qu'on a trouvé #34, dans les logs du seed.
- **Cypress** : Playwright est plus rapide en headless, gère plusieurs onglets et origines (utile pour Stripe), et fournit les traces.

## Conséquences

- Un test E2E vert en local l'est aussi en CI : même script, même catalogue, builds de prod.
- La suite a déjà révélé trois bugs : #30, #32, #34.
- Le job E2E est le plus long de la CI (build des deux apps). Les tests restent centrés sur les parcours critiques ; les cas limites vont en tests unitaires.
- Les sélecteurs passent par les rôles et les noms accessibles : un composant inaccessible casse le test, ce qui a mis en évidence #32.
