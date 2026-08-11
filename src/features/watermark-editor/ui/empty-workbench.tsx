import { LuImagePlus, LuImages, LuSparkles } from "react-icons/lu";

interface EmptyWorkbenchProps {
  isDragging: boolean;
  onOpenFilePicker: () => void;
}

export function EmptyWorkbench({
  isDragging,
  onOpenFilePicker,
}: EmptyWorkbenchProps) {
  return (
    <div className="flex min-h-[32rem] w-full items-center justify-center p-5 sm:p-10">
      <button
        type="button"
        onClick={onOpenFilePicker}
        className={`group relative flex min-h-[25rem] w-full max-w-3xl flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-dashed px-6 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-workbench ${
          isDragging
            ? "scale-[1.01] border-primary bg-primary/12"
            : "border-workbench-foreground/25 bg-workbench-foreground/[0.035] hover:border-primary/70 hover:bg-workbench-foreground/[0.06]"
        }`}
      >
        <span className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_30%_20%,var(--primary)_0,transparent_25%),radial-gradient(circle_at_75%_80%,var(--signal-blue)_0,transparent_28%)] blur-3xl" />
        <span className="relative mb-7 flex size-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-[0_16px_45px_var(--primary-glow)] transition-transform group-hover:-rotate-3 group-hover:scale-105">
          <LuImagePlus className="size-9" aria-hidden="true" />
        </span>
        <span className="relative text-2xl font-bold tracking-[-0.03em] text-workbench-foreground sm:text-3xl">
          이미지를 놓아 주세요
        </span>
        <span className="relative mt-3 max-w-md text-sm leading-6 text-workbench-foreground/58 sm:text-base">
          클릭해서 선택하거나 여러 이미지를 한 번에 끌어오세요.
          <br />
          JPG, PNG, WebP, AVIF, GIF, SVG를 지원합니다.
        </span>
        <span className="relative mt-8 flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-workbench-foreground/52">
          <span className="flex items-center gap-1.5 rounded-full border border-workbench-foreground/12 bg-workbench/50 px-3 py-1.5">
            <LuImages className="size-3.5" aria-hidden="true" />
            여러 장 일괄 처리
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-workbench-foreground/12 bg-workbench/50 px-3 py-1.5">
            <LuSparkles className="size-3.5" aria-hidden="true" />
            원본 해상도 유지
          </span>
        </span>
      </button>
    </div>
  );
}
