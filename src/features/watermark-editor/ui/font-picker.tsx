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
import type { FontOption, FontProvider } from "../model/types";

interface FontPickerProps {
  fonts: FontOption[];
  selectedFont: FontOption;
  onSelect: (fontId: string) => void;
  onAddLocalFont: (file: File) => void;
}

type ProviderFilter = FontProvider | "all";

const PROVIDER_FILTERS: Array<{
  value: ProviderFilter;
  label: string;
}> = [
  { value: "all", label: "전체" },
  { value: "noonnu", label: "눈누" },
  { value: "google", label: "Google" },
  { value: "local", label: "내 글꼴" },
];

export function FontPicker({
  fonts,
  selectedFont,
  onSelect,
  onAddLocalFont,
}: FontPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState<ProviderFilter>("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void ensureFontLoaded(selectedFont, "가나다라마바사 ABC 123");
  }, [selectedFont]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    searchInputRef.current?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const filteredFonts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ko");
    return fonts.filter((font) => {
      const matchesProvider =
        providerFilter === "all" || font.provider === providerFilter;
      const matchesQuery =
        !normalizedQuery ||
        font.name.toLocaleLowerCase("ko").includes(normalizedQuery) ||
        font.family.toLocaleLowerCase("en").includes(normalizedQuery);
      return matchesProvider && matchesQuery;
    });
  }, [fonts, providerFilter, query]);

  const handleFontUpload = (file: File | undefined) => {
    if (!file) {
      return;
    }
    onAddLocalFont(file);
    setProviderFilter("local");
    setQuery("");
    if (fontInputRef.current) {
      fontInputRef.current.value = "";
    }
  };

  return (
    <div ref={containerRef} className="relative space-y-2.5">
      <span className="text-sm font-medium text-foreground/78">글꼴</span>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
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
            {FONT_PROVIDER_LABELS[selectedFont.provider]}
          </span>
        </span>
        <LuChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          role="dialog"
          aria-label="글꼴 선택"
          className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-50 overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl shadow-black/15"
        >
          <div className="space-y-3 border-b border-border p-3">
            <div className="relative">
              <LuSearch
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="글꼴 이름 검색"
                aria-label="글꼴 이름 검색"
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-9 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="검색어 지우기"
                  className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                >
                  <LuX className="size-3.5" aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <div className="flex gap-1 overflow-x-auto pb-0.5">
              {PROVIDER_FILTERS.map((filter) => {
                const isSelected = filter.value === providerFilter;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setProviderFilter(filter.value)}
                    aria-pressed={isSelected}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isSelected
                        ? "bg-foreground text-background"
                        : "bg-foreground/[0.055] text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto p-2" role="listbox">
            {filteredFonts.length > 0 ? (
              filteredFonts.map((font) => {
                const isSelected = font.id === selectedFont.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelect(font.id);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      isSelected
                        ? "bg-primary/18 text-foreground"
                        : "hover:bg-foreground/[0.055]"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {font.name}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                        {FONT_PROVIDER_LABELS[font.provider]}
                        {font.supportsKorean ? (
                          <span className="rounded bg-foreground/[0.06] px-1 py-0.5">
                            한글
                          </span>
                        ) : (
                          <span className="rounded bg-foreground/[0.06] px-1 py-0.5">
                            영문
                          </span>
                        )}
                      </span>
                    </span>
                    {isSelected ? (
                      <LuCheck className="size-4 shrink-0" aria-hidden="true" />
                    ) : null}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                검색 결과가 없습니다.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-border p-2">
            <button
              type="button"
              onClick={() => fontInputRef.current?.click()}
              className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-foreground/[0.055] px-3 text-xs font-semibold text-foreground hover:bg-foreground/10"
            >
              <LuUpload className="size-3.5" aria-hidden="true" />내 글꼴 추가
            </button>
            {selectedFont.licenseUrl ? (
              <a
                href={selectedFont.licenseUrl}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 text-xs font-semibold text-muted-foreground hover:bg-foreground/[0.055] hover:text-foreground"
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
