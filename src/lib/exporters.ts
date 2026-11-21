import { getRevealTiming, type GlyphFit } from '../hooks/useGlyphRun'
import type { GlyphRun } from './fontLoader'
import type { AnimationConfig, SignatureConfig } from '../types'

export interface ExportScene {
  signature: SignatureConfig
  animation: AnimationConfig
  run: GlyphRun
  fit: GlyphFit
}

const FPS = 30

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function fileName(scene: ExportScene, extension: string) {
  const slug = scene.signature.text
    .trim()
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
  return `${slug ? `signflow-${slug}` : 'signflow'}.${extension}`
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/** Vector output: no masks, no pen tip, nothing that only makes sense while animating. */
export function buildStaticSvg(scene: ExportScene): string {
  const { signature, run, fit } = scene
  const background =
    signature.backgroundColor === 'transparent'
      ? ''
      : `<rect width="100%" height="100%" fill="${signature.backgroundColor}"/>`
  const glyphs = run.paths.map((glyph) => `<path d="${glyph.d}"/>`).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${signature.canvasWidth}" height="${signature.canvasHeight}" viewBox="0 0 ${signature.canvasWidth} ${signature.canvasHeight}">${background}<g transform="translate(${fit.tx.toFixed(2)} ${fit.ty.toFixed(2)}) scale(${fit.scale.toFixed(4)})" fill="${signature.fontColor}">${glyphs}</g></svg>`
}

interface Painter {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  drawFrame: (elapsedMs: number) => void
}

const TIP_IMAGE_SCALE = 1.1

function loadTipImage(scene: ExportScene): Promise<HTMLImageElement | null> {
  const style = scene.animation.penTipStyle
  if (style === 'none') return Promise.resolve(null)

  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('The selected pen tip image could not be loaded.'))
    image.src = style === 'pen' ? '/pen-tip.png' : '/feather-tip.png'
  })
}

/**
 * Draws the signature into an offscreen canvas.
 * `Number.POSITIVE_INFINITY` renders the finished signature, any other value renders
 * the reveal at that point in time by clipping each glyph to its own progress.
 */
function createPainter(
  scene: ExportScene,
  pixelRatio: number,
  opaqueBackground: boolean,
  tipImage: HTMLImageElement | null = null,
): Painter {
  const { signature, run, fit } = scene
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(signature.canvasWidth * pixelRatio)
  canvas.height = Math.round(signature.canvasHeight * pixelRatio)

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('This browser refused a 2D canvas context.')

  const { charMs, totalMs } = getRevealTiming(
    run.paths.length,
    scene.animation.speed,
    scene.animation.delayBetweenChars,
  )
  const unit = fit.scale * pixelRatio

  return {
    canvas,
    ctx,
    drawFrame(elapsedMs) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const background =
        signature.backgroundColor === 'transparent'
          ? opaqueBackground
            ? '#ffffff'
            : null
          : signature.backgroundColor

      if (background) {
        ctx.fillStyle = background
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.setTransform(unit, 0, 0, unit, fit.tx * pixelRatio, fit.ty * pixelRatio)
      ctx.fillStyle = signature.fontColor

      run.paths.forEach((glyph, index) => {
        const progress =
          elapsedMs === Number.POSITIVE_INFINITY
            ? 1
            : clamp((elapsedMs - index * charMs) / charMs, 0, 1)
        if (progress <= 0) return

        const width = Math.max(1, glyph.box.x2 - glyph.box.x1)
        ctx.save()
        ctx.beginPath()
        ctx.rect(glyph.box.x1, run.y1 - 2, width * progress, run.height + 4)
        ctx.clip()
        ctx.fill(new Path2D(glyph.d))
        ctx.restore()
      })

      if (tipImage && elapsedMs >= 0 && elapsedMs < totalMs) {
        const rawIndex = Math.floor(elapsedMs / charMs)
        const index = Math.min(rawIndex, run.paths.length - 1)
        const glyph = run.paths[index]
        const progress = clamp((elapsedMs - index * charMs) / charMs, 0, 1)
        const x = glyph.box.x1 + (glyph.box.x2 - glyph.box.x1) * progress
        const y = (glyph.box.y1 + glyph.box.y2) / 2
        const size = signature.fontSize * TIP_IMAGE_SCALE
        ctx.drawImage(tipImage, x, y - size, size, size)
      }
    },
  }
}

