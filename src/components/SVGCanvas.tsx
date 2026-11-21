import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react'
import { FIT_PADDING } from '../lib/fontLoader'
import { fitToTransform, getRevealTiming, useGlyphRun } from '../hooks/useGlyphRun'
import { useT } from '../lib/i18n'
import { useSignatureStore } from '../store/useSignatureStore'

/** Bundled pen artwork used by the "pen" tip; sized against the signature's font size. */
const PEN_IMAGE_SRC = '/pen-tip.png'
const FEATHER_IMAGE_SRC = '/feather-tip.png'
const PEN_IMAGE_SCALE = 1.1
const FEATHER_IMAGE_SCALE = 1.1
/** Which point of the image sits on the writing position: 0 = left/top, 1 = right/bottom. */
const PEN_TIP_ANCHOR = { x: 0, y: 1 }

/**
 * Renders the signature as opentype.js glyph paths and reveals it character by character.
 *
 * Every character gets its own <mask> containing one white rect the size of that glyph's
 * bounding box. The rect scales from 0 to 1 on the X axis (transform only — never width),
 * which wipes the glyph in from left to right. `animation-delay` staggers the characters by
 * `delayBetweenChars`; looping restarts the whole run instead of letting each mask repeat
 * on its own, otherwise every character would fall back into sync after the first cycle.
 *
 * While the font is loading or has failed, a system-font <text> fallback keeps the preview
 * alive under the same single-mask reveal.
 */
