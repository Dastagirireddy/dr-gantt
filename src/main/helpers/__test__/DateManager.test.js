import { getFormatTokens } from "../DateManager";

it("should return formats", () => {
  expect(getFormatTokens("DD/MM/YYYY")).toEqual(["DD", "MM", "YYYY"]);
});
