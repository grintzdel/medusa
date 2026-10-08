import { expect, test } from "@playwright/test"

test("the store lists the Écaille catalogue and links to product pages", async ({ page }) => {
  await page.goto("/fr/store")

  await expect(page.getByTestId("store-page-title")).toBeVisible()
  const products = page.getByTestId("products-list").getByTestId("product-wrapper")
  await expect(products.first()).toBeVisible()

  await products.first().click()
  await expect(page).toHaveURL(/\/fr\/products\//)
  await expect(page.getByTestId("product-container")).toBeVisible()
})

test("the home page renders without client errors", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))

  await page.goto("/fr")
  await expect(page.locator("h1").first()).toBeVisible()

  expect(errors).toEqual([])
})

test("the theme toggle switches to dark mode and survives a reload", async ({ page }) => {
  await page.goto("/fr")
  const html = page.locator("html")
  const startsDark = (await html.getAttribute("class"))?.includes("dark") ?? false

  await page.getByTestId("theme-toggle").first().click()
  await expect(html).toHaveClass(startsDark ? /^(?!.*\bdark\b)/ : /\bdark\b/)

  await page.reload()
  await expect(html).toHaveClass(startsDark ? /^(?!.*\bdark\b)/ : /\bdark\b/)
})
