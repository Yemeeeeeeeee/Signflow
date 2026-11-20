import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

interface PanelProps {
  title: string
  children: ReactNode
  className?: string
}

export function Panel({ title, children, className }: PanelProps) {
  return (
    <section className={cn('border-b border-line px-4 py-4', className)}>
      <h2 className="sf-label">{title}</h2>
      <div className="mt-3 flex flex-col gap-2.5">{children}</div>
    </section>
  )
}
