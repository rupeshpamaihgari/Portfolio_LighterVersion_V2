import { useState, useEffect, useRef } from 'react'
import CaseStudyAccordion from './CaseStudyAccordion'
import CaseStudyCallout from './CaseStudyCallout'
import { CaseStudyImage, CaseStudyVideo, CaseStudyScrollableImage } from './CaseStudyMedia'

/* ─────────────────────────────────────────────────────────────
   Shared typography helpers
───────────────────────────────────────────────────────────── */
const T = {
  kicker: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#999',
    marginBottom: '10px',
    display: 'block',
  },
  h1: {
    fontSize: 'clamp(32px, 5vw, 56px)',
    fontWeight: 700,
    letterSpacing: '-0.035em',
    lineHeight: 1.08,
    color: '#111',
    marginBottom: '18px',
  },
  h2: {
    fontSize: 'clamp(24px, 3vw, 36px)',
    fontWeight: 650,
    letterSpacing: '-0.025em',
    lineHeight: 1.15,
    color: '#111',
    marginBottom: '20px',
    marginTop: '48px',
  },
  h3: {
    fontSize: '18px',
    fontWeight: 650,
    letterSpacing: '-0.015em',
    color: '#111',
    marginBottom: '12px',
    marginTop: '32px',
  },
  h4: {
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: '#777',
    marginBottom: '10px',
    marginTop: '28px',
  },
  body: {
    fontSize: '15px',
    lineHeight: 1.75,
    color: '#555',
    marginBottom: '16px',
  },
  inlineHeading: {
    fontWeight: 650,
    color: '#222',
  },
}

/* ─────────────────────────────────────────────────────────────
   Step definitions (stepper nav labels)
───────────────────────────────────────────────────────────── */
const STEPS = [
  { label: 'Introduction' },
  { label: 'Phase 1: Siloed Products' },
  { label: 'Phase 2: Unification' },
  { label: 'Phase 3: Intelligence Layer' },
  { label: 'Phase 4: Agentic Shift' },
  { label: 'Outcomes & Impact' },
]

