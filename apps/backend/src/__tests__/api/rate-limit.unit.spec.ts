import { rateLimit } from "../../api/utils/rate-limit";

const makeCache = () => {
  const store = new Map<string, unknown>();
  return {
    get: jest.fn(async (key: string) => store.get(key) ?? null),
    set: jest.fn(async (key: string, value: unknown) => {
      store.set(key, value);
    }),
  };
};

const makeRequest = (cache: ReturnType<typeof makeCache>, ip = "203.0.113.7") =>
  ({ ip, scope: { resolve: () => cache } }) as never;

const makeResponse = () => {
  const res = {
    headers: {} as Record<string, string>,
    statusCode: 200,
    body: undefined as unknown,
    setHeader(name: string, value: string) {
      res.headers[name] = value;
    },
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(body: unknown) {
      res.body = body;
      return res;
    },
  };
  return res;
};

const call = async (
  middleware: ReturnType<typeof rateLimit>,
  cache: ReturnType<typeof makeCache>,
  ip?: string,
) => {
  const res = makeResponse();
  const next = jest.fn();
  await middleware(makeRequest(cache, ip), res as never, next);
  return { res, next };
};

describe("rateLimit", () => {
  const options = { name: "login", max: 2, windowSeconds: 60, now: () => 120_000 };

  it("lets requests through up to the limit and reports the remaining budget", async () => {
    const cache = makeCache();
    const middleware = rateLimit(options);

    const first = await call(middleware, cache);
    const second = await call(middleware, cache);

    expect(first.next).toHaveBeenCalled();
    expect(second.next).toHaveBeenCalled();
    expect(second.res.headers["RateLimit-Remaining"]).toBe("0");
  });

  it("answers 429 with Retry-After once the limit is exceeded", async () => {
    const cache = makeCache();
    const middleware = rateLimit(options);

    await call(middleware, cache);
    await call(middleware, cache);
    const blocked = await call(middleware, cache);

    expect(blocked.next).not.toHaveBeenCalled();
    expect(blocked.res.statusCode).toBe(429);
    expect(blocked.res.headers["Retry-After"]).toBe("60");
  });

  it("counts each client IP separately", async () => {
    const cache = makeCache();
    const middleware = rateLimit({ ...options, max: 1 });

    await call(middleware, cache, "198.51.100.1");
    const other = await call(middleware, cache, "198.51.100.2");

    expect(other.next).toHaveBeenCalled();
  });

  it("starts a fresh budget in the next window", async () => {
    const cache = makeCache();
    let now = 120_000;
    const middleware = rateLimit({ ...options, max: 1, now: () => now });

    await call(middleware, cache);
    now += 60_000;
    const nextWindow = await call(middleware, cache);

    expect(nextWindow.next).toHaveBeenCalled();
  });

  it("expires the counter when the window ends", async () => {
    const cache = makeCache();
    const middleware = rateLimit({ ...options, now: () => 150_000 });

    await call(middleware, cache);

    expect(cache.set).toHaveBeenCalledWith(expect.stringContaining("rate-limit:login:"), 1, 30);
  });
});
