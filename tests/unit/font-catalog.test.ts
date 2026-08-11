import { describe, expect, it } from "vitest";
import { FONT_CATALOG } from "../../src/features/watermark-editor/config/font-catalog";

describe("FONT_CATALOG", () => {
  it("중복 없이 눈누와 Google 글꼴을 제공한다", () => {
    const ids = FONT_CATALOG.map((font) => font.id);
    const noonnuFonts = FONT_CATALOG.filter(
      (font) => font.provider === "noonnu",
    );
    const googleFonts = FONT_CATALOG.filter(
      (font) => font.provider === "google",
    );

    expect(new Set(ids).size).toBe(ids.length);
    expect(noonnuFonts).toHaveLength(49);
    expect(googleFonts).toHaveLength(52);
    expect(noonnuFonts[0]).toMatchObject({
      name: "프리텐다드",
      popularityRank: 1,
    });
  });

  it("Google 글꼴마다 공식 popularity 값이 있다", () => {
    const googleFonts = FONT_CATALOG.filter(
      (font) => font.provider === "google",
    );

    for (const font of googleFonts) {
      expect(font.popularityRank).toBeGreaterThan(0);
    }
  });

  it("눈누 글꼴마다 웹폰트와 이용 조건 주소가 있다", () => {
    const noonnuFonts = FONT_CATALOG.filter(
      (font) => font.provider === "noonnu",
    );

    for (const font of noonnuFonts) {
      expect(font.sourceUrl).toMatch(/^https:\/\/.+\.woff2?$/);
      expect(font.licenseUrl).toMatch(/^https:\/\/noonnu\.cc\/font_page\/\d+$/);
      expect(font.popularityRank).toBeGreaterThan(0);
    }
  });
});
