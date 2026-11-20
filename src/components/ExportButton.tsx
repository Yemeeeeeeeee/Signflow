import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { EXPORTERS, type ExportScene } from '../lib/exporters'
import { useT } from '../lib/i18n'
import type { ExportFormat } from './FormatSelector'

type ExportState = 'idle' | 'working' | 'done' | 'error'

interface ExportButtonProps {
  format: ExportFormat
  scene: ExportScene | null
}

export function ExportButton({ format, scene }: ExportButtonProps) {
  const [state, setState] = useState<ExportState>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const t = useT()

  const blocked = !scene || scene.run.paths.length === 0

  async function handleExport() {
    if (!scene) return
    setState('working')
    setMessage(null)
    try {
      await EXPORTERS[format](scene)
      setState('done')
      setMessage(t('export.saved', { format: format.toUpperCase() }))
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : t('export.failed'))
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="primary"
        className="w-full"
        disabled={blocked || state === 'working'}
        onClick={handleExport}
      >
        {state === 'working' ? (
          <Loader2 size={14} className="animate-spin" aria-hidden />
        ) : (
          <Download size={14} aria-hidden />
        )}
        {state === 'working' ? t('export.working') : t('export.action', { format: format.toUpperCase() })}
      </Button>

      {blocked ? (
        <p className="text-[11px] leading-snug text-ink-muted">
          {t('export.blocked')}
        </p>
      ) : null}

      {!blocked && format === 'gif' && scene?.signature.backgroundColor === 'transparent' ? (
        <p className="text-[11px] leading-snug text-ink-muted">
          {t('export.gifNote')}
        </p>
      ) : null}

      {!blocked && format === 'webm' ? (
        <p className="text-[11px] leading-snug text-ink-muted">
          {t('export.webmNote')}
        </p>
      ) : null}

      {message ? (
        <p
          role="status"
          className={`text-[11px] leading-snug ${
            state === 'error' ? 'text-red-600 dark:text-red-400' : 'text-ink-muted'
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}
