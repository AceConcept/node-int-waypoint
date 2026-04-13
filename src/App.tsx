import { LunaSidebar } from '../luna-sidebar/index.js'
import { FLOW_SIDEBAR_ITEMS } from './flowSidebarItems'
import { useFlowStep, useFlowStore } from './store/flowStore'
import './App.css'

function App() {
  const { step } = useFlowStep()
  const goToStepById = useFlowStore((s) => s.goToStepById)

  return (
    <LunaSidebar
      items={FLOW_SIDEBAR_ITEMS}
      activeItemId={step.id}
      onActiveItemChange={(id) => {
        const hit = FLOW_SIDEBAR_ITEMS.find((item) => item.id === id)
        if (hit) goToStepById(hit.id)
      }}
      railLabel="FLOW"
    />
  )
}

export default App
