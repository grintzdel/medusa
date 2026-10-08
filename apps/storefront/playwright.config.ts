import { defineConfig, devices } from "@playwright/test"

const externalBaseURL = process.env.E2E_BASE_URL
const baseURL = externalBaseURL ?? "http://localhost:8000"

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  timeout: 60_000,
  use: {
    baseURL,
    locale: "fr-FR",
    timezoneId: "Europe/Paris",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: externalBaseURL
    ? undefined
    : {
        command: "pnpm dev",
        url: `${baseURL}/favicon.ico`,
        reuseExistingServer: true,
        timeout: 120_000,
      },
})
