import { useCallback, useId, useRef } from 'react'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  onChange: (value: number) => void
}

const TICKS = 11

/** Reference-site slider: a 34px scrubbable row with the label and value living inside it. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: SliderProps) {
  const id = useId()
  const rowRef = useRef<HTMLDivElement>(null)
  const decimals = step < 1 ? 1 : 0
  const ratio = max === min ? 0 : Math.min(1, Math.max(0, (value - min) / (max - min)))

  const commit = useCallback(
    (raw: number) => {
      const snapped = Math.round(raw / step) * step
      const clamped = Math.min(max, Math.max(min, snapped))
      onChange(Number(clamped.toFixed(decimals)))
    },
    [max, min, step, decimals, onChange],
  )

  const scrubTo = useCallback(
    (clientX: number) => {
      const row = rowRef.current
      if (!row) return
      const rect = row.getBoundingClientRect()
      const percent = rect.width === 0 ? 0 : (clientX - rect.left) / rect.width
      commit(min + percent * (max - min))
    },
    [commit, max, min],
  )

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Dragging must not leave the row looking selected afterwards.
    rowRef.current?.blur()
    event.currentTarget.setPointerCapture(event.pointerId)
    scrubTo(event.clientX)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    scrubTo(event.clientX)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId)
    event.currentTarget.blur()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const big = step * 10
    const moves: Record<string, number> = {
      ArrowLeft: -step,
      ArrowDown: -step,
      ArrowRight: step,
      ArrowUp: step,
      PageDown: -big,
      PageUp: big,
    }

    if (event.key in moves) {
      event.preventDefault()
      commit(value + moves[event.key])
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      commit(min)
    }
    if (event.key === 'End') {
      event.preventDefault()
      commit(max)
    }
  }

  return (
    <div
      ref={rowRef}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value}${suffix ?? ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={[
        'group relative h-[34px] w-full touch-none select-none overflow-hidden rounded-sm',
        'border border-line/40 bg-muted/20 transition-colors',
        'cursor-grab active:cursor-grabbing hover:border-ink/20 focus:outline-none focus-visible:border-ink/30',
      ].join(' ')}
    >
      {/* tick marks */}
      <div className="pointer-events-none absolute inset-0 flex items-center" aria-hidden="true">
        <div className="flex w-full justify-between px-[10px] opacity-[0.07]">
          {Array.from({ length: TICKS }, (_, index) => (
            <div key={index} className="h-2.5 w-px bg-ink" />
          ))}
        </div>
      </div>

      {/* progress fill */}
      <div
        className="absolute inset-0 z-0 origin-left bg-ink/[0.07]"
        style={{ transform: `scaleX(${ratio})` }}
        aria-hidden="true"
      />

      {/* label + editable value */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center px-2 text-micro uppercase tracking-[0.08em] text-ink/70">
        <div className="flex w-full items-center justify-between">
          <span className="ml-1">{label}</span>
          <div className="pointer-events-auto flex items-center gap-1">
            <input
              id={id}
              type="number"
              aria-label={`${label} value`}
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(event) => {
                const next = Number(event.target.value)
                if (!Number.isNaN(next)) commit(next)
              }}
              className={[
                'w-10 min-h-6 cursor-ew-resize border border-transparent bg-transparent px-1 py-0.5',
                'text-right font-mono text-micro tabular-nums outline-none transition-colors',
                '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none',
                '[&::-webkit-outer-spin-button]:appearance-none',
                'hover:bg-muted/40 focus:cursor-text focus:border-line/60 focus:bg-canvas/40',
              ].join(' ')}
            />
            {suffix ? <span className="font-mono text-micro text-ink/40">{suffix}</span> : null}
          </div>
        </div>
      </div>

      {/* playhead */}
      <div
        className="pointer-events-none absolute top-0 z-20 flex h-full w-4 items-center justify-center"
        style={{ left: `${ratio * 100}%`, transform: 'translateX(-50%)' }}
        aria-hidden="true"
      >
        <div className="h-full w-px bg-ink/25" />
      </div>
    </div>
  )
}
