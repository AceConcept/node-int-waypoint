/** Git-installed `waypoint-sidebar` (AceConcept/waypoint-sidebar) JS entry points */
declare module 'waypoint-sidebar/src/luna-sidebar/index.js' {
  import type { ComponentType, Context } from 'react'

  export const LunaCanvasScaleContext: Context<number>

  export type LunaSidebarProps = {
    items: unknown[]
    expanded?: boolean
    onExpandedChange?: (next: boolean) => void
    initialActiveId?: string
    onActiveItemChange?: (id: string) => void
    onInfo?: () => void
    infoHref?: string
    infoTooltip?: string
    railLabel?: string
    graphicSrc?: string
    defaultExpanded?: boolean
  }

  export const LunaSidebar: ComponentType<LunaSidebarProps>
}

declare module 'waypoint-sidebar/src/luna-sidebar/canvasScale.js' {
  export const CANVAS_H: number
  export const CANVAS_W: number
  export function getCanvasContainScale(width: number, height: number): number
  export function getOtfFooterDesignHeightPx(): number
  export function getSidebarShellDesignWidthPx(expanded: boolean): number
  export function getViewportSize(): { width: number; height: number }
}
