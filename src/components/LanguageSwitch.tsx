import { cn } from '../lib/utils'
import { LANGS, useT } from '../lib/i18n'
import { useSignatureStore } from '../store/useSignatureStore'

/** Segmented zh / EN switch; Chinese is the default and the active option is pressed. */
export function LanguageSwitch() {
  const lang = useSignatureStore((state) => state.lang)
  const setLang = useSignatureStore((state) => state.setLang)
  const t = useT()

  return (
    <div className="sf-segment" role="group" aria-label={t('lang.switch')}>
      {LANGS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLang(option.value)}
          aria-pressed={lang === option.value}
          className={cn(
            'sf-segment-item',
            lang === option.value ? 'sf-segment-item-on' : 'sf-segment-item-off',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
