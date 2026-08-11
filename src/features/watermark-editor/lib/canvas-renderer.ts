import type {
  EditorSettings,
  FontOption,
  OutputFormat,
  SourceImage,
  WatermarkImage,
  WatermarkPlacement,
} from "../model/types";

const MAX_PREVIEW_DIMENSION = 1_600;
const MIN_TILE_STEP = 12;
const MAX_TILE_COUNT = 12_000;
const MAX_EXPORT_PIXELS = 100_000_000;
const MAX_CANVAS_DIMENSION = 32_767;
const CORNER_PADDING = 48;

export interface Dimensions {
  width: number;
  height: number;
  scale: number;
}

interface RenderOptions {
  source: SourceImage;
  settings: EditorSettings;
  font: FontOption;
  watermarkImage: WatermarkImage | null;
  preview?: boolean;
  targetCanvas?: HTMLCanvasElement;
}

interface Point {
  x: number;
  y: number;
}

export function calculatePreviewDimensions(
  width: number,
  height: number,
  maxDimension = MAX_PREVIEW_DIMENSION,
): Dimensions {
  const largestDimension = Math.max(width, height);
  const scale = Math.min(1, maxDimension / largestDimension);

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
    scale,
  };
}

export function calculateTilePositions(
  width: number,
  height: number,
  stepX: number,
  stepY: number,
): Point[] {
  const extent = Math.hypot(width, height);
  const safeStepX = Math.max(MIN_TILE_STEP, stepX);
  const safeStepY = Math.max(MIN_TILE_STEP, stepY);
  const points: Point[] = [];
  let row = 0;

  for (let y = -extent; y <= extent; y += safeStepY) {
    const rowOffset = row % 2 === 0 ? 0 : safeStepX / 2;
    for (let x = -extent; x <= extent; x += safeStepX) {
      points.push({ x: x + rowOffset, y });
      if (points.length >= MAX_TILE_COUNT) {
        return points;
      }
    }
    row += 1;
  }

  return points;
}

function getPlacementPoint(
  placement: WatermarkPlacement,
  canvasWidth: number,
  canvasHeight: number,
  contentWidth: number,
  contentHeight: number,
  scale: number,
): Point {
  if (placement === "bottom-right") {
    const padding = CORNER_PADDING * scale;
    return {
      x: canvasWidth - contentWidth / 2 - padding,
      y: canvasHeight - contentHeight / 2 - padding,
    };
  }

  return { x: canvasWidth / 2, y: canvasHeight / 2 };
}

function drawRotated(
  context: CanvasRenderingContext2D,
  point: Point,
  angle: number,
  draw: () => void,
): void {
  context.save();
  context.translate(point.x, point.y);
  context.rotate((angle * Math.PI) / 180);
  draw();
  context.restore();
}

function drawTextWatermark(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  scale: number,
  settings: EditorSettings,
  font: FontOption,
): void {
  const textSettings = settings.text;
  const text = textSettings.text.trim();
  if (!text) {
    return;
  }

  const fontSize = textSettings.fontSize * scale;
  const spacing = textSettings.spacing * scale;
  context.globalAlpha = textSettings.opacity / 100;
  context.fillStyle = textSettings.color;
  context.font = `400 ${fontSize}px "${font.family}", sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";

  const textWidth = context.measureText(text).width;

  if (textSettings.placement !== "tile") {
    const point = getPlacementPoint(
      textSettings.placement,
      canvasWidth,
      canvasHeight,
      textWidth,
      fontSize,
      scale,
    );
    drawRotated(context, point, textSettings.angle, () => {
      context.fillText(text, 0, 0);
    });
    return;
  }

  context.save();
  context.translate(canvasWidth / 2, canvasHeight / 2);
  context.rotate((textSettings.angle * Math.PI) / 180);

  const positions = calculateTilePositions(
    canvasWidth,
    canvasHeight,
    textWidth + spacing,
    fontSize * 1.15 + spacing,
  );

  for (const point of positions) {
    context.fillText(text, point.x, point.y);
  }

  context.restore();
}

function drawImageWatermark(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  scale: number,
  settings: EditorSettings,
  watermarkImage: WatermarkImage,
): void {
  const imageSettings = settings.image;
  const imageWidth = canvasWidth * (imageSettings.size / 100);
  const imageHeight =
    imageWidth * (watermarkImage.height / watermarkImage.width);
  const spacing = imageSettings.spacing * scale;

  context.globalAlpha = imageSettings.opacity / 100;

  const drawImage = () => {
    context.drawImage(
      watermarkImage.element,
      -imageWidth / 2,
      -imageHeight / 2,
      imageWidth,
      imageHeight,
    );
  };

  if (imageSettings.placement !== "tile") {
    const point = getPlacementPoint(
      imageSettings.placement,
      canvasWidth,
      canvasHeight,
      imageWidth,
      imageHeight,
      scale,
    );
    drawRotated(context, point, imageSettings.angle, drawImage);
    return;
  }

  context.save();
  context.translate(canvasWidth / 2, canvasHeight / 2);
  context.rotate((imageSettings.angle * Math.PI) / 180);
  const positions = calculateTilePositions(
    canvasWidth,
    canvasHeight,
    imageWidth + spacing,
    imageHeight + spacing,
  );

  for (const point of positions) {
    context.save();
    context.translate(point.x, point.y);
    drawImage();
    context.restore();
  }
  context.restore();
}

export function renderWatermarkedImage({
  source,
  settings,
  font,
  watermarkImage,
  preview = false,
  targetCanvas,
}: RenderOptions): HTMLCanvasElement {
  const pixelCount = source.width * source.height;
  const hasUnsupportedDimensions =
    source.width > MAX_CANVAS_DIMENSION ||
    source.height > MAX_CANVAS_DIMENSION ||
    pixelCount > MAX_EXPORT_PIXELS;

  if (!preview && hasUnsupportedDimensions) {
    throw new Error(
      "이미지가 너무 큽니다. 가로, 세로 32,767px 이하이면서 1억 픽셀 이하 이미지를 사용해 주세요.",
    );
  }

  const dimensions = preview
    ? calculatePreviewDimensions(source.width, source.height)
    : { width: source.width, height: source.height, scale: 1 };

  const canvas = targetCanvas ?? document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas를 시작할 수 없습니다.");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(source.element, 0, 0, dimensions.width, dimensions.height);

  if (settings.kind === "text") {
    drawTextWatermark(
      context,
      dimensions.width,
      dimensions.height,
      dimensions.scale,
      settings,
      font,
    );
  } else if (watermarkImage) {
    drawImageWatermark(
      context,
      dimensions.width,
      dimensions.height,
      dimensions.scale,
      settings,
      watermarkImage,
    );
  }

  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  quality: number,
): Promise<Blob> {
  const mimeType = `image/${format}`;
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }
        reject(new Error("이미지 파일을 만들지 못했습니다."));
      },
      mimeType,
      quality / 100,
    );
  });
}

export function getOutputFilename(
  originalName: string,
  format: OutputFormat,
): string {
  const basename = originalName.replace(/\.[^/.]+$/, "") || "image";
  const extension = format === "jpeg" ? "jpg" : format;
  return `${basename}-watermarked.${extension}`;
}
