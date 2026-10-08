import { toOptionValues } from "../option-values";

describe("toOptionValues", () => {
  it("flattens options into title:value entries", () => {
    expect(
      toOptionValues([
        { title: "Format", values: [{ value: "115 g" }, { value: "230 g" }] },
        { title: "Millésime", values: [{ value: "2024" }] },
      ]),
    ).toEqual(["Format:115 g", "Format:230 g", "Millésime:2024"]);
  });

  it("trims titles and values and skips blank ones", () => {
    expect(
      toOptionValues([
        { title: "  Format ", values: [{ value: " 115 g " }, { value: "  " }, null] },
        { title: "   ", values: [{ value: "ignored" }] },
        null,
      ]),
    ).toEqual(["Format:115 g"]);
  });

  it("deduplicates identical entries", () => {
    expect(
      toOptionValues([
        { title: "Format", values: [{ value: "115 g" }] },
        { title: "Format", values: [{ value: "115 g" }] },
      ]),
    ).toEqual(["Format:115 g"]);
  });

  it("returns an empty list when there are no options", () => {
    expect(toOptionValues(null)).toEqual([]);
    expect(toOptionValues(undefined)).toEqual([]);
  });
});
