import { convertToLocale } from "./money"

export const getPricePerKg = ({
  amount,
  weightInGrams,
  currencyCode,
}: {
  amount: number
  weightInGrams?: number | null
  currencyCode: string
}) => {
  if (!weightInGrams || weightInGrams <= 0) {
    return null
  }

  return `${convertToLocale({
    amount: (amount / weightInGrams) * 1000,
    currency_code: currencyCode,
  })}/kg`
}
