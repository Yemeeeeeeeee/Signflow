import { useSignatureStore } from '../store/useSignatureStore'
import { cn } from '../lib/utils'
import { FONTS } from '../data/fonts'
import type { FontStyle } from '../types'
import { useT, type StringKey } from '../lib/i18n'
import { Panel } from './Panel'

const STYLE_KEYS: Record<FontStyle, StringKey> = {
  elegant: 'font.style.elegant',
  modern: 'font.style.modern',
  retro: 'font.style.retro',
}

export function FontSelector() {
  const fontId = useSignatureStore((state) => state.signature.fontId)
  const updateSignature = useSignatureStore((state) => state.updateSignature)
  const fontStatus = useSignatureStore((state) => state.fontStatus)
  const t = useT()

  return (
    <Panel title={t('font.panel')}>
      <div className="grid grid-cols-2 gap-2">
        {FONTS.map((font) => {
          const selected = font.id === fontId
          return (
            <button
              key={font.id}
              type="button"
              onClick={() => updateSignature({ fontId: font.id })}
              aria-pressed={selected}
              className={cn(
                'flex h-[62px] flex-col justify-between rounded-sm border p-2.5 text-left',
                'transition-colors duration-150',
                selected
                  ? 'border-ink/25 bg-muted text-ink'
                  : 'border-line/40 bg-canvas text-ink-muted hover:border-ink/20 hover:bg-muted/50',
              )}
            >
              <span
                className={cn(
                  'truncate text-[13px] font-medium tracking-tight',
                  selected ? 'text-ink' : 'text-ink',
                )}
              >
                {font.name}
              </span>
              <span className="sf-label">{t(STYLE_KEYS[font.style])}</span>
            </button>
          )
        })}
      </div>

      {fontStatus === 'loading' ? (
        <div
          className="h-[34px] w-full animate-pulse rounded-sm border border-line/40 bg-muted/50"
          aria-hidden="true"
        />
      ) : null}
    </Panel>
  )
}
