import { useMemo } from 'react'
import { buildGlyphRun, FIT_PADDING, type GlyphRun } from '../lib/fontLoader'
import { findFont } from '../data/fonts'
import { useFont } from './useFont'
import { useSignatureStore } from '../store/useSignatureStore'

export interface GlyphFit {
  scale: number
  tx: number
  ty: number
}

export interface GlyphSceneSource {
  run: GlyphRun | null
  fit: GlyphFit | null
}

/**
 * Single source of truth for "text + font + canvas" geometry.
 * The preview renders from it and the exporters rebuild frames from the same numbers,
 * so what you see is what gets written to disk.
 */
export function useGlyphRun(deferredText?: string): GlyphSceneSource {
  const signature = useSignatureStore((state) => state.signature)
  const fontItem = findFont(signature.fontId)
  const font = useFont(fontItem?.url ?? '')

  const text = deferredText ?? signature.text

  const run = useMemo(() => {
    if (!font) return null
    return buildGlyphRun(font, text, signature.fontSize, signature.letterSpacing)
  }, [font, text, signature.fontSize, signature.letterSpacing])

  const fit = useMemo<GlyphFit | null>(() => {
    if (!run || run.width === 0 || run.height === 0) return null
    const availableWidth = signature.canvasWidth - FIT_PADDING * 2
    const availableHeight = signature.canvasHeight - FIT_PADDING * 2
    const scale = Math.min(1, availableWidth / run.width, availableHeight / run.height)
    return {
      scale,
      tx: (signature.canvasWidth - run.width * scale) / 2 - run.x1 * scale,
      ty: (signature.canvasHeight - run.height * scale) / 2 - run.y1 * scale,
    }
  }, [run, signature.canvasWidth, signature.canvasHeight])

  return { run, fit }
}

export function fitToTransform(fit: GlyphFit): string {
  return `translate(${fit.tx.toFixed(2)} ${fit.ty.toFixed(2)}) scale(${fit.scale.toFixed(4)})`
}

/** Per-character reveal timing shared by the animation, the WebM recorder and the GIF. */
export function getRevealTiming(characterCount: number, speed: number, delayBetweenChars: number) {
  const charMs = Math.max(60, Math.round(delayBetweenChars / speed))
  return { charMs, totalMs: Math.max(400, charMs * characterCount) }
}
