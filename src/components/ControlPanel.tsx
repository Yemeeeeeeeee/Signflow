import { TextInput } from './TextInput'
import { FontSelector } from './FontSelector'
import { StyleSettings } from './StyleSettings'
import { AnimationSettings } from './AnimationSettings'

export function ControlPanel() {
  return (
    <aside className="flex w-[300px] shrink-0 flex-col overflow-y-auto border-r border-line bg-surface max-lg:w-full max-lg:border-r-0 max-lg:border-b">
      <TextInput />
      <FontSelector />
      <StyleSettings />
      <AnimationSettings />
    </aside>
  )
}
