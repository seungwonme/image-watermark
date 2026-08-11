import type { Metadata } from "next";
import { GuidePage } from "@/pages/guide";
import { siteConfig } from "@/shared/config";

const description =
  "이미지 추가부터 텍스트 또는 로고 워터마크 설정, PNG, JPG, WebP와 ZIP 저장까지 Watermark Lab 사용법을 확인하세요.";

export const metadata: Metadata = {
  title: "이미지 워터마크 사용법",
  description,
  alternates: {
    canonical: "/guide",
  },
  openGraph: {
    url: `${siteConfig.url}/guide`,
    title: `이미지 워터마크 사용법 | ${siteConfig.name}`,
    description,
  },
};

export default GuidePage;
