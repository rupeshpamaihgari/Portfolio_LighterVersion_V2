import { useState, useEffect, useRef, useCallback } from 'react'
import useInView from '../hooks/useInView'
import { asset } from '../utils/asset'

const eras = [
  {
    yearRange: '2021 - Present',
    title: 'Staff Product Designer @ SenseHQ',
    titleLink: 'https://sensehq.com',
    description:
      'I joined Sense as a Lead Product Designer and grew into a Staff Product Designer. Over the last 5 years, I led end-to-end design across 10+ products mainly including Automations and AI recruiter agents which contributes to about 80% of Sense\'s revenue.',
    descriptionRich: (
      <>
        I joined Sense as a Lead Product Designer and grew into a Staff Product Designer. Over the last 5 years, I led end-to-end design across{' '}
        <strong style={{ color: '#111', fontWeight: 650 }}>10+ products</strong> mainly including{' '}
        <strong style={{ color: '#111', fontWeight: 650 }}>Automations and AI recruiter agents</strong> which contributes to about{' '}
        <strong style={{ color: '#111', fontWeight: 650 }}>80% of Sense's revenue.</strong>
      </>
    ),
    icon: '🤖',
    logo: asset('/Sense.png'),
    color: '#F8E4A0',
    metrics: [
      { value: '80%',  label: 'Reduction in\ntime-to-hire' },
      { value: '1M+',  label: 'Candidates\nengaged' },
      { value: '$5M+', label: 'Booked\nARR' },
    ],
  },
  {
    yearRange: '2019–2021',
    title: 'Sr Product Designer @ Betterplace',
    titleLink: 'https://betterplace.co.in',
    description:
      "Joined as a founding designer at Betterplace and contributed to core products involving background verification of blue-collared employees, attendance tracking apps, and more.",
    icon: '🤝',
    logo: asset('/betterplace.png'),
    color: '#B8F4D4',
    metrics: [
      { value: '4.4',   label: 'App\nRating' },
      { value: '100K+', label: 'App\nDownloads' },
      { value: '$1M+',  label: 'Revenue\nGenerated' },
    ],
  },
  {
    yearRange: '2015–2019',
    title: 'UI/UX Designer @ Unisys',
    titleLink: 'https://unisys.com',
    description:
      'I landed my first role as a UX Designer at Unisys. This was my exposure to the global stage. I had the opportunity to work on enterprise products for international clients across Public Sector, Travel and Transportation domains.',
    icon: '🌍',
    logo: asset('/Unisys_logo_2022.svg'),
    color: '#B8D4F8',
    clientChips: { label: 'Notable Clients', chips: ['SaS Cargo', 'DigiYatra', 'Singapore Airport', 'Delta Airlines'] },
  },
  {
    yearRange: '2013',
    title: 'Games & AR/VR Developer',
    description:
      'My passion for design began before I even graduated. Leading a team of four, I developed games that built the foundation of empathetic, user-centered thinking.',
    icon: '🎮',
    color: '#F4A58A',
    metrics: [
      { value: '3+',    label: 'International\nAwards' },
      { value: '500K+', label: 'Users\nEngaged' },
      { value: '4',     label: 'Team\nManaged' },
    ],
  },
]

const CARD_COUNT = eras.length

