import { LuCornerDownRight, LuFocus, LuGrid3X3 } from "react-icons/lu";
import type { WatermarkPlacement } from "../model/types";

interface PlacementControlProps {
  value: WatermarkPlacement;
  onChange: (value: WatermarkPlacement) => void;
}

const PLACEMENT_OPTIONS = [
  { value: "tile", label: "반복", icon: LuGrid3X3 },
  { value: "center", label: "가운데", icon: LuFocus },
  { value: "bottom-right", label: "오른쪽 아래", icon: LuCornerDownRight },
] as const;

export function PlacementControl({ value, onChange }: PlacementControlProps) {
  return (
    <fieldset className="space-y-2.5">
      <legend className="text-sm font-medium text-foreground/78">배치</legend>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-foreground/[0.055] p-1">
        {PLACEMENT_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isSelected}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isSelected
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
