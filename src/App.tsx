import { Header } from './components/Header'
import { ControlPanel } from './components/ControlPanel'
import { PreviewArea } from './components/PreviewArea'

export default function App() {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-canvas lg:h-screen lg:overflow-hidden">
      <Header />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <ControlPanel />

        <main className="flex min-h-[60vh] min-w-0 flex-1 flex-col lg:min-h-0">
          <PreviewArea />
        </main>
      </div>
    </div>
  )
}
