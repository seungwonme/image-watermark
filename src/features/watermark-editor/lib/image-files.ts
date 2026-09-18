import type { SourceImage, WatermarkImage } from "../model/types";

export const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);

export const SUPPORTED_FONT_EXTENSIONS = /\.(woff2?|ttf|otf)$/i;

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("이미지를 읽을 수 없습니다."));
    image.src = url;
  });
}

export function isSupportedImageFile(file: File): boolean {
  return SUPPORTED_IMAGE_TYPES.has(file.type);
}

export async function createSourceImage(file: File): Promise<SourceImage> {
  if (!isSupportedImageFile(file)) {
    throw new Error(`${file.name}: 지원하지 않는 이미지 형식입니다.`);
  }

  const url = URL.createObjectURL(file);

  try {
    const element = await loadImageElement(url);
    return {
      id: crypto.randomUUID(),
      file,
      name: file.name,
      url,
      width: element.naturalWidth,
      height: element.naturalHeight,
      element,
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

export async function createWatermarkImage(
  file: File,
): Promise<WatermarkImage> {
  const source = await createSourceImage(file);
  return {
    file: source.file,
    name: source.name,
    url: source.url,
    width: source.width,
    height: source.height,
    element: source.element,
  };
}

export function revokeSourceImage(image: SourceImage | WatermarkImage): void {
  URL.revokeObjectURL(image.url);
}

export const BLANK_CANVAS_MIN_SIZE = 16;
export const BLANK_CANVAS_MAX_SIZE = 8_000;

export function clampBlankCanvasSize(value: number): number {
  if (!Number.isFinite(value)) {
    return BLANK_CANVAS_MIN_SIZE;
  }
  return Math.min(
    BLANK_CANVAS_MAX_SIZE,
    Math.max(BLANK_CANVAS_MIN_SIZE, Math.round(value)),
  );
}

// width/height/viewBox를 모두 명시해야 한다. viewBox만 있으면 Chromium이
// naturalWidth를 84x150으로 잡아 에러 없이 엉뚱한 크기가 나온다.
export function createBlankImageFile(
  width: number,
  height: number,
  color: string,
): File {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${color}"/></svg>`;
  return new File([svg], `blank-${width}x${height}-${color.slice(1)}.svg`, {
    type: "image/svg+xml",
  });
}

// 배경 위에서 읽히는 워터마크 글자색. 기본값 #d8ff5f를 불투명도 48%로 흰
// 배경에 올리면 명암비가 1.08:1이라 워터마크가 보이지 않는다.
export function readableTextColor(backgroundColor: string): string {
  const toLinear = (channel: number) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  const [red, green, blue] = [1, 3, 5].map((offset) =>
    toLinear(
      Number.parseInt(backgroundColor.slice(offset, offset + 2), 16) / 255,
    ),
  );
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  return luminance > 0.4 ? "#111111" : "#ffffff";
}
