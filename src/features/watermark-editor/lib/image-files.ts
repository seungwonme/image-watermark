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

export function createBlankImageFile(
  name: string,
  width: number,
  height: number,
  color: string,
): File {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${color}"/></svg>`;
  return new File([svg], `${name}.svg`, { type: "image/svg+xml" });
}
