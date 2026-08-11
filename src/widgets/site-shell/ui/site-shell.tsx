"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FaGithub } from "react-icons/fa6";
import { LuCircleHelp, LuImage, LuLayers3 } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { ThemeToggle } from "@/shared/ui";

interface SiteShellProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { href: "/", label: "만들기", icon: LuImage },
  { href: "/guide", label: "사용법", icon: LuCircleHelp },
] as const;

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-2 z-[100] -translate-y-16 rounded-lg bg-foreground px-4 py-2 text-sm font-bold text-background transition-transform focus:translate-y-0"
      >
        본문으로 건너뛰기
      </a>
      <header className="sticky top-0 z-[60] flex h-16 items-center justify-between border-b border-border bg-card/95 px-3 backdrop-blur sm:px-6">
        <Link
          href="/"
          aria-label="Watermark Lab 편집기"
          className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
            <LuLayers3 className="size-5" aria-hidden="true" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-base font-black tracking-[-0.035em] sm:text-lg">
              WATERMARK LAB
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Image watermark studio
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="주요 메뉴" className="flex rounded-xl bg-muted p-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-3",
                    isActive
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="main-content">{children}</main>

      <a
        href="https://github.com/seungwonme/image-watermark"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub 저장소 열기"
        className="fixed bottom-5 right-5 z-[70] flex size-12 items-center justify-center rounded-full border border-background/15 bg-foreground text-background shadow-[0_14px_38px_rgba(0,0,0,0.28)] transition-transform hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <FaGithub className="size-5" aria-hidden="true" />
      </a>
    </>
  );
}
