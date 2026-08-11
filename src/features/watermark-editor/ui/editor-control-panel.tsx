"use client";

import { useRef } from "react";
import {
  LuDownload,
  LuFileArchive,
  LuImage,
  LuImagePlus,
  LuInfo,
  LuLoaderCircle,
  LuRotateCcw,
  LuType,
} from "react-icons/lu";
import { Button } from "@/shared/ui";
import type {
  EditorSettings,
  EditorStatus,
  FontOption,
  ImageWatermarkSettings,
  TextWatermarkSettings,
  WatermarkImage,
  WatermarkKind,
} from "../model/types";
import { FontPicker } from "./font-picker";
import { PlacementControl } from "./placement-control";
import { RangeControl } from "./range-control";

interface EditorControlPanelProps {
  settings: EditorSettings;
  fonts: FontOption[];
  selectedFont: FontOption;
  watermarkImage: WatermarkImage | null;
  sourceImageCount: number;
  canDownload: boolean;
  status: EditorStatus;
  onSettingsChange: (settings: EditorSettings) => void;
  onAddLocalFont: (file: File) => void;
  onWatermarkImageChange: (file: File) => void;
  onResetSettings: () => void;
  onDownloadCurrent: () => void;
  onDownloadAll: () => void;
}

const KIND_OPTIONS: Array<{
  value: WatermarkKind;
  label: string;
  icon: typeof LuType;
}> = [
  { value: "text", label: "텍스트 워터마크", icon: LuType },
  { value: "image", label: "이미지 워터마크", icon: LuImage },
];

