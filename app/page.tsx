import type { Metadata } from "next";
import { HomePage } from "@/pages/home";
import { siteConfig } from "@/shared/config";

export const metadata: Metadata = {
  title: "이미지 워터마크 만들기",
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
};

export default HomePage;
