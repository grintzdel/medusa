# 0004. Limitation de débit dans l'application, sur le cache Medusa

- **Statut** : Accepté
- **Date** : 2026-10-08
- **Issue** : #26

## Contexte

Les routes `/auth` (connexion, inscription, réinitialisation du mot de passe) acceptaient un nombre illimité de tentatives : les comptes clients et admin étaient exposés à la force brute. L'hébergement n'est pas encore choisi (#42), on ne peut donc pas compter sur un WAF.

## Décision

Un middleware Medusa (`apps/backend/src/api/utils/rate-limit.ts`) compte les requêtes par IP sur une fenêtre fixe, dans le module de cache de Medusa :

| Route | Budget |
|---|---|
| `POST /auth/:actor/:provider` | 10 / 15 min |
| `POST /auth/:actor/:provider/register` | 10 / heure |
| `POST /auth/:actor/:provider/reset-password` | 5 / heure |

Au-delà : `429` avec `Retry-After`. Le storefront appelle `/auth` depuis des server actions : il transmet donc l'IP du visiteur en `X-Forwarded-For`, uniquement sur ces appels.

## Alternatives écartées

- **WAF ou reverse proxy** (Cloudflare, nginx `limit_req`) : meilleure option à terme, mais dépend d'un hébergement qui n'existe pas encore. Les deux se cumulent.
- **Paquet `express-rate-limit`** : il faudrait un store séparé, alors que le cache Medusa passe déjà sur Redis quand `REDIS_URL` est défini.
- **Verrouillage du compte après N échecs** : permet de bloquer un client légitime à distance (déni de service ciblé).

## Conséquences

- Avec Redis, le compteur est partagé entre instances. Sans Redis, il est par instance.
- Medusa fait confiance à un seul saut de proxy. Le backend doit être derrière **exactement un** reverse proxy : exposé directement, un `X-Forwarded-For` forgé permet de contourner la limite.
- Le compteur est lu puis écrit en deux temps, pas incrémenté de façon atomique : en rafale concurrente, quelques requêtes de plus que le budget peuvent passer. C'est acceptable contre la force brute ; un `INCR` Redis le corrigerait.
- La fenêtre fixe autorise jusqu'à deux budgets à cheval sur deux fenêtres.
