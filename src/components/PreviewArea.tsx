import { Pause, Play } from 'lucide-react'
import { findFont } from '../data/fonts'
import { useGlyphRun } from '../hooks/useGlyphRun'
import { SVGCanvas } from './SVGCanvas'
import { TEXT_LIMITS } from '../types'
import { Slider } from './ui/slider'
import { Button } from './ui/button'
import { ExportPopover } from './ExportPopover'
import type { ExportScene } from '../lib/exporters'
import { useT } from '../lib/i18n'
import { useSignatureStore } from '../store/useSignatureStore'

export function PreviewArea() {
  const signature = useSignatureStore((state) => state.signature)
  const animation = useSignatureStore((state) => state.animation)
  const updateSignature = useSignatureStore((state) => state.updateSignature)
  const updateAnimation = useSignatureStore((state) => state.updateAnimation)
  const togglePlay = useSignatureStore((state) => state.togglePlay)
  const fontStatus = useSignatureStore((state) => state.fontStatus)
  const errorMessage = useSignatureStore((state) => state.errorMessage)
  const { run, fit } = useGlyphRun()

  const t = useT()

  const fontName = findFont(signature.fontId)?.name ?? t('preview.selectedFont')
  const { isPlaying, loop, speed } = animation

  const scene: ExportScene | null =
    run && fit ? { signature, animation, run, fit } : null

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 items-center justify-center p-6">
        <div className="sf-workspace relative flex h-full w-full max-w-[960px] items-center justify-center rounded-lg border border-line/60 p-4">
          <SVGCanvas />

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-md border border-line/60 bg-canvas/95 p-1.5 backdrop-blur-sm">
            <Button variant="primary" onClick={togglePlay} aria-pressed={isPlaying}>
              {isPlaying ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}
              {isPlaying ? t('preview.pause') : t('preview.play')}
            </Button>
            <ExportPopover scene={scene} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-line px-4 py-2">
        <p role="status" className="min-h-[16px] max-w-[220px] truncate text-[11px]">
          {fontStatus === 'loading' ? (
            <span className="text-ink-muted">{t('preview.loading', { name: fontName })}</span>
          ) : null}
          {fontStatus === 'error' ? (
            <span className="text-red-600 dark:text-red-400">
              {errorMessage ?? t('preview.loadError', { name: fontName })}
            </span>
          ) : null}
        </p>

        <div className="w-[150px]">
          <Slider
            label={t('preview.canvasWidth')}
            value={signature.canvasWidth}
            min={TEXT_LIMITS.canvasWidth.min}
            max={TEXT_LIMITS.canvasWidth.max}
            step={TEXT_LIMITS.canvasWidth.step}
            suffix="px"
            onChange={(canvasWidth) => updateSignature({ canvasWidth })}
          />
        </div>

        <div className="w-[150px]">
          <Slider
            label={t('preview.canvasHeight')}
            value={signature.canvasHeight}
            min={TEXT_LIMITS.canvasHeight.min}
            max={TEXT_LIMITS.canvasHeight.max}
            step={TEXT_LIMITS.canvasHeight.step}
            suffix="px"
            onChange={(canvasHeight) => updateSignature({ canvasHeight })}
          />
        </div>

        <span className="sf-value ml-auto">
          {speed.toFixed(1)}× · {loop ? t('preview.loopShort') : t('preview.onceShort')}
        </span>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => updateAnimation({ loop: !loop })}
          aria-pressed={loop}
        >
          {loop ? t('preview.loopOn') : t('preview.loopOff')}
        </Button>
      </div>
    </div>
  )
}
