import { useEffect, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from './ui/button'
import { FormatSelector, type ExportFormat } from './FormatSelector'
import { ExportButton } from './ExportButton'
import { useT } from '../lib/i18n'
import type { ExportScene } from '../lib/exporters'

interface ExportPopoverProps {
  scene: ExportScene | null
}

/** Outlined trigger; the format choice and the real download live inside the popover. */
export function ExportPopover({ scene }: ExportPopoverProps) {
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState<ExportFormat>('png')
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const t = useT()

  useEffect(() => {
    if (!open) return

    const close = () => setOpen(false)
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) close()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={wrapRef} className="relative">
      <Button
        ref={triggerRef}
        variant="secondary"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Download size={14} aria-hidden />
        {t('export.trigger')}
      </Button>

      {open ? (
        <div
          role="dialog"
          aria-label={t('export.trigger')}
          className="absolute bottom-full left-1/2 z-30 mb-2 flex w-[236px] -translate-x-1/2 flex-col gap-3 rounded-md border border-line/60 bg-surface p-3"
        >
          <FormatSelector value={format} onChange={setFormat} />
          <ExportButton format={format} scene={scene} />
        </div>
      ) : null}
    </div>
  )
}