export function exportSvg(scene: ExportScene): void {
  download(new Blob([buildStaticSvg(scene)], { type: 'image/svg+xml' }), fileName(scene, 'svg'))
}

export function exportPng(scene: ExportScene): Promise<void> {
  const painter = createPainter(scene, 2, false)
  painter.drawFrame(Number.POSITIVE_INFINITY)

  return new Promise((resolve, reject) => {
    painter.canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('The canvas could not be encoded as PNG.'))
        return
      }
      download(blob, fileName(scene, 'png'))
      resolve()
    }, 'image/png')
  })
}

function playFrames(painter: Painter, durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    const startedAt = performance.now()
    const step = (now: number) => {
      const elapsed = now - startedAt
      painter.drawFrame(Math.min(elapsed, durationMs))
      if (elapsed >= durationMs) {
        resolve()
        return
      }
      requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  })
}

export async function exportWebm(scene: ExportScene): Promise<void> {
  const tipImage = await loadTipImage(scene)
  const painter = createPainter(scene, 1, false, tipImage)
  const { totalMs } = getRevealTiming(
    scene.run.paths.length,
    scene.animation.speed,
    scene.animation.delayBetweenChars,
  )

  const mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find((type) =>
    MediaRecorder.isTypeSupported(type),
  )
  if (!mimeType) throw new Error('This browser cannot record WebM video.')

  const stream = painter.canvas.captureStream(FPS)
  const recorder = new MediaRecorder(stream, { mimeType })
  const chunks: Blob[] = []
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data)
  }
  const stopped = new Promise<void>((resolve) => {
    recorder.onstop = () => resolve()
  })

  recorder.start()
  await playFrames(painter, totalMs + 200)
  recorder.stop()
  await stopped

  for (const track of stream.getTracks()) track.stop()
  download(new Blob(chunks, { type: mimeType }), fileName(scene, 'webm'))
}

export async function exportGif(scene: ExportScene): Promise<void> {
  const [{ default: GIF }, { default: workerUrl }] = await Promise.all([
    import('gif.js'),
    import('gif.js/dist/gif.worker.js?url'),
  ])

  // GIF has no partial transparency, so transparent signatures are flattened onto white.
  const tipImage = await loadTipImage(scene)
  const painter = createPainter(scene, 1, true, tipImage)
  const { totalMs } = getRevealTiming(
    scene.run.paths.length,
    scene.animation.speed,
    scene.animation.delayBetweenChars,
  )

  const delay = Math.round(1000 / FPS)
  const frameCount = Math.max(2, Math.ceil(totalMs / delay))
  const gif = new GIF({
    workers: 2,
    quality: 10,
    workerScript: workerUrl,
    width: painter.canvas.width,
    height: painter.canvas.height,
    repeat: 0,
  })

  for (let frame = 0; frame < frameCount; frame += 1) {
    painter.drawFrame(frame * delay)
    gif.addFrame(painter.ctx, { copy: true, delay })
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    gif.on('finished', (result) => resolve(result))
    gif.on('abort', () => reject(new Error('GIF encoding was cancelled.')))
    gif.render()
  })

  download(blob, fileName(scene, 'gif'))
}

export type ExportRunner = (scene: ExportScene) => void | Promise<void>

export const EXPORTERS: Record<'png' | 'svg' | 'gif' | 'webm', ExportRunner> = {
  png: exportPng,
  svg: exportSvg,
  gif: exportGif,
  webm: exportWebm,
}
