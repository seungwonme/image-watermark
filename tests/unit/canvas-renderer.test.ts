import { describe, expect, it } from "vitest";
import {
  calculatePreviewDimensions,
  calculateTilePositions,
  getOutputFilename,
} from "../../src/features/watermark-editor/lib/canvas-renderer";

describe("calculatePreviewDimensions", () => {
  it("긴 변을 기준으로 미리보기 크기를 줄인다", () => {
    expect(calculatePreviewDimensions(4000, 2000)).toEqual({
      width: 1600,
      height: 800,
      scale: 0.4,
    });
  });

  it("작은 이미지는 확대하지 않는다", () => {
    expect(calculatePreviewDimensions(800, 600)).toEqual({
      width: 800,
      height: 600,
      scale: 1,
    });
  });
});

describe("calculateTilePositions", () => {
  it("회전된 캔버스를 덮는 반복 좌표를 만든다", () => {
    const points = calculateTilePositions(500, 300, 120, 80);

    expect(points.length).toBeGreaterThan(20);
    expect(points.length).toBeLessThanOrEqual(12_000);
    expect(points.some((point) => point.x < 0 && point.y < 0)).toBe(true);
    expect(points.some((point) => point.x > 0 && point.y > 0)).toBe(true);
  });
});

describe("getOutputFilename", () => {
  it("원본 확장자를 선택한 출력 확장자로 바꾼다", () => {
    expect(getOutputFilename("여행.사진.jpeg", "png")).toBe(
      "여행.사진-watermarked.png",
    );
    expect(getOutputFilename("portrait.png", "jpeg")).toBe(
      "portrait-watermarked.jpg",
    );
  });
});
