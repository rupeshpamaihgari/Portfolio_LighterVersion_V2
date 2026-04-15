import { useState, useEffect, useRef, useCallback } from 'react'
import useInView from '../hooks/useInView'

const phases = [
  {
    number: '01',
    label: 'Research & Discovery',
    tools: [
      { logo: '/claude.png',      label: 'Claude' },
      { logo: '/notebooklm.png',  label: 'NotebookLM' },
    ],
    what: 'Synthesize user interview notes and spot patterns in minutes. What used to take 3 hours of synthesis now takes 20 minutes.',
    stat: { from: '3 hours', to: '20 min', label: 'of synthesis' },
    color: '#F4A58A',
    bgTint: `
      linear-gradient(to bottom, rgb(234,232,225) 0%, transparent 18%),
      linear-gradient(to right, transparent 50%, rgb(234,232,225) 92%),
      radial-gradient(ellipse at 5% 60%, rgba(244,165,138,0.55) 0%, transparent 55%),
      radial-gradient(ellipse at 75% 45%, rgba(248,190,160,0.35) 0%, transparent 50%),
      rgb(234,232,225)
    `,
  },
  {
    number: '02',
    label: 'Ideation & Validation',
    tools: [
      { logo: '/lovable.png', label: 'Lovable' },
      { logo: '/claude.png',  label: 'Claude Code' },
    ],
    what: "Generate initial UI concepts from a brief. I don't use them as finals — I use them to kill bad ideas faster and explore more directions.",
    stat: { from: '4 hours', to: '1 hour', label: 'of ideation' },
    color: '#B8D4F8',
    bgTint: `
      linear-gradient(to bottom, rgb(234,232,225) 0%, transparent 18%),
      linear-gradient(to right, transparent 50%, rgb(234,232,225) 92%),
      radial-gradient(ellipse at 5% 50%, rgba(184,212,248,0.6) 0%, transparent 55%),
      radial-gradient(ellipse at 72% 70%, rgba(160,175,248,0.35) 0%, transparent 50%),
      rgb(234,232,225)
    `,
  },
  {
    number: '03',
    label: 'Final Designs',
    tools: [
      { logo: '/cursor.png', label: 'Cursor' },
      { logo: '/figma.png',  label: 'Figma MCP' },
    ],
    what: 'For simpler designs, ship frontend code directly to developers. Saves 2–3 hours of frontend development effort per handoff.',
    stat: { from: null, to: '3–4 hrs saved', label: 'per frontend handoff' },
    color: '#B8F4D4',
    bgTint: `
      linear-gradient(to bottom, rgb(234,232,225) 0%, transparent 18%),
      linear-gradient(to right, transparent 50%, rgb(234,232,225) 92%),
      radial-gradient(ellipse at 5% 65%, rgba(184,244,212,0.6) 0%, transparent 55%),
      radial-gradient(ellipse at 70% 40%, rgba(150,210,200,0.35) 0%, transparent 50%),
      rgb(234,232,225)
    `,
  },
  {
    number: '04',
    label: 'Documentation & Handoff',
    tools: [
      { logo: '/claude.png', label: 'Claude Cowork' },
    ],
    what: 'Design critique, system management, UX writing, accessibility, research synthesis, and developer handoff. My developers say my handoffs have never been clearer.',
    stat: { from: null, to: '8–10 hrs/week', label: 'saved total' },
    color: '#F8E4A0',
    bgTint: `
      linear-gradient(to bottom, rgb(234,232,225) 0%, transparent 18%),
      linear-gradient(to right, transparent 50%, rgb(234,232,225) 92%),
      radial-gradient(ellipse at 5% 60%, rgba(248,228,160,0.6) 0%, transparent 55%),
      radial-gradient(ellipse at 68% 38%, rgba(255,205,100,0.3) 0%, transparent 50%),
      rgb(234,232,225)
    `,
  },
]

const PHASE_COUNT = phases.length
const CIRCLE_RADIUS = 148   // orbit radius for phase dots
const CARD_ARC_RADIUS = 1400 // card arc radius (larger = gentler curve)
const CARD_SPACING = 360     // vertical distance between cards

const DOT_RADIUS = 28 // half of 56px dot
const LABEL_OFFSET = CIRCLE_RADIUS + DOT_RADIUS + 10 // label starts just outside dot edge

