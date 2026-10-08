# Contribuer à Écaille

Installation et variables d'environnement : voir le [README](./README.md). Choix d'architecture : voir les [ADR](./docs/adr/README.md).

## Du besoin à la fusion

1. **Une issue d'abord.** Tout travail part d'une issue : bug, fonctionnalité, dette ou décision à prendre. Elle décrit le constat ou le besoin, et ses critères d'acceptation. Elle porte un label de type (`bug`, `enhancement`, `security`, `tech-debt`, `documentation`, `decision`…), un label de zone (`backend`, `storefront`, `infra`, `ci`) et un milestone.
2. **Une branche par issue**, créée depuis `main` à jour.
3. **Une PR par branche**, liée à son issue, avec le modèle de PR rempli.
4. **CI verte et relecture**, puis fusion par *merge commit*. La branche est supprimée après la fusion.

Une décision structurante (nouveau service, changement de stack, compromis de sécurité) passe par un [ADR](./docs/adr/README.md) relu dans la même PR.

## Branches

`<type>/<sujet-court-en-kebab-case>`

| Type | Usage | Exemple |
|---|---|---|
| `feat/` | Fonctionnalité | `feat/stripe-checkout` |
| `fix/` | Correction de bug | `fix/middleware-redirect-loop` |
| `chore/` | Outillage, dépendances, CI, nettoyage | `chore/ci-and-docs` |
| `test/` | Tests seuls | `test/e2e-checkout` |
| `docs/` | Documentation seule | `docs/adr-contributing` |

On ne pousse jamais directement sur `main`.

## Commits

- En anglais, à l'impératif, sans préfixe ni point final : `Stop redirecting cookieless visitors in a loop on region URLs`.
- Le titre dit ce que le commit change, du point de vue de l'utilisateur ou du code. Le corps, s'il y en a un, dit pourquoi.
- Un commit = un changement cohérent qui compile. Un correctif trouvé en chemin va dans son propre commit (cf. #10 : tests E2E d'un côté, correctifs d'accessibilité de l'autre).
- Pas d'emoji.

## Pull requests

- **Titre en français**, préfixé par la nature du changement : `Fix : …`, `Sécurité : …`, `Prod : …`, `Navigation : …`.
- **Description** selon [le modèle](./.github/pull_request_template.md) : issues liées (`Closes #…`), résumé, vérifications faites (et celles qui ne l'ont pas été), actions à mener après le merge.
- **Petite et ciblée.** Si une PR dépend d'une autre, l'écrire en tête de la description et la baser sur cette branche.
- Ce qui est découvert mais hors périmètre devient une issue, pas une ligne de plus dans la PR.

## Relecture

La personne qui relit vérifie, dans cet ordre :

1. **Le besoin** : la PR répond à l'issue, sans plus.
2. **La justesse** : cas limites, erreurs, données d'autres clients (régions, canaux de vente).
3. **La sécurité** : secrets, entrées non validées, données exposées par l'API.
4. **Les tests** : le bug corrigé a un test qui échouait avant.
5. **La lisibilité et les conventions**.

Les remarques bloquantes sont explicites (« à corriger avant merge »). Le reste est une suggestion que l'auteur peut écarter en expliquant pourquoi.

## Définition de « terminé »

- [ ] `pnpm lint`, `pnpm typecheck` et `pnpm test` passent.
- [ ] `pnpm test:e2e` passe si le parcours d'achat, le compte ou la navigation sont touchés.
- [ ] Le bug corrigé ou la fonctionnalité a un test.
- [ ] Une nouvelle variable d'environnement est dans le `.env.template` concerné et dans le README.
- [ ] Une modification de modèle de données a sa migration (`pnpm exec medusa db:generate <module>`).
- [ ] La documentation (README, `AGENTS.md`, ADR) reflète le changement.
- [ ] La CI est verte.

## Conventions de code

- Fichiers en kebab-case, types et classes en PascalCase, fonctions et variables en camelCase, colonnes SQL en snake_case.
- Backend : il doit satisfaire `@medusajs/eslint-plugin`. Ne jamais désactiver une règle `@medusajs/*` pour faire passer le lint : elle signale presque toujours un vrai défaut. La logique métier va dans des workflows, pas dans les routes.
- Storefront : Prettier (`apps/storefront/.prettierrc`), sans point-virgule, guillemets doubles. Le backend n'a pas encore de formateur commun (#44).
- Tests backend sous `apps/backend/src/__tests__/`, jamais dans `src/search/` : Medusa charge tout ce dossier comme index de recherche (#23).
- Interface en français, code et commentaires en anglais.

## Sécurité

Ne jamais commiter de `.env` ni de secret. Pour signaler une faille, voir [SECURITY.md](./SECURITY.md).
