import { expect, test } from "@playwright/test"
import { addToCart } from "./support/cart"

test("quantity changes update the line and removing the last item empties the cart", async ({ page }) => {
  await addToCart(page, "thon-germon-naturel")
  await page.goto("/fr/cart")

  const row = page.getByTestId("product-row")
  await expect(row).toHaveCount(1)

  const subtotal = page.getByTestId("cart-subtotal")
  const unitPrice = Number(await subtotal.getAttribute("data-value"))

  // The row is a client component: an interaction before hydration is silently dropped, so retry until it lands.
  await expect(async () => {
    await row.getByTestId("product-select-button").selectOption("3")
    await expect
      .poll(async () => Number(await subtotal.getAttribute("data-value")), { timeout: 3_000 })
      .toBeCloseTo(unitPrice * 3)
  }).toPass()

  await expect(async () => {
    await row.getByTestId("product-delete-button").click()
    await expect(page.getByTestId("empty-cart-message")).toBeVisible({ timeout: 3_000 })
  }).toPass()
})

test("items from two products sit on separate lines", async ({ page }) => {
  await addToCart(page, "rillettes-sardine-espelette")
  await addToCart(page, "ventreche-thon-germon")
  await page.goto("/fr/cart")

  await expect(page.getByTestId("product-row")).toHaveCount(2)
})
