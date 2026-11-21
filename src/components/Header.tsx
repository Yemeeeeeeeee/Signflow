import { findFont } from '../data/fonts'
import { useT } from '../lib/i18n'
import { useSignatureStore } from '../store/useSignatureStore'
import { LanguageSwitch } from './LanguageSwitch'

export function Header() {
  const fontId = useSignatureStore((state) => state.signature.fontId)
  const font = findFont(fontId)
  const unknownLicense = font?.license === 'unknown'
  const t = useT()

  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-line bg-canvas/95 backdrop-blur-sm">
      <div className="flex h-11 items-center gap-2 px-4">
        <img
          src="/logo.png"
          alt=""
          aria-hidden="true"
          width={24}
          height={24}
          className="h-6 w-6 rounded-md object-contain"
        />
        <h1 className="font-mono text-[11px] font-medium uppercase tracking-tight text-ink">
          Signflow
        </h1>

        <span className="h-3.5 w-px bg-line/60" aria-hidden />

        <p className="text-[11px] text-ink-muted">{t('header.tagline')}</p>

        <div className="ml-auto">
          <LanguageSwitch />
        </div>
      </div>

      {unknownLicense ? (
        <p className="border-t border-line bg-muted/60 px-4 py-1.5 text-[11px] text-ink">
          {t('header.licenseWarning', { name: font?.name ?? '' })}
        </p>
      ) : null}
    </header>
  )
}
