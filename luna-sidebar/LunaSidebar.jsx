import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import defaultGraphic from "@assets/GRAPHIC.png";
import {
  CANVAS_H,
  getCanvasContainScale,
  getCanvasHeightFitScale,
  getCanvasWidthFitScale,
  getOtfFooterDesignHeightPx,
  getSidebarShellDesignWidthPx,
  getTotalDesignHeightPx,
  getViewportSize,
} from "./canvasScale.js";
import "./LunaSidebar.css";

/** Applies dynamic background-color without a JSX `style` prop. */
function BackgroundFill({ as: Tag = "span", color, className, ...rest }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (color != null && color !== "")
      el.style.backgroundColor = color;
    else el.style.removeProperty("background-color");
  }, [color]);
  return <Tag ref={ref} className={className} {...rest} />;
}

function normalizeActiveId(items, preferredId) {
  if (!items?.length) return null;
  if (preferredId != null && items.some((i) => i.id === preferredId)) {
    return preferredId;
  }
  return items[0].id;
}

function getPreviewScrollbarMetrics(scrollEl, trackEl) {
  const { scrollWidth, clientWidth, scrollLeft } = scrollEl;
  const trackW = trackEl.clientWidth || clientWidth;
  if (scrollWidth <= clientWidth + 0.5) {
    return {
      scrollable: false,
      thumbW: 0,
      thumbX: 0,
      maxScroll: 0,
      maxThumbX: 0,
    };
  }
  const maxScroll = scrollWidth - clientWidth;
  const minPct = parseFloat(
    getComputedStyle(document.documentElement)
      .getPropertyValue("--preview-scrollbar-thumb-min-pct")
      .trim() || "8",
  );
  const minThumb = Math.max((minPct / 100) * trackW, 4);
  const thumbW = Math.max(minThumb, (clientWidth / scrollWidth) * trackW);
  const maxThumbX = Math.max(0, trackW - thumbW);
  const thumbX = maxScroll <= 0 ? 0 : (scrollLeft / maxScroll) * maxThumbX;
  return { scrollable: true, thumbW, thumbX, maxScroll, maxThumbX, trackW };
}

function PreviewStrip({ cards, activePreviewId, onSelect }) {
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const [bar, setBar] = useState({
    show: false,
    thumbW: 0,
    thumbX: 0,
  });

  const measure = useCallback(() => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const m = getPreviewScrollbarMetrics(el, track);
    if (!m.scrollable) {
      setBar({ show: false, thumbW: 0, thumbX: 0 });
      return;
    }
    setBar({ show: true, thumbW: m.thumbW, thumbX: m.thumbX });
  }, []);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const track = trackRef.current;
    if (track) ro.observe(track);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure, cards.length]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.setProperty("--preview-thumb-w", `${bar.thumbW}px`);
    track.style.setProperty("--preview-thumb-x", `${bar.thumbX}px`);
  }, [bar.thumbW, bar.thumbX]);

  const onThumbPointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const startX = e.clientX;
    const startScroll = el.scrollLeft;
    const onMove = (ev) => {
      const m = getPreviewScrollbarMetrics(el, track);
      if (!m.scrollable || m.maxThumbX <= 0 || m.maxScroll <= 0) return;
      const dx = ev.clientX - startX;
      const next = startScroll + (dx / m.maxThumbX) * m.maxScroll;
      el.scrollLeft = Math.max(0, Math.min(m.maxScroll, next));
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const onTrackPointerDown = (e) => {
    if (e.target.closest(".preview-scrollbar__thumb")) return;
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const m = getPreviewScrollbarMetrics(el, track);
    if (!m.scrollable || m.maxThumbX <= 0) return;
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let thumbX = x - m.thumbW / 2;
    thumbX = Math.max(0, Math.min(m.maxThumbX, thumbX));
    el.scrollLeft = (thumbX / m.maxThumbX) * m.maxScroll;
  };

  return (
    <div className="preview-strip">
      <div ref={scrollRef} className="preview-list">
        {cards.map((card) => (
          <button
            key={card.id}
            className={`preview-card ${card.id === activePreviewId ? "is-active" : ""}`}
            type="button"
            aria-label={`${card.label}: ${card.title}`}
            aria-pressed={card.id === activePreviewId}
            onClick={() => onSelect(card.id)}
          >
            <span className="preview-card__media">
              <BackgroundFill
                as="span"
                className="preview-thumb preview-thumb--swatch"
                color={card.swatch}
                aria-hidden
              />
            </span>
            <span className="preview-card__title">{card.title}</span>
          </button>
        ))}
      </div>
      <div
        className={`preview-scrollbar${bar.show ? "" : " preview-scrollbar--hidden"}`}
        aria-hidden="true"
      >
        <div
          ref={trackRef}
          className="preview-scrollbar__track"
          onPointerDown={onTrackPointerDown}
        >
          <div
            className="preview-scrollbar__thumb"
            onPointerDown={onThumbPointerDown}
          />
        </div>
      </div>
    </div>
  );
}

