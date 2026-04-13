import type { FlowStepId } from './store/flowStore'

/** Luna sidebar cards — `id` matches `FlowStepId` for store sync. */
export const FLOW_SIDEBAR_ITEMS: {
  id: FlowStepId
  label: string
  step: string
  title: string
  description: string
  swatch: string
}[] = [
  {
    id: 'welcome',
    label: 'WELCOME',
    step: 'Step 1',
    title: 'Welcome',
    description:
      'Begin the flow here. Use Next in the main panel or pick another step from this rail.',
    swatch: '#e8e4f0',
  },
  {
    id: 'details',
    label: 'DETAILS',
    step: 'Step 2',
    title: 'Details',
    description:
      'Shared state lives in Zustand — the center panel and this sidebar both reflect the same step.',
    swatch: '#d4c8e8',
  },
  {
    id: 'review',
    label: 'REVIEW',
    step: 'Step 3',
    title: 'Review',
    description:
      'Confirm everything looks right before the final step.',
    swatch: '#c0b0dc',
  },
  {
    id: 'done',
    label: 'DONE',
    step: 'Step 4',
    title: 'Done',
    description:
      'You reached the end. Start over in the main panel resets the whole flow.',
    swatch: '#9b7fc4',
  },
]
