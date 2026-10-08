import { expect, test } from "@playwright/test"
import { uniqueEmail } from "./support/cart"

const PASSWORD = "Sardine-millesimee-2024"

test("a visitor creates an account, signs out and signs back in", async ({ page }) => {
  const email = uniqueEmail("account")

  await page.goto("/fr/account")
  await page.getByTestId("login-page").getByTestId("register-button").click()

  const register = page.getByTestId("register-page")
  await register.getByTestId("first-name-input").fill("Yann")
  await register.getByTestId("last-name-input").fill("Kerjean")
  await register.getByTestId("email-input").fill(email)
  await register.getByTestId("password-input").fill(PASSWORD)
  await register.getByTestId("register-button").click()

  await expect(page.getByTestId("customer-email")).toHaveText(email)

  await page.getByTestId("logout-button").locator("visible=true").click()
  await expect(page.getByTestId("login-page")).toBeVisible()

  await page.getByTestId("email-input").fill(email)
  await page.getByTestId("password-input").fill(PASSWORD)
  await page.getByTestId("sign-in-button").click()

  await expect(page.getByTestId("welcome-message")).toHaveAttribute("data-value", "Yann")
})

test("a wrong password shows an error and keeps the visitor signed out", async ({ page }) => {
  await page.goto("/fr/account")
  await page.getByTestId("email-input").fill(uniqueEmail("nobody"))
  await page.getByTestId("password-input").fill("not-the-password")
  await page.getByTestId("sign-in-button").click()

  await expect(page.getByTestId("login-error-message")).toBeVisible()
  await expect(page.getByTestId("login-page")).toBeVisible()
})
