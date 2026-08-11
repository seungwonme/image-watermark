export type WatermarkKind = "text" | "image";

export type WatermarkPlacement = "tile" | "center" | "bottom-right";

export type OutputFormat = "png" | "jpeg" | "webp";

export type FontProvider = "google" | "noonnu" | "system" | "local";

export type FontCategory =
  | "gothic"
  | "serif"
  | "handwriting"
  | "display"
  | "latin"
  | "custom";

export interface FontOption {
  id: string;
  name: string;
  family: string;
  provider: FontProvider;
  category: FontCategory;
  supportsKorean: boolean;
  sourceUrl?: string;
  licenseUrl?: string;
}

export interface TextWatermarkSettings {
  text: string;
  fontId: string;
  color: string;
  fontSize: number;
  opacity: number;
  spacing: number;
  angle: number;
  placement: WatermarkPlacement;
}

export interface ImageWatermarkSettings {
  size: number;
  opacity: number;
  spacing: number;
  angle: number;
  placement: WatermarkPlacement;
}

export interface EditorSettings {
  kind: WatermarkKind;
  text: TextWatermarkSettings;
  image: ImageWatermarkSettings;
  outputFormat: OutputFormat;
  outputQuality: number;
}

export interface SourceImage {
  id: string;
  file: File;
  name: string;
  url: string;
  width: number;
  height: number;
  element: HTMLImageElement;
}

export interface WatermarkImage {
  file: File;
  name: string;
  url: string;
  width: number;
  height: number;
  element: HTMLImageElement;
}

export type EditorStatus =
  | { kind: "idle" }
  | { kind: "working"; message: string; progress?: number }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };
