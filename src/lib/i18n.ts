import { useSignatureStore } from '../store/useSignatureStore'
import type { Lang } from '../types'

export const LANGS: { value: Lang; label: string }[] = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'EN' },
]

/** English is the source of truth for keys, so `zh` must stay complete. */
export type StringKey = keyof typeof en

const en = {
  'lang.switch': 'Switch language',

  'header.tagline': 'Signatures in motion',
  'header.licenseWarning':
    '“{name}” has an unknown licence. Confirm commercial-use rights before shipping anything exported with it.',

  'text.label': 'Your name',
  'text.placeholder': 'e.g. John Hancock',
  'text.error': "English letters, numbers and . ' - & only.",

  'font.panel': 'Font',
  'font.style.elegant': 'Elegant',
  'font.style.modern': 'Modern',
  'font.style.retro': 'Retro',

  'style.panel': 'Style',
  'style.textLabel': 'Text',
  'style.bgLabel': 'BG',
  'style.textColor': 'Text colour',
  'style.backgroundColor': 'Background colour',
  'style.transparent': 'Transparent',
  'style.solid': 'Solid',
  'style.size': 'Size',
  'style.tracking': 'Tracking',

  'anim.panel': 'Animation',
  'anim.speed': 'Speed',
  'anim.charDelay': 'Char delay',
  'anim.loop': 'Loop',
  'anim.on': 'On',
  'anim.once': 'Once',
  'anim.penTip': 'Pen tip',
  'anim.penTip.none': 'None',
  'anim.penTip.feather': 'Feather',
  'anim.penTip.pen': 'Pen',

  'preview.play': 'Play',
  'preview.pause': 'Pause',
  'preview.canvasWidth': 'Canvas w',
  'preview.canvasHeight': 'Canvas h',
  'preview.loopShort': 'loop',
  'preview.onceShort': 'once',
  'preview.loopOn': 'Loop on',
  'preview.loopOff': 'Loop off',
  'preview.loading': 'Loading {name}…',
  'preview.selectedFont': 'the selected font',
  'preview.loadError': '{name} could not be loaded.',
  'preview.empty': 'Type your name to start',
  'preview.ariaEmpty': 'Empty signature preview',
  'preview.ariaFilled': 'Preview of {name}',

  'export.trigger': 'Export',
  'export.format': 'Format',
  'export.pngHint': 'Raster, keeps transparency',
  'export.svgHint': 'Vector, editable',
  'export.webmHint': 'Video with alpha channel',
  'export.gifHint': 'No partial transparency',
  'export.action': 'Export {format}',
  'export.working': 'Exporting…',
  'export.blocked': 'Type at least one character and wait for the font to finish loading.',
  'export.gifNote': 'GIF has no partial transparency — this export is flattened onto white.',
  'export.webmNote': 'Recording replays the animation once, so keep this tab focused.',
  'export.saved': '{format} saved to your downloads.',
  'export.failed': 'Export failed.',
}

const zh: Record<StringKey, string> = {
  'lang.switch': '切换语言',

  'header.tagline': '让笔迹优雅流动',
  'header.licenseWarning': '“{name}”的授权信息未知。在商用之前请先确认其商用授权范围。',

  'text.label': '你的名字',
  'text.placeholder': '例如 John Hancock',
  'text.error': "仅支持英文字母、数字以及 . ' - &",

  'font.panel': '字体',
  'font.style.elegant': '优雅',
  'font.style.modern': '现代',
  'font.style.retro': '复古',

  'style.panel': '样式',
  'style.textLabel': '文字',
  'style.bgLabel': '背景',
  'style.textColor': '文字颜色',
  'style.backgroundColor': '背景颜色',
  'style.transparent': '透明',
  'style.solid': '纯色',
  'style.size': '字号',
  'style.tracking': '字距',

  'anim.panel': '动画',
  'anim.speed': '速度',
  'anim.charDelay': '字符间隔',
  'anim.loop': '循环',
  'anim.on': '开',
  'anim.once': '一次',
  'anim.penTip': '笔尖',
  'anim.penTip.none': '无',
  'anim.penTip.feather': '羽毛',
  'anim.penTip.pen': '钢笔',

  'preview.play': '播放',
  'preview.pause': '暂停',
  'preview.canvasWidth': '画布宽',
  'preview.canvasHeight': '画布高',
  'preview.loopShort': '循环',
  'preview.onceShort': '单次',
  'preview.loopOn': '循环开',
  'preview.loopOff': '循环关',
  'preview.loading': '正在加载 {name}…',
  'preview.selectedFont': '所选字体',
  'preview.loadError': '{name} 加载失败。',
  'preview.empty': '输入名字开始',
  'preview.ariaEmpty': '空签名预览',
  'preview.ariaFilled': '{name} 的预览',

  'export.trigger': '导出',
  'export.format': '格式',
  'export.pngHint': '位图，保留透明通道',
  'export.svgHint': '矢量，可编辑',
  'export.webmHint': '视频，带透明通道',
  'export.gifHint': '不支持半透明',
  'export.action': '导出 {format}',
  'export.working': '导出中…',
  'export.blocked': '请至少输入一个字符，并等待字体加载完成。',
  'export.gifNote': 'GIF 不支持半透明 —— 本次导出会压平为白底。',
  'export.webmNote': '录制会完整播放一遍动画，请保持当前标签页处于前台。',
  'export.saved': '{format} 已保存到下载目录。',
  'export.failed': '导出失败。',
}

const DICTS: Record<Lang, Record<StringKey, string>> = { zh, en }

type Vars = Record<string, string | number>

function fill(template: string, vars?: Vars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  )
}

/** Reads the active language from the store and returns its lookup function. */
export function useT() {
  const lang = useSignatureStore((state) => state.lang)
  return (key: StringKey, vars?: Vars): string => fill(DICTS[lang][key], vars)
}
