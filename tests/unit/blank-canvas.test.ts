import { describe, expect, it } from "vitest";
import {
  BLANK_CANVAS_MAX_SIZE,
  BLANK_CANVAS_MIN_SIZE,
  clampBlankCanvasSize,
  readableTextColor,
} from "../../src/features/watermark-editor/lib/image-files";

describe("clampBlankCanvasSize", () => {
  it("범위 안의 값은 그대로 둔다", () => {
    expect(clampBlankCanvasSize(1080)).toBe(1080);
    expect(clampBlankCanvasSize(1920)).toBe(1920);
  });

  it("범위를 벗어나면 잘라낸다", () => {
    expect(clampBlankCanvasSize(0)).toBe(BLANK_CANVAS_MIN_SIZE);
    expect(clampBlankCanvasSize(-500)).toBe(BLANK_CANVAS_MIN_SIZE);
    expect(clampBlankCanvasSize(99_999)).toBe(BLANK_CANVAS_MAX_SIZE);
  });

  it("빈 입력이나 소수를 안전한 정수로 바꾼다", () => {
    expect(clampBlankCanvasSize(Number.NaN)).toBe(BLANK_CANVAS_MIN_SIZE);
    expect(clampBlankCanvasSize(1080.6)).toBe(1081);
  });

  it("최대값끼리 곱해도 export 픽셀 한도 1억을 넘지 않는다", () => {
    expect(BLANK_CANVAS_MAX_SIZE ** 2).toBeLessThan(100_000_000);
  });
});

describe("readableTextColor", () => {
  it("밝은 배경에는 어두운 글자색을 준다", () => {
    expect(readableTextColor("#ffffff")).toBe("#111111");
    expect(readableTextColor("#f5f5f5")).toBe("#111111");
    expect(readableTextColor("#d8ff5f")).toBe("#111111");
  });

  it("어두운 배경에는 흰 글자색을 준다", () => {
    expect(readableTextColor("#000000")).toBe("#ffffff");
    expect(readableTextColor("#1a1a2e")).toBe("#ffffff");
    expect(readableTextColor("#0000ff")).toBe("#ffffff");
  });
});
