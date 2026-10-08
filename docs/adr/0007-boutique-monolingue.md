# 0007. Boutique uniquement en français

- **Statut** : Accepté
- **Date** : 2026-10-08
- **Issue** : #36

## Contexte

Le starter Next.js de Medusa embarque une plomberie de traduction : appel à `/store/locales` à chaque rendu, sélecteur de langue, cookie `_medusa_locale`, en-tête `x-medusa-locale`. Le module de traduction n'est pas activé côté backend : l'appel répond 404 à chaque rendu, et le sélecteur ne s'affiche jamais. La clientèle visée est francophone, et tous les textes ont été écrits en français pour la DA.

## Décision

Retirer la plomberie de locales du storefront. Textes, prix et dates sont en français (`fr-FR`). Les pays de la région Europe restent dans les URL (`/fr`, `/de`…) pour la livraison et les prix, pas pour la langue.

## Alternatives écartées

- **Activer le module de traduction Medusa** : il faudrait traduire et maintenir tout le catalogue et l'interface, pour une demande inexistante aujourd'hui.
- **Garder le code inutilisé** : un appel réseau en échec à chaque rendu et du code mort.

## Conséquences

- Moins d'appels réseau et de code à maintenir.
- Ouvrir une autre langue demandera de réintroduire l'internationalisation de l'interface (par exemple `next-intl`) et le module de traduction pour le catalogue : à reprendre dans un nouvel ADR.