function IntroSection({ step, title, description, swatch }) {
  return (
    <div className="intro-section">
      <div className="intro-copy">
        <p className="step">{step}</p>
        <div className="intro-copy-main">
          <h2 className="title">{title}</h2>
          <p className="description">{description}</p>
          <button className="start-btn" type="button">
            Start
          </button>
        </div>
      </div>

      <div className="intro-media-column">
        <div className="intro-image-wrap" aria-hidden="true">
          <BackgroundFill
            as="div"
            key={swatch}
            className="intro-image intro-image--swatch"
            color={swatch}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * @param {object} props
 * @param {Array<{ id: string, label: string, step: string, title: string, description: string, swatch: string }>} props.items
 * @param {boolean} [props.defaultExpanded]
 * @param {string} [props.initialActiveId]
 * @param {string} [props.graphicSrc] — URL for sidebar shell background; defaults to bundled GRAPHIC.png
 * @param {string} [props.railLabel]
 * @param {string} [props.activeItemId] — when set, selection follows this id (sync with parent)
 * @param {'contain'|'canvas-contain'|'height'|'width'} [props.scaleMode] — `canvas-contain` (default) fits the artboard to the full viewport; OTF footer sits below `.luna-scale-stage` and shows on scroll. `contain` fits canvas+footer in one screen. `height` / `width` pin one axis.
 * @param {import('react').ReactNode} [props.children] — slot: main UI in the design stage (left of the rail); scales with the rem artboard. Prefer this over `stageContent`.
 * @param {import('react').ReactNode} [props.stageContent] — same as `children` when `children` is omitted (legacy prop).
 * @param {(id: string) => void} [props.onActiveItemChange]
 * @param {(open: boolean) => void} [props.onExpandedChange]
 */
export function LunaSidebar({
  items,
  defaultExpanded = false,
  initialActiveId,
  activeItemId,
  graphicSrc,
  railLabel = "LUNA STATE MANAGER",
  scaleMode = "canvas-contain",
  children,
  stageContent,
  onActiveItemChange,
  onExpandedChange,
}) {
  const stageSlot = children ?? stageContent;
  const layoutRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [expanded, setExpandedState] = useState(defaultExpanded);
  const [activePreviewId, setActivePreviewIdState] = useState(() =>
    normalizeActiveId(
      items,
      activeItemId !== undefined ? activeItemId : initialActiveId,
    ),
  );

  useEffect(() => {
    setActivePreviewIdState((prev) => normalizeActiveId(items, prev));
  }, [items]);

  useEffect(() => {
    if (activeItemId === undefined) return;
    setActivePreviewIdState(normalizeActiveId(items, activeItemId));
  }, [activeItemId, items]);

  useLayoutEffect(() => {
    const el = layoutRef.current;
    if (!el) return;
    const update = () => {
      // getViewportSize() → canvasScale.js (visualViewport or window inner size).
      // Do not use el.clientWidth/Height here: if the root height tracks scaled
      // children, h ≈ totalDesignH×scale → sy ≈ scale and scale cannot increase
      // again after narrowing (stuck smaller artboards).
      const { width: w, height: h } = getViewportSize();
      if (w <= 0 || h <= 0) {
        setScale(1);
        return;
      }
      const totalDesignH = getTotalDesignHeightPx();
      const next =
        scaleMode === "height"
          ? getCanvasHeightFitScale(h, totalDesignH)
          : scaleMode === "width"
            ? getCanvasWidthFitScale(w)
            : scaleMode === "canvas-contain"
              ? getCanvasContainScale(w, h, CANVAS_H)
              : getCanvasContainScale(w, h, totalDesignH);
      setScale(next);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", update);
    }
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      if (vv) {
        vv.removeEventListener("resize", update);
      }
    };
  }, [scaleMode]);

  useLayoutEffect(() => {
    const layout = layoutRef.current;
    if (!layout) return;
    const scaledFooterH = getOtfFooterDesignHeightPx() * scale;
    const shellW = getSidebarShellDesignWidthPx(expanded);
    const url = graphicSrc ?? defaultGraphic;
    const urlStr = typeof url === "string" ? url : String(url);
    const escaped = urlStr.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    layout.style.setProperty("--luna-scale", String(scale));
    layout.style.setProperty("--luna-scaled-footer-h", `${scaledFooterH}px`);
    layout.style.setProperty("--luna-shell-design-w", `${shellW}px`);
    layout.style.setProperty("--luna-sidebar-bg", `url("${escaped}")`);
  }, [scale, expanded, graphicSrc]);

  const setExpanded = (next) => {
    setExpandedState(next);
    onExpandedChange?.(next);
  };

  const selectPreview = (id) => {
    setActivePreviewIdState(id);
    onActiveItemChange?.(id);
  };

  if (!items?.length) {
    console.warn("LunaSidebar: `items` must be a non-empty array.");
    return null;
  }

  const activePreview =
    items.find((item) => item.id === activePreviewId) ?? items[0];

  return (
    <div ref={layoutRef} className="luna-root">
      {/*
        .luna-root — ResizeObserver + --luna-* (inline).
        .luna-scale-stage — height follows children; scroll to .luna-footer-slot.
      */}
      <div className="luna-scale-stage">
        <div className="luna-chrome">
          <div className="luna-shell">
            <div className="luna-canvas-row">
          {expanded ? (
            <button
              type="button"
              className="luna-canvas-row-scrim"
              aria-label="Close panel"
              onClick={() => setExpanded(false)}
            />
          ) : null}
          {/* .luna-space-left — LunaSidebar.css */}
          <div className="luna-space-left" aria-hidden="true" />
          {/* .artboard-slot — width via .luna-root --luna-artboard-slot-width; gutters flex */}
          <div className="artboard-slot">
            <div className="artboard">
              {stageSlot != null ? (
                <div className="luna-stage">
                  <div className="luna-stage-artboard">{stageSlot}</div>
                </div>
              ) : null}
            </div>
          </div>
          {/* .luna-space-right — LunaSidebar.css */}
          <div className="luna-space-right" aria-hidden="true" />

          <div
            className={`sidebar-shell UxzaHe luna-sidebar-dock ${expanded ? "m2T_PB" : ""}`}
          >
            <div className="sidebar-host Bf7PXJ">
              <section
                className={`sidebar-drawer ${expanded ? "m2T_PB" : ""}`}
                aria-hidden={!expanded}
              >
                <div
                  className={`sidebar-panel-inner Q1PD1g ${expanded ? "m2T_PB" : ""}`}
                >
                  <div className="sidebar-panel-content">
                    <div className="sidebar-drawer-stack">
                      <IntroSection
                        step={activePreview.step}
                        title={activePreview.title}
                        description={activePreview.description}
                        swatch={activePreview.swatch}
                      />
                      <PreviewStrip
                        cards={items}
                        activePreviewId={activePreviewId}
                        onSelect={selectPreview}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <button
                className="sidebar-rail"
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                aria-label="Toggle sidebar"
              >
                <span className="rail-dot" />
                <span className="rail-label">{railLabel}</span>
                <span className="rail-dot" />
              </button>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>

      <div className="luna-footer-slot">
        <div className="luna-footer-artboard" aria-hidden="true" />
      </div>
    </div>
  );
}
