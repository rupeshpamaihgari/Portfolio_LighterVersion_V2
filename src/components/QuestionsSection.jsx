import { useState, useEffect, useRef, useCallback } from 'react'
import useInView from '../hooks/useInView'

// ── Q&A Data ──────────────────────────────────────────────────────────────────
const QA = [
  {
    question: 'How do you use AI in your day-to-day?',
    answer: 'Research: Claude synthesises interviews in 20 min (was 3 hrs). Ideation: Lovable/Claude Code generates UI concepts to kill bad ideas fast. Execution: Cursor + Figma MCP bridges designs to front-end code. Handoff: Claude Cowork for critiques, specs & accessibility. Total: 8–10 hrs saved per week.',
    color: '#F4A58A',
  },
  {
    question: 'How do you collaborate with engineers?',
    answer: '4-stage collaboration: (1) Solutioning workshops with EMs, (2) Ideation feedback with FE/BE, (3) Dev-ready final designs with all unknowns answered, (4) Design UAT after build. Focus: realistic, feasible designs that earn engineering alignment before a single line of code is written.',
    color: '#B8D4F8',
  },
  {
    question: 'Can you walk through an end-to-end design process you owned?',
    answer: 'Led core AI Agent experience at Sense end-to-end. Mapped recruiter workflows → reframed the problem → co-defined agent vision with PM → designed workflow builder, orchestration UI & monitoring → shipped with metrics tracking time-to-hire, automation coverage, and recruiter efficiency.',
    color: '#B8F4D4',
  },
  {
    question: "What's your B2B and AI product experience?",
    answer: '11 years in product-led B2B SaaS. At Sense, led design for recruiting automation, messaging, analytics, and AI agents used daily. PLG mindset: clear onboarding, self-serve config, strong empty states, in-product AI education. Work closely with PM & data to define and track success metrics.',
    color: '#F8E4A0',
  },
  {
    question: 'How has AI compressed your discovery & execution?',
    answer: 'On AI Automation Agent: Discovery synthesis dropped from 2–3 weeks → 2–3 days with Claude/NotebookLM. System-level ideation from weeks → days. UX copy & specs drafted in hours via Claude Cowork. Deliberate trade-off: kept interaction patterns & risk decisions fully human-owned.',
    color: '#D4B8F8',
  },
  {
    question: 'How do you set design direction without managing people?',
    answer: '4 shared principles: Thoughtful, Collaborative, Scalable, Empathetic. Weekly cross-product crits. Dev-ready checklists. Key wins: added simulation phase to AI Recruiter roadmap to build user trust; enabled designers to contribute UI code — saving engineers 4–5 hrs per feature.',
    color: '#f4c8d4',
  },
  {
    question: "What's the most challenging design problem you've solved?",
    answer: 'Designing Grace (AI Recruiter): 3 autonomous agents orchestrated into one recruiter. Challenge: when should AI act vs pause for human? Solution: transparent pipeline, explicit scoring thresholds (auto-submit ≥ 8/10), traceable evidence per action. Result: 11-hr hire, 50K+ hrs saved, ~$5M ARR.',
    color: '#c8f4f0',
  },
  {
    question: 'Tell us about your background and experience.',
    answer: 'CS degree + 11 years in B2B SaaS. Shipped 15+ products from 0→1 across Gaming, AR/VR, Travel, HR Tech & Public Sector in 5+ countries. 5 years specialising in AI agents & automation. Mentors 4 junior designers. Won 3+ international design awards.',
    color: '#e4d4f8',
  },
]

const COUNT = QA.length // 8

