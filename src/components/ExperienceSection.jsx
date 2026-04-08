import { useState, useEffect, useRef, useCallback } from 'react'
import useInView from '../hooks/useInView'

const eras = [
  {
    yearRange: '2021 – Present',
    title: 'AI & Automation @ SenseHQ',
    description:
      'I joined Sense as a Lead Product Designer and grew into a Staff Product Designer. Over the last 4 years, I led end-to-end design across multiple products. Most recently, I have been part of the transformation of these tools into AI Agents, evolving the Sense platform.',
    icon: '🤖',
    color: '#F8E4A0',
  },
  {
    yearRange: '2019–2021',
    title: 'Social Impact @ Betterplace',
    description:
      "Joining Betterplace as a Lead Product Designer offered a humbling challenge: designing for India's blue-collar workforce.",
    icon: '🤝',
    color: '#B8F4D4',
  },
  {
    yearRange: '2015–2019',
    title: 'Global Scale @ Unisys',
    description:
      'I landed my first role as a UX Designer at Unisys. This was my exposure to the global stage. I had the opportunity to work on enterprise products for international clients.',
    icon: '🌍',
    color: '#B8D4F8',
  },
  {
    yearRange: '2012–2015',
    title: 'The Spark: Gaming & Empathy',
    description:
      'My passion for design began before I even graduated. Leading a team of four, I developed games that built the foundation of empathetic, user-centered thinking.',
    icon: '🎮',
    color: '#F4A58A',
  },
]

const CARD_COUNT = eras.length

// Arc parameters — cards travel along a circular arc
// radius controls how pronounced the curve is
const ARC_RADIUS = 1200 // px — larger = gentler curve

