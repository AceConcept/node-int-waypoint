import { useCallback, useEffect, useRef, useState } from 'react'

const GUTTER_BG_VIDEO = '/bg-img/hex-bg-loop-light.webm'

/**
 * Tiles the gutter video horizontally (like prior `background-repeat: repeat-x`
 * + `background-size: auto 100%`). Plain CSS cannot repeat a video element as a background.
 */
export function LunaGutterVideoBg() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const probeRef = useRef<HTMLVideoElement>(null)
  const [tileCount, setTileCount] = useState(1)

  const updateTileCount = useCallback(() => {
    const wrap = wrapRef.current
    const probe = probeRef.current
    if (!wrap || !probe) return

    const tileWidth = probe.offsetWidth
    const containerWidth = wrap.clientWidth
    if (tileWidth <= 0 || containerWidth <= 0) return

    setTileCount(Math.max(1, Math.ceil(containerWidth / tileWidth)))
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    const probe = probeRef.current
    if (!wrap || !probe) return

    updateTileCount()

    const onProbeReady = () => updateTileCount()
    probe.addEventListener('loadedmetadata', onProbeReady)
    probe.addEventListener('loadeddata', onProbeReady)

    const ro = new ResizeObserver(() => updateTileCount())
    ro.observe(wrap)

    return () => {
      probe.removeEventListener('loadedmetadata', onProbeReady)
      probe.removeEventListener('loadeddata', onProbeReady)
      ro.disconnect()
    }
  }, [updateTileCount])

  return (
    <div ref={wrapRef} className="luna-gutter-video-wrap" aria-hidden>
      <div className="luna-gutter-video-strip">
        {Array.from({ length: tileCount }, (_, index) => (
          <video
            key={index}
            ref={index === 0 ? probeRef : undefined}
            className="luna-gutter-video"
            src={GUTTER_BG_VIDEO}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        ))}
      </div>
    </div>
  )
}
