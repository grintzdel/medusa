import { loadEnv, defineConfig, MedusaError } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const DEV_SECRET = 'supersecret'

function requireSecret(name: 'JWT_SECRET' | 'COOKIE_SECRET') {
  const value = process.env[name]
  if (process.env.NODE_ENV === 'production' && (!value || value === DEV_SECRET)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `${name} must be set to a strong, non-default value in production`
    )
  }
  return value
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: requireSecret('JWT_SECRET'),
      cookieSecret: requireSecret('COOKIE_SECRET'),
    }
  }
})
