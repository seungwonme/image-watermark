import type {
  Article,
  BreadcrumbList,
  FAQPage,
  Organization,
  Person,
  Product,
  WebApplication,
  WebPage,
  WebSite,
  WithContext,
} from "schema-dts";
import { siteConfig } from "@/shared/config";

type JsonLdType =
  | WithContext<WebSite>
  | WithContext<WebPage>
  | WithContext<Article>
  | WithContext<Organization>
  | WithContext<Person>
  | WithContext<BreadcrumbList>
  | WithContext<Product>
  | WithContext<WebApplication>
  | WithContext<FAQPage>;

interface JsonLdProps {
  data: JsonLdType;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function createWebSiteJsonLd(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}

export function createWebApplicationJsonLd(): WithContext<WebApplication> {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    browserRequirements: "Canvas를 지원하는 최신 웹 브라우저",
    inLanguage: "ko-KR",
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    featureList: [
      "텍스트 워터마크",
      "로고 이미지 워터마크",
      "눈누 및 Google Fonts 글꼴 선택",
      "여러 이미지 일괄 저장",
      "PNG, JPG, WebP 형식 다운로드",
    ],
  };
}

interface WebPageJsonLdOptions {
  title: string;
  description: string;
  url: string;
}

export function createWebPageJsonLd(
  options: WebPageJsonLdOptions,
): WithContext<WebPage> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: options.title,
    description: options.description,
    url: options.url,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

interface ArticleJsonLdOptions {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
}

export function createArticleJsonLd(
  options: ArticleJsonLdOptions,
): WithContext<Article> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.title,
    description: options.description,
    url: options.url,
    image: options.image,
    datePublished: options.datePublished,
    dateModified: options.dateModified || options.datePublished,
    author: {
      "@type": "Person",
      name: options.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function createBreadcrumbJsonLd(
  items: BreadcrumbItem[],
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface OrganizationJsonLdOptions {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

export function createOrganizationJsonLd(
  options: OrganizationJsonLdOptions,
): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: options.name,
    url: options.url,
    logo: options.logo,
    sameAs: options.sameAs,
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

export function createFAQJsonLd(items: FAQItem[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