// ── Phase Dot + attached rotating title ───────────────────────────────────
function PhaseDot({ phase, phaseIndex, angleDeg, isActive }) {
  const rad = angleDeg * Math.PI / 180
  const dotX = CIRCLE_RADIUS * Math.cos(rad)
  const dotY = CIRCLE_RADIUS * Math.sin(rad)
  const labelX = LABEL_OFFSET * Math.cos(rad)
  const labelY = LABEL_OFFSET * Math.sin(rad)

  return (
    <>
      {/* Black circle dot — number counter-rotates to stay upright */}
      <div style={{
        position: 'absolute',
        left: `calc(50% + ${dotX}px)`,
        top: `calc(50% + ${dotY}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: 3,
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: isActive ? '#111' : 'rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isActive ? '0 0 0 6px rgba(17,17,17,0.10), 0 8px 24px rgba(0,0,0,0.18)' : 'none',
          transition: 'background 0.4s ease, box-shadow 0.4s ease',
        }}>
          <span style={{
            fontSize: '16px',
            fontWeight: 700,
            color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
            display: 'block',
            transform: `rotate(${-angleDeg}deg)`,
            transition: 'color 0.4s ease',
          }}>
            {phaseIndex + 1}
          </span>
        </div>
      </div>

      {/* Phase title — rotates WITH the circle, anchored radially outward */}
      <div style={{
        position: 'absolute',
        left: `calc(50% + ${labelX}px)`,
        top: `calc(50% + ${labelY}px)`,
        transformOrigin: 'left center',
        transform: `translateY(-50%) rotate(${angleDeg}deg)`,
        whiteSpace: 'nowrap',
        zIndex: 2,
        pointerEvents: 'none',
        opacity: isActive ? 1 : 0.2,
        transition: 'opacity 0.4s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span style={{
          fontSize: isActive ? '16px' : '13px',
          fontWeight: isActive ? 600 : 400,
          color: isActive ? '#111' : '#666',
          letterSpacing: '-0.01em',
          transition: 'font-size 0.4s cubic-bezier(0.33,1,0.68,1), color 0.4s ease',
        }}>
          {phase.label}
        </span>
        {/* Arrow pointing toward the card section */}
        <span style={{
          fontSize: '14px',
          fontWeight: 400,
          color: '#111',
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'translateX(0)' : 'translateX(-4px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          lineHeight: 1,
        }}>→</span>
      </div>
    </>
  )
}

// ── Left Dial ──────────────────────────────────────────────────────────────
function CircleDial({ currentPos, hasEntered }) {
  const circleRotation = -currentPos * 90

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      // Spin-in: dial rotates -135° and scales from 0.5, then springs into place
      opacity: hasEntered ? 1 : 0,
      transform: hasEntered ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-135deg)',
      transition: hasEntered
        ? 'opacity 0.8s ease, transform 1.1s cubic-bezier(0.34, 1.4, 0.64, 1)'
        : 'none',
    }}>
      {/* Circle container — overflow visible so rotating labels extend outside */}
      <div style={{ position: 'relative', width: '340px', height: '340px', overflow: 'visible' }}>

        {/* Outer dashed ring */}
        <div style={{
          position: 'absolute',
          inset: '10px',
          borderRadius: '50%',
          border: '1.5px dashed rgba(0,0,0,0.12)',
          pointerEvents: 'none',
        }} />

        {/* Inner subtle ring */}
        <div style={{
          position: 'absolute',
          inset: '60px',
          borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.06)',
          pointerEvents: 'none',
        }} />

        {/* Center cross */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.2)',
          zIndex: 1,
        }} />

        {/* Horizontal arm from center to active dot */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: `${CIRCLE_RADIUS}px`,
          height: '1px',
          background: 'linear-gradient(to right, rgba(0,0,0,0.06), rgba(0,0,0,0.25))',
          transformOrigin: 'left center',
          pointerEvents: 'none',
          zIndex: 1,
          // This arm doesn't rotate — it always points right to show active
        }} />

        {/* Phase dots — orbit around center based on scroll */}
        {phases.map((phase, i) => {
          const angleDeg = i * 90 + circleRotation
          const normalized = ((angleDeg % 360) + 360) % 360
          const isActive = normalized < 45 || normalized > 315
          return (
            <PhaseDot
              key={phase.number}
              phase={phase}
              phaseIndex={i}
              angleDeg={angleDeg}
              isActive={isActive}
            />
          )
        })}
      </div>

    </div>
  )
}

// ── Right Card Dial ────────────────────────────────────────────────────────
function CardDial({ currentPos, hasEntered, entranceComplete }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {phases.map((phase, i) => {
        const offset = i - currentPos
        // Vertical position: card spacing
        const y = offset * CARD_SPACING
        // Horizontal bow: cards above/below curve gently to the right
        const clamped = Math.min(Math.abs(y), CARD_ARC_RADIUS)
        const x = CARD_ARC_RADIUS - Math.sqrt(CARD_ARC_RADIUS * CARD_ARC_RADIUS - clamped * clamped)
        // Tilt: tangent of the arc (cards tilt along their path)
        const rotZ = Math.atan2(y, Math.sqrt(CARD_ARC_RADIUS * CARD_ARC_RADIUS - clamped * clamped)) * (180 / Math.PI) * 0.6

        const isActive = Math.abs(offset) < 0.5
        const opacity = Math.max(0, 1 - Math.abs(offset) * 0.8)
        const scale = isActive ? 1 : Math.max(0.75, 1 - Math.abs(offset) * 0.15)

        // Entrance: active card slides from right, others stagger from below
        const entranceX = hasEntered ? x : (i === 0 ? x + 180 : x)
        const entranceY = hasEntered ? y : (i === 0 ? y : y + 100)
        const entranceScale = hasEntered ? scale : 0.85
        const staggerDelay = entranceComplete ? 0 : 0.25 + i * 0.1
        const transition = entranceComplete
          ? 'transform 0.12s linear, opacity 0.15s ease'
          : `transform 0.9s cubic-bezier(0.33, 1, 0.68, 1) ${staggerDelay}s, opacity 0.7s ease ${staggerDelay}s`

        return (
          <div
            key={phase.number}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${entranceX}px), calc(-50% + ${entranceY}px)) rotate(${rotZ}deg) scale(${entranceScale})`,
              opacity: hasEntered ? opacity : 0,
              transition,
              willChange: 'transform, opacity',
              zIndex: Math.round(10 - Math.abs(offset) * 2),
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          >
            {/* Card content — counter-rotate so text stays level */}
            <div style={{
              width: '420px',
              maxWidth: '85vw',
              background: '#ffffff',
              borderRadius: '28px',
              padding: '40px 36px',
              boxShadow: isActive
                ? '0 24px 64px rgba(0,0,0,0.11)'
                : '0 4px 20px rgba(0,0,0,0.05)',
              transform: `rotate(${-rotZ}deg)`,
              transition: 'box-shadow 0.4s ease, transform 0.12s linear',
            }}>
              {/* Phase number + tool badges */}
              <div style={{ marginBottom: '20px' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: phase.color,
                  display: 'block', marginBottom: '10px',
                }}>
                  Phase {phase.number}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {phase.tools.map((t) => (
                    <div key={t.label} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: phase.color + '22', borderRadius: '999px',
                      padding: '5px 12px 5px 5px', fontSize: '11px', fontWeight: 600, color: '#444',
                    }}>
                      <img src={t.logo} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'contain', background: '#fff', padding: '2px', flexShrink: 0 }} />
                      <span>{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '26px', fontWeight: 400, letterSpacing: '-0.025em',
                color: '#111', lineHeight: 1.2, marginBottom: '14px',
              }}>
                {phase.label}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '14px', lineHeight: 1.7, color: '#666',
                fontWeight: 400, marginBottom: '24px',
              }}>
                {phase.what}
              </p>

              {/* Stat block */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: phase.color + '1A', borderRadius: '14px',
                padding: '14px 18px', marginBottom: '24px',
              }}>
                {phase.stat.from && (
                  <>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#aaa', textDecoration: 'line-through' }}>
                      {phase.stat.from}
                    </span>
                    <span style={{ color: phase.color, fontSize: '16px', fontWeight: 700 }}>→</span>
                  </>
                )}
                <span style={{ fontSize: '17px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>
                  {phase.stat.to}
                </span>
                <span style={{ fontSize: '12px', color: '#888' }}>{phase.stat.label}</span>
              </div>

              {/* Accent line */}
              <div style={{ height: '3px', width: '40px', borderRadius: '2px', background: phase.color }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Mobile card ────────────────────────────────────────────────────────────
function MobilePhaseCard({ phase, delay }) {
  const { ref } = useInView({ rootMargin: '0px 0px -40px 0px' })
  return (
    <div ref={ref} className="reveal" style={{
      transitionDelay: `${delay}ms`,
      background: '#ffffff', borderRadius: '24px',
      padding: '32px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
    }}>
      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: phase.color, display: 'block', marginBottom: '10px' }}>
          Phase {phase.number}
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {phase.tools.map((t) => (
            <div key={t.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: phase.color + '22', borderRadius: '999px',
              padding: '5px 12px 5px 5px', fontSize: '11px', fontWeight: 600, color: '#444',
            }}>
              <img src={t.logo} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'contain', background: '#fff', padding: '2px', flexShrink: 0 }} />
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
      <h3 style={{ fontSize: '20px', fontWeight: 400, letterSpacing: '-0.02em', color: '#111', marginBottom: '12px' }}>
        {phase.label}
      </h3>
      <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#666', marginBottom: '20px' }}>
        {phase.what}
      </p>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: phase.color + '1A', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px',
      }}>
        {phase.stat.from && (
          <>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#aaa', textDecoration: 'line-through' }}>{phase.stat.from}</span>
            <span style={{ color: phase.color, fontWeight: 700 }}>→</span>
          </>
        )}
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>{phase.stat.to}</span>
        <span style={{ fontSize: '11px', color: '#888' }}>{phase.stat.label}</span>
      </div>
      <div style={{ height: '3px', width: '32px', borderRadius: '2px', background: phase.color }} />
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
export default function AIProcessSection() {
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [currentPos, setCurrentPos] = useState(0)
  const [hasEntered, setHasEntered] = useState(false)
  const [entranceComplete, setEntranceComplete] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { ref: headRef } = useInView()

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)')
    const handler = (e) => setIsMobile(e.matches)
    setIsMobile(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const onScroll = useCallback(() => {
    const section = sectionRef.current
    if (!section || isMobile) return

    const rect      = section.getBoundingClientRect()
    const maxScroll = section.offsetHeight - window.innerHeight
    const p         = Math.max(0, Math.min(1, -rect.top / maxScroll))

    if (!hasEntered && rect.top < window.innerHeight * 0.8) {
      setHasEntered(true)
      setTimeout(() => setEntranceComplete(true), 950)
    }

    setProgress(p)
    setCurrentPos(p * (PHASE_COUNT - 1))
  }, [isMobile, hasEntered])

  useEffect(() => {
    if (isMobile) return
    let ticking = false
    const handler = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => { onScroll(); ticking = false })
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [onScroll, isMobile])

  // ── Mobile ─────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section id="ai-process" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="section-container">
          <div ref={headRef} className="reveal" style={{ marginBottom: '40px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>AI x Design Process</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#111' }}>
              My AI Powered Design Process
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {phases.map((phase, i) => <MobilePhaseCard key={phase.number} phase={phase} delay={i * 80} />)}
          </div>
          <div className="reveal" style={{
            marginTop: '24px', background: 'linear-gradient(135deg, #111 0%, #333 100%)',
            borderRadius: '24px', padding: '32px 28px',
          }}>
            <p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, letterSpacing: '-0.02em' }}>
              "AI didn't replace my design skills.<br />
              It replaced my <strong style={{ color: '#F8E4A0', fontStyle: 'normal' }}>busywork</strong> — so I can spend more time on strategy and user thinking."
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '16px', fontWeight: 500 }}>
              Total time saved per week: ~8–10 hours
            </p>
          </div>
        </div>
      </section>
    )
  }

  // ── Desktop ─────────────────────────────────────────────────────────────
  return (
    <section
      id="ai-process"
      ref={sectionRef}
      style={{ height: '500vh', position: 'relative' }}
    >
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        {/* Per-phase background tint — cross-fade layers */}
        {phases.map((phase, i) => (
          <div key={i} style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: phase.bgTint,
            opacity: i === Math.min(Math.round(currentPos), PHASE_COUNT - 1) ? 1 : 0,
            transition: 'opacity 0.75s ease',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Section header */}
        <div style={{
          padding: '92px 24px 0',
          maxWidth: '1260px',
          margin: '0 auto',
          width: '100%',
          zIndex: 6,
          flexShrink: 0,
          position: 'relative',
          boxSizing: 'border-box',
        }}>
          <p style={{
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#999', marginBottom: '8px',
            opacity: hasEntered ? 1 : 0,
            transform: hasEntered ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease 0.1s, transform 0.6s cubic-bezier(0.33,1,0.68,1) 0.1s',
          }}>
            AI x Design Process
          </p>
          <h2 style={{
            fontSize: 'clamp(24px, 2.5vw, 34px)', fontWeight: 400,
            letterSpacing: '-0.03em', color: '#111', lineHeight: 1.2,
            opacity: hasEntered ? 1 : 0,
            transform: hasEntered ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease 0.25s, transform 0.6s cubic-bezier(0.33,1,0.68,1) 0.25s',
          }}>
            My AI Powered Design Process
          </h2>
        </div>

        {/* Two-dial layout — centered, max-width constrained */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '100%',
            maxWidth: '1260px',
            padding: '0 24px',
            boxSizing: 'border-box',
            display: 'flex',
            height: '100%',
          }}>
            {/* Left dial — rotating circle */}
            <div style={{ flex: '0 0 45%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircleDial currentPos={currentPos} hasEntered={hasEntered} />
            </div>

            {/* Right dial — arc cards */}
            <div style={{ flex: '0 0 55%', position: 'relative', overflow: 'hidden' }}>
              <CardDial currentPos={currentPos} hasEntered={hasEntered} entranceComplete={entranceComplete} />
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: '44px', left: '50%',
          transform: 'translateX(-50%)',
          opacity: progress < 0.05 && hasEntered ? 0.5 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          zIndex: 6,
        }}>
          <span style={{ fontSize: '11px', fontWeight: 500, color: '#999', letterSpacing: '0.05em' }}>Scroll to explore</span>
          <span style={{ fontSize: '16px', color: '#bbb' }}>↓</span>
        </div>
      </div>
    </section>
  )
}
