import { useState } from 'react'
import { ALLOWED_TEXT_PATTERN, MAX_TEXT_LENGTH } from '../types'
import { useT } from '../lib/i18n'
import { useSignatureStore } from '../store/useSignatureStore'

export function TextInput() {
  const text = useSignatureStore((state) => state.signature.text)
  const setText = useSignatureStore((state) => state.setText)
  const [invalid, setInvalid] = useState(false)
  const t = useT()

  const handleChange = (raw: string) => {
    setInvalid(!ALLOWED_TEXT_PATTERN.test(raw))
    setText(raw)
  }

  return (
    <section className="border-b border-line px-4 py-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="signature-text" className="sf-label">
            {t('text.label')}
          </label>
          <span className="sf-value">
            {text.length}/{MAX_TEXT_LENGTH}
          </span>
        </div>

        <input
          id="signature-text"
          type="text"
          value={text}
          maxLength={MAX_TEXT_LENGTH}
          autoComplete="off"
          spellCheck={false}
          placeholder={t('text.placeholder')}
          onChange={(event) => handleChange(event.target.value)}
          aria-invalid={invalid}
          aria-describedby={invalid ? 'signature-text-error' : undefined}
          className={[
            'h-[34px] w-full rounded-sm border border-line/40 bg-white px-2.5',
            'font-medium tracking-tight text-ink transition-colors',
            'placeholder:font-normal placeholder:text-ink-muted',
            'hover:bg-muted focus:border-ink/30 focus:outline-none',
            'focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-surface',
          ].join(' ')}
        />

        {invalid ? (
          <p id="signature-text-error" className="text-[11px] text-red-600 dark:text-red-400">
            {t('text.error')}
          </p>
        ) : null}
      </div>
    </section>
  )
}
