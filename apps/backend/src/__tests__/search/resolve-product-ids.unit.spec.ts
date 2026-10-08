import { resolveProductIds } from "../../search/helpers/resolve-product-ids";

const contextReturning = (data: unknown[]) => {
  const graph = jest.fn(async () => ({ data }));
  return {
    graph,
    context: { container: { query: { graph } } } as never,
  };
};

describe("resolveProductIds", () => {
  it("returns product ids straight from a product event", async () => {
    const { context } = contextReturning([]);

    await expect(
      resolveProductIds({ name: "product.updated", data: [{ id: "prod_1" }, { id: "prod_2" }] }, context),
    ).resolves.toEqual(["prod_1", "prod_2"]);
  });

  it("maps a shared product option to every product that uses it", async () => {
    const { context, graph } = contextReturning([
      { products: [{ id: "prod_1" }, { id: "prod_2" }] },
    ]);

    await expect(
      resolveProductIds({ name: "product-option.updated", data: { id: "opt_1" } }, context),
    ).resolves.toEqual(["prod_1", "prod_2"]);
    expect(graph).toHaveBeenCalledWith(
      expect.objectContaining({ entity: "product_option", fields: ["products.id"] }),
    );
  });

  it("maps an option value through its option to the products", async () => {
    const { context } = contextReturning([{ option: { products: [{ id: "prod_3" }] } }]);

    await expect(
      resolveProductIds({ name: "product-option-value.created", data: { id: "optval_1" } }, context),
    ).resolves.toEqual(["prod_3"]);
  });

  it("skips rows the query could not resolve instead of throwing", async () => {
    const { context } = contextReturning([null, { product_id: "prod_4" }]);

    await expect(
      resolveProductIds({ name: "product-variant.deleted", data: [{ id: "var_1" }, { id: "var_2" }] }, context),
    ).resolves.toEqual(["prod_4"]);
  });
});
