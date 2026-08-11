"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LuCheck,
  LuChevronDown,
  LuExternalLink,
  LuSearch,
  LuUpload,
  LuX,
} from "react-icons/lu";
import { FONT_PROVIDER_LABELS } from "../config";
import { ensureFontLoaded } from "../lib/font-loader";
import type { FontCategory, FontOption, FontProvider } from "../model/types";

interface FontPickerProps {
  fonts: FontOption[];
  selectedFont: FontOption;
  onSelect: (fontId: string) => void;
  onAddLocalFont: (file: File) => void;
}

type ProviderFilter = FontProvider | "all";
type CategoryFilter = FontCategory | "all";

const PROVIDER_FILTERS: Array<{
  value: ProviderFilter;
  label: string;
}> = [
  { value: "all", label: "전체" },
  { value: "noonnu", label: "눈누" },
  { value: "google", label: "Google" },
  { value: "system", label: "기본" },
  { value: "local", label: "내 글꼴" },
];

const CATEGORY_FILTERS: Array<{
  value: CategoryFilter;
  label: string;
}> = [
  { value: "all", label: "전체 스타일" },
  { value: "gothic", label: "고딕" },
  { value: "serif", label: "명조" },
  { value: "handwriting", label: "손글씨" },
  { value: "display", label: "타이틀" },
  { value: "monospace", label: "고정폭" },
  { value: "custom", label: "직접 추가" },
];

const CATEGORY_LABELS: Record<FontCategory, string> = {
  gothic: "고딕",
  serif: "명조",
  handwriting: "손글씨",
  display: "타이틀",
  monospace: "고정폭",
  custom: "직접 추가",
};

const PROVIDER_ORDER: Record<FontProvider, number> = {
  noonnu: 0,
  google: 1,
  system: 2,
  local: 3,
};

function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase("ko");
}

function matchesSearch(font: FontOption, normalizedQuery: string): boolean {
  if (!normalizedQuery) {
    return true;
  }

  return [font.name, font.family, ...(font.aliases ?? [])].some((value) =>
    value.toLocaleLowerCase("ko").includes(normalizedQuery),
  );
}