export function SVGCanvas() {
  const signature = useSignatureStore((state) => state.signature)
  const animation = useSignatureStore((state) => state.animation)
  const updateAnimation = useSignatureStore((state) => state.updateAnimation)
  const t = useT()

  const { text, fontColor, backgroundColor, fontSize, letterSpacing } = signature
  const { isPlaying, loop, speed, delayBetweenChars, penTipStyle } = animation

  const deferredText = useDeferredValue(text)
  const rawId = useId()
  const uid = useMemo(() => rawId.replace(/[^a-zA-Z0-9]/g, ''), [rawId])

  const { run, fit } = useGlyphRun(deferredText)

  const charCount = run?.paths.length ?? 0
  const { charMs, totalMs } = getRevealTiming(charCount, speed, delayBetweenChars)

  const background = backgroundColor === 'transparent' ? undefined : backgroundColor
  const isEmpty = deferredText.trim().length === 0
  const hasPaths = Boolean(run && run.paths.length > 0)

  const transform = useMemo(() => (fit ? fitToTransform(fit) : undefined), [fit])

  const maskRegion = useMemo(() => {
    if (!run) return undefined
    const margin = Math.max(run.width, run.height) + FIT_PADDING
    return {
      x: run.x1 - margin,
      y: run.y1 - margin,
      width: run.width + margin * 2,
      height: run.height + margin * 2,
    }
  }, [run])

  const [cycle, setCycle] = useState(0)

  /**
   * One timeout per finished run. Bumping `cycle` remounts the mask rects, which is what
   * restarts the reveal; in "once" mode it also flips `isPlaying` back to false so the play
   * button returns to idle instead of staying stuck on "Pause" after the run ends.
   */
  useEffect(() => {
    if (!isPlaying || charCount === 0) return
    const timer = window.setTimeout(() => {
      setCycle((value) => value + 1)
      if (!loop) updateAnimation({ isPlaying: false })
    }, totalMs + 60)
    return () => window.clearTimeout(timer)
  }, [isPlaying, loop, charCount, totalMs, cycle, updateAnimation])

  const penSize = fontSize * PEN_IMAGE_SCALE
  const featherSize = fontSize * FEATHER_IMAGE_SCALE
  const penRef = useRef<SVGGElement>(null)

  /**
   * One pen element drives the whole run from a requestAnimationFrame loop instead of
   * one CSS-animated copy per character: per-character copies blinked at every boundary
   * while the previous one faded out and the next one popped in, so the movement looked
   * unstable. Writing the transform directly also avoids re-rendering the SVG each frame.
   */
  useEffect(() => {
    const node = penRef.current
    if (!node) return
    if (!isPlaying || penTipStyle === 'none' || !run || charCount === 0) {
      node.style.opacity = '0'
      return
    }

    let frame = 0
    let startedAt = performance.now()

    const tick = (now: number) => {
      let elapsed = now - startedAt
      if (elapsed >= totalMs) {
        if (loop) {
          startedAt = now
          elapsed = 0
        } else {
          node.style.opacity = '0'
          return
        }
      }

      const rawIndex = Math.floor(elapsed / charMs)
      const index = Math.min(Math.max(rawIndex, 0), run.paths.length - 1)
      const glyph = run.paths[index]
      const progress = Math.min((elapsed - index * charMs) / charMs, 1)
      const x = glyph.box.x1 + (glyph.box.x2 - glyph.box.x1) * progress
      const y = (glyph.box.y1 + glyph.box.y2) / 2

      node.setAttribute('transform', `translate(${x} ${y})`)
      node.style.opacity = '1'
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [isPlaying, penTipStyle, run, charCount, charMs, totalMs, loop, cycle])

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-8">
      <svg
        role="img"
        aria-label={isEmpty ? t('preview.ariaEmpty') : t('preview.ariaFilled', { name: deferredText })}
        viewBox={`0 0 ${signature.canvasWidth} ${signature.canvasHeight}`}
        width={signature.canvasWidth}
        height={signature.canvasHeight}
        className="max-h-full w-auto max-w-full rounded-lg"
        style={{
          backgroundColor: background,
          aspectRatio: `${signature.canvasWidth} / ${signature.canvasHeight}`,
        }}
      >
        <defs>
          {hasPaths && maskRegion
            ? run?.paths.map((glyph, index) => (
                <mask
                  key={`${uid}-mask-${index}`}
                  id={`${uid}-char-${index}`}
                  maskUnits="userSpaceOnUse"
                  x={maskRegion.x}
                  y={maskRegion.y}
                  width={maskRegion.width}
                  height={maskRegion.height}
                >
                  <rect
                    key={`${uid}-rect-${cycle}-${index}`}
                    x={glyph.box.x1}
                    y={glyph.box.y1}
                    width={Math.max(1, glyph.box.x2 - glyph.box.x1)}
                    height={Math.max(1, glyph.box.y2 - glyph.box.y1)}
                    fill="#fff"
                    className={isPlaying ? 'sf-reveal' : undefined}
                    style={{
                      animationDuration: `${charMs}ms`,
                      animationDelay: `${index * charMs}ms`,
                      animationIterationCount: 1,
                    }}
                  />
                </mask>
              ))
            : null}

          <mask id={`${uid}-canvas`} maskUnits="userSpaceOnUse">
            <rect
              x="0"
              y="0"
              width={signature.canvasWidth}
              height={signature.canvasHeight}
              fill="#000"
            />
            <rect
              key={`${uid}-canvas-rect-${cycle}`}
              x="0"
              y="0"
              width={signature.canvasWidth}
              height={signature.canvasHeight}
              fill="#fff"
              className={isPlaying ? 'sf-reveal' : undefined}
              style={{
                animationDuration: `${totalMs}ms`,
                animationIterationCount: 1,
              }}
            />
          </mask>
        </defs>

        {hasPaths && transform ? (
          <g transform={transform} fill={fontColor}>
            {run?.paths.map((glyph, index) => (
              <g key={`${uid}-glyph-${index}`} mask={`url(#${uid}-char-${index})`}>
                <path d={glyph.d} />
              </g>
            ))}

            {penTipStyle !== 'none' && hasPaths ? (
              <g ref={penRef} aria-hidden="true" opacity={0}>
                {penTipStyle === 'pen' ? (
                  <image
                    href={PEN_IMAGE_SRC}
                    x={-penSize * PEN_TIP_ANCHOR.x}
                    y={-penSize * PEN_TIP_ANCHOR.y}
                    width={penSize}
                    height={penSize}
                    preserveAspectRatio="xMidYMid meet"
                  />
                ) : (
                  <image
                    href={FEATHER_IMAGE_SRC}
                    x={-featherSize * PEN_TIP_ANCHOR.x}
                    y={-featherSize * PEN_TIP_ANCHOR.y}
                    width={featherSize}
                    height={featherSize}
                    preserveAspectRatio="xMidYMid meet"
                  />
                )}
              </g>
            ) : null}
          </g>
        ) : (
          <g mask={`url(#${uid}-canvas)`}>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              fill={fontColor}
              fontSize={fontSize}
              letterSpacing={letterSpacing}
            >
              {deferredText}
            </text>
          </g>
        )}

        {isEmpty ? (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#9aa2af"
            fontSize="24"
          >
            {t('preview.empty')}
          </text>
        ) : null}
      </svg>
    </div>
  )
}
