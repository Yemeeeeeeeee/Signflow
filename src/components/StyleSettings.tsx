import { TEXT_LIMITS } from '../types'
import { useT } from '../lib/i18n'
import { useSignatureStore } from '../store/useSignatureStore'
import { Slider } from './ui/slider'
import { Panel } from './Panel'

const NEUTRALS = ['#0a0a0a', '#ffffff', '#8f8f8f']

export function StyleSettings() {
  const signature = useSignatureStore((state) => state.signature)
  const updateSignature = useSignatureStore((state) => state.updateSignature)

  const transparent = signature.backgroundColor === 'transparent'
  const t = useT()

  return (
    <Panel title={t('style.panel')}>
      <div className="sf-row">
        <input
          type="color"
          value={signature.fontColor}
          onChange={(event) => updateSignature({ fontColor: event.target.value })}
          aria-label={t('style.textColor')}
          className="h-6 w-9 cursor-pointer rounded-[2px] border border-line/60 bg-transparent p-0"
        />
        <span className="sf-label">{t('style.textLabel')}</span>
        <div className="ml-auto flex items-center gap-1.5">
          {NEUTRALS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => updateSignature({ fontColor: color })}
              aria-label={`${t('style.textColor')} ${color}`}
              className="h-4 w-4 rounded-[2px] border border-line/60"
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="sf-value ml-1">{signature.fontColor.toUpperCase()}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="sf-segment w-full">
          <button
            type="button"
            onClick={() => updateSignature({ backgroundColor: 'transparent' })}
            aria-pressed={transparent}
            className={`sf-segment-item flex-1 ${
              transparent ? 'sf-segment-item-on' : 'sf-segment-item-off'
            }`}
          >
            {t('style.transparent')}
          </button>
          <button
            type="button"
            onClick={() => updateSignature({ backgroundColor: '#ffffff' })}
            aria-pressed={!transparent}
            className={`sf-segment-item flex-1 ${
              transparent ? 'sf-segment-item-off' : 'sf-segment-item-on'
            }`}
          >
            {t('style.solid')}
          </button>
        </div>

        {!transparent ? (
          <div className="sf-row">
            <input
              type="color"
              value={signature.backgroundColor}
              onChange={(event) => updateSignature({ backgroundColor: event.target.value })}
              aria-label={t('style.backgroundColor')}
              className="h-6 w-9 cursor-pointer rounded-[2px] border border-line/60 bg-transparent p-0"
            />
            <span className="sf-label">{t('style.bgLabel')}</span>
            <div className="ml-auto flex items-center gap-1.5">
              {NEUTRALS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateSignature({ backgroundColor: color })}
                  aria-label={`${t('style.backgroundColor')} ${color}`}
                  className="h-4 w-4 rounded-[2px] border border-line/60"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span className="sf-value ml-1">{signature.backgroundColor.toUpperCase()}</span>
            </div>
          </div>
        ) : null}
      </div>

      <Slider
        label={t('style.size')}
        value={signature.fontSize}
        min={TEXT_LIMITS.fontSize.min}
        max={TEXT_LIMITS.fontSize.max}
        step={TEXT_LIMITS.fontSize.step}
        suffix="px"
        onChange={(fontSize) => updateSignature({ fontSize })}
      />

      <Slider
        label={t('style.tracking')}
        value={signature.letterSpacing}
        min={TEXT_LIMITS.letterSpacing.min}
        max={TEXT_LIMITS.letterSpacing.max}
        step={TEXT_LIMITS.letterSpacing.step}
        suffix="px"
        onChange={(letterSpacing) => updateSignature({ letterSpacing })}
      />
    </Panel>
  )
}