// ── FlipCard ──────────────────────────────────────────────────────────────────
function FlipCard({ item, index, isFlipped, isAnimating, onFlip }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ perspective: '900px', height: '240px' }}
      onMouseEnter={() => !isFlipped && !isAnimating && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !isAnimating && onFlip(index)}
    >
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.58s cubic-bezier(0.33,1,0.68,1), box-shadow 0.2s ease',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        borderRadius: '20px',
        boxShadow: hovered && !isFlipped
          ? '0 8px 28px rgba(0,0,0,0.11)'
          : '0 2px 16px rgba(0,0,0,0.06)',
        cursor: isAnimating ? 'default' : 'pointer',
      }}>

        {/* ── FRONT ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          background: 'rgba(255,255,255,0.92)',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <p style={{
            fontSize: 'clamp(16px, 1.4vw, 18px)',
            fontWeight: 650,
            letterSpacing: '-0.025em',
            lineHeight: 1.35,
            color: '#111',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            margin: '0 0 16px',
          }}>
            {item.question}
          </p>

          <div style={{ width: '28px', height: '5px', borderRadius: '3px', background: item.color }} />
        </div>

        {/* ── BACK ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: '#111',
          borderRadius: '20px',
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: item.color }}>
            Answer
          </span>

          <p style={{
            fontSize: '12.5px',
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.82)',
            fontWeight: 400,
            flex: 1,
            margin: '10px 0',
            overflowY: 'auto',
          }}>
            {item.answer}
          </p>

          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ← tap to close
          </span>
        </div>
      </div>
    </div>
  )
}

// ── AccordionItem (mobile) ────────────────────────────────────────────────────
function AccordionItem({ item, index, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(0,0,0,0.09)', overflow: 'hidden' }}>
      <button
        onClick={() => onToggle(index)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '22px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
        aria-expanded={isOpen}
      >
        <span style={{
          fontSize: 'clamp(15px, 1.8vw, 17px)',
          fontWeight: isOpen ? 600 : 500,
          color: isOpen ? '#111' : '#333',
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
          transition: 'color 0.2s ease',
        }}>
          {item.question}
        </span>
        <span style={{
          width: '32px', height: '32px',
          borderRadius: '50%',
          background: isOpen ? '#111' : '#f0efea',
          color: isOpen ? '#fff' : '#555',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', fontWeight: 300,
          flexShrink: 0,
          transition: 'background 0.25s ease, color 0.25s ease, transform 0.3s ease',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          +
        </span>
      </button>
      <div style={{
        maxHeight: isOpen ? '280px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.33, 1, 0.68, 1)',
      }}>
        <p style={{
          fontSize: '15px', lineHeight: 1.75, color: '#555', fontWeight: 400,
          paddingBottom: '22px', maxWidth: '680px', letterSpacing: '-0.01em',
        }}>
          {item.answer}
        </p>
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function QuestionsSection() {
  const { ref: headRef }    = useInView()
  const [openIndex,   setOpenIndex]   = useState(-1)
  // All cards start flipped (showing answer backs)
  const [flipStates,  setFlipStates]  = useState(() => Array(COUNT).fill(true))
  const [isAnimating, setIsAnimating] = useState(false)
  const gridRef       = useRef(null)
  const timeoutsRef   = useRef([])

  // Clear any running timeouts
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }

  // Flip all cards back to front, one by one in random order over 3 seconds
  const playReveal = useCallback(() => {
    clearAllTimeouts()

    // First: snap all cards back to flipped state instantly
    setFlipStates(Array(COUNT).fill(true))
    setIsAnimating(true)

    // Build a shuffled index order
    const order = [...Array(COUNT).keys()].sort(() => Math.random() - 0.5)

    // Spread flips across 3000ms
    order.forEach((cardIndex, position) => {
      const delay = 60 + Math.round((position / (COUNT - 1)) * 1800)
      const t = setTimeout(() => {
        setFlipStates(prev => {
          const next = [...prev]
          next[cardIndex] = false
          return next
        })
      }, delay)
      timeoutsRef.current.push(t)
    })

    // Mark animation done after all flips finish (3 s + flip duration)
    const done = setTimeout(() => setIsAnimating(false), 2000 + 600)
    timeoutsRef.current.push(done)
  }, [])

  // IntersectionObserver — trigger on scroll into view
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        obs.disconnect()
        playReveal()
      }
    }, { threshold: 0.15 })
    if (gridRef.current) obs.observe(gridRef.current)
    return () => { obs.disconnect(); clearAllTimeouts() }
  }, [playReveal])

  // Custom event — triggered by FAQ nav click
  useEffect(() => {
    const handler = () => playReveal()
    window.addEventListener('faq-reveal', handler)
    return () => window.removeEventListener('faq-reveal', handler)
  }, [playReveal])

  const handleFlip = (index) => {
    setFlipStates(prev => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  return (
    <section id="questions" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
      <div className="section-container">

        {/* Header */}
        <div ref={headRef} className="reveal" style={{ marginBottom: '56px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>
            Questions
          </p>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 650, letterSpacing: '-0.03em', lineHeight: 1.15, color: '#111', marginBottom: '14px' }}>
            Things people ask me
          </h2>
          <p style={{ fontSize: '15px', lineHeight: 1.65, color: '#777', letterSpacing: '-0.01em', maxWidth: '480px' }}>
            Common collaboration questions — answered directly. Click any card to reveal the answer.
          </p>
        </div>

        {/* Desktop grid */}
        <div
          ref={gridRef}
          className="questions-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}
        >
          {QA.map((item, i) => (
            <FlipCard
              key={i}
              item={item}
              index={i}
              isFlipped={flipStates[i]}
              isAnimating={isAnimating}
              onFlip={handleFlip}
            />
          ))}
        </div>

        {/* Mobile accordion */}
        <div className="questions-accordion">
          {QA.map((item, i) => (
            <AccordionItem
              key={i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={(idx) => setOpenIndex(openIndex === idx ? -1 : idx)}
            />
          ))}
        </div>
      </div>

      <style>{`
        .questions-grid      { display: grid; }
        .questions-accordion { display: none; }
        @media (max-width: 767px) {
          .questions-grid      { display: none !important; }
          .questions-accordion { display: block !important; }
        }
      `}</style>
    </section>
  )
}
