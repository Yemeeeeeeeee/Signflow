declare module 'gif.js' {
  interface GifOptions {
    workers?: number
    quality?: number
    width?: number
    height?: number
    workerScript?: string
    background?: string
    repeat?: number
  }

  interface FrameOptions {
    delay?: number
    copy?: boolean
  }

  export default class GIF {
    constructor(options?: GifOptions)
    addFrame(
      frame: CanvasRenderingContext2D | HTMLCanvasElement | ImageData,
      options?: FrameOptions,
    ): void
    on(event: 'finished', callback: (blob: Blob) => void): void
    on(event: 'progress', callback: (percent: number) => void): void
    on(event: 'abort', callback: () => void): void
    render(): void
    abort(): void
  }
}
