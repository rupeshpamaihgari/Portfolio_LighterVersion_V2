import { useState, useEffect, useRef } from 'react'

// ── Tool stack data ───────────────────────────────────────────────────────────
const TOOLS = [
  { name: 'Claude',        emoji: '🤖', color: '#F4A58A' },
  { name: 'NotebookLM',    emoji: '📓', color: '#B8D4F8' },
  { name: 'Lovable',       emoji: '💜', color: '#D4B8F8' },
  { name: 'Claude Code',   emoji: '⚡', color: '#F8E4A0' },
  { name: 'Cursor',        emoji: '🖱️',  color: '#c8f4f0' },
  { name: 'Figma',         emoji: '🎨', color: '#f4c8d4' },
  { name: 'Figma MCP',     emoji: '🔌', color: '#B8F4D4' },
  { name: 'Claude Cowork', emoji: '🤝', color: '#e4d4f8' },
  { name: 'Framer',        emoji: '🖼️',  color: '#F4A58A' },
  { name: 'Notion',        emoji: '📋', color: '#F8E4A0' },
  { name: 'Hotjar',        emoji: '🔥', color: '#f4c8d4' },
  { name: 'Miro',          emoji: '🗺️',  color: '#B8D4F8' },
]

// Reusable: style for an element before/after it enters
function entryStyle(inView, delay, options = {}) {
  const {
    y        = 22,
    scale    = 1,
    duration = 0.85,
    easing   = 'cubic-bezier(0.33, 1, 0.68, 1)',
  } = options
  return {
    opacity:    inView ? 1 : 0,
    transform:  inView ? 'none' : `translateY(${y}px) scale(${scale})`,
    transition: `opacity ${duration}s ${easing} ${delay}s,
                 transform ${duration}s ${easing} ${delay}s`,
  }
}

export default function CompanySection() {
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el  = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="company"
      ref={sectionRef}
      style={{ paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div
        className="section-container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
        }}
      >
        {/* ── LEFT — Impact stat ─────────────────────────────────────── */}
        <div>
          {/* Eyebrow */}
          <p style={{
            ...entryStyle(inView, 0.05),
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#999', marginBottom: '20px',
          }}>
            Impact of AI Integration
          </p>

          {/* Big number — dramatic spring entrance */}
          <div style={{
            ...entryStyle(inView, 0.22, { y: 40, scale: 0.88, duration: 1.15, easing: 'cubic-bezier(0.34, 1.4, 0.64, 1)' }),
            fontSize: 'clamp(72px, 9vw, 120px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
            color: '#111',
            marginBottom: '12px',
          }}>
            12 hrs
          </div>

          {/* Sub label */}
          <p style={{
            ...entryStyle(inView, 0.42, { duration: 0.9 }),
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            color: '#444',
            lineHeight: 1.3,
            marginBottom: '32px',
            maxWidth: '380px',
          }}>
            Saved per week
          </p>

          {/* Description */}
          <p style={{
            ...entryStyle(inView, 0.58, { y: 14, duration: 0.9 }),
            fontSize: '14.5px', lineHeight: 1.7, color: '#777',
            maxWidth: '380px', letterSpacing: '-0.01em',
          }}>
            Across research synthesis, ideation, frontend handoff, and documentation — AI tools compress hours of repetitive work into minutes, freeing up 12 hours every week for deeper thinking and better design decisions.
          </p>

          {/* Accent bar — slides in from left */}
          <div style={{
            display: 'flex', gap: '6px', marginTop: '36px',
            ...entryStyle(inView, 0.74, { y: 0, duration: 0.8 }),
          }}>
            {['#F4A58A', '#B8D4F8', '#B8F4D4', '#F8E4A0'].map((color, i) => (
              <div key={i} style={{
                height: '4px', flex: i === 0 ? '3' : '1',
                borderRadius: '2px', background: color,
                transformOrigin: 'left',
                transform: inView ? 'scaleX(1)' : 'scaleX(0)',
                transition: `transform 0.7s cubic-bezier(0.33,1,0.68,1) ${0.78 + i * 0.08}s`,
              }} />
            ))}
          </div>
        </div>

        {/* ── RIGHT — Tool stack blobs ───────────────────────────────── */}
        <div>
          {/* Heading row */}
          <p style={{
            ...entryStyle(inView, 0.10, { duration: 0.8 }),
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#999', marginBottom: '8px',
          }}>
            All tool stack
          </p>
          <p style={{
            ...entryStyle(inView, 0.20, { y: 12, duration: 0.8 }),
            fontSize: '14px', color: '#aaa', marginBottom: '28px',
            letterSpacing: '-0.01em', lineHeight: 1.5,
          }}>
            Tools I use across the design workflow
          </p>

          {/* Blobs — staggered pop-in */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {TOOLS.map((tool, i) => (
              <div
                key={tool.name}
                style={{
                  // Entry animation per blob
                  opacity:   inView ? 1 : 0,
                  transform: inView ? 'none' : 'translateY(10px) scale(0.88)',
                  transition: `opacity 0.55s cubic-bezier(0.34,1.4,0.64,1) ${0.28 + i * 0.055}s,
                               transform 0.55s cubic-bezier(0.34,1.4,0.64,1) ${0.28 + i * 0.055}s`,
                  // Static styles
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.85)',
                  border: `1.5px solid ${tool.color}88`,
                  borderRadius: '999px',
                  padding: '9px 16px 9px 10px',
                  boxShadow: `0 2px 10px ${tool.color}33`,
                  backdropFilter: 'blur(4px)',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = `0 6px 18px ${tool.color}55`
                  e.currentTarget.style.transition = 'transform 0.18s ease, box-shadow 0.18s ease'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = `0 2px 10px ${tool.color}33`
                  e.currentTarget.style.transition = 'transform 0.18s ease, box-shadow 0.18s ease'
                }}
              >
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: tool.color + '44',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', flexShrink: 0,
                }}>
                  {tool.emoji}
                </span>
                <span style={{
                  fontSize: '13px', fontWeight: 500,
                  color: '#333', letterSpacing: '-0.01em', whiteSpace: 'nowrap',
                }}>
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