/* ─────────────────────────────────────────────────────────────
   Accent-line H2 wrapper
───────────────────────────────────────────────────────────── */
function AccentH2({ children, style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', ...style }}>
      <div
        style={{
          width: '3px',
          height: '40px',
          background: 'linear-gradient(to bottom, #111, #888)',
          borderRadius: '2px',
          flexShrink: 0,
          marginTop: '4px',
        }}
      />
      <h2 style={{ ...T.h2, marginTop: 0 }}>{children}</h2>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Stepper — sleek horizontal progress bar
───────────────────────────────────────────────────────────── */
function Stepper({ current, onChange }) {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(234,232,225,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '0 32px',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          gap: '0',
          padding: '18px 0',
        }}
      >
        {STEPS.map((step, i) => {
          const isActive = current === i + 1
          const isCompleted = i + 1 < current
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <button
                onClick={() => onChange(i + 1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  opacity: isActive ? 1 : isCompleted ? 0.8 : 0.4,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: isActive
                      ? '#111'
                      : isCompleted
                        ? '#111'
                        : 'transparent',
                    border: `2px solid ${isActive || isCompleted ? '#111' : '#bbb'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: isActive || isCompleted ? '#fff' : '#888',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive ? '0 0 12px rgba(17,17,17,0.25)' : 'none',
                    flexShrink: 0,
                  }}
                >
                  {isCompleted ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: isActive ? '#111' : isCompleted ? '#555' : '#999',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.01em',
                    textTransform: 'uppercase',
                  }}
                >
                  {step.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    width: '28px',
                    height: '2px',
                    borderRadius: '1px',
                    background: isCompleted
                      ? '#111'
                      : 'linear-gradient(to right, #ddd, #e8e8e8)',
                    transition: 'background 0.4s ease',
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}

/* ─────────────────────────────────────────────────────────────
   Step Nav (Prev / Next) — with step label preview
───────────────────────────────────────────────────────────── */
function StepNav({ current, total, onChange }) {
  const prevLabel = current > 1 ? STEPS[current - 2].label : ''
  const nextLabel = current < total ? STEPS[current].label : ''

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '72px',
        paddingTop: '36px',
        borderTop: '1px solid #e5e3dc',
      }}
    >
      {current > 1 ? (
        <button
          onClick={() => onChange(current - 1)}
          className="btn-light cs-nav-btn"
          style={{ gap: '8px', padding: '11px 24px', fontSize: '13.5px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Previous
          </span>
          <span style={{ fontSize: '11px', color: '#999', fontWeight: 400, marginTop: '2px' }}>{prevLabel}</span>
        </button>
      ) : (
        <span />
      )}
      {current < total ? (
        <button
          onClick={() => onChange(current + 1)}
          className="btn-dark cs-nav-btn-next"
          style={{ gap: '8px', padding: '12px 28px', fontSize: '13.5px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Next
            <svg className="cs-nav-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transition: 'transform 0.25s ease' }}><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', fontWeight: 400, marginTop: '2px' }}>{nextLabel}</span>
        </button>
      ) : (
        <span />
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Metric card — gradient value, accent top border
───────────────────────────────────────────────────────────── */
function MetricCard({ value, label }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '28px 24px',
        textAlign: 'center',
        border: '1.5px solid #ebebeb',
        borderTop: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #111 0%, #666 50%, #bbb 100%)',
        }}
      />
      <div
        style={{
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, #111 0%, #555 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '8px',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '13px', color: '#777', fontWeight: 500 }}>{label}</div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Info card — hover lift, frosted border
───────────────────────────────────────────────────────────── */
function InfoCard({ title, children }) {
  return (
    <div
      className="cs-info-card"
      style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1.5px solid rgba(235,235,235,0.8)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <h3
        style={{
          fontSize: '15px',
          fontWeight: 650,
          color: '#111',
          marginBottom: '10px',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#666', margin: 0 }}>{children}</p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Inline heading helper
───────────────────────────────────────────────────────────── */
function IH({ children }) {
  return <span style={T.inlineHeading}>{children}</span>
}

/* ─────────────────────────────────────────────────────────────
   Persona table — colored left border per persona
───────────────────────────────────────────────────────────── */
function PersonaTable() {
  const personas = [
    {
      avatar: '/illustrations/case-study/avatar1.png',
      name: 'The Recruiter (End User)',
      role: '"The Busy Bee"',
      need: 'Wants to eliminate data entry and scheduling busy work. They want the AI to "show up to work with interviews already scheduled" on their calendar.',
      accent: '#111',
    },
    {
      avatar: '/illustrations/case-study/avatar2.png',
      name: 'The Ops Manager (The Builder)',
      role: '"The Architect"',
      need: 'Needs a scalable, visual canvas to orchestrate millions of touchpoints without creating "spaghetti logic" or managing hundreds of duplicate workflows.',
      accent: '#555',
    },
    {
      avatar: '/illustrations/case-study/avatar3.png',
      name: 'The Candidate (The Recipient)',
      role: '"The Talent"',
      need: 'Expects a frictionless experience. Whether texting or talking to an AI, they want instant responses and no repetition of data they have already provided.',
      accent: '#888',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
      {personas.map((p, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: '20px',
            background: '#fff',
            borderRadius: '16px',
            padding: '20px',
            border: '1.5px solid #ebebeb',
            borderLeft: `4px solid ${p.accent}`,
            alignItems: 'flex-start',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <img
            src={p.avatar}
            alt={p.name}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
              background: '#f5f4f1',
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '32px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Persona</div>
                <div style={{ fontSize: '14px', fontWeight: 650, color: '#111' }}>{p.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Role</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#555' }}>{p.role}</div>
              </div>
            </div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Core Need</div>
            <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#555', margin: 0 }}>{p.need}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   User flows interactive selector (Phase 2) — flow-diagram pills
───────────────────────────────────────────────────────────── */
const USER_FLOWS = [
  { label: 'Create a workflow', video: 'https://drive.google.com/file/d/1Fmd4kU8MvIaQ_G9B3JWbUTpeBuwaCjxH/preview?rm=minimal', description: 'Start by creating a new workflow from scratch. This initial step sets up the foundation for your automation process, allowing you to build a customized flow tailored to your recruitment needs.' },
  { label: 'Add trigger', video: 'https://drive.google.com/file/d/1G1uCDZH2A1CuAMzTo1bv7JeQC9-j27dR/preview?rm=minimal', description: 'Define the trigger event that initiates your workflow. Triggers can be based on candidate actions, status changes, or specific conditions that automatically start the automation sequence.' },
  { label: 'Add Email', video: 'https://drive.google.com/file/d/1UXXnTqIV7OTy9hYcmBqkUPn-5FS7e-Ov/preview?rm=minimal', description: 'Configure email communication nodes to send personalized messages to candidates. Customize templates, add dynamic content, and schedule delivery for effective candidate engagement.' },
  { label: 'Add scheduling', video: 'https://drive.google.com/file/d/1MZtA5emlG8cYQLvFVH0OWfripgWwAZrh/preview?rm=minimal', description: 'Integrate smart scheduling functionality to automate interview coordination. The system finds optimal meeting times by analyzing availability and reduces back-and-forth communication.' },
  { label: 'Add Delay', video: 'https://drive.google.com/file/d/1c8T_tBbBEpTlQrI-rbd4cr1jUVEUkTAJ/preview?rm=minimal', description: 'Insert time-based delays between workflow steps to control pacing. This allows for natural timing in your automation, such as waiting before sending follow-up communications.' },
  { label: 'Add SMS', video: 'https://drive.google.com/file/d/1J00TPou-ElkLf5RN7l8uTFgu7FSkMHnd/preview?rm=minimal', description: 'Add SMS messaging nodes to reach candidates via text. SMS provides immediate, high-open-rate communication that complements email outreach for better engagement.' },
  { label: 'Add path', video: 'https://drive.google.com/file/d/184G7kpkb6wsZZmT1o5zFhCQHf_aKln3E/preview?rm=minimal', description: 'Create conditional paths that branch your workflow based on specific criteria. Use split nodes to route candidates down different paths depending on their responses or qualifications.' },
  { label: 'Candidate Matching', video: 'https://drive.google.com/file/d/1N_xpWlc5pTSyvazTjMsfmyivDm49Gg3L/preview?rm=minimal', description: 'Leverage AI-powered candidate matching to automatically identify the best-fit candidates for job requirements. The system analyzes skills, experience, and qualifications to rank matches.' },
  { label: 'Candidate Evaluation', video: 'https://drive.google.com/file/d/1ZWhNx9XQYABi-__HaEob4FLn3aIJ7Fv4/preview?rm=minimal', description: 'Evaluate candidates through automated screening processes. This node can run assessments, score qualifications, and filter candidates based on predefined evaluation criteria.' },
  { label: 'Database Update', video: 'https://drive.google.com/file/d/16Yj1x6PZE8kKMMkLDs1hBWDZ6lFN6yMF/preview?rm=minimal', description: 'Automatically update your database and CRM with candidate information and workflow progress. Keep all systems synchronized without manual data entry, ensuring accurate records across platforms.' },
  { label: 'Activate', video: 'https://drive.google.com/file/d/1Z0b4kDb0WUcneuoDoISFx2lzBd0DQ6TN/preview?rm=minimal', description: 'Activate your completed workflow to start the automation process. Once activated, the workflow will begin processing candidates according to the configured nodes and logic paths.' },
]

function UserFlowsSelector() {
  const [active, setActive] = useState(0)

  return (
    <div>
      <p style={{ fontSize: '13px', color: '#999', fontWeight: 500, marginBottom: '16px', fontStyle: 'italic' }}>
        Select a flow below to play the video
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '24px',
          alignItems: 'center',
        }}
      >
        {USER_FLOWS.map((flow, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            <button
              onClick={() => setActive(i)}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '12.5px',
                fontWeight: 500,
                border: `1.5px solid ${active === i ? '#111' : '#ddd'}`,
                background: active === i ? '#111' : 'transparent',
                color: active === i ? '#fff' : '#555',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                letterSpacing: '-0.01em',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {active === i && (
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#fff',
                    animation: 'caseStudyPulse 2s ease-in-out infinite',
                    flexShrink: 0,
                  }}
                />
              )}
              {flow.label}
            </button>
            {i < USER_FLOWS.length - 1 && (
              <svg width="16" height="8" viewBox="0 0 16 8" fill="none" style={{ margin: '0 -2px', flexShrink: 0, opacity: 0.3 }}>
                <path d="M0 4H12M12 4L9 1M12 4L9 7" stroke="#999" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <CaseStudyVideo src={USER_FLOWS[active].video} />
      <div
        style={{
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: '14px',
          padding: '18px 22px',
          border: '1.5px solid #ebebeb',
          marginTop: '-8px',
        }}
      >
        <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#555', margin: 0 }}>
          {USER_FLOWS[active].description}
        </p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Limitation item — numbered badge, staggered layout
───────────────────────────────────────────────────────────── */
function LimitationItem({ title, children, imgSrc, imgAlt, index = 0 }) {
  const isEven = index % 2 === 0
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '28px',
        alignItems: 'start',
        marginBottom: '32px',
        padding: '28px',
        background: '#fff',
        borderRadius: '18px',
        border: '1.5px solid #ebebeb',
        direction: isEven ? 'ltr' : 'rtl',
      }}
      className="limitation-item"
    >
      <div style={{ direction: 'ltr' }}>
        <h3 style={{ ...T.h3, marginTop: 0 }}>{title}</h3>
        {children}
      </div>
      {imgSrc && (
        <img
          src={imgSrc}
          alt={imgAlt || title}
          style={{ width: '100%', height: 'auto', borderRadius: '12px', display: 'block', direction: 'ltr' }}
        />
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   List helpers
───────────────────────────────────────────────────────────── */
function UL({ children, nested = false }) {
  return (
    <ul
      style={{
        paddingLeft: nested ? '20px' : '20px',
        marginBottom: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {children}
    </ul>
  )
}
function OL({ children }) {
  return (
    <ol style={{ paddingLeft: '20px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {children}
    </ol>
  )
}
function LI({ children }) {
  return (
    <li style={{ fontSize: '14.5px', lineHeight: 1.7, color: '#555' }}>{children}</li>
  )
}

/* ─────────────────────────────────────────────────────────────
   Section wrapper — generous whitespace
───────────────────────────────────────────────────────────── */
function Section({ children }) {
  return <div style={{ marginBottom: '56px' }}>{children}</div>
}

/* ─────────────────────────────────────────────────────────────
   ═══════════ STEP CONTENT COMPONENTS ═══════════
───────────────────────────────────────────────────────────── */

function Step1() {
  const accordionItems = [
    {
      title: 'Key Personas',
      content: (
        <>
          <p style={T.body}>Designing this evolution required balancing the conflicting needs of three distinct users.</p>
          <PersonaTable />
        </>
      ),
    },
    {
      title: 'The Ecosystem of Use Cases',
      content: (
        <>
          <p style={T.body}>Before diving into the evolution, it's important to understand the breadth of problems Sense solves. The platform covers four main pillars:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
            {[
              { img: '/illustrations/case-study/Sourcing.png', title: 'Sourcing & Attraction', desc: 'Reactivating dormant candidate databases, referral automation, and chatbot screening.' },
              { img: '/illustrations/case-study/Candidate_Engagement.png', title: 'Candidate Engagement', desc: 'Post-application acknowledgments, interview reminders, and status updates to prevent ghosting.' },
              { img: '/illustrations/case-study/Efficiency.png', title: 'Recruiter Efficiency', desc: 'Automated interview scheduling, candidate scoring, and bulk messaging at scale.' },
              { img: '/illustrations/case-study/Employee Engagement.png', title: 'Employee Engagement', desc: 'Onboarding workflows, NPS surveys, and assignment-end redeployment.' },
            ].map((c, i) => (
              <InfoCard key={i} title={c.title}>
                {c.desc}
              </InfoCard>
            ))}
          </div>
        </>
      ),
    },
    {
      title: 'Hero Use Case: Auto-Submission',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }} className="hero-usecase-grid">
          <div>
            <h3 style={T.h3}>The Problem</h3>
            <p style={T.body}>Recruiters spent hours manually searching their database for candidates who matched a new job order, calling them one by one, and screening them before submitting them to a client.</p>
            <h3 style={T.h3}>The Goal</h3>
            <p style={T.body}>Design a system that detects a new job, identifies the best matches, screens them via Voice/Chat, and submits qualified profiles to the recruiter — zero human intervention required.</p>
          </div>
          <CaseStudyImage src="/illustrations/case-study/Auto-Submissoin.png" alt="Auto-submission flow diagram" style={{ margin: 0 }} />
        </div>
      ),
    },
  ]

  return (
    <>
      {/* Hero — immersive dark gradient mesh with grid pattern */}
      <div
        className="cs-hero"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 40%, #16213e 70%, #1a1a1a 100%)',
          borderRadius: '24px',
          padding: 'clamp(40px, 6vw, 80px)',
          marginBottom: '56px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            zIndex: 0,
          }}
        />
        {/* Gradient mesh orbs */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-40px', width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', top: '50%', right: '20%', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter: 'blur(20px)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="cs-hero-anim cs-hero-anim-1" style={{ ...T.kicker, color: 'rgba(255,255,255,0.4)' }}>Case Study</span>
          <h1 className="cs-hero-anim cs-hero-anim-2" style={{ ...T.h1, color: '#fff', marginBottom: '16px' }}>Evolution of AI Automation Agent</h1>
          <p className="cs-hero-anim cs-hero-anim-3" style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: '36px', maxWidth: '560px' }}>
            A journey from siloed tools to autonomous AI teammates in talent acquisition.
          </p>
          <div className="cs-hero-anim cs-hero-anim-4" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { label: 'Role', value: 'Lead Product Designer' },
              { label: 'Timeline', value: '2021 – Present' },
              { label: 'Company', value: 'Sense.com' },
            ].map((m, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '999px',
                  padding: '10px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.35)' }}>{m.label}</span>
                <span style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.12)' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="cs-scroll-indicator"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            opacity: 0.4,
          }}
        >
          <span style={{ fontSize: '10px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>Scroll</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'caseStudyBounce 2s ease-in-out infinite' }}>
            <path d="M4 6L8 10L12 6" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <Section>
        <AccentH2>Project Context</AccentH2>
        <p style={T.body}>
          <IH>About Sense:</IH> Sense is an enterprise Talent Engagement Platform used by staffing agencies to accelerate hiring. It operates as a System of Engagement that syncs bi-directionally with an Applicant Tracking System (ATS), automating communication across the entire talent lifecycle.
        </p>
        <p style={T.body}>
          <IH>About this Project:</IH> This case study documents my journey as a product designer in the overall evolution of Sense products to AI Agents — from disconnected point solutions to a fully autonomous AI Recruiter.
        </p>
        <CaseStudyImage src="/illustrations/case-study/Step_1_HeroImage.png" alt="Sense Platform Overview" />
      </Section>

      <Section>
        <CaseStudyAccordion items={accordionItems} />
      </Section>

      <Section>
        <AccentH2>My Role & Cross-Functional Collaboration</AccentH2>
        <p style={T.body}>
          As Staff Product Designer for the Workflow Builder, I established a rigorous collaboration framework early on to ensure we were solving the right problems before a single pixel was pushed.
        </p>
        <CaseStudyImage src="/illustrations/case-study/collaboration.png" alt="Cross-functional collaboration framework" />
        <p style={T.body}>This is how my typical busy week looked like…</p>
        <CaseStudyImage src="/illustrations/case-study/Collaboration_Calendar.png" alt="Typical collaboration calendar" />
        <p style={T.body}>
          Although the calendar looks chaotic, we follow a framework to achieve efficiency in design: <IH>Research → Define → Validate ⟷ Design ⟷ Prototype → Build → QA test → Launch.</IH>
        </p>
      </Section>
    </>
  )
}

function Step2() {
  const accordionItems = [
    {
      title: 'Chatbot Builder 1.0',
      content: (
        <>
          <p style={T.body}><IH>What it did:</IH> A tool to create conversational interfaces for screening candidates or gathering feedback.</p>
          <p style={T.body}><IH>The UX Friction:</IH> It was rigid — limited logic (no nested branches), no "Text Piping" to personalise questions, and no validation for emails or phone numbers.</p>
          <CaseStudyScrollableImage src="/illustrations/case-study/phase1/Chatbot_1.png" alt="Chatbot Builder 1.0" />
        </>
      ),
    },
    {
      title: 'List Builder 1.0',
      content: (
        <>
          <p style={T.body}><IH>What it did:</IH> The engine for defining who to contact. It allowed users to filter candidates based on ATS data.</p>
          <p style={T.body}><IH>The UX Friction:</IH> It was "Tightly Coupled." Lists were built inside a specific journey rather than existing as independent, reusable assets. No Boolean power, and users struggled to differentiate static vs. dynamic "Smart Lists".</p>
          <CaseStudyScrollableImage src="/illustrations/case-study/phase1/Lists_1.png" alt="List Builder 1.0" />
        </>
      ),
    },
    {
      title: 'Messaging (Bulk Outreach)',
      content: (
        <>
          <p style={T.body}><IH>What it did:</IH> A console for 1:1 texting or Mass SMS blasts (Broadcasts).</p>
          <p style={T.body}><IH>The UX Friction:</IH> It was an isolated island. Data from a text conversation didn't easily trigger a follow-up journey — it was disconnected from the broader automation strategy.</p>
          <CaseStudyScrollableImage src="/illustrations/case-study/phase1/Messaging_1.png" alt="Messaging interface" />
        </>
      ),
    },
  ]

  return (
    <>
      <Section>
        <AccentH2>Phase 1: The Era of Siloed Products (Journeys 1.0)</AccentH2>
        <h3 style={T.h3}>The Context (2021)</h3>
        <p style={T.body}>
          When I joined Sense, the ecosystem was defined by Engage 1.0. While the platform offered powerful capabilities, they operated as "point solutions" — separate tools that solved specific problems but lacked a unified "central nervous system" to pass data between them.
        </p>
      </Section>

      <Section>
        <h3 style={{ ...T.h3, marginTop: 0 }}>1. Journeys 1.0 (Linear Automation)</h3>
        <p style={T.body}><IH>What it did:</IH> The primary automation engine. It allowed recruiters to send linear sequences of emails or SMS based on a trigger (e.g., "Candidate Applied").</p>
        <p style={T.body}><IH>The UX Friction:</IH> It was "Context Blind." A journey was merely a list of events with no native branching logic.</p>
        <p style={T.body}><IH>The "Clutter" Problem:</IH> Because assets weren't reusable, customers had to create hundreds of duplicate touchpoints. Cloning entire workflows resulted in massive, unmanageable systems.</p>
        <CaseStudyScrollableImage src="/illustrations/case-study/phase1/Journeys_1.png" alt="Journeys 1.0 interface" />
      </Section>

      <Section>
        <CaseStudyAccordion items={accordionItems} />
      </Section>

      <Section>
        <h3 style={T.h3}>The Auto-Submission Struggle (The "Before" State)</h3>
        <p style={T.body}>Because these products were silos, Auto-Submission was a manual nightmare. A recruiter had to act as the "human API" connecting these tools:</p>
        <UL>
          <LI><IH>Manual List:</IH> Build a static list of candidates in List Builder using limited filters.</LI>
          <LI><IH>Disconnected Content:</IH> Go to Chatbot Builder, create a new bot from scratch (no reusability), and manually copy the web link.</LI>
          <LI><IH>The Blast:</IH> Move to Messaging to paste that link into a bulk SMS.</LI>
          <LI><IH>The Black Hole:</IH> Once sent, the automation stopped. The recruiter had to manually download CSV reports from the chatbot to find who passed.</LI>
        </UL>
        <CaseStudyCallout>
          <strong>Our Contribution:</strong> We led the design for Chatbot 2.0 and List Builder 2.0. We introduced <strong>Modularity</strong> — redesigning chatbots and lists to be independent "objects" that could be attached to multiple workflows. This was the foundational "Lego block" strategy needed for the advanced automation to come.
        </CaseStudyCallout>
      </Section>

      <Section>
        <h3 style={T.h3}>Reusable Lists</h3>
        <CaseStudyVideo src="https://drive.google.com/file/d/1CfWexUA-bFAf8ASYUU_Tz81Fk_myXNcw/preview?rm=minimal" />
        <h3 style={T.h3}>Reusable Surveys</h3>
        <CaseStudyVideo src="https://drive.google.com/file/d/1YAaiTgEEzGx9ToJD1simXBAVPkC19DVX/preview?rm=minimal" />
      </Section>

      <Section>
        <h3 style={T.h3}>Phase 1 Outcomes — List 2.0 Impact</h3>
        <h4 style={T.h4}>Quantitative Metrics & Adoption</h4>
        <UL>
          <LI><IH>List Adoption:</IH> Achieved <strong>50 active agencies</strong> creating <strong>297 lists</strong> and driving <strong>87 unique workflows</strong> in the first month of release.</LI>
          <LI><IH>Cost Optimization:</IH> Engineering optimizations on the "List DB" instances resulted in immediate monthly cost savings of approximately <strong>$1,900/month per cluster</strong>.</LI>
        </UL>
        <h4 style={T.h4}>Customer Sentiment</h4>
        <UL>
          <LI>The <IH>"ATS List Sync"</IH> feature received high praise as a <em>"game changer"</em> — a <em>"better version of CSV uploads."</em></LI>
          <LI>Addressed the <IH>"Pacific Companies"</IH> use case, significantly reducing the hundreds of duplicate assets customers had to manage.</LI>
        </UL>
      </Section>
    </>
  )
}

function Step3() {
  const nodeAccordion = [
    {
      title: 'Understanding the Nodes',
      content: (
        <>
          <CaseStudyScrollableImage src="/illustrations/case-study/phase2/NodePanel.png" alt="Node panel" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
            <InfoCard title='Action Nodes (The "Doers")'>Modular nodes for SMS, Email, WhatsApp, and Voice — mix communication channels within a single flow.</InfoCard>
            <InfoCard title='Logical Nodes (The "Brains")'>Split, Filter, Foreach, and Delay nodes for conditional branching, audience filtering, batch processing, and time-based control.</InfoCard>
            <InfoCard title='ATS Integrations'>Nodes to update database stages in CRM and write notes to ATS — keeping everything in sync without leaving Sense.</InfoCard>
            <InfoCard title='Smart Nodes'>Voiceflow, Smart Schedule, Candidate Matching, and Job Matching — AI-powered nodes that take intelligent decisions at runtime.</InfoCard>
          </div>
        </>
      ),
    },
  ]

  const limitationsAccordion = [
    {
      title: 'Limitations of Phase 2',
      content: (
        <>
          <p style={T.body}>Despite the architectural success of Workflows, the UX hit a "complexity ceiling" that prevented full democratisation of the tool:</p>
          <LimitationItem title='1. The "Boolean Burden" (Complexity)' imgSrc="/illustrations/case-study/phase2/booleanBurden.png" imgAlt="Boolean Burden" index={0}>
            <p style={T.body}>Creating a precise "Job Match" list required manually constructing complex Boolean strings (e.g., <em>"(Location = SF OR NY) AND (Skills = Java) AND NOT (Status = Placed)"</em>). This alienated average recruiters.</p>
          </LimitationItem>
          <LimitationItem title='2. "Dumb" Logic (Lack of Intelligence)' imgSrc="/illustrations/case-study/phase2/DumbLogic.png" imgAlt="Dumb Logic" index={1}>
            <p style={T.body}>The logic was rigid. A candidate either matched a keyword or they didn't. The system lacked semantic intelligence to understand that a "React Developer" is also a good match for a "Frontend Engineer" role.</p>
          </LimitationItem>
          <LimitationItem title='3. Data Blind Spots' imgSrc="/illustrations/case-study/phase2/Blind.png" imgAlt="Data Blind Spots" index={2}>
            <p style={T.body}>Users struggled to analyse the performance of complex workflows. The dashboard only provided static charts — there was a disconnect between execution (Workflows) and insights (Analytics).</p>
          </LimitationItem>
          <CaseStudyCallout>
            <strong>The Realization:</strong> We had built the "Railroad Tracks" (Workflows), but we needed a "Conductor." This necessitated <strong>Phase 3</strong>, where we introduced the <strong>Intelligence Layer (Ask AI & Jarvis)</strong>.
          </CaseStudyCallout>
        </>
      ),
    },
  ]

  return (
    <>
      <Section>
        <AccentH2>Phase 2: The Unification — Workflow Builder 2.0</AccentH2>
        <h3 style={T.h3}>The Pivot</h3>
        <p style={T.body}>
          To solve the fragmentation of Phase 1, we needed a central nervous system. We led the design of <IH>Workflows (Journey Builder 2.0)</IH>, moving the product from linear, disconnected lists to a visual <IH>Node-Based Canvas</IH>. This became the operating system where all Sense products (Messaging, Voice, Chatbot, Scheduling) converged.
        </p>
        <CaseStudyImage src="/illustrations/case-study/phase2/Workflow_Integrations.png" alt="Workflow integrations unified architecture" />
      </Section>

      <Section>
        <h3 style={T.h3}>The Product Solution: A Scalable Node Architecture</h3>
        <p style={T.body}>We designed a drag-and-drop canvas categorised into three distinct node types to handle enterprise complexity:</p>
        <CaseStudyVideo src="https://drive.google.com/file/d/1iV-QC-l-5P68w3bO4WkKdoedK7me-J8k/preview?rm=minimal" />
        <CaseStudyAccordion items={nodeAccordion} />
      </Section>

      <Section>
        <h3 style={T.h3}>Understanding the User Flows</h3>
        <p style={T.body}>Creating a workflow is intuitive and simple. Let's look at a typical workflow creation-to-activation flow:</p>
        <UserFlowsSelector />
      </Section>

      <Section>
        <h3 style={T.h3}>Solving "Auto-Submission" in Phase 2</h3>
        <p style={T.body}>We transformed the manual, disjointed steps of Phase 1 into a cohesive, automated loop on the canvas:</p>
        <OL>
          <LI><IH>Trigger Node:</IH> "When a New Job is Posted" — listens to ATS data updates.</LI>
          <LI><IH>Job Match Node:</IH> Automatically scans the database for candidates matching the job criteria, replacing manual list building.</LI>
          <LI><IH>Looping Logic:</IH> The system iterates through the matches.</LI>
          <LI><IH>Screening Node:</IH> Triggers an SMS Chatbot or Email to gauge interest.</LI>
          <LI><IH>Writeback Node:</IH> If the candidate responds positively, this node automatically updates the ATS field to "Submitted" — completing the objective without human hands.</LI>
        </OL>
        <CaseStudyScrollableImage src="/illustrations/case-study/phase2/AutoSubmissionFull.png" alt="Auto-Submission workflow Phase 2" />
      </Section>

      <Section>
        <h3 style={T.h3}>Impact & Metrics of Phase 2</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginTop: '16px', marginBottom: '24px' }}>
          <MetricCard value="10M/day" label="Automations capacity (up from 1M)" />
          <MetricCard value="8s" label="Trigger latency (down from 40s)" />
          <MetricCard value="9s" label="Communication latency (down from 72s)" />
          <MetricCard value="97%" label="QoQ workflow growth Q2→Q3 2025" />
        </div>

        <h4 style={T.h4}>Adoption & Usage Velocity</h4>
        <UL>
          <LI><IH>Active workflows:</IH> Reached <strong>1,101</strong> by Q3 2025 — <strong>97% QoQ growth.</strong></LI>
          <LI><IH>Agency penetration:</IH> <strong>199 agencies</strong> had at least one active workflow.</LI>
          <LI><IH>Depth of usage:</IH> Hit target of <strong>10 active journeys per customer</strong>, shifting from one-off blasts to always-on automation.</LI>
          <LI><IH>Migration:</IH> Converted <strong>181</strong> legacy Journeys into <strong>141</strong> Workflows across <strong>29</strong> agencies.</LI>
        </UL>
        <h4 style={T.h4}>Customer Business ROI</h4>
        <UL>
          <LI><IH>Capacity gain (Carvana):</IH> Delivered a <strong>3× increase</strong> in weekly start capacity per recruiter.</LI>
          <LI><IH>Conversion:</IH> Better targeting lifted candidate conversion by <strong>40%.</strong></LI>
          <LI><IH>Satisfaction:</IH> Helped drive a record <strong>96.6% CSAT</strong> in 2025.</LI>
        </UL>
      </Section>

      <Section>
        <CaseStudyAccordion items={limitationsAccordion} />
      </Section>
    </>
  )
}

function Step4() {
  const limitationsAccordion = [
    {
      title: 'Limitations of Phase 3: The "Co-Pilot" Ceiling',
      content: (
        <>
          <p style={T.body}>While Phase 3 made recruiters faster, it did not remove them from the process. Three critical limitations necessitated Phase 4:</p>
          <LimitationItem title='1. Assistive vs. Autonomous (The "Human Bottleneck")' imgSrc="/illustrations/case-study/phase3/Human Bottleneck.png" imgAlt="Human Bottleneck" index={0}>
            <p style={T.body}>Ask AI could <em>write</em> the email, and AI Listers could <em>find</em> the candidates, but a human still had to push the button to launch the campaign. Speed to Lead was still limited by how fast a recruiter could log in and approve.</p>
          </LimitationItem>
          <LimitationItem title='2. The "Execution Gap" (No Sensory Capability)' imgSrc="/illustrations/case-study/phase3/Execution gap.png" imgAlt="Execution Gap" index={1}>
            <p style={T.body}>The AI was text-based and passive. If a candidate replied saying "I'm interested but I cost $100/hr," the Phase 3 system couldn't negotiate or verify that rate via a phone call. It lacked Voice and Judgment capabilities.</p>
          </LimitationItem>
          <LimitationItem title='3. Disconnected Brains' imgSrc="/illustrations/case-study/phase3/DisconnectedBrains.png" imgAlt="Disconnected Brains" index={2}>
            <p style={T.body}>Jarvis knew the data ("Open rates are low"), and Ask AI knew the content ("Here is a better subject line"), but they were disconnected. The recruiter still had to act as middleware between insight and action.</p>
          </LimitationItem>
          <CaseStudyCallout>
            <strong>The Realization:</strong> We didn't just need a "Co-pilot" that offered suggestions; we needed a <strong>"Virtual Employee"</strong> that could do the work itself. This necessitated <strong>Phase 4: Autonomous Agents (Grace, Voice AI).</strong>
          </CaseStudyCallout>
        </>
      ),
    },
  ]

  return (
    <>
      <Section>
        <AccentH2>Phase 3: The Intelligence Layer — Ask AI, Jarvis & AI Listers</AccentH2>
        <h3 style={T.h3}>The Pivot</h3>
        <p style={T.body}>
          By Phase 2, we had successfully built the "central nervous system" (Workflows) that could handle 10 million automations a day. However, users were hitting a cognitive ceiling — tools were powerful but complex. Users struggled to define <em>who</em> to target and <em>how</em> to interpret success.
        </p>
        <p style={T.body}>
          To bridge this gap, we designed the <IH>Intelligence Layer</IH> — a suite of Generative and Analytical AI tools designed to act as "Co-pilots" for the recruiter.
        </p>
      </Section>

      <Section>
        <h3 style={T.h3}>1. Ask AI (The Creative Assistant)</h3>
        <p style={T.body}><IH>The Problem:</IH> Recruiters often suffered from "writer's block" when building workflows, resulting in generic, low-converting messages.</p>
        <p style={T.body}><IH>The Solution:</IH> We integrated a Generative AI assistant directly into the Workflow Canvas to assist with drafting job descriptions, generating role-specific pre-screening questions, and rewriting SMS content to be more conversational.</p>
        <p style={T.body}><IH>Impact on Auto-Submission:</IH> Ask AI directly improved the Screening Node by automating the generation of "job-specific screening questions." Instead of sending a generic message, the AI analysed the Job Description to generate precise qualification questions — accelerating the qualification process for auto-submitting candidates.</p>
        <h4 style={T.h4}>Defining Interactions First</h4>
        <CaseStudyVideo src="https://drive.google.com/file/d/1RSDoNdp74b0T-6-8ZVET3cZ2s93k5Cs9/preview?rm=minimal" />
        <CaseStudyVideo src="https://drive.google.com/file/d/1NsQaTAubzZUK_zsVsWR0fhioJkkIjoUt/preview?rm=minimal" />
      </Section>

      <Section>
        <h3 style={T.h3}>2. AI Lister Agent (Solving the "Boolean Burden")</h3>
        <p style={T.body}><IH>The Problem:</IH> In Phase 2, creating a precise "Job Match" list required manually constructing complex Boolean strings, alienating non-technical recruiters.</p>
        <p style={T.body}><IH>The Solution:</IH> We designed a <IH>Conversational UI</IH> where users could simply type natural language intents.</p>
        <UL>
          <LI><IH>User Input:</IH> "Find me Java Developers in SF available now who haven't been contacted in 6 months."</LI>
          <LI><IH>AI Action:</IH> The agent translates this intent into the rigid database query logic automatically — reducing list creation from minutes to seconds.</LI>
        </UL>
        <CaseStudyVideo src="https://drive.google.com/file/d/1klwvpTs2Q73TmuaQwftpxG39Z0s5U2Um/preview?rm=minimal" />
      </Section>

      <Section>
        <h3 style={T.h3}>3. Jarvis (The Data Agent)</h3>
        <p style={T.body}><IH>The Problem:</IH> Analytics were static. Users couldn't diagnose <em>why</em> a workflow was failing without exporting data to Excel.</p>
        <p style={T.body}><IH>The Solution:</IH> We designed the interaction model for <IH>Jarvis</IH>, a conversational analytics agent. Instead of navigating complex dashboards, users could ask: <em>"Why is my Auto-Submission workflow failing?"</em> — and get instant diagnostic insights.</p>
        <p style={T.body}><IH>Impact on Auto-Submission:</IH> Recruiters could ask "Show me the conversion rate from Match to Submission" — instantly identifying drop-off at the outreach or screening stage, enabling rapid optimisation.</p>
        <CaseStudyVideo src="https://drive.google.com/file/d/1snDLVyUYkW8idSWXFm9cMTUIB4sg1W1c/preview?rm=minimal" />
      </Section>

      <Section>
        <CaseStudyAccordion items={limitationsAccordion} />
      </Section>
    </>
  )
}

function Step5() {
  return (
    <>
      <Section>
        <AccentH2>Phase 4: The Agentic Shift — AI Recruiter & Voice Agents</AccentH2>
        <h3 style={T.h3}>The Final Evolution</h3>
        <p style={T.body}>
          The goal was to move from <em>automation</em> (doing what you are told) to <em>agency</em> (making decisions). This phase introduced the <IH>Agentic World</IH> — transitioning from linear workflows to a dynamic ecosystem of specialised agents.
        </p>
        <CaseStudyImage src="/illustrations/case-study/phase4/FullyAutonomous flow.png" alt="Fully Autonomous Flow diagram" />
      </Section>

      <Section>
        <h3 style={T.h3}>Step 1: The Foundation — Multimodal Agent Builder</h3>
        <p style={T.body}><IH>The Problem:</IH> Legacy bots were rigid. If a candidate on SMS said "Can you call me?", the bot would break because it lacked memory or voice capabilities.</p>
        <p style={T.body}><IH>The Solution:</IH> I led the design of the <IH>Agent Builder</IH>, a no-code interface that allows "Architects" to build Multimodal Chat+Voice Agents.</p>
        <UL>
          <LI><IH>Block-Based Architecture:</IH> "Blocks" (e.g., Job Match Block, Scheduling Block) that encapsulate complex logic.</LI>
          <LI><IH>Context Store:</IH> The critical innovation — retaining memory across channels. If a candidate ignores an SMS, the agent can autonomously switch to Voice, knowing exactly where the conversation left off.</LI>
          <LI><IH>Dynamic Flow:</IH> Unlike the linear paths of Phase 2, these agents use an Agentic Orchestration Framework to autonomously decide the next best step.</LI>
        </UL>
        <CaseStudyVideo src="https://drive.google.com/file/d/1Fj-rjo3MOC_bf_RCpqEILvaC5yejlF7g/preview?rm=minimal" />
      </Section>

      <Section>
        <h3 style={T.h3}>Step 2: The Orchestrator — "Grace" (AI Recruiter)</h3>
        <p style={T.body}>With the sub-agents built, we needed a manager. We introduced <IH>Grace (The AI Recruiter)</IH> as the central orchestrator that commands this virtual workforce.</p>
        <CaseStudyImage src="/illustrations/case-study/phase4/HeroImage.png" alt="Grace AI Recruiter" />
        <p style={T.body}><IH>The Concept:</IH> "One Recruiter with the Power of a Team." Grace doesn't just do the work — she delegates it.</p>

        <h4 style={T.h4}>Discover Agent (The Sourcer)</h4>
        <UL>
          <LI>Uses Deep Match logic to rank candidates based on skills, location, and availability.</LI>
          <LI>Processes candidates in batches and features "Goal-based Exit" logic — stops searching once enough qualified candidates are found.</LI>
          <LI>Supports advanced filters like Zip Code Radius for remote jobs.</LI>
        </UL>
        <CaseStudyImage src="/illustrations/case-study/phase4/discover.png" alt="Discover Agent" />

        <h4 style={T.h4}>Voice Agent (The Screener)</h4>
        <UL>
          <LI>Handles the phone screen — moves from "calls" to "conversations."</LI>
          <LI>Dynamically analyses the transcript to determine call status (Consented, Hung Up, Voicemail), scheduling up to 3 retries with configurable delays.</LI>
          <LI>Dynamic Question Module (DQM) reads the Job Description to auto-generate role-specific questions.</LI>
        </UL>
        <CaseStudyImage src="/illustrations/case-study/phase4/Evaluation.png" alt="Voice Agent" />

        <h4 style={T.h4}>Evaluation Agent (The Judge)</h4>
        <UL>
          <LI>Analyses output from the Voice Agent and assigns a Fit Score (1–10).</LI>
          <LI>Supports three modes: Resume only, Voice Transcript only, or holistic Resume + Voice analysis.</LI>
          <LI>If the score meets the threshold (e.g., 8/10), triggers an Object Writeback to automatically create the submission record in the ATS — no human data entry required.</LI>
        </UL>
        <CaseStudyImage src="/illustrations/case-study/phase4/Evaluation Summary.png" alt="Evaluation Agent" />
      </Section>

      <Section>
        <h3 style={T.h3}>Step 3: Solving "Auto-Submission" in the Agentic World</h3>
        <p style={T.body}>We transformed Auto-Submission from a "workflow" into a fully autonomous loop:</p>
        <OL>
          <LI><IH>Trigger (The Watcher):</IH> Grace detects a "New Job Order" in the ATS.</LI>
          <LI><IH>Sourcing (The Hand-off):</IH> Grace activates the Discover Agent to fetch the top 50 matches.</LI>
          <LI><IH>Engagement (Multimodal):</IH> Grace deploys the Multimodal Agent. If a candidate on SMS says "Call me," the agent autonomously switches to Voice, initiates the call, and conducts the pre-screen.</LI>
          <LI><IH>Decision (The Closer):</IH> The Evaluation Agent reads the transcript. IF Score &gt; 8/10 AND Interest = High → THEN trigger "Create ATS Record." The candidate is submitted to the Hiring Manager without a human recruiter ever logging in.</LI>
        </OL>
        <CaseStudyVideo src="https://drive.google.com/file/d/18WJF2KzUEE3VJlJRuMJpZ0yYM5sPwbUb/preview?rm=minimal" />
      </Section>

      <Section>
        <h3 style={T.h3}>Phase 4 Outcomes & Impact</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <MetricCard value="11.1 hrs" label="Time to fill a hard role (BGSF)" />
          <MetricCard value="20/100" label="Qualified evaluations per candidates" />
          <MetricCard value="60%" label="Cold calls lasting over 8 minutes" />
          <MetricCard value="$5M" label="Booked ARR tracked" />
        </div>
        <UL>
          <LI><IH>Unprecedented Speed:</IH> For client BGSF, the AI Recruiter placed a hard-to-fill role in just <strong>11.1 hours</strong>. The system achieved a <strong>2-minute engagement time</strong> after application and completed screening within <strong>7 minutes</strong>.</LI>
          <LI><IH>Quality Benchmark:</IH> The AI Agent is finding <strong>20 qualified evaluations per 100 candidates</strong> — outperforming the average human recruiter.</LI>
          <LI><IH>Productivity:</IH> Saved <strong>50,000+ hours</strong> of manager time for HCA (Healthcare).</LI>
          <LI><IH>Scheduling Scale:</IH> <strong>404,507 meetings</strong> scheduled YTD — a <strong>175% increase</strong> year-over-year.</LI>
        </UL>
      </Section>
    </>
  )
}

function Step6() {
  return (
    <>
      <Section>
        <AccentH2>Outcomes & Impact</AccentH2>
        <p style={T.body}>
          By evolving <IH>Auto-Submission</IH> from a manual task to an <IH>agentic workflow</IH>, we achieved measurable results across <IH>speed</IH>, <IH>scale</IH>, and <IH>candidate experience</IH>.
        </p>
        <CaseStudyImage src="/illustrations/case-study/phase4/Summary.png" alt="Summary of outcomes and impact" />
      </Section>

      <Section>
        <h3 style={T.h3}>2025–2026 Strategic Wins</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Unprecedented Speed to Lead', desc: 'For client BGSF, the AI Recruiter placed a hard-to-fill role in just 11.1 hours from application to hire.' },
            { title: 'Operational Transformation', desc: 'The ecosystem saved 50,000+ hours of manager time for HCA, equivalent to dozens of full-time employees.' },
            { title: 'Brand Reputation', desc: 'Helped TalentBurst flip their Glassdoor rating from 2.0 to 4.2, turning candidate sentiment into a competitive advantage.' },
            { title: 'Referral Velocity', desc: 'Drove 107 referrals in just 45 days for Dietitians On Demand, proving the system can generate its own pipeline.' },
            { title: 'Capacity Multiplier', desc: 'Carvana achieved a 3× increase in weekly start capacity per recruiter by utilising the full automation suite.' },
            { title: 'Enterprise Adoption', desc: 'The AI Recruiter product line has tracked toward $4.6M in Post-Pilot ARR.' },
          ].map((c, i) => <InfoCard key={i} title={c.title}>{c.desc}</InfoCard>)}
        </div>
      </Section>

      <Section>
        <h3 style={T.h3}>General Business ROI</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
          <MetricCard value="30–81%" label="Reduction in Time-to-Hire" />
          <MetricCard value="30%" label="Increase in recruiter productivity" />
          <MetricCard value="1M+" label="Candidates engaged per year" />
          <MetricCard value="96.6%" label="CSAT score in 2025" />
        </div>
      </Section>

      <Section>
        <h3 style={T.h3}>AI Agent Performance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Rapid Evaluation', desc: 'Reduced "Time to Evaluate" a candidate to just 33 minutes from application to scored evaluation.' },
            { title: 'Quality Benchmark', desc: '20 qualified evaluations per 100 candidates — outperforming the average human recruiter.' },
            { title: 'Funnel Optimisation', desc: 'In one live example: 12,821 matches → 3,699 contacted → 127 screened → 15 influenced placements.' },
            { title: 'Scheduling Scale', desc: '404,507 meetings scheduled YTD — a 175% increase year-over-year.' },
          ].map((c, i) => <InfoCard key={i} title={c.title}>{c.desc}</InfoCard>)}
        </div>
      </Section>

      <Section>
        <AccentH2>Conclusion: From Tools to Teammates</AccentH2>
        <p style={T.body}>
          The evolution of the Sense platform from <IH>Journeys 1.0</IH> to the <IH>AI Recruiter</IH> represents a fundamental paradigm shift in product design: moving from building tools that users operate to designing digital teammates that operate themselves.
        </p>

        <h3 style={T.h3}>1. Solving the "Black Hole" of Communication</h3>
        <p style={T.body}>
          By transitioning from manual "blasts" (Phase 1) to "Action-Based Targeting" (Phase 2) and finally to "Autonomous Agents" (Phase 4), we ensured that every candidate receives a personalised, instant response — whether via text, email, or a voice call.
        </p>

        <h3 style={T.h3}>2. The "Glass Box" Design Philosophy</h3>
        <p style={T.body}>
          A critical design challenge was ensuring that as the system became more intelligent, it didn't become a "black box" that recruiters feared. By visualising the AI's logic (Voice flows, Evaluation scores, and Branching paths) directly on the Workflow Canvas, I maintained user trust. Recruiters aren't replaced; they are elevated to <IH>supervisors</IH> who manage the AI's strategy rather than executing its tasks.
        </p>

        <h3 style={T.h3}>3. Future Vision: True Agentic AIR</h3>
        <p style={T.body}>
          This case study documents the foundation for Sense's vision of "True Agentic AIR" (Humanized Grace) by 2026. We have successfully moved from <IH>automation (efficiency)</IH> to <IH>orchestration (intelligence)</IH>. The systems we designed — the interplay between Workflow infrastructure and specialised sub-agents like Voice and Jarvis — have paved the way for a future where AI handles the entire operational lifecycle, allowing human recruiters to focus entirely on building relationships.
        </p>
        <CaseStudyImage src="/illustrations/case-study/phase4/Future.png" alt="Future vision of agentic AI" />
      </Section>
    </>
  )
}

const STEP_COMPONENTS = [Step1, Step2, Step3, Step4, Step5, Step6]

/* ─────────────────────────────────────────────────────────────
   Main CaseStudyPage
───────────────────────────────────────────────────────────── */
export default function CaseStudyPage({ onClose }) {
  const [step, setStep] = useState(1)
  const contentRef = useRef(null)

  const goToStep = (s) => {
    setStep(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const StepContent = STEP_COMPONENTS[step - 1]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgb(234,232,225)',
        overflowY: 'auto',
        fontFamily: "'Inter', sans-serif",
      }}
      ref={contentRef}
    >
      {/* Top bar — frosted glass with step name */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          background: 'rgba(234,232,225,0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <button
          onClick={onClose}
          className="cs-back-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '999px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#333',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#111' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#333'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to Portfolio
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#999', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Case Study
          </span>
          <span style={{ width: '1px', height: '12px', background: '#ddd' }} />
          <span style={{ fontSize: '11px', fontWeight: 500, color: '#777', letterSpacing: '0.02em' }}>
            {STEPS[step - 1].label}
          </span>
        </div>
      </div>

      {/* Stepper (below top bar) */}
      <div style={{ paddingTop: '56px' }}>
        <Stepper current={step} onChange={goToStep} />
      </div>

      {/* Content with fade-in animation */}
      <div
        key={step}
        className="cs-step-content"
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '56px 32px 80px',
          animation: 'caseStudyFadeIn 0.5s cubic-bezier(0.33, 1, 0.68, 1) forwards',
        }}
      >
        <StepContent />
        <StepNav current={step} total={STEPS.length} onChange={goToStep} />
      </div>

      {/* Responsive + animation styles */}
      <style>{`
        @media (max-width: 640px) {
          .limitation-item { grid-template-columns: 1fr !important; }
          .hero-usecase-grid { grid-template-columns: 1fr !important; }
        }
        .cs-nav-btn-next:hover .cs-nav-arrow {
          transform: translateX(3px) !important;
        }
        .cs-media-frame:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  )
}
