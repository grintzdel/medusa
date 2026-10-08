import { expect, test } from "@playwright/test"
import { addToCart, uniqueEmail } from "./support/cart"

test("a guest buys a tin and lands on the order confirmation", async ({ page }) => {
  await addToCart(page, "maquereau-moutarde-ancienne")

  await page.goto("/fr/cart")
  await expect(page.getByTestId("product-row")).toHaveCount(1)
  await page.getByTestId("checkout-button").click()

  await page.getByTestId("shipping-first-name-input").fill("Anne")
  await page.getByTestId("shipping-last-name-input").fill("Le Guen")
  await page.getByTestId("shipping-address-input").fill("12 quai de la Fosse")
  await page.getByTestId("shipping-postal-code-input").fill("44000")
  await page.getByTestId("shipping-city-input").fill("Nantes")
  await page.getByTestId("shipping-country-select").selectOption("fr")
  await page.getByTestId("shipping-email-input").fill(uniqueEmail("guest"))
  await page.getByTestId("submit-address-button").click()

  await page.getByTestId("delivery-option-radio").first().click()
  await page.getByTestId("submit-delivery-option-button").click()

  await page.getByRole("radio", { name: /paiement manuel/i }).click()
  await page.getByTestId("submit-payment-button").click()
  await page.getByTestId("submit-order-button").click()

  await expect(page).toHaveURL(/\/order\/[^/]+\/confirmed/)
  await expect(page.getByTestId("order-complete-container")).toBeVisible()
  await expect(page.getByTestId("product-name")).toHaveCount(1)
})

test("an unknown promo code is rejected without touching the total", async ({ page }) => {
  await addToCart(page, "sardines-citron-poivre")
  await page.goto("/fr/cart")

  const total = await page.getByTestId("cart-total").textContent()
  await page.getByTestId("add-discount-button").click()
  await page.getByTestId("discount-input").fill("PASUNCODE")
  await page.getByTestId("discount-apply-button").click()

  await expect(page.getByTestId("discount-error-message")).toBeVisible()
  await expect(page.getByTestId("cart-total")).toHaveText(total ?? "")
})
