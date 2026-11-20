import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-fg hover:bg-primary/85 active:opacity-80 disabled:opacity-40',
  secondary:
    'border border-line/50 bg-muted/40 text-ink hover:bg-muted/70 hover:border-ink/20 disabled:opacity-40',
  ghost: 'text-ink-muted hover:bg-muted/50 hover:text-ink disabled:opacity-40',
}

const SIZES: Record<Size, string> = {
  sm: 'h-7 rounded-sm px-2.5 text-[11px]',
  md: 'h-8 rounded-md px-3 text-xs',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'secondary', size = 'md', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex select-none items-center justify-center gap-1.5 font-semibold tracking-tight',
        'transition-all duration-150 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  )
})
