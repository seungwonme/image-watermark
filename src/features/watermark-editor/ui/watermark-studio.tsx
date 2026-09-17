"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LuImagePlus, LuPlus, LuTrash2, LuUpload } from "react-icons/lu";
import { Button } from "@/shared/ui";
import { FONT_CATALOG, findFontById } from "../config";
import {
  canvasToBlob,
  getOutputFilename,
  renderWatermarkedImage,
} from "../lib/canvas-renderer";
import { createLocalFontOption, ensureFontLoaded } from "../lib/font-loader";
import {
  createBlankImageFile,
  createSourceImage,
  createWatermarkImage,
  isSupportedImageFile,
  revokeSourceImage,
  SUPPORTED_FONT_EXTENSIONS,
} from "../lib/image-files";
import type {
  EditorSettings,
  EditorStatus,
  FontOption,
  SourceImage,
  WatermarkImage,
} from "../model";
import { DEFAULT_EDITOR_SETTINGS } from "../model";
import { CanvasPreview } from "./canvas-preview";
import { EditorControlPanel } from "./editor-control-panel";
import { EmptyWorkbench } from "./empty-workbench";

const STATUS_RESET_DELAY_MS = 4_000;

const BLANK_PRESETS = [
  {
    label: "흰 배경 9:16",
    name: "blank-white-1080x1920",
    width: 1080,
    height: 1920,
    color: "#ffffff",
    textColor: "#111111",
  },
  {
    label: "검은 배경 9:16",
    name: "blank-black-1080x1920",
    width: 1080,
    height: 1920,
    color: "#000000",
    textColor: "#ffffff",
  },
  {
    label: "흰 배경 16:9",
    name: "blank-white-1920x1080",
    width: 1920,
    height: 1080,
    color: "#ffffff",
    textColor: "#111111",
  },
  {
    label: "검은 배경 16:9",
    name: "blank-black-1920x1080",
    width: 1920,
    height: 1080,
    color: "#000000",
    textColor: "#ffffff",
  },
] as const;

// 빈 배경이 덮어써도 되는 글자색. 사용자가 직접 고른 색은 그대로 둔다.
const PRESET_MANAGED_COLORS = new Set([
  DEFAULT_EDITOR_SETTINGS.text.color,
  ...BLANK_PRESETS.map((preset) => preset.textColor),
]);

