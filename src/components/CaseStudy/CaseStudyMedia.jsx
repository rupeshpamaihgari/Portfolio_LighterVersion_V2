import { useRef, useCallback, useState, useEffect } from 'react'

export function CaseStudyImage({ src, alt, style = {} }) {
  return (
    <div
      className="cs-media-frame"
      style={{
        borderRadius: '18px',
        overflow: 'hidden',
        margin: '28px 0',
        background: '#f5f4f1',
        border: '1.5px solid #e8e6e0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06), inset 0 1px 2px rgba(0,0,0,0.03)',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          transition: 'transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.015)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      />
    </div>
  )
}

export function CaseStudyVideo({ src, style = {} }) {
  return (
    <div
      className="cs-media-frame"
      style={{
        borderRadius: '18px',
        overflow: 'hidden',
        margin: '28px 0',
        background: '#000',
        border: '1.5px solid rgba(255,255,255,0.08)',
        aspectRatio: '16/9',
        position: 'relative',
        boxShadow: '0 6px 24px rgba(0,0,0,0.1), inset 0 1px 3px rgba(0,0,0,0.08)',
        ...style,
      }}
    >
      <iframe
        src={src}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        allow="autoplay"
        allowFullScreen
      />
    </div>
  )
}

const FRAME_W = 800
const FRAME_H = 450
const PAN_SCALE = 0.7

export function CaseStudyScrollableImage({ src, alt, pan = false }) {
  const containerRef = useRef(null)
  const drag = useRef({ active: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 })
  const [imgW, setImgW] = useState(null)

  const onImageLoad = useCallback((e) => {
    if (!pan) return
    setImgW(e.currentTarget.naturalWidth * PAN_SCALE)
  }, [pan])

  useEffect(() => {
    if (pan && imgW && containerRef.current) {
      containerRef.current.scrollLeft = (imgW - FRAME_W) / 2
      containerRef.current.scrollTop = 0
    }
  }, [pan, imgW])

  const onMouseDown = useCallback((e) => {
    const el = containerRef.current
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, scrollLeft: el.scrollLeft, scrollTop: el.scrollTop }
    el.style.cursor = 'grabbing'
    e.preventDefault()
  }, [])

  const onMouseMove = useCallback((e) => {
    if (!drag.current.active) return
    const el = containerRef.current
    el.scrollLeft = drag.current.scrollLeft - (e.clientX - drag.current.startX)
    el.scrollTop  = drag.current.scrollTop  - (e.clientY - drag.current.startY)
  }, [])

  const onMouseUp = useCallback(() => {
    drag.current.active = false
    if (containerRef.current) containerRef.current.style.cursor = 'grab'
  }, [])

  return (
    <div
      className="cs-media-frame"
      style={{
        borderRadius: '18px',
        margin: '28px 0',
        border: '1.5px solid #e8e6e0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06), inset 0 1px 2px rgba(0,0,0,0.03)',
        width: `${FRAME_W}px`,
        height: `${FRAME_H}px`,
        overflow: 'hidden',
      }}
    >
      {pan ? (
        <div
          ref={containerRef}
          style={{ width: '100%', height: '100%', overflow: 'scroll', cursor: 'grab', userSelect: 'none' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            onLoad={onImageLoad}
            style={{ width: imgW ? `${imgW}px` : 'auto', maxWidth: 'none', display: 'block' }}
          />
        </div>
      ) : (
        <div style={{ width: '100%', height: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
          <img
            src={src}
            alt={alt}
            style={{ height: `${FRAME_H}px`, width: 'auto', maxWidth: 'none', display: 'block' }}
          />
        </div>
      )}
    </div>
  )
}