export function EditorControlPanel({
  settings,
  fonts,
  selectedFont,
  watermarkImage,
  sourceImageCount,
  canDownload,
  status,
  onSettingsChange,
  onAddLocalFont,
  onWatermarkImageChange,
  onResetSettings,
  onDownloadCurrent,
  onDownloadAll,
}: EditorControlPanelProps) {
  const watermarkImageInputRef = useRef<HTMLInputElement>(null);

  const updateKind = (kind: WatermarkKind) => {
    onSettingsChange({ ...settings, kind });
  };

  const updateText = (patch: Partial<TextWatermarkSettings>) => {
    onSettingsChange({
      ...settings,
      text: { ...settings.text, ...patch },
    });
  };

  const updateImage = (patch: Partial<ImageWatermarkSettings>) => {
    onSettingsChange({
      ...settings,
      image: { ...settings.image, ...patch },
    });
  };

  return (
    <aside className="flex min-h-0 flex-col border-t border-border bg-card lg:border-l lg:border-t-0">
      <div className="border-b border-border p-3">
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-foreground/[0.055] p-1">
          {KIND_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = settings.kind === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateKind(option.value)}
                aria-pressed={isSelected}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-2 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isSelected
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 sm:p-5">
        {settings.kind === "text" ? (
          <div className="space-y-5">
            <div className="space-y-2.5">
              <label
                htmlFor="watermark-text"
                className="text-sm font-medium text-foreground/78"
              >
                워터마크 문구
              </label>
              <textarea
                id="watermark-text"
                value={settings.text.text}
                onChange={(event) => updateText({ text: event.target.value })}
                rows={2}
                maxLength={120}
                placeholder="표시할 문구를 입력하세요"
                className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-6 outline-none transition-shadow placeholder:text-muted-foreground/65 focus:ring-2 focus:ring-primary"
              />
            </div>

            <FontPicker
              fonts={fonts}
              selectedFont={selectedFont}
              onSelect={(fontId) => updateText({ fontId })}
              onAddLocalFont={onAddLocalFont}
            />

            <div className="space-y-2.5">
              <label
                htmlFor="watermark-color"
                className="text-sm font-medium text-foreground/78"
              >
                색상
              </label>
              <div className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-background p-1.5 pr-3.5">
                <input
                  id="watermark-color"
                  type="color"
                  value={settings.text.color}
                  onChange={(event) =>
                    updateText({ color: event.target.value })
                  }
                  className="h-9 w-16 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={settings.text.color.toUpperCase()}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
                      updateText({ color: value });
                    }
                  }}
                  aria-label="워터마크 색상 HEX 값"
                  className="min-w-0 flex-1 bg-transparent font-mono text-xs font-semibold uppercase outline-none"
                />
                <span
                  className="size-7 rounded-full border border-black/10 shadow-inner"
                  style={{ backgroundColor: settings.text.color }}
                  aria-hidden="true"
                />
              </div>
            </div>

            <PlacementControl
              value={settings.text.placement}
              onChange={(placement) => updateText({ placement })}
            />

            <RangeControl
              id="text-font-size"
              label="글꼴 크기"
              value={settings.text.fontSize}
              min={16}
              max={320}
              suffix="px"
              onChange={(fontSize) => updateText({ fontSize })}
            />
            <RangeControl
              id="text-opacity"
              label="불투명도"
              value={settings.text.opacity}
              min={5}
              max={100}
              suffix="%"
              onChange={(opacity) => updateText({ opacity })}
            />
            <RangeControl
              id="text-spacing"
              label={
                settings.text.placement === "tile"
                  ? "반복 간격"
                  : "가장자리 여백"
              }
              value={settings.text.spacing}
              min={12}
              max={480}
              suffix="px"
              onChange={(spacing) => updateText({ spacing })}
            />
            <RangeControl
              id="text-angle"
              label="각도"
              value={settings.text.angle}
              min={-90}
              max={90}
              suffix="°"
              onChange={(angle) => updateText({ angle })}
            />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2.5">
              <span className="text-sm font-medium text-foreground/78">
                워터마크 이미지
              </span>
              <button
                type="button"
                onClick={() => watermarkImageInputRef.current?.click()}
                className="group flex min-h-28 w-full items-center gap-4 rounded-2xl border border-dashed border-border bg-background p-3 text-left transition-colors hover:border-primary"
              >
                <span
                  className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-border bg-[linear-gradient(45deg,var(--checker)_25%,transparent_25%),linear-gradient(-45deg,var(--checker)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,var(--checker)_75%),linear-gradient(-45deg,transparent_75%,var(--checker)_75%)] bg-[length:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0px] bg-center bg-contain bg-no-repeat"
                  style={
                    watermarkImage
                      ? { backgroundImage: `url("${watermarkImage.url}")` }
                      : undefined
                  }
                >
                  {!watermarkImage ? (
                    <LuImagePlus
                      className="size-7 text-muted-foreground transition-colors group-hover:text-primary"
                      aria-hidden="true"
                    />
                  ) : null}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-foreground">
                    {watermarkImage?.name ?? "로고나 서명 이미지 선택"}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    투명 배경 PNG 또는 SVG를 권장합니다.
                  </span>
                </span>
              </button>
              <input
                ref={watermarkImageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    onWatermarkImageChange(file);
                  }
                  event.target.value = "";
                }}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>

            <PlacementControl
              value={settings.image.placement}
              onChange={(placement) => updateImage({ placement })}
            />
            <RangeControl
              id="image-size"
              label="이미지 크기"
              value={settings.image.size}
              min={4}
              max={70}
              suffix="%"
              onChange={(size) => updateImage({ size })}
            />
            <RangeControl
              id="image-opacity"
              label="불투명도"
              value={settings.image.opacity}
              min={5}
              max={100}
              suffix="%"
              onChange={(opacity) => updateImage({ opacity })}
            />
            <RangeControl
              id="image-spacing"
              label={
                settings.image.placement === "tile"
                  ? "반복 간격"
                  : "가장자리 여백"
              }
              value={settings.image.spacing}
              min={12}
              max={480}
              suffix="px"
              onChange={(spacing) => updateImage({ spacing })}
            />
            <RangeControl
              id="image-angle"
              label="각도"
              value={settings.image.angle}
              min={-90}
              max={90}
              suffix="°"
              onChange={(angle) => updateImage({ angle })}
            />
          </div>
        )}

        <div className="border-t border-border pt-5">
          <button
            type="button"
            onClick={onResetSettings}
            className="flex min-h-10 items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <LuRotateCcw className="size-3.5" aria-hidden="true" />
            설정 초기화
          </button>
        </div>
      </div>

      <div className="space-y-3 border-t border-border bg-card p-4 pb-20 sm:p-5 sm:pb-20">
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <label htmlFor="output-format" className="sr-only">
            저장 형식
          </label>
          <select
            id="output-format"
            value={settings.outputFormat}
            onChange={(event) =>
              onSettingsChange({
                ...settings,
                outputFormat: event.target
                  .value as EditorSettings["outputFormat"],
              })
            }
            className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="png">PNG - 최고 품질</option>
            <option value="jpeg">JPG - 작은 용량</option>
            <option value="webp">WebP - 웹 최적화</option>
          </select>
          <span className="flex min-w-16 items-center justify-center rounded-xl bg-foreground/[0.055] px-2 font-mono text-[11px] font-semibold text-muted-foreground">
            {settings.outputFormat === "png"
              ? "LOSSLESS"
              : `Q${settings.outputQuality}`}
          </span>
        </div>

        {settings.outputFormat !== "png" ? (
          <RangeControl
            id="output-quality"
            label="저장 품질"
            value={settings.outputQuality}
            min={50}
            max={100}
            suffix="%"
            onChange={(outputQuality) =>
              onSettingsChange({ ...settings, outputQuality })
            }
          />
        ) : null}

        <Button
          type="button"
          size="lg"
          disabled={!canDownload || status.kind === "working"}
          onClick={onDownloadCurrent}
          className="h-12 w-full rounded-xl bg-primary text-sm font-extrabold text-primary-foreground shadow-[0_12px_30px_var(--primary-glow)] hover:bg-primary/88"
        >
          {status.kind === "working" ? (
            <LuLoaderCircle className="animate-spin" aria-hidden="true" />
          ) : (
            <LuDownload aria-hidden="true" />
          )}
          현재 이미지 다운로드
        </Button>

        {sourceImageCount > 1 ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={!canDownload || status.kind === "working"}
            onClick={onDownloadAll}
            className="h-11 w-full rounded-xl text-xs font-bold"
          >
            <LuFileArchive aria-hidden="true" />
            {sourceImageCount}장 ZIP으로 받기
          </Button>
        ) : null}

        <div
          aria-live="polite"
          className={`flex min-h-8 items-start gap-2 rounded-lg px-2 py-1.5 text-[11px] leading-4 ${
            status.kind === "error"
              ? "bg-destructive/10 text-destructive"
              : "text-muted-foreground"
          }`}
        >
          {status.kind === "idle" ? (
            <>
              <LuInfo className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              설정 값은 미리보기에 바로 반영됩니다.
            </>
          ) : (
            <>
              {status.kind === "working" ? (
                <LuLoaderCircle
                  className="mt-0.5 size-3.5 shrink-0 animate-spin"
                  aria-hidden="true"
                />
              ) : null}
              <span>
                {status.message}
                {status.kind === "working" && status.progress
                  ? ` (${status.progress}%)`
                  : ""}
              </span>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