function TimelineCard({ era, isActive, arcX, arcY, arcRotate, entranceComplete }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateX = ((y - cy) / cy) * -18
    const rotateY = ((x - cx) / cx) * 18
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (card) card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${arcX}px), calc(-50% + ${arcY}px)) rotate(${arcRotate}deg)`,
        transition: entranceComplete
          ? 'transform 0.1s linear, opacity 0.4s ease'
          : 'transform 0.8s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.8s ease',
        opacity: isActive ? 1 : 0.2,
        zIndex: isActive ? 10 : 1,
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '480px',
          maxWidth: '85vw',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '44px 36px',
          boxShadow: isActive
            ? '0 20px 60px rgba(0,0,0,0.12)'
            : '0 4px 20px rgba(0,0,0,0.04)',
          transform: isActive ? 'scale(1)' : 'scale(0.88)',
          transition: 'transform 0.15s ease, box-shadow 0.4s ease, scale 0.4s ease',
          willChange: 'transform',
          cursor: 'default',
          // Undo parent rotation so card text stays level
          rotate: `${-arcRotate}deg`,
        }}
      >
        {/* Year */}
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#ccc', letterSpacing: '0.06em', display: 'block', marginBottom: '24px' }}>
          {era.yearRange}
        </span>

        {/* Icon */}
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: era.color + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '24px' }}>
          {era.icon}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '26px', fontWeight: 400, letterSpacing: '-0.025em', color: '#111', marginBottom: '16px', lineHeight: 1.3 }}>
          {era.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#666', fontWeight: 400, letterSpacing: '-0.01em' }}>
          {era.description}
        </p>

        {/* Accent line */}
        <div style={{ height: '3px', borderRadius: '2px', background: era.color, marginTop: '32px', width: '40px' }} />
      </div>
    </div>
  )
}

function TimelineBar({ progress, activeIndex }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '48px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        maxWidth: '600px',
        zIndex: 20,
      }}
    >
      {/* Track line */}
      <div style={{ position: 'relative', height: '2px', background: 'rgba(0,0,0,0.08)', borderRadius: '1px' }}>
        {/* Progress fill */}
        <div
          style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${progress * 100}%`,
            background: eras[activeIndex]?.color || '#111',
            borderRadius: '1px',
            transition: 'background 0.4s ease',
          }}
        />
        {/* Dots */}
        {eras.map((era, i) => {
          const pos = CARD_COUNT > 1 ? (i / (CARD_COUNT - 1)) * 100 : 0
          const active = i === activeIndex
          return (
            <div
              key={i}
              style={{
                position: 'absolute', top: '50%', left: `${pos}%`,
                transform: `translate(-50%, -50%) scale(${active ? 1.4 : 1})`,
                width: '10px', height: '10px', borderRadius: '50%',
                background: i <= activeIndex ? era.color : 'rgba(0,0,0,0.12)',
                border: active ? `2px solid ${era.color}` : '2px solid transparent',
                boxShadow: active ? `0 0 12px ${era.color}66` : 'none',
                transition: 'all 0.4s ease',
              }}
            />
          )
        })}
      </div>
      {/* Year labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
        {eras.map((era, i) => (
          <span
            key={i}
            style={{
              fontSize: '11px',
              fontWeight: i === activeIndex ? 600 : 400,
              color: i === activeIndex ? '#111' : '#bbb',
              transition: 'color 0.4s ease',
              textAlign: 'center', minWidth: '60px',
            }}
          >
            {era.yearRange.split('–')[0].split(' – ')[0].trim()}
          </span>
        ))}
      </div>
    </div>
  )
}

function ScrollHint({ visible }) {
  return (
    <div
      style={{
        position: 'absolute', bottom: '120px', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        opacity: visible ? 0.5 : 0, transition: 'opacity 0.6s ease', pointerEvents: 'none',
      }}
    >
      <span style={{ fontSize: '12px', fontWeight: 500, color: '#999', letterSpacing: '0.05em' }}>Scroll to explore</span>
      <span style={{ fontSize: '18px', color: '#bbb', animation: 'fadeInUp 1.5s ease-in-out infinite' }}>↓</span>
    </div>
  )
}

// Mobile fallback card
function MobileEraCard({ era, delay }) {
  const { ref } = useInView({ rootMargin: '0px 0px -40px 0px' })
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms`, background: '#ffffff', borderRadius: '20px', padding: '32px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '12px', fontWeight: 600, color: '#ccc', letterSpacing: '0.06em', marginBottom: '20px', display: 'block' }}>{era.yearRange}</span>
      <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: era.color + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>{era.icon}</div>
      <h3 style={{ fontSize: '20px', fontWeight: 400, letterSpacing: '-0.02em', color: '#111', marginBottom: '12px' }}>{era.title}</h3>
      <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#666', fontWeight: 400, letterSpacing: '-0.01em', flex: 1 }}>{era.description}</p>
      <div style={{ height: '3px', borderRadius: '2px', background: era.color, marginTop: '24px', width: '32px' }} />
    </div>
  )
}

// Calculate arc position for a card based on its offset from center
function getArcPosition(offset) {
  // offset: 0 = center (active), negative = left, positive = right
  // Cards travel along an arc: x moves horizontally, y follows a circular path
  const spacing = 600 // horizontal spacing between cards
  const x = offset * spacing
  // y = R - sqrt(R^2 - x^2)  — circular arc, peaks at center (y=0), dips at sides
  const clamped = Math.min(Math.abs(x), ARC_RADIUS)
  const y = ARC_RADIUS - Math.sqrt(ARC_RADIUS * ARC_RADIUS - clamped * clamped)
  // Tangent-based rotation: atan2(x, sqrt(R² - x²)) gives the true tangent angle
  // 0° at center, positive on right, negative on left — follows the arc naturally
  const rotate = Math.atan2(x, Math.sqrt(ARC_RADIUS * ARC_RADIUS - clamped * clamped)) * (180 / Math.PI)
  return { x, y, rotate }
}

export default function ExperienceSection() {
  const { ref: headRef } = useInView()
  const sectionRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [smoothProgress, setSmoothProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const [entranceComplete, setEntranceComplete] = useState(false)

  // Mobile detection
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)')
    const handler = (e) => setIsMobile(e.matches)
    setIsMobile(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  // Scroll-driven arc animation
  const onScroll = useCallback(() => {
    const section = sectionRef.current
    if (!section || isMobile) return

    const rect = section.getBoundingClientRect()
    const scrolled = -rect.top
    const maxScroll = section.offsetHeight - window.innerHeight
    const p = Math.max(0, Math.min(1, scrolled / maxScroll))
    const newIndex = Math.min(Math.floor(p * CARD_COUNT), CARD_COUNT - 1)

    // Trigger entrance animation when section comes into view
    if (!hasEntered && rect.top < window.innerHeight * 0.8) {
      setHasEntered(true)
      // After entrance animation completes, switch to fast scroll transitions
      setTimeout(() => setEntranceComplete(true), 900)
    }

    setProgress(p)
    setSmoothProgress(p)
    setActiveIndex(newIndex)
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

  // ─── Mobile Layout ───
  if (isMobile) {
    return (
      <section id="experience" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="section-container">
          <div ref={headRef} className="reveal" style={{ marginBottom: '40px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Experience</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#111' }}>From Game Worlds to Enterprise Ecosystems</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {eras.map((era, i) => <MobileEraCard key={era.yearRange} era={era} delay={i * 80} />)}
          </div>
        </div>
      </section>
    )
  }

  // Current fractional position (0 to CARD_COUNT-1)
  const currentPos = smoothProgress * (CARD_COUNT - 1)

  // ─── Desktop: Arc Scroll Timeline ───
  return (
    <section
      id="experience"
      ref={sectionRef}
      className="experience-section-tall"
      style={{ height: '500vh', position: 'relative' }}
    >
      <div
        className="experience-sticky"
        style={{
          position: 'sticky', top: 0, height: '100vh',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ padding: '48px 24px 0', maxWidth: '1260px', margin: '0 auto', width: '100%' }}>
          <div ref={headRef} className="reveal">
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Experience</p>
            <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 48px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#111' }}>From Game Worlds to Enterprise Ecosystems</h2>
          </div>
        </div>

        {/* Arc card area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {eras.map((era, i) => {
            const offset = i - currentPos // offset from current active position
            const { x, y, rotate } = getArcPosition(offset)
            const isActive = i === activeIndex
            // Before entrance: push all cards far to the right
            const entranceOffsetX = hasEntered ? 0 : 800
            return (
              <TimelineCard
                key={era.yearRange}
                era={era}
                isActive={isActive}
                arcX={x + entranceOffsetX}
                arcY={hasEntered ? y : 0}
                arcRotate={hasEntered ? rotate : 15}
                entranceComplete={entranceComplete}
              />
            )
          })}
        </div>

        {/* Timeline bar */}
        <TimelineBar progress={progress} activeIndex={activeIndex} />

        {/* Scroll hint */}
        <ScrollHint visible={progress < 0.05} />
      </div>
    </section>
  )
}
