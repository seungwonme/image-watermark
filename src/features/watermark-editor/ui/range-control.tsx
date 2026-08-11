interface RangeControlProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  onChange: (value: number) => void;
}

export function RangeControl({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: RangeControlProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-foreground/78">
          {label}
        </label>
        <output
          htmlFor={id}
          className="min-w-14 rounded-md bg-foreground/[0.055] px-2 py-1 text-right font-mono text-xs font-semibold tabular-nums text-foreground/80"
        >
          {value}
          {suffix}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="watermark-range w-full"
      />
    </div>
  );
}
