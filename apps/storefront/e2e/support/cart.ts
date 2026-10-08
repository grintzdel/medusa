import { expect, type Page } from "@playwright/test"

export const addToCart = async (page: Page, handle: string) => {
  await page.goto(`/fr/products/${handle}`)
  await expect(page.getByTestId("product-container")).toBeVisible()

  const options = page.getByTestId("option-button")
  if (await options.count()) {
    await options.first().click()
  }

  const addButton = page.getByTestId("add-product-button")
  await addButton.click()
  await expect(addButton).toBeEnabled()
}

export const uniqueEmail = (label: string) =>
  `e2e+${label}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`