// Per-era gradient backgrounds — same language as ServicesSection / AIProcessSection
const ERA_GRADIENTS = [
  // AI & Automation — warm amber/gold
  `linear-gradient(to bottom, rgb(234,232,225) 0%, transparent 18%),
   linear-gradient(to right, transparent 50%, rgb(234,232,225) 92%),
   radial-gradient(ellipse at 6% 58%, rgba(248,228,160,0.68) 0%, transparent 55%),
   radial-gradient(ellipse at 78% 38%, rgba(255,200,80,0.32) 0%, transparent 50%),
   rgb(234,232,225)`,
  // Social Impact — fresh green
  `linear-gradient(to bottom, rgb(234,232,225) 0%, transparent 18%),
   linear-gradient(to right, transparent 50%, rgb(234,232,225) 92%),
   radial-gradient(ellipse at 6% 55%, rgba(184,244,212,0.68) 0%, transparent 55%),
   radial-gradient(ellipse at 73% 42%, rgba(120,220,170,0.32) 0%, transparent 50%),
   rgb(234,232,225)`,
  // Global Scale — calm blue
  `linear-gradient(to bottom, rgb(234,232,225) 0%, transparent 18%),
   linear-gradient(to right, transparent 50%, rgb(234,232,225) 92%),
   radial-gradient(ellipse at 6% 55%, rgba(184,212,248,0.68) 0%, transparent 55%),
   radial-gradient(ellipse at 70% 65%, rgba(160,175,248,0.32) 0%, transparent 50%),
   rgb(234,232,225)`,
  // Gaming & Empathy — warm coral/salmon
  `linear-gradient(to bottom, rgb(234,232,225) 0%, transparent 18%),
   linear-gradient(to right, transparent 50%, rgb(234,232,225) 92%),
   radial-gradient(ellipse at 6% 60%, rgba(244,165,138,0.62) 0%, transparent 55%),
   radial-gradient(ellipse at 76% 40%, rgba(248,190,160,0.36) 0%, transparent 50%),
   rgb(234,232,225)`,
]

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
          ? 'opacity 0.4s ease'
          : 'transform 0.8s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.8s ease',
        willChange: 'transform',
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
        {/* Top row: logo left + timeline right */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          {era.logo ? (
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', flexShrink: 0 }}>
              <img src={era.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          ) : (
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: era.color + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
              {era.icon}
            </div>
          )}
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#888', letterSpacing: '0.06em', background: era.color + '44', borderRadius: '999px', padding: '5px 12px' }}>
            {era.yearRange}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.025em', color: '#111', marginBottom: '12px', lineHeight: 1.3 }}>
          {era.titleLink ? (
            <a
              href={era.titleLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none', borderBottom: '2px solid rgba(0,0,0,0.15)', paddingBottom: '1px' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderBottomColor = 'rgba(0,0,0,0.5)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderBottomColor = 'rgba(0,0,0,0.15)' }}
            >
              {era.title} ↗
            </a>
          ) : era.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#666', fontWeight: 400, letterSpacing: '-0.01em', marginBottom: era.metrics ? '16px' : '0' }}>
          {era.descriptionRich ?? era.description}
        </p>

        {/* Client chips */}
        {era.clientChips && (
          <div style={{ marginTop: '14px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: '8px' }}>
              {era.clientChips.label}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {era.clientChips.chips.map((chip) => (
                <span key={chip} style={{
                  background: era.color + '33',
                  border: `1px solid ${era.color}99`,
                  borderRadius: '999px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#333',
                }}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metrics row */}
        {era.metrics && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            {era.metrics.map((m) => (
              <div key={m.label} style={{
                flex: '1 1 0',
                background: era.color + '22',
                border: `1px solid ${era.color}88`,
                borderRadius: '12px',
                padding: '10px 8px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '17px', fontWeight: 750, color: '#111', letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
                  {m.value}
                </p>
                <p style={{ fontSize: '10px', color: '#777', marginTop: '4px', fontWeight: 500, lineHeight: 1.3, whiteSpace: 'pre-line' }}>
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Accent line */}
        <div style={{ height: '3px', borderRadius: '2px', background: era.color, marginTop: '20px', width: '40px' }} />
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
            {era.yearRange}
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
      <span style={{ fontSize: '12px', fontWeight: 600, color: '#888', letterSpacing: '0.06em', marginBottom: '20px', display: 'block' }}>{era.yearRange}</span>
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
        {/* Gradient background layers — cross-fade between eras */}
        {ERA_GRADIENTS.map((gradient, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', inset: 0,
              background: gradient,
              opacity: i === activeIndex ? 1 : 0,
              transition: 'opacity 0.75s ease',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        ))}

        {/* Header */}
        <div style={{ padding: '92px 24px 0', maxWidth: '1260px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{
            opacity: hasEntered ? 1 : 0,
            transform: hasEntered ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}>
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Experience</p>
            <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 48px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#111' }}>From Game Worlds to Enterprise Ecosystems</h2>
          </div>
        </div>

        {/* Arc card area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', zIndex: 1 }}>
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
