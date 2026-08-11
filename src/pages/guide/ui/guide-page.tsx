import Link from "next/link";
import {
  LuArrowRight,
  LuDownload,
  LuImagePlus,
  LuSlidersHorizontal,
} from "react-icons/lu";
import { siteConfig } from "@/shared/config";
import { createFAQJsonLd, createWebPageJsonLd, JsonLd } from "@/shared/lib";
import { Button } from "@/shared/ui";

const GUIDE_DESCRIPTION =
  "이미지 추가부터 텍스트 또는 로고 워터마크 설정, PNG, JPG, WebP와 ZIP 저장까지 Watermark Lab 사용법을 확인하세요.";

const GUIDE_STEPS = [
  {
    number: "01",
    title: "이미지 추가",
    description: "한 장 또는 여러 장의 이미지를 선택합니다.",
    icon: LuImagePlus,
  },
  {
    number: "02",
    title: "워터마크 설정",
    description: "텍스트나 로고를 고르고 배치와 스타일을 조절합니다.",
    icon: LuSlidersHorizontal,
  },
  {
    number: "03",
    title: "파일 저장",
    description: "PNG, JPG, WebP 또는 여러 장 ZIP으로 저장합니다.",
    icon: LuDownload,
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "여러 이미지에 같은 워터마크를 넣을 수 있나요?",
    answer:
      "여러 이미지를 한 번에 추가한 뒤 같은 워터마크 설정을 적용하고 ZIP 파일로 저장할 수 있습니다.",
  },
  {
    question: "텍스트와 로고 이미지 워터마크를 모두 지원하나요?",
    answer:
      "텍스트 워터마크와 로고 이미지 워터마크를 선택할 수 있으며 반복, 가운데, 오른쪽 아래 배치를 지원합니다.",
  },
  {
    question: "눈누와 Google Fonts 글꼴은 어떻게 찾나요?",
    answer:
      "글꼴 선택 창에서 이름을 검색하거나 제공처와 글꼴 종류를 선택해 원하는 글꼴을 찾을 수 있습니다.",
  },
  {
    question: "어떤 파일 형식으로 저장할 수 있나요?",
    answer:
      "완성 이미지는 PNG, JPG, WebP 형식으로 저장할 수 있고 여러 이미지는 ZIP 파일로 받을 수 있습니다.",
  },
];

export function GuidePage() {
  return (
    <div className="min-h-[calc(100svh-4rem)] bg-background px-5 py-12 text-foreground sm:px-8 sm:py-16 lg:py-20">
      <JsonLd
        data={createWebPageJsonLd({
          title: "이미지 워터마크 사용법",
          description: GUIDE_DESCRIPTION,
          url: `${siteConfig.url}/guide`,
        })}
      />
      <JsonLd data={createFAQJsonLd(FAQ_ITEMS)} />

      <div className="mx-auto max-w-6xl">
        <section className="grid gap-8 border-b border-border pb-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-end lg:pb-16">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Watermark maker guide
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.05em] sm:text-6xl sm:leading-[1.05]">
              세 단계면 워터마크가 완성됩니다
            </h1>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              이미지를 추가하고 텍스트 또는 로고를 고른 뒤 크기, 투명도, 간격과
              각도를 조절하세요. 한 장은 이미지 파일로, 여러 장은 ZIP 파일로
              저장할 수 있습니다.
            </p>
            <Button asChild className="mt-6 rounded-xl">
              <Link href="/">
                편집기 열기
                <LuArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>

        <ol className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-3">
          {GUIDE_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <li key={step.number} className="bg-card p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    {step.number}
                  </span>
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                </div>
                <h2 className="mt-12 text-lg font-black tracking-tight">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>

        <section
          aria-labelledby="faq-title"
          className="mt-16 grid gap-8 lg:mt-20 lg:grid-cols-[minmax(16rem,0.65fr)_minmax(0,1.35fr)]"
        >
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              FAQ
            </p>
            <h2
              id="faq-title"
              className="mt-3 text-2xl font-black tracking-[-0.035em] sm:text-3xl"
            >
              자주 묻는 질문
            </h2>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {FAQ_ITEMS.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="cursor-pointer list-none pr-8 text-sm font-bold marker:content-none sm:text-base">
                  {item.question}
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
