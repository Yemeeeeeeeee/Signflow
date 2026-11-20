import { cn } from '../lib/utils'
import { useT, type StringKey } from '../lib/i18n'

export type ExportFormat = 'png' | 'svg' | 'gif' | 'webm'

const FORMATS: { value: ExportFormat; label: string; hintKey: StringKey }[] = [
  { value: 'png', label: 'PNG', hintKey: 'export.pngHint' },
  { value: 'svg', label: 'SVG', hintKey: 'export.svgHint' },
  { value: 'webm', label: 'WebM', hintKey: 'export.webmHint' },
  { value: 'gif', label: 'GIF', hintKey: 'export.gifHint' },
]

interface FormatSelectorProps {
  value: ExportFormat
  onChange: (format: ExportFormat) => void
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  const t = useT()

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="sf-label">{t('export.format')}</legend>
      {FORMATS.map((format) => (
        <label
          key={format.value}
          className={cn(
            'flex cursor-pointer items-center gap-2.5 rounded-sm border px-2.5 py-1.5',
            'transition-colors duration-150',
            value === format.value
              ? 'border-ink/25 bg-muted'
              : 'border-line/40 bg-canvas hover:border-ink/20 hover:bg-muted/50',
          )}
        >
          <input
            type="radio"
            name="export-format"
            value={format.value}
            checked={value === format.value}
            onChange={() => onChange(format.value)}
            className="h-3 w-3 accent-accent"
          />
          <span className="flex flex-col">
            <span className="text-[12px] font-medium tracking-tight text-ink">{format.label}</span>
            <span className="text-[11px] leading-snug text-ink-muted">
              {t(format.hintKey)}
            </span>
          </span>
        </label>
      ))}
    </fieldset>
  )
}
