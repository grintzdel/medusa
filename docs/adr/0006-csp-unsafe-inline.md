# 0006. CSP avec `'unsafe-inline'` sur les scripts

- **Statut** : Accepté, à réévaluer (#40)
- **Date** : 2026-10-08
- **Issue** : #25

## Contexte

Le storefront n'envoyait aucun en-tête de sécurité. On ajoute une Content Security Policy, mais l'App Router de Next.js injecte des scripts inline (payload RSC, hydratation) dans chaque page.

## Décision

CSP stricte sur tout sauf `script-src`, qui garde `'unsafe-inline'` :
- `frame-ancestors 'none'`, `object-src 'none'`, `base-uri` et `form-action` verrouillés ;
- domaines Stripe autorisés pour le script, les iframes et les connexions ;
- en plus : HSTS en prod, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, et plus de `X-Powered-By`.

## Alternatives écartées

- **Nonce par requête** (middleware + `headers()`) : seule façon de retirer `'unsafe-inline'`. Mais lire un en-tête par requête rend toutes les pages dynamiques : plus de rendu statique ni de cache, TTFB et charge serveur en hausse.
- **Hashes** : les scripts RSC changent à chaque rendu, les hashes ne sont pas stables.
- **Pas de CSP** : on perd aussi la protection contre le clickjacking et l'injection de `<object>` ou `<base>`.

## Conséquences

- La CSP limite les dégâts d'une XSS (pas d'exfiltration vers un domaine inconnu, pas d'iframe), mais n'empêche pas l'exécution d'un script injecté inline.
- Le risque est porté par la qualité du code : aucun `dangerouslySetInnerHTML` sur une donnée utilisateur.
- À réévaluer (#40) en mesurant le coût réel du rendu dynamique, ou si Next.js propose des nonces compatibles avec le rendu statique.
