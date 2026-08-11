import type { FontOption } from "../model/types";

const FONT_LOAD_TIMEOUT_MS = 12_000;
const fontLoadCache = new Map<string, Promise<boolean>>();

function waitForStylesheet(link: HTMLLinkElement): Promise<void> {
  if (link.dataset.loaded === "true") {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error("글꼴 스타일시트 로딩 시간이 초과되었습니다."));
    }, FONT_LOAD_TIMEOUT_MS);

    link.addEventListener(
      "load",
      () => {
        window.clearTimeout(timeoutId);
        link.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );

    link.addEventListener(
      "error",
      () => {
        window.clearTimeout(timeoutId);
        reject(new Error("글꼴 스타일시트를 불러오지 못했습니다."));
      },
      { once: true },
    );
  });
}

async function loadGoogleFont(font: FontOption): Promise<void> {
  const linkId = `watermark-font-${font.id}`;
  let link = document.getElementById(linkId) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.family)}&display=swap`;
    document.head.append(link);
  }

  await waitForStylesheet(link);
}

async function loadFontFace(font: FontOption): Promise<void> {
  if (!font.sourceUrl) {
    throw new Error("글꼴 파일 주소가 없습니다.");
  }

  const fontFace = new FontFace(font.family, `url("${font.sourceUrl}")`, {
    display: "swap",
    style: "normal",
    weight: "400",
  });
  const loadedFont = await fontFace.load();
  document.fonts.add(loadedFont);
}

export async function ensureFontLoaded(
  font: FontOption,
  sampleText: string,
): Promise<boolean> {
  if (font.provider === "system") {
    return true;
  }

  const cachedPromise = fontLoadCache.get(font.id);
  if (cachedPromise) {
    return cachedPromise;
  }

  const loadPromise = (async () => {
    if (font.provider === "google") {
      await loadGoogleFont(font);
    } else {
      await loadFontFace(font);
    }

    const fontDescriptor = `400 64px "${font.family}"`;
    await document.fonts.load(fontDescriptor, sampleText || "가나다 ABC");
    await document.fonts.ready;
    return document.fonts.check(fontDescriptor, sampleText || "가나다 ABC");
  })().catch(() => false);

  fontLoadCache.set(font.id, loadPromise);
  return loadPromise;
}

export function createLocalFontOption(file: File): FontOption {
  const fontName = file.name.replace(/\.(woff2?|ttf|otf)$/i, "");
  const uniqueId = `local-${crypto.randomUUID()}`;

  return {
    id: uniqueId,
    name: fontName,
    family: `WM Local ${uniqueId}`,
    provider: "local",
    category: "custom",
    supportsKorean: true,
    sourceUrl: URL.createObjectURL(file),
  };
}
