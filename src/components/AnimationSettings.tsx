import { useSignatureStore } from '../store/useSignatureStore'
import { cn } from '../lib/utils'
import { useT, type StringKey } from '../lib/i18n'
import { Slider } from './ui/slider'
import { Panel } from './Panel'

const PEN_TIPS = ['none', 'feather', 'pen'] as const

const PEN_TIP_KEYS: Record<(typeof PEN_TIPS)[number], StringKey> = {
  none: 'anim.penTip.none',
  feather: 'anim.penTip.feather',
  pen: 'anim.penTip.pen',
}

export const SPEED_RANGE = { min: 0.1, max: 2, step: 0.1 } as const

export function AnimationSettings() {
  const animation = useSignatureStore((state) => state.animation)
  const updateAnimation = useSignatureStore((state) => state.updateAnimation)
  const t = useT()

  return (
    <Panel title={t('anim.panel')}>
      <Slider
        label={t('anim.speed')}
        value={animation.speed}
        min={SPEED_RANGE.min}
        max={SPEED_RANGE.max}
        step={SPEED_RANGE.step}
        suffix="×"
        onChange={(speed) => updateAnimation({ speed })}
      />

      <Slider
        label={t('anim.charDelay')}
        value={animation.delayBetweenChars}
        min={0}
        max={500}
        step={10}
        suffix="ms"
        onChange={(delayBetweenChars) => updateAnimation({ delayBetweenChars })}
      />

      <div className="flex flex-col gap-1.5">
        <span className="sf-label">{t('anim.loop')}</span>
        <div className="sf-segment w-full">
          <button
            type="button"
            onClick={() => updateAnimation({ loop: true })}
            aria-pressed={animation.loop}
            className={cn(
              'sf-segment-item flex-1',
              animation.loop ? 'sf-segment-item-on' : 'sf-segment-item-off',
            )}
          >
            {t('anim.on')}
          </button>
          <button
            type="button"
            onClick={() => updateAnimation({ loop: false })}
            aria-pressed={!animation.loop}
            className={cn(
              'sf-segment-item flex-1',
              animation.loop ? 'sf-segment-item-off' : 'sf-segment-item-on',
            )}
          >
            {t('anim.once')}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="sf-label">{t('anim.penTip')}</span>
        <div className="sf-segment w-full">
          {PEN_TIPS.map((tip) => (
            <button
              key={tip}
              type="button"
              onClick={() => updateAnimation({ penTipStyle: tip })}
              aria-pressed={animation.penTipStyle === tip}
              className={cn(
                'sf-segment-item flex-1',
                animation.penTipStyle === tip ? 'sf-segment-item-on' : 'sf-segment-item-off',
              )}
            >
              {t(PEN_TIP_KEYS[tip])}
            </button>
          ))}
        </div>
      </div>
    </Panel>
  )
}
