import type { FontItem } from '../types'

/**
 * The bundled font package.
 *
 * Every file lives in `public/fonts` and ships with the app, so nothing is fetched from
 * a third party at runtime. Add a new font by dropping the file in that folder and
 * appending one entry here — opentype.js parses .ttf and .otf (CFF) alike.
 */
export const FONTS: FontItem[] = [
  {
    id: 'the-billion',
    name: 'The Billion',
    url: '/fonts/the-billion.otf',
    license: 'personal',
    style: 'elegant',
  },
  {
    id: 'brigend-signature',
    name: 'Brigend Signature',
    url: '/fonts/brigend-signature.ttf',
    license: 'commercial',
    style: 'elegant',
  },
  {
    id: 'bughats',
    name: 'Bughats',
    url: '/fonts/bughats.ttf',
    license: 'commercial',
    style: 'retro',
  },
  {
    id: 'pointone',
    name: 'Pointone',
    url: '/fonts/pointone.otf',
    license: 'commercial',
    style: 'modern',
  },
  {
    id: 'sign-rathi',
    name: 'Sign Rathi',
    url: '/fonts/sign-rathi.ttf',
    license: 'commercial',
    style: 'elegant',
  },
]

export const DEFAULT_FONT_ID = FONTS[0].id

export function findFont(id: string): FontItem | undefined {
  return FONTS.find((font) => font.id === id)
}
