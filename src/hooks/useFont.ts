import { useEffect, useState } from 'react'
import type { Font } from 'opentype.js'
import { loadFont } from '../lib/fontLoader'
import { useSignatureStore } from '../store/useSignatureStore'

/**
 * Loads the selected font file and mirrors its lifecycle into the store,
 * so every panel (font skeleton, preview status line) reads one source of truth.
 */
export function useFont(url: string): Font | null {
  const setFontStatus = useSignatureStore((state) => state.setFontStatus)
  const [font, setFont] = useState<Font | null>(null)

  useEffect(() => {
    let cancelled = false
    setFont(null)
    setFontStatus('loading')

    loadFont(url)
      .then((loaded) => {
        if (cancelled) return
        setFont(loaded)
        setFontStatus('ready')
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setFont(null)
        setFontStatus('error', error instanceof Error ? error.message : 'Unknown font error.')
      })

    return () => {
      cancelled = true
    }
  }, [url, setFontStatus])

  return font
}
