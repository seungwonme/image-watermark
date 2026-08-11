import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/guide`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