function cloneDefaultSettings(): EditorSettings {
  return {
    ...DEFAULT_EDITOR_SETTINGS,
    text: { ...DEFAULT_EDITOR_SETTINGS.text },
    image: { ...DEFAULT_EDITOR_SETTINGS.image },
  };
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export function WatermarkStudio() {
  const [images, setImages] = useState<SourceImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<WatermarkImage | null>(
    null,
  );
  const [customFonts, setCustomFonts] = useState<FontOption[]>([]);
  const [settings, setSettings] =
    useState<EditorSettings>(cloneDefaultSettings);
  const [status, setStatus] = useState<EditorStatus>({ kind: "idle" });
  const [isDragging, setIsDragging] = useState(false);
  const sourceInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const imagesRef = useRef(images);
  const watermarkImageRef = useRef(watermarkImage);
  const customFontsRef = useRef(customFonts);

  imagesRef.current = images;
  watermarkImageRef.current = watermarkImage;
  customFontsRef.current = customFonts;

  useEffect(() => {
    return () => {
      for (const image of imagesRef.current) {
        revokeSourceImage(image);
      }
      if (watermarkImageRef.current) {
        revokeSourceImage(watermarkImageRef.current);
      }
      for (const font of customFontsRef.current) {
        if (font.sourceUrl) {
          URL.revokeObjectURL(font.sourceUrl);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (status.kind !== "success") {
      return;
    }
    const timeoutId = window.setTimeout(
      () => setStatus({ kind: "idle" }),
      STATUS_RESET_DELAY_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, [status]);

  const fonts = useMemo(() => [...customFonts, ...FONT_CATALOG], [customFonts]);
  const selectedFont = useMemo(
    () => findFontById(settings.text.fontId, customFonts),
    [customFonts, settings.text.fontId],
  );
  const activeImage = useMemo(
    () =>
      images.find((image) => image.id === selectedImageId) ?? images[0] ?? null,
    [images, selectedImageId],
  );
  const canDownload = Boolean(
    activeImage && (settings.kind === "text" || watermarkImage),
  );

  const handleSourceFiles = async (files: File[]) => {
    const supportedFiles = files.filter(isSupportedImageFile);
    if (supportedFiles.length === 0) {
      setStatus({
        kind: "error",
        message: "지원되는 이미지 파일을 선택해 주세요.",
      });
      return;
    }

    setStatus({
      kind: "working",
      message: `${supportedFiles.length}개 이미지를 읽는 중입니다.`,
    });

    const results = await Promise.allSettled(
      supportedFiles.map((file) => createSourceImage(file)),
    );
    const loadedImages = results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : [],
    );
    const failedCount = results.length - loadedImages.length;

    if (loadedImages.length === 0) {
      setStatus({
        kind: "error",
        message: "이미지를 읽지 못했습니다. 파일 형식을 확인해 주세요.",
      });
      return;
    }

    setImages((current) => [...current, ...loadedImages]);
    setSelectedImageId((current) => current ?? loadedImages[0].id);
    setStatus({
      kind: failedCount > 0 ? "error" : "success",
      message:
        failedCount > 0
          ? `${loadedImages.length}개를 추가했고 ${failedCount}개는 읽지 못했습니다.`
          : `${loadedImages.length}개 이미지를 추가했습니다.`,
    });
  };

  const handleCreateBlank = async (preset: (typeof BLANK_PRESETS)[number]) => {
    try {
      const blankImage = await createSourceImage(
        createBlankImageFile(
          preset.name,
          preset.width,
          preset.height,
          preset.color,
        ),
      );
      setImages((current) => [...current, blankImage]);
      setSelectedImageId(blankImage.id);
      setSettings((current) =>
        PRESET_MANAGED_COLORS.has(current.text.color)
          ? { ...current, text: { ...current.text, color: preset.textColor } }
          : current,
      );
      setStatus({
        kind: "success",
        message: `${preset.label} 이미지를 추가했습니다.`,
      });
    } catch {
      setStatus({
        kind: "error",
        message: "빈 배경을 만들지 못했습니다.",
      });
    }
  };

  const handleRemoveImage = (imageId: string) => {
    const imageToRemove = images.find((image) => image.id === imageId);
    if (imageToRemove) {
      revokeSourceImage(imageToRemove);
    }

    const remainingImages = images.filter((image) => image.id !== imageId);
    setImages(remainingImages);
    if (selectedImageId === imageId) {
      setSelectedImageId(remainingImages[0]?.id ?? null);
    }
  };

  const handleWatermarkImageChange = async (file: File) => {
    setStatus({ kind: "working", message: "워터마크 이미지를 읽는 중입니다." });
    try {
      const nextImage = await createWatermarkImage(file);
      if (watermarkImage) {
        revokeSourceImage(watermarkImage);
      }
      setWatermarkImage(nextImage);
      setStatus({
        kind: "success",
        message: "워터마크 이미지를 추가했습니다.",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "워터마크 이미지를 읽지 못했습니다.",
      });
    }
  };

  const handleAddLocalFont = async (file: File) => {
    if (!SUPPORTED_FONT_EXTENSIONS.test(file.name)) {
      setStatus({
        kind: "error",
        message: "WOFF, WOFF2, TTF, OTF 글꼴만 추가할 수 있습니다.",
      });
      return;
    }

    const font = createLocalFontOption(file);
    setStatus({
      kind: "working",
      message: `${file.name} 글꼴을 확인하는 중입니다.`,
    });
    const isLoaded = await ensureFontLoaded(font, settings.text.text);
    if (!isLoaded) {
      if (font.sourceUrl) {
        URL.revokeObjectURL(font.sourceUrl);
      }
      setStatus({
        kind: "error",
        message: "이 글꼴을 읽지 못했습니다. 다른 글꼴 파일을 선택해 주세요.",
      });
      return;
    }

    setCustomFonts((current) => [font, ...current]);
    setSettings((current) => ({
      ...current,
      text: { ...current.text, fontId: font.id },
    }));
    setStatus({
      kind: "success",
      message: `${font.name} 글꼴을 추가했습니다.`,
    });
  };

  const createExportBlob = async (source: SourceImage): Promise<Blob> => {
    if (settings.kind === "text") {
      const isFontReady = await ensureFontLoaded(
        selectedFont,
        settings.text.text,
      );
      if (!isFontReady) {
        throw new Error(
          "선택한 글꼴을 불러오지 못했습니다. 네트워크를 확인하거나 다른 글꼴을 선택해 주세요.",
        );
      }
    }

    if (settings.kind === "image" && !watermarkImage) {
      throw new Error("먼저 워터마크 이미지를 선택해 주세요.");
    }

    const canvas = renderWatermarkedImage({
      source,
      settings,
      font: selectedFont,
      watermarkImage,
    });
    return canvasToBlob(canvas, settings.outputFormat, settings.outputQuality);
  };

  const handleDownloadCurrent = async () => {
    if (!activeImage) {
      return;
    }

    setStatus({ kind: "working", message: "원본 해상도로 저장하는 중입니다." });
    try {
      const blob = await createExportBlob(activeImage);
      triggerBlobDownload(
        blob,
        getOutputFilename(activeImage.name, settings.outputFormat),
      );
      setStatus({
        kind: "success",
        message: "이미지 다운로드를 시작했습니다.",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "이미지를 저장하지 못했습니다.",
      });
    }
  };

  const handleDownloadAll = async () => {
    if (images.length === 0) {
      return;
    }
    if (images.length === 1) {
      await handleDownloadCurrent();
      return;
    }

    setStatus({
      kind: "working",
      message: `${images.length}개 이미지를 처리하는 중입니다.`,
      progress: 0,
    });

    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      for (const [index, image] of images.entries()) {
        const blob = await createExportBlob(image);
        const filename = getOutputFilename(image.name, settings.outputFormat);
        zip.file(`${String(index + 1).padStart(2, "0")}-${filename}`, blob);
        setStatus({
          kind: "working",
          message: `${images.length}개 이미지를 처리하는 중입니다.`,
          progress: Math.round(((index + 1) / images.length) * 85),
        });
      }

      const zipBlob = await zip.generateAsync({ type: "blob" }, (metadata) => {
        setStatus({
          kind: "working",
          message: "ZIP 파일을 만드는 중입니다.",
          progress: 85 + Math.round(metadata.percent * 0.15),
        });
      });
      triggerBlobDownload(zipBlob, "watermarked-images.zip");
      setStatus({
        kind: "success",
        message: `${images.length}개 이미지 ZIP 다운로드를 시작했습니다.`,
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "ZIP 파일을 만들지 못했습니다.",
      });
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    dragDepthRef.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    dragDepthRef.current = 0;
    setIsDragging(false);
    void handleSourceFiles(Array.from(event.dataTransfer.files));
  };

  const handleResetSettings = () => {
    setSettings(cloneDefaultSettings());
    setStatus({ kind: "success", message: "워터마크 설정을 초기화했습니다." });
  };

  return (
    <div className="bg-background text-foreground">
      <div className="grid min-h-[calc(100svh-4rem)] grid-cols-1 lg:h-[calc(100svh-4rem)] lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_23rem] xl:grid-cols-[minmax(0,1fr)_25rem]">
        <section
          aria-label="이미지 편집 작업 영역"
          onDragEnter={handleDragEnter}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex min-h-[42rem] min-w-0 flex-col bg-workbench text-workbench-foreground transition-shadow lg:min-h-0 ${
            isDragging ? "shadow-[inset_0_0_0_3px_var(--primary)]" : ""
          }`}
        >
          <div className="flex min-h-14 items-center justify-between gap-3 border-b border-workbench-foreground/10 px-4 sm:px-5">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-workbench-foreground">
                {activeImage?.name ?? "작업 이미지"}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-workbench-foreground/45">
                {activeImage
                  ? `${activeImage.width.toLocaleString()} × ${activeImage.height.toLocaleString()} px`
                  : "이미지를 추가해 시작하세요"}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => sourceInputRef.current?.click()}
              className="shrink-0 border-workbench-foreground/15 bg-workbench text-workbench-foreground hover:bg-workbench-foreground/10 hover:text-workbench-foreground"
            >
              <LuPlus aria-hidden="true" />
              이미지 추가
            </Button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-stretch justify-center overflow-hidden checkerboard-dark">
            {activeImage ? (
              <CanvasPreview
                source={activeImage}
                settings={settings}
                font={selectedFont}
                watermarkImage={watermarkImage}
              />
            ) : (
              <EmptyWorkbench
                isDragging={isDragging}
                onOpenFilePicker={() => sourceInputRef.current?.click()}
              />
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto border-t border-workbench-foreground/10 px-4 py-2.5 sm:px-5">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.13em] text-workbench-foreground/48">
              빈 배경
            </span>
            {BLANK_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => void handleCreateBlank(preset)}
                className="flex min-h-9 shrink-0 items-center gap-2 rounded-full border border-workbench-foreground/15 px-3.5 text-[11px] font-semibold text-workbench-foreground/72 transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span
                  className="size-3 rounded-full border border-workbench-foreground/30"
                  style={{ backgroundColor: preset.color }}
                  aria-hidden="true"
                />
                {preset.label}
              </button>
            ))}
          </div>

          {images.length > 0 ? (
            <div className="border-t border-workbench-foreground/10 bg-workbench/94 px-4 py-3 sm:px-5">
              <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.13em] text-workbench-foreground/48">
                <span>{images.length} images</span>
                <span>클릭해서 편집 이미지 변경</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => {
                  const isSelected = image.id === activeImage?.id;
                  return (
                    <div key={image.id} className="group relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedImageId(image.id)}
                        aria-label={`${image.name} 선택`}
                        aria-pressed={isSelected}
                        className={`relative size-16 overflow-hidden rounded-xl border-2 bg-workbench-foreground/5 bg-cover bg-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                          isSelected
                            ? "border-primary shadow-[0_0_0_2px_var(--workbench)]"
                            : "border-transparent opacity-72 hover:opacity-100"
                        }`}
                        style={{ backgroundImage: `url("${image.url}")` }}
                      >
                        <span className="absolute bottom-1 left-1 rounded bg-black/65 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                          {index + 1}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.id)}
                        aria-label={`${image.name} 제거`}
                        className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full border border-white/20 bg-black text-white opacity-0 shadow-lg transition-opacity hover:bg-destructive focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group-hover:opacity-100"
                      >
                        <LuTrash2 className="size-3" aria-hidden="true" />
                      </button>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => sourceInputRef.current?.click()}
                  className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-workbench-foreground/25 text-workbench-foreground/50 transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="이미지 더 추가"
                >
                  <LuImagePlus className="size-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : null}

          {isDragging ? (
            <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-primary/14 p-8 backdrop-blur-sm">
              <div className="flex min-h-52 w-full max-w-lg flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-primary bg-workbench/90 text-center shadow-2xl">
                <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <LuUpload className="size-6" aria-hidden="true" />
                </span>
                <p className="text-xl font-black tracking-tight text-workbench-foreground">
                  여기에 놓으면 바로 추가됩니다
                </p>
                <p className="mt-2 text-sm text-workbench-foreground/55">
                  여러 장을 한 번에 놓아도 됩니다.
                </p>
              </div>
            </div>
          ) : null}

          <input
            ref={sourceInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
            onChange={(event) => {
              void handleSourceFiles(Array.from(event.target.files ?? []));
              event.target.value = "";
            }}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
        </section>

        <EditorControlPanel
          settings={settings}
          fonts={fonts}
          selectedFont={selectedFont}
          watermarkImage={watermarkImage}
          sourceImageCount={images.length}
          canDownload={canDownload}
          status={status}
          onSettingsChange={setSettings}
          onAddLocalFont={(file) => void handleAddLocalFont(file)}
          onWatermarkImageChange={(file) =>
            void handleWatermarkImageChange(file)
          }
          onResetSettings={handleResetSettings}
          onDownloadCurrent={() => void handleDownloadCurrent()}
          onDownloadAll={() => void handleDownloadAll()}
        />
      </div>
    </div>
  );
}
