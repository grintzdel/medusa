import type { MedusaNextFunction, MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import type { ICacheService } from '@medusajs/framework/types'
import { Modules } from '@medusajs/framework/utils'

type RateLimitOptions = {
  name: string
  max: number
  windowSeconds: number
  now?: () => number
}

export function rateLimit({ name, max, windowSeconds, now = Date.now }: RateLimitOptions) {
  return async (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
    const cache = req.scope.resolve<ICacheService>(Modules.CACHE)
    const window = Math.floor(now() / 1000 / windowSeconds)
    const key = `rate-limit:${name}:${req.ip}:${window}`
    const count = ((await cache.get<number>(key)) ?? 0) + 1
    const resetIn = (window + 1) * windowSeconds - Math.floor(now() / 1000)

    await cache.set(key, count, resetIn)

    res.setHeader('RateLimit-Limit', String(max))
    res.setHeader('RateLimit-Remaining', String(Math.max(0, max - count)))
    res.setHeader('RateLimit-Reset', String(resetIn))

    if (count > max) {
      res.setHeader('Retry-After', String(resetIn))
      res.status(429).json({ type: 'too_many_requests', message: 'Too many attempts, please try again later.' })
      return
    }

    next()
  }
}
