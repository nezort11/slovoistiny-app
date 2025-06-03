import { buildTelegramShareLink } from "../telegram";

describe("buildTelegramShareLink", () => {
  it("builds link with only URL", () => {
    const url = "https://example.com";
    const result = buildTelegramShareLink(url);
    expect(result).toBe(
      "https://t.me/share/url?url=https%3A%2F%2Fexample.com"
    );
  });

  it("builds link with URL and text", () => {
    const url = "https://example.com";
    const text = "Check, this out!";
    const result = buildTelegramShareLink(url, text);
    expect(result).toBe(
      "https://t.me/share/url?url=https%3A%2F%2Fexample.com&text=Check%2C+this+out%21"
    );
  });
});
