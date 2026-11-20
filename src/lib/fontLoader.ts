import { parse, type Font } from 'opentype.js'

/**
 * Font files are fetched once per url and kept in memory for the rest of the session.
 * Nothing is bundled — every entry in `src/data/fonts.ts` points at a runtime url.
 */
const cache = new Map<string, Promise<Font>>()

export class FontLoadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FontLoadError'
  }
}

export function loadFont(url: string): Promise<Font> {
  const cached = cache.get(url)
  if (cached) return cached

  const request = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new FontLoadError(`Font request failed with status ${response.status}.`)
      }
      return response.arrayBuffer()
    })
    .then((buffer) => {
      try {
        return parse(buffer)
      } catch {
        throw new FontLoadError('This file is not a readable TrueType or OpenType font.')
      }
    })
    .catch((error: unknown) => {
      cache.delete(url)
      throw error instanceof FontLoadError
        ? error
        : new FontLoadError('Font could not be downloaded. Check the file path or your network.')
    })

  cache.set(url, request)
  return request
}

/** Free space kept around the signature when it is fitted into the canvas. */
export const FIT_PADDING = 24

export interface GlyphBox {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface GlyphPath {
  char: string
  d: string
  /** Per-character bounding box in glyph units — this is what each reveal mask covers. */
  box: GlyphBox
}

export interface GlyphRun {
  paths: GlyphPath[]
  width: number
  height: number
  x1: number
  y1: number
}

/**
 * One opentype path per character.
 *
 * Phase 2 renders them as a single run; Phase 3 gives each of them its own reveal mask,
 * which is why the per-character advance width lives on the run already.
 */
export function buildGlyphRun(
  font: Font,
  text: string,
  fontSize: number,
  letterSpacing = 0,
): GlyphRun {
  const paths: GlyphPath[] = []
  let cursor = 0
  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (const char of text) {
    const path = font.getPath(char, cursor, 0, fontSize, { kerning: true })
    const d = path.toPathData(2)
    const advance = font.getAdvanceWidth(char, fontSize, { kerning: true })

    if (d) {
      const box = path.getBoundingBox()
      minX = Math.min(minX, box.x1)
      minY = Math.min(minY, box.y1)
      maxX = Math.max(maxX, box.x2)
      maxY = Math.max(maxY, box.y2)
      paths.push({ char, d, box: { x1: box.x1, y1: box.y1, x2: box.x2, y2: box.y2 } })
    }

    cursor += advance + letterSpacing
  }

  const measured = Number.isFinite(minX) && Number.isFinite(minY)

  return {
    paths,
    width: measured ? Math.max(0, maxX - minX) : 0,
    height: measured ? Math.max(0, maxY - minY) : 0,
    x1: measured ? minX : 0,
    y1: measured ? minY : 0,
  }
}