export function FontPicker({
  fonts,
  selectedFont,
  onSelect,
  onAddLocalFont,
}: FontPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState<ProviderFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [loadedPreviewFontIds, setLoadedPreviewFontIds] = useState<Set<string>>(
    () => new Set(),
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);
  const previewListRef = useRef<HTMLFieldSetElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    void ensureFontLoaded(selectedFont, "가나다라마바사 ABC 123");
  }, [selectedFont]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const focusTarget = window.matchMedia("(min-width: 768px)").matches
      ? searchInputRef.current
      : closeButtonRef.current;
    focusTarget?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);
      if (!firstElement || !lastElement) {
        return;
      }

      if (
        event.shiftKey &&
        (document.activeElement === firstElement ||
          !dialogRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === lastElement ||
          !dialogRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerButtonRef.current?.focus();
    };
  }, [isOpen]);

  const normalizedQuery = normalizeSearchText(query);

  const categoryCounts = useMemo(() => {
    const counts = new Map<FontCategory, number>();
    for (const font of fonts) {
      const matchesProvider =
        providerFilter === "all" || font.provider === providerFilter;
      if (!matchesProvider || !matchesSearch(font, normalizedQuery)) {
        continue;
      }
      counts.set(font.category, (counts.get(font.category) ?? 0) + 1);
    }
    return counts;
  }, [fonts, normalizedQuery, providerFilter]);

  const filteredFonts = useMemo(() => {
    return fonts
      .filter((font) => {
        const matchesProvider =
          providerFilter === "all" || font.provider === providerFilter;
        const matchesCategory =
          categoryFilter === "all" || font.category === categoryFilter;
        return (
          matchesProvider &&
          matchesCategory &&
          matchesSearch(font, normalizedQuery)
        );
      })
      .sort((fontA, fontB) => {
        if (providerFilter === "all" && fontA.provider !== fontB.provider) {
          return (
            PROVIDER_ORDER[fontA.provider] - PROVIDER_ORDER[fontB.provider]
          );
        }

        const rankDifference =
          (fontA.popularityRank ?? Number.MAX_SAFE_INTEGER) -
          (fontB.popularityRank ?? Number.MAX_SAFE_INTEGER);
        return (
          rankDifference ||
          fontA.name.localeCompare(fontB.name, "ko", { numeric: true })
        );
      });
  }, [categoryFilter, fonts, normalizedQuery, providerFilter]);

  const fontById = useMemo(
    () => new Map(fonts.map((font) => [font.id, font])),
    [fonts],
  );
  const previewFontKey = filteredFonts.map((font) => font.id).join("|");

  useEffect(() => {
    const previewList = previewListRef.current;
    if (!isOpen || !previewList || !previewFontKey) {
      return;
    }

    let isCancelled = false;
    const previewElements = Array.from(
      previewList.querySelectorAll<HTMLElement>("[data-font-preview-id]"),
    );

    const loadPreviewFont = (element: HTMLElement) => {
      const fontId = element.dataset.fontPreviewId;
      const font = fontId ? fontById.get(fontId) : undefined;
      if (!font || loadedPreviewFontIds.has(font.id)) {
        return;
      }

      void ensureFontLoaded(
        font,
        font.supportsKorean ? "가나다 Aa" : "Aa 123",
      ).then((isLoaded) => {
        if (!isLoaded || isCancelled) {
          return;
        }
        setLoadedPreviewFontIds((current) => {
          if (current.has(font.id)) {
            return current;
          }
          const next = new Set(current);
          next.add(font.id);
          return next;
        });
      });
    };

    if (!("IntersectionObserver" in window)) {
      for (const element of previewElements.slice(0, 12)) {
        loadPreviewFont(element);
      }
      return () => {
        isCancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          observer.unobserve(entry.target);
          loadPreviewFont(entry.target as HTMLElement);
        }
      },
      { root: previewList, rootMargin: "120px 0px" },
    );

    for (const element of previewElements) {
      observer.observe(element);
    }

    return () => {
      isCancelled = true;
      observer.disconnect();
    };
  }, [fontById, isOpen, loadedPreviewFontIds, previewFontKey]);

  const handleProviderChange = (provider: ProviderFilter) => {
    setProviderFilter(provider);
    setCategoryFilter("all");
  };

  const handleFontUpload = (file: File | undefined) => {
    if (!file) {
      return;
    }
    onAddLocalFont(file);
    setProviderFilter("local");
    setCategoryFilter("all");
    setQuery("");
    if (fontInputRef.current) {
      fontInputRef.current.value = "";
    }
  };

  return (
    <div className="relative space-y-2.5">
      <span className="text-sm font-medium text-foreground/78">글꼴</span>
      <button
        ref={triggerButtonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 text-left shadow-xs transition-colors hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="min-w-0">
          <span
            className="block truncate text-base text-foreground"
            style={{ fontFamily: `"${selectedFont.family}", sans-serif` }}
          >
            {selectedFont.name}
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {FONT_PROVIDER_LABELS[selectedFont.provider]} ·{" "}
            {CATEGORY_LABELS[selectedFont.category]}
          </span>
        </span>
        <LuChevronDown
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="글꼴 선택 창 닫기"
            tabIndex={-1}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[80] cursor-default bg-black/45 backdrop-blur-[2px]"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="font-picker-title"
            className="fixed inset-x-3 bottom-3 top-16 z-[81] flex flex-col overflow-hidden rounded-3xl border border-border bg-popover shadow-2xl shadow-black/25 sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:h-[min(44rem,calc(100svh-4rem))] sm:w-[min(40rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
              <div>
                <h2
                  id="font-picker-title"
                  className="text-base font-black tracking-tight"
                >
                  글꼴 선택
                </h2>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  눈누와 Google Fonts를 제공처별 인기순으로 보여줍니다.
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="닫기"
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <LuX className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3 border-b border-border p-3 sm:p-4">
              <div className="relative">
                <LuSearch
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  type="search"
                  name="font-search"
                  autoComplete="off"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="한글 또는 영문 글꼴 이름 검색"
                  aria-label="글꼴 이름 검색"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-9 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="검색어 지우기"
                    className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <LuX className="size-3.5" aria-hidden="true" />
                  </button>
                ) : null}
              </div>

              <fieldset className="flex min-w-0 gap-1 overflow-x-auto pb-0.5">
                <legend className="sr-only">글꼴 제공처</legend>
                {PROVIDER_FILTERS.map((filter) => {
                  const isSelected = filter.value === providerFilter;
                  const count =
                    filter.value === "all"
                      ? fonts.length
                      : fonts.filter((font) => font.provider === filter.value)
                          .length;
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => handleProviderChange(filter.value)}
                      aria-pressed={isSelected}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isSelected
                          ? "bg-foreground text-background"
                          : "bg-foreground/[0.055] text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {filter.label} {count}
                    </button>
                  );
                })}
              </fieldset>

              <fieldset className="flex min-w-0 gap-1 overflow-x-auto pb-0.5">
                <legend className="sr-only">글꼴 카테고리</legend>
                {CATEGORY_FILTERS.filter(
                  (filter) =>
                    filter.value === "all" ||
                    (categoryCounts.get(filter.value) ?? 0) > 0,
                ).map((filter) => {
                  const isSelected = filter.value === categoryFilter;
                  const count =
                    filter.value === "all"
                      ? [...categoryCounts.values()].reduce(
                          (total, value) => total + value,
                          0,
                        )
                      : (categoryCounts.get(filter.value) ?? 0);
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setCategoryFilter(filter.value)}
                      aria-pressed={isSelected}
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isSelected
                          ? "border-primary bg-primary/18 text-foreground"
                          : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground"
                      }`}
                    >
                      {filter.label} {count}
                    </button>
                  );
                })}
              </fieldset>
            </div>

            <div className="flex items-center justify-between border-b border-border px-4 py-2 text-[11px] font-semibold text-muted-foreground">
              <span>{filteredFonts.length}개 글꼴</span>
              <span>제공처별 인기순</span>
            </div>

            <fieldset
              ref={previewListRef}
              className="min-h-0 min-w-0 flex-1 overflow-y-auto p-2"
            >
              <legend className="sr-only">글꼴 검색 결과</legend>
              {filteredFonts.length > 0 ? (
                filteredFonts.map((font) => {
                  const isSelected = font.id === selectedFont.id;
                  return (
                    <button
                      key={font.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        onSelect(font.id);
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition-colors [contain-intrinsic-size:auto_3.75rem] [content-visibility:auto] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isSelected
                          ? "bg-primary/18 text-foreground"
                          : "hover:bg-foreground/[0.055]"
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span
                          data-font-preview-id={font.id}
                          className="flex min-w-0 items-baseline justify-between gap-3"
                          style={
                            font.provider === "system" ||
                            loadedPreviewFontIds.has(font.id)
                              ? {
                                  fontFamily: `"${font.family}", sans-serif`,
                                }
                              : undefined
                          }
                        >
                          <span className="truncate text-base">
                            {font.name}
                          </span>
                          <span
                            className="shrink-0 text-sm text-muted-foreground"
                            aria-hidden="true"
                          >
                            {font.supportsKorean ? "가나다 Aa" : "Aa 123"}
                          </span>
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                          <span>{FONT_PROVIDER_LABELS[font.provider]}</span>
                          <span aria-hidden="true">·</span>
                          <span>{CATEGORY_LABELS[font.category]}</span>
                          <span className="rounded bg-foreground/[0.06] px-1 py-0.5">
                            {font.supportsKorean ? "한글" : "영문"}
                          </span>
                          {font.popularityRank ? (
                            <span className="rounded bg-primary/18 px-1 py-0.5 text-foreground">
                              인기 {font.popularityRank}위
                            </span>
                          ) : null}
                        </span>
                      </span>
                      {isSelected ? (
                        <LuCheck
                          className="size-4 shrink-0"
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  );
                })
              ) : (
                <p className="px-3 py-12 text-center text-sm text-muted-foreground">
                  검색 조건에 맞는 글꼴이 없습니다.
                </p>
              )}
            </fieldset>

            <div className="grid grid-cols-2 gap-2 border-t border-border p-2 sm:p-3">
              <button
                type="button"
                onClick={() => fontInputRef.current?.click()}
                className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-foreground/[0.055] px-3 text-xs font-semibold text-foreground hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <LuUpload className="size-3.5" aria-hidden="true" />내 글꼴 추가
              </button>
              {selectedFont.licenseUrl ? (
                <a
                  href={selectedFont.licenseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 text-xs font-semibold text-muted-foreground hover:bg-foreground/[0.055] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  이용 조건
                  <LuExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              ) : (
                <span className="flex min-h-10 items-center justify-center px-3 text-center text-[10px] text-muted-foreground">
                  직접 추가한 글꼴
                </span>
              )}
            </div>
          </div>
        </>
      ) : null}

      <input
        ref={fontInputRef}
        type="file"
        accept=".woff,.woff2,.ttf,.otf,font/woff,font/woff2,font/ttf,font/otf"
        onChange={(event) => handleFontUpload(event.target.files?.[0])}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
