/**
 * Shared domain types for SignatureFlow.
 * These three models are the contract between the store, the controls and the renderer.
 */

export type FontStyle = 'elegant' | 'modern' | 'retro'

export interface FontItem {
  id: string
  name: string
  url: string
  license: 'personal' | 'commercial' | 'unknown'
  style: FontStyle
}

export type Lang = 'zh' | 'en'

export interface SignatureConfig {
  text: string
  fontId: string
  fontColor: string
  backgroundColor: string | 'transparent'
  fontSize: number
  letterSpacing: number
  canvasWidth: number
  canvasHeight: number
}

export interface AnimationConfig {
  isPlaying: boolean
  speed: number
  loop: boolean
  delayBetweenChars: number
  penTipStyle: 'none' | 'feather' | 'pen'
}

export const MAX_TEXT_LENGTH = 30

/** MVP is English-only: letters, digits, spaces and basic punctuation (.'-&). */
export const ALLOWED_TEXT_PATTERN = /^[A-Za-z0-9 .'\-&]*$/

export const TEXT_LIMITS = {
  canvasWidth: { min: 320, max: 1920, step: 16 },
  canvasHeight: { min: 160, max: 1080, step: 16 },
  fontSize: { min: 24, max: 240, step: 2 },
  letterSpacing: { min: -4, max: 24, step: 1 },
} as const
