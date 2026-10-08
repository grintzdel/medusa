import { expect, test } from "@playwright/test"
import { addToCart, uniqueEmail } from "./support/cart"

test.skip(
  !process.env.NEXT_PUBLIC_STRIPE_KEY || !process.env.STRIPE_API_KEY,
  "needs Stripe test keys in NEXT_PUBLIC_STRIPE_KEY and STRIPE_API_KEY"
)

test("a guest pays by card with Stripe and lands on the order confirmation", async ({ page }) => {
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
  await page.getByTestId("shipping-email-input").fill(uniqueEmail("stripe"))
  await page.getByTestId("submit-address-button").click()

  await page.getByTestId("delivery-option-radio").first().click()
  await page.getByTestId("submit-delivery-option-button").click()

  await page.getByRole("radio", { name: /carte bancaire/i }).click()
  const card = page.frameLocator('iframe[name^="__privateStripeFrame"]').first()
  await card.locator('input[name="cardnumber"]').fill("4242424242424242")
  await card.locator('input[name="exp-date"]').fill("12/34")
  await card.locator('input[name="cvc"]').fill("123")
  await card.locator('input[name="postal"]').fill("44000")
  await page.getByTestId("submit-payment-button").click()
  await page.getByTestId("submit-order-button").click()

  await expect(page).toHaveURL(/\/order\/[^/]+\/confirmed/, { timeout: 30_000 })
  await expect(page.getByTestId("order-complete-container")).toBeVisible()
})
