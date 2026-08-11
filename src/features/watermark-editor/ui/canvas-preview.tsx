"use client";

import { useEffect, useRef, useState } from "react";
import { LuLoaderCircle, LuTriangleAlert } from "react-icons/lu";
import { renderWatermarkedImage } from "../lib/canvas-renderer";
import { ensureFontLoaded } from "../lib/font-loader";
import type {
  EditorSettings,
  FontOption,
  SourceImage,
  WatermarkImage,
} from "../model/types";

interface CanvasPreviewProps {
  source: SourceImage;
  settings: EditorSettings;
  font: FontOption;
  watermarkImage: WatermarkImage | null;
}

type PreviewState = "loading" | "ready" | "font-fallback" | "error";

export function CanvasPreview({
  source,
  settings,
  font,
  watermarkImage,
}: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewState, setPreviewState] = useState<PreviewState>("loading");

  useEffect(() => {
    let isCancelled = false;
    let frameId = 0;

    const renderPreview = async () => {
      setPreviewState("loading");
      const isFontReady =
        settings.kind !== "text" ||
        (await ensureFontLoaded(font, settings.text.text));

      if (isCancelled) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        try {
          const canvas = canvasRef.current;
          if (!canvas) {
            throw new Error("미리보기 Canvas를 시작할 수 없습니다.");
          }
          renderWatermarkedImage({
            source,
            settings,
            font,
            watermarkImage,
            preview: true,
            targetCanvas: canvas,
          });
          setPreviewState(isFontReady ? "ready" : "font-fallback");
        } catch {
          setPreviewState("error");
        }
      });
    };

    void renderPreview();

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(frameId);
    };
  }, [font, settings, source, watermarkImage]);

  return (
    <div className="relative flex h-full min-h-[26rem] w-full items-center justify-center overflow-hidden p-4 sm:p-7 lg:p-10">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`${source.name} 워터마크 미리보기`}
        className="max-h-[68vh] max-w-full rounded-sm object-contain shadow-[0_30px_90px_rgba(0,0,0,0.3)]"
      />

      {previewState === "loading" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-workbench/40 backdrop-blur-[2px]">
          <span className="flex items-center gap-2 rounded-full bg-card/90 px-3 py-2 text-xs font-semibold text-foreground shadow-lg">
            <LuLoaderCircle
              className="size-4 animate-spin"
              aria-hidden="true"
            />
            미리보기 생성 중
          </span>
        </div>
      ) : null}

      {previewState === "font-fallback" ? (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-amber-400 px-3 py-2 text-xs font-semibold text-black shadow-lg">
          <LuTriangleAlert className="size-4" aria-hidden="true" />
          글꼴을 불러오지 못해 기본 글꼴로 표시합니다.
        </div>
      ) : null}

      {previewState === "error" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-workbench/90 p-6 text-center text-sm text-foreground">
          미리보기를 만들지 못했습니다. 다른 이미지로 다시 시도해 주세요.
        </div>
      ) : null}
    </div>
  );
}
