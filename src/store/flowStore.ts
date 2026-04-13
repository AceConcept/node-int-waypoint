import { create } from 'zustand'

/** Named “states” in the flow — each maps to one screen. */
export type FlowStepId = 'welcome' | 'details' | 'review' | 'done'

export const FLOW_STEPS: {
  id: FlowStepId
  title: string
  body: string
}[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    body: 'This is the first step. Use Next to move forward in the flow.',
  },
  {
    id: 'details',
    title: 'Details',
    body: 'Step two — your shared state lives in Zustand, so any component can read or update it.',
  },
  {
    id: 'review',
    title: 'Review',
    body: 'Almost there. Back and Next always change the same step index in the store.',
  },
  {
    id: 'done',
    title: 'Done',
    body: 'You reached the last step. Start over resets the flow to step one.',
  },
]

type FlowState = {
  stepIndex: number
  next: () => void
  back: () => void
  goToStep: (index: number) => void
  goToStepById: (id: FlowStepId) => void
  reset: () => void
}

export const useFlowStore = create<FlowState>((set, get) => ({
  stepIndex: 0,
  next: () => {
    const i = get().stepIndex
    if (i < FLOW_STEPS.length - 1) set({ stepIndex: i + 1 })
  },
  back: () => {
    const i = get().stepIndex
    if (i > 0) set({ stepIndex: i - 1 })
  },
  goToStep: (index) => {
    if (index >= 0 && index < FLOW_STEPS.length) set({ stepIndex: index })
  },
  goToStepById: (id) => {
    const index = FLOW_STEPS.findIndex((s) => s.id === id)
    if (index >= 0) set({ stepIndex: index })
  },
  reset: () => set({ stepIndex: 0 }),
}))

export function useFlowStep() {
  const stepIndex = useFlowStore((s) => s.stepIndex)
  const step = FLOW_STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === FLOW_STEPS.length - 1
  return { stepIndex, step, isFirst, isLast }
}
