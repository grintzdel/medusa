import { configureStoreSearch, defineMiddlewares } from '@medusajs/framework/http'
import { rateLimit } from './utils/rate-limit'

const FIFTEEN_MINUTES = 15 * 60
const ONE_HOUR = 60 * 60

export default defineMiddlewares({
  routes: [
    {
      method: ['POST'],
      matcher: '/auth/:actor_type/:auth_provider',
      middlewares: [rateLimit({ name: 'auth-login', max: 10, windowSeconds: FIFTEEN_MINUTES })],
    },
    {
      method: ['POST'],
      matcher: '/auth/:actor_type/:auth_provider/register',
      middlewares: [rateLimit({ name: 'auth-register', max: 10, windowSeconds: ONE_HOUR })],
    },
    {
      method: ['POST'],
      matcher: '/auth/:actor_type/:auth_provider/reset-password',
      middlewares: [rateLimit({ name: 'auth-reset-password', max: 5, windowSeconds: ONE_HOUR })],
    },
    // The product index declares filterable `status` and `sales_channel_ids`, so
    // the route narrows it to published products in the key's sales channels.
    {
      method: ['POST'],
      matcher: '/store/search',
      middlewares: [
        configureStoreSearch({
          allowed_indexes: {
            product: true,
          },
        }),
      ],
    },
  ],
})
