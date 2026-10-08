# 0003. Modules d'infrastructure pilotés par l'environnement

- **Statut** : Accepté
- **Date** : 2026-10-08
- **Issues** : #21, #27

## Contexte

Par défaut, Medusa garde en mémoire le cache, le bus d'événements, le moteur de workflows et les verrous. Une seule instance peut donc tourner, et les événements et workflows en cours sont perdus à chaque redémarrage. Stripe et S3 ne sont pas configurés. Le dev local, la CI et la prod n'ont pas les mêmes besoins, mais on ne veut pas trois fichiers de configuration.

## Décision

`medusa-config.ts` active chaque module selon la présence de sa variable d'environnement :

| Variable | Modules activés |
|---|---|
| `REDIS_URL` | `cache-redis`, `event-bus-redis`, `workflow-engine-redis`, `locking-redis` |
| `STRIPE_API_KEY` | `payment-stripe` (webhook `STRIPE_WEBHOOK_SECRET`) |
| `S3_BUCKET` | `file-s3` (tout stockage compatible S3 via `S3_ENDPOINT`) |

En `NODE_ENV=production`, le serveur **refuse de démarrer** si `REDIS_URL`, les CORS ou le secret du webhook Stripe manquent, ou si `JWT_SECRET` / `COOKIE_SECRET` sont absents ou valent `supersecret`.

## Alternatives écartées

- **Un fichier de configuration par environnement** : duplication, et les fichiers finissent par diverger.
- **Avertir au lieu de refuser** : un avertissement dans des logs de prod passe inaperçu. Une prod qui démarre avec des secrets de dev expose des sessions forgeables.
- **Redis seulement en prod** : le dev ne tournerait pas dans les mêmes conditions. Le `docker-compose.yml` fournit déjà Redis.

## Conséquences

- La même image tourne partout : seules les variables changent.
- Une erreur de configuration en prod se voit au déploiement, pas au premier client.
- Le backend peut tourner sur plusieurs instances, et les compteurs de limitation de débit sont partagés (ADR 0004).
- Activer Stripe ne suffit pas : il faut aussi l'activer sur la région. Sur une base neuve, la migration initiale (`initial-data-seed.ts`) le fait si `STRIPE_API_KEY` est défini ; sur une base existante, il faut passer par l'admin.
