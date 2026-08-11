import type { EditorSettings } from "./types";

export const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  kind: "text",
  text: {
    text: "내 이미지",
    fontId: "system-sans",
    color: "#d8ff5f",
    fontSize: 56,
    opacity: 48,
    spacing: 96,
    angle: -32,
    placement: "tile",
  },
  image: {
    size: 18,
    opacity: 55,
    spacing: 72,
    angle: 0,
    placement: "center",
  },
  outputFormat: "png",
  outputQuality: 92,
};
