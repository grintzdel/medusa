import { toProductPricing } from "../../search/helpers/pricing";

const variant = (calculated: number | null, original?: number | null) => ({
  calculated_price: { calculated_amount: calculated, original_amount: original },
});

describe("toProductPricing", () => {
  it("takes min and original from the cheapest variant and max from the most expensive", () => {
    expect(
      toProductPricing({ eur: [variant(12, 15), variant(8, 8), variant(20, 20)] }),
    ).toEqual({
      min_price_eur: 8,
      max_price_eur: 20,
      original_price_eur: 8,
      on_sale_eur: false,
    });
  });

  it("flags the product on sale when the cheapest variant is discounted", () => {
    expect(toProductPricing({ eur: [variant(6, 9), variant(10, 10)] })).toMatchObject({
      min_price_eur: 6,
      original_price_eur: 9,
      on_sale_eur: true,
    });
  });

  it("falls back to the calculated amount when the original is missing", () => {
    expect(toProductPricing({ usd: [variant(7, null)] })).toEqual({
      min_price_usd: 7,
      max_price_usd: 7,
      original_price_usd: 7,
      on_sale_usd: false,
    });
  });

  it("writes nothing for a currency without any priced variant", () => {
    expect(toProductPricing({ eur: [variant(null), null], usd: null })).toEqual({});
    expect(toProductPricing(undefined)).toEqual({});
  });

  it("prices each currency independently", () => {
    expect(
      toProductPricing({ eur: [variant(5, 5)], usd: [variant(6, 7)] }),
    ).toEqual({
      min_price_eur: 5,
      max_price_eur: 5,
      original_price_eur: 5,
      on_sale_eur: false,
      min_price_usd: 6,
      max_price_usd: 6,
      original_price_usd: 7,
      on_sale_usd: true,
    });
  });
});
