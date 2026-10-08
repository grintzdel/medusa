import { loadEnv, defineConfig, MedusaError } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const DEV_SECRET = 'supersecret'
const isProduction = process.env.NODE_ENV === 'production'

function requireSecret(name: 'JWT_SECRET' | 'COOKIE_SECRET') {
  const value = process.env[name]
  if (isProduction && (!value || value === DEV_SECRET)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `${name} must be set to a strong, non-default value in production`
    )
  }
  return value
}

function requireInProduction(name: string) {
  const value = process.env[name]
  if (isProduction && !value) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, `${name} must be set in production`)
  }
  return value
}

const redisUrl = requireInProduction('REDIS_URL')

const redisModules = redisUrl
  ? [
      { resolve: '@medusajs/medusa/cache-redis', options: { redisUrl } },
      { resolve: '@medusajs/medusa/event-bus-redis', options: { redisUrl } },
      { resolve: '@medusajs/medusa/workflow-engine-redis', options: { redis: { redisUrl } } },
      {
        resolve: '@medusajs/medusa/locking',
        options: {
          providers: [
            { resolve: '@medusajs/medusa/locking-redis', id: 'locking-redis', is_default: true, options: { redisUrl } },
          ],
        },
      },
    ]
  : []

const stripeModules = process.env.STRIPE_API_KEY
  ? [
      {
        resolve: '@medusajs/medusa/payment',
        options: {
          providers: [
            {
              resolve: '@medusajs/medusa/payment-stripe',
              id: 'stripe',
              options: {
                apiKey: process.env.STRIPE_API_KEY,
                webhookSecret: requireInProduction('STRIPE_WEBHOOK_SECRET'),
              },
            },
          ],
        },
      },
    ]
  : []

const s3Modules = process.env.S3_BUCKET
  ? [
      {
        resolve: '@medusajs/medusa/file',
        options: {
          providers: [
            {
              resolve: '@medusajs/medusa/file-s3',
              id: 's3',
              options: {
                file_url: process.env.S3_FILE_URL,
                access_key_id: process.env.S3_ACCESS_KEY_ID,
                secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
                region: process.env.S3_REGION,
                bucket: process.env.S3_BUCKET,
                endpoint: process.env.S3_ENDPOINT,
              },
            },
          ],
        },
      },
    ]
  : []

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl,
    http: {
      storeCors: requireInProduction('STORE_CORS')!,
      adminCors: requireInProduction('ADMIN_CORS')!,
      authCors: requireInProduction('AUTH_CORS')!,
      jwtSecret: requireSecret('JWT_SECRET'),
      cookieSecret: requireSecret('COOKIE_SECRET'),
    },
  },
  modules: [...redisModules, ...stripeModules, ...s3Modules],
})
