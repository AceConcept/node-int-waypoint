/**
 * Canvas scaling — keep DESIGN_REM_H in sync with `--canvas-h` in LunaSidebar.css :root.
 * Design token: 1rem = 16px → CANVAS_W/H = DESIGN_REM_* × 16 px.
 */

export const DESIGN_REM_W = 160;
/** Must match `--canvas-h` in LunaSidebar.css (rem). */
export const DESIGN_REM_H = 90;
export const DESIGN_ROOT_PX = 16;

export const CANVAS_W = DESIGN_REM_W * DESIGN_ROOT_PX;
export const CANVAS_H = DESIGN_REM_H * DESIGN_ROOT_PX;

/** Must match `--page-row-otf-footer-h` in LunaSidebar.css (rem). */
export const OTF_FOOTER_DESIGN_REM = 48;

/** Must match `--sidebar-collapsed` / `--sidebar-expanded` in LunaSidebar.css (rem). */
export const SIDEBAR_COLLAPSED_REM = 4.875;
export const SIDEBAR_EXPANDED_REM = 78.875;

export function getSidebarShellDesignWidthPx(expanded) {
  return (
    (expanded ? SIDEBAR_EXPANDED_REM : SIDEBAR_COLLAPSED_REM) * DESIGN_ROOT_PX
  );
}

/** Design-pixel height of the OTF footer bar (below main artboard). */
export function getOtfFooterDesignHeightPx() {
  return OTF_FOOTER_DESIGN_REM * DESIGN_ROOT_PX;
}

/** Vertical design span: main canvas + OTF footer (for contain scale). */
export function getTotalDesignHeightPx() {
  return CANVAS_H + getOtfFooterDesignHeightPx();
}

/**
 * Size of the visible viewport used for Luna scale (not `.luna-root` client box).
 * Prefers `visualViewport` (mobile URL bar / pinch-zoom); else `window.innerWidth/Height`.
 */
export function getViewportSize() {
  if (typeof window === "undefined") {
    return { width: CANVAS_W, height: CANVAS_H };
  }
  const vv = window.visualViewport;
  if (vv) {
    return { width: vv.width, height: vv.height };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}

/**
 * “Contain” scale: fit design width CANVAS_W and design height `designHeightPx` in the viewport.
 * Default `designHeightPx` is main canvas only; use `getTotalDesignHeightPx()` when the OTF footer is shown.
 */
export function getCanvasContainScale(width, height, designHeightPx = CANVAS_H) {
  const sx = width / CANVAS_W;
  const sy = height / designHeightPx;
  return Math.min(sx, sy);
}

/**
 * Scale so total design height matches container height (narrow column / height mode).
 */
export function getCanvasHeightFitScale(height, designHeightPx = CANVAS_H) {
  if (height <= 0) return 1;
  return height / designHeightPx;
}

/**
 * Scale so design width matches viewport width (full-bleed horizontal).
 * Total stack height may exceed the viewport; rely on `.luna-root { overflow: hidden }` or scroll policy.
 */
export function getCanvasWidthFitScale(width, designWidthPx = CANVAS_W) {
  if (width <= 0) return 1;
  return width / designWidthPx;
}
