import { create } from 'zustand'
import { DEFAULT_FONT_ID } from '../data/fonts'
import { MAX_TEXT_LENGTH, type AnimationConfig, type Lang, type SignatureConfig } from '../types'

export type FontStatus = 'idle' | 'loading' | 'ready' | 'error'

interface SignatureState {
  signature: SignatureConfig
  animation: AnimationConfig
  fontStatus: FontStatus
  errorMessage: string | null
  lang: Lang

  setText: (text: string) => void
  updateSignature: (patch: Partial<SignatureConfig>) => void
  updateAnimation: (patch: Partial<AnimationConfig>) => void
  togglePlay: () => void
  setFontStatus: (status: FontStatus, message?: string | null) => void
  setLang: (lang: Lang) => void
  reset: () => void
}

const INITIAL_SIGNATURE: SignatureConfig = {
  text: 'SignatureFlow',
  fontId: DEFAULT_FONT_ID,
  fontColor: '#111827',
  backgroundColor: 'transparent',
  fontSize: 96,
  letterSpacing: 0,
  canvasWidth: 960,
  canvasHeight: 320,
}

const INITIAL_ANIMATION: AnimationConfig = {
  isPlaying: false,
  speed: 0.5,
  loop: true,
  delayBetweenChars: 180,
  penTipStyle: 'none',
}

export const useSignatureStore = create<SignatureState>((set) => ({
  signature: INITIAL_SIGNATURE,
  animation: INITIAL_ANIMATION,
  fontStatus: 'idle',
  errorMessage: null,
  lang: 'zh',

  setText: (text) =>
    set((state) => ({
      signature: { ...state.signature, text: text.slice(0, MAX_TEXT_LENGTH) },
    })),

  updateSignature: (patch) =>
    set((state) => ({ signature: { ...state.signature, ...patch } })),

  updateAnimation: (patch) =>
    set((state) => ({ animation: { ...state.animation, ...patch } })),

  togglePlay: () =>
    set((state) => ({ animation: { ...state.animation, isPlaying: !state.animation.isPlaying } })),

  setFontStatus: (status, message = null) => set({ fontStatus: status, errorMessage: message }),

  setLang: (lang) => set({ lang }),

  reset: () =>
    set({ signature: INITIAL_SIGNATURE, animation: INITIAL_ANIMATION, errorMessage: null }),
}))
