import { publicEnv } from "./env";

// Single source of truth for site-wide metadata.
// Update these fields per project; downstream code (layout, sitemap,
// robots, manifest, JSON-LD) reads from here.

export const siteConfig = {
  name: "Watermark Lab",
  description:
    "눈누와 Google Fonts로 텍스트 및 이미지 워터마크를 만드는 이미지 편집 도구",
  url: publicEnv.siteUrl,
  locale: "ko_KR",
  lang: "ko",
  author: {
    name: "Aiden Ahn",
    url: "https://github.com/seungwonme",
  },
  keywords: [
    "이미지 워터마크",
    "텍스트 워터마크",
    "눈누 폰트",
    "Google Fonts",
    "이미지 편집",
  ],
  ogImage: "/opengraph-image",
  themeColor: {
    light: "#f2f4ef",
    dark: "#101210",
  },
} as const;

export type SiteConfig = typeof siteConfig;
