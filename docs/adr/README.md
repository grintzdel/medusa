# Décisions d'architecture (ADR)

Un ADR (*Architecture Decision Record*) consigne une décision structurante : le contexte, ce qui a été décidé, les alternatives écartées et ce que la décision coûte. On ne réécrit pas un ADR accepté : si la décision change, on en écrit un nouveau qui le remplace et on passe l'ancien en « Remplacé par ».

| N° | Décision | Statut |
|---|---|---|
| [0001](./0001-medusa-comme-moteur-e-commerce.md) | Medusa 2 comme moteur e-commerce headless | Accepté |
| [0002](./0002-monorepo-turborepo-pnpm.md) | Monorepo Turborepo + pnpm | Accepté |
| [0003](./0003-modules-d-infra-pilotes-par-l-environnement.md) | Modules d'infrastructure pilotés par l'environnement, démarrage refusé en prod s'il manque une variable | Accepté |
| [0004](./0004-limitation-de-debit-applicative.md) | Limitation de débit dans l'application, sur le cache Medusa | Accepté |
| [0005](./0005-tests-e2e-sur-base-jetable.md) | Tests E2E Playwright sur une base jetable | Accepté |
| [0006](./0006-csp-unsafe-inline.md) | CSP avec `'unsafe-inline'` sur les scripts | Accepté, à réévaluer (#40) |
| [0007](./0007-boutique-monolingue.md) | Boutique uniquement en français | Accepté |

## Écrire un ADR

1. Copier [`template.md`](./template.md) en `NNNN-titre-court.md`, avec le numéro suivant.
2. L'ouvrir en statut « Proposé » dans une PR, liée à l'issue qui pose la question (label `decision`).
3. Il passe en « Accepté » au merge.
