interface NumberFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  error?: string;
  step?: string;
  min?: number;
  helpText?: string;
  accentClassName?: string;
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  unit,
  error,
  step = "1",
  min = 0,
  helpText,
  accentClassName,
}: NumberFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between text-xs font-medium tracking-wide text-muted uppercase"
      >
        <span>{label}</span>
        {unit && <span className="font-technical text-[11px] normal-case text-muted">{unit}</span>}
      </label>
      <div className="mt-1.5 relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
          className={`font-technical w-full rounded-md border bg-surface px-3 py-2 text-base text-foreground outline-none transition-colors focus:ring-2 focus:ring-offset-0 ${
            error
              ? "border-danger focus:ring-danger/40"
              : `border-surface-border focus:border-transparent focus:ring-accent/40 ${accentClassName ?? ""}`
          }`}
        />
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      ) : helpText ? (
        <p id={`${id}-help`} className="mt-1 text-xs text-muted">
          {helpText}
        </p>
      ) : null}
    </div>
  );
}
