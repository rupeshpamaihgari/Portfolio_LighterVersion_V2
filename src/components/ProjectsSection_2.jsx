import { useState, useEffect, useRef, useCallback } from 'react'
import useInView from '../hooks/useInView'

// ── Tab definitions ────────────────────────────────────────────────────────
const CATEGORY_TABS = [
  { id: 'ai-agents',      label: 'AI Agents' },
  { id: 'automations',    label: 'Automations' },
  { id: 'analytics',      label: 'Analytics' },
  { id: 'design-system',  label: 'Design System' },
  { id: 'mobile',         label: 'Mobile' },
  { id: 'arvr',           label: 'AR/VR' },
]

const PLACEHOLDER_TABS = {
  automations:    { tagline: 'Workflow automation across the recruiting lifecycle.', projects: ['Workflows', 'List Builder', 'Surveys'] },
  analytics:      { tagline: 'Dashboards that turn data into decisions.', projects: ['Landing Dashboard', 'Survey Analytics', 'Voiceflows', 'Redeployments', 'AI Recruiter'] },
  'design-system': { tagline: 'A shared language of components, tokens, and patterns.', projects: ['Form Components', 'Colors & Typography', 'AI Components'] },
  mobile:         { tagline: 'Native-feeling apps for the modern workforce.', projects: ['Betterjobs', 'Attendance App'] },
  arvr:           { tagline: 'Spatial computing experiences from hackathons to enterprise.', projects: ['Hololens-Automated Home Designer', "Bayer's Digital Label", 'Alina-Intelligent Assistant', 'Accudrive-DriverAssistant', 'Game - Where is my way'] },
}

// ── AI Agents data ─────────────────────────────────────────────────────────
const AI_AGENTS_METRICS = [
  { value: '30–81%',   label: 'Reduction in time-to-hire' },
  { value: '1M+',      label: 'Candidates engaged per year' },
  { value: '96.6%',    label: 'CSAT score 2025' },
  { value: '50K+ hrs', label: 'Manager time saved (HCA)' },
  { value: '404K',     label: 'Meetings scheduled YTD' },
  { value: '$4.6M',    label: 'Post-Pilot ARR' },
]

const AGENT_PROJECTS = {
  center:    { name: 'AI Recruiter',    subtitle: 'The Orchestrator',   desc: 'End-to-end autonomous recruiting — coordinates all agents from sourcing to placement, managing the full candidate journey without human intervention.' },
  senseiq:   { name: 'SenseIQ',         subtitle: 'Intelligence Layer', desc: 'Scores and ranks candidates using behavioural signals, fit analysis, and historical hiring data — surfacing the best matches instantly.' },
  listbuild: { name: 'List Builder',    subtitle: 'Sourcing Agent',     desc: 'Autonomously builds targeted candidate lists from multiple job boards and talent databases, keeping pipelines full without manual sourcing effort.' },
  data:      { name: 'Data Agent',      subtitle: 'Data Pipeline',      desc: 'Cleans, enriches, and structures raw candidate data for downstream agent consumption — ensuring every agent works from a single source of truth.' },
  voice:     { name: 'Voice Agent',     subtitle: 'Screening Agent',    desc: 'Conducts AI-powered phone screens, transcribes responses, and surfaces key evaluation signals — enabling 24/7 candidate engagement at scale.' },
  screen:    { name: 'Screening Agent', subtitle: 'Evaluation Agent',   desc: 'Runs structured evaluations — achieving 20 qualified evaluations per 100 candidates, consistently outperforming average human recruiter benchmarks.' },
}

// ── Blob network geometry ──────────────────────────────────────────────────
const CX = 250
const CY = 250
const ORBIT_R = 158

const toRad = (deg) => deg * Math.PI / 180
const restX  = (deg) => CX + ORBIT_R * Math.cos(toRad(deg))
const restY  = (deg) => CY + ORBIT_R * Math.sin(toRad(deg))

const SATELLITE_NODES = [
  { id: 'senseiq',   label: 'SenseIQ',         icon: '🧠', angleDeg: 300,
    color: { light: '#ddeeff', mid: '#B8D4F8', dark: '#7aaee8' },
    tooltip: 'Scores and ranks candidates using behavioural signals and fit analysis.' },
  { id: 'listbuild', label: 'List Builder',     icon: '📋', angleDeg: 218,
    color: { light: '#d4fce8', mid: '#B8F4D4', dark: '#7adcaa' },
    tooltip: 'Builds targeted candidate lists from multiple job boards autonomously.' },
  { id: 'data',      label: 'Data Agent',       icon: '⚡', angleDeg: 158,
    color: { light: '#fdf2c4', mid: '#F8E4A0', dark: '#e8c84a' },
    tooltip: 'Cleans and enriches raw candidate data for downstream agent consumption.' },
  { id: 'voice',     label: 'Voice Agent',      icon: '🎙', angleDeg: 108,
    color: { light: '#fdddd4', mid: '#F4A58A', dark: '#e07858' },
    tooltip: 'Conducts AI-powered phone screens and surfaces key evaluation signals.' },
  { id: 'screen',    label: 'Screening',        icon: '✅', angleDeg: 28,
    color: { light: '#ecdeff', mid: '#D4B8F8', dark: '#b080f0' },
    tooltip: 'Runs structured evaluations — 20 qualified candidates per 100 applicants.' },
]

const CENTER_NODE = {
  id: 'center', label: 'AI Recruiter', icon: '🤖',
  tooltip: 'Orchestrates all sub-agents to deliver end-to-end autonomous recruiting.',
}

// ── 3D blob style helpers ──────────────────────────────────────────────────
const darkBlobStyle = (selected, hovered) => ({
  background: 'radial-gradient(circle at 38% 30%, #666 0%, #1c1c1c 45%, #000 100%)',
  boxShadow: hovered || selected
    ? 'inset 0 2px 10px rgba(255,255,255,0.14), 0 0 0 3px rgba(0,0,0,0.18), 0 16px 48px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.3)'
    : 'inset 0 2px 8px rgba(255,255,255,0.10), 0 12px 36px rgba(0,0,0,0.38), 0 3px 10px rgba(0,0,0,0.22)',
})

const lightBlobStyle = (selected, hovered, color) => ({
  background: selected
    ? 'radial-gradient(circle at 38% 30%, #666 0%, #1c1c1c 45%, #000 100%)'
    : `radial-gradient(circle at 38% 30%, ${color.light} 0%, ${color.mid} 55%, ${color.dark} 100%)`,
  border: selected ? 'none' : `1.5px solid ${color.dark}44`,
  boxShadow: hovered
    ? `inset 0 -4px 10px rgba(0,0,0,0.08), 0 0 0 3px ${color.mid}88, 0 10px 32px ${color.mid}66`
    : selected
      ? 'inset 0 2px 8px rgba(255,255,255,0.10), 0 0 0 3px rgba(0,0,0,0.15), 0 12px 32px rgba(0,0,0,0.3)'
      : `inset 0 -3px 8px rgba(0,0,0,0.06), 0 6px 20px ${color.mid}55`,
})

// ── Tooltip ────────────────────────────────────────────────────────────────
function NodeTooltip({ text, isDark }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 'calc(100% + 14px)',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#fff',
      borderRadius: '12px',
      padding: '10px 14px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.14)',
      width: '178px',
      pointerEvents: 'none',
      zIndex: 20,
      animation: 'tooltipIn 0.18s cubic-bezier(0.33,1,0.68,1) forwards',
    }}>
      <p style={{ fontSize: '11.5px', color: '#333', lineHeight: 1.5, marginBottom: '5px', fontWeight: 500 }}>
        {text}
      </p>
      <p style={{ fontSize: '10px', color: '#999', fontWeight: 600, letterSpacing: '0.03em' }}>
        Click to view project details
      </p>
      {/* Arrow */}
      <div style={{
        position: 'absolute', top: '100%', left: '50%',
        transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderTop: '7px solid #fff',
        filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.06))',
      }} />
    </div>
  )
}

// ── BlobNetwork ────────────────────────────────────────────────────────────
// outerRef: the wider container (whole two-col section) for mouse tracking
function BlobNetwork({ selectedNode, onSelectNode, outerRef }) {
  const containerRef  = useRef(null)
  const nodesRef      = useRef([])
  const lineRefs      = useRef([])
  const rafRef        = useRef(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [centerScale, setCenterScale] = useState(1)
  const centerScaleRef = useRef(1)
  const centerHoveredRef = useRef(false)
  const centerElRef = useRef(null)
  const centerRafRef = useRef(null)

  // Initialise mutable satellite node state
  useEffect(() => {
    nodesRef.current = SATELLITE_NODES.map(n => ({
      restX:        restX(n.angleDeg),
      restY:        restY(n.angleDeg),
      currentX:     restX(n.angleDeg),
      currentY:     restY(n.angleDeg),
      targetX:      restX(n.angleDeg),
      targetY:      restY(n.angleDeg),
      currentScale: 1,
      hovered:      false,
      el:           null,
    }))
  }, [])

  // Center node scale via its own rAF
  const startCenterRaf = useCallback(() => {
    const tick = () => {
      const target = centerHoveredRef.current ? 1.12 : 1.0
      centerScaleRef.current += (target - centerScaleRef.current) * 0.14
      if (centerElRef.current) {
        centerElRef.current.style.transform = `translate(-50%, -50%) scale(${centerScaleRef.current.toFixed(4)})`
      }
      if (Math.abs(target - centerScaleRef.current) > 0.003) {
        centerRafRef.current = requestAnimationFrame(tick)
      } else {
        centerRafRef.current = null
      }
    }
    if (!centerRafRef.current) centerRafRef.current = requestAnimationFrame(tick)
  }, [])

  const startRaf = useCallback(() => {
    const tick = () => {
      let settled = true
      nodesRef.current.forEach((node, i) => {
        node.currentX += (node.targetX - node.currentX) * 0.12
        node.currentY += (node.targetY - node.currentY) * 0.12
        const targetScale = node.hovered ? 1.18 : 1.0
        node.currentScale += (targetScale - node.currentScale) * 0.14

        if (
          Math.abs(node.targetX - node.currentX) > 0.1 ||
          Math.abs(node.targetY - node.currentY) > 0.1 ||
          Math.abs(targetScale - node.currentScale) > 0.004
        ) settled = false

        const offsetX = node.currentX - node.restX
        const offsetY = node.currentY - node.restY
        if (node.el) {
          node.el.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${node.currentScale.toFixed(4)})`
        }
        // Update SVG line endpoint
        const line = lineRefs.current[i]
        if (line) {
          line.setAttribute('x2', node.currentX.toFixed(2))
          line.setAttribute('y2', node.currentY.toFixed(2))
        }
      })
      if (!settled) { rafRef.current = requestAnimationFrame(tick) }
      else          { rafRef.current = null }
    }
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    const outer = outerRef?.current
    if (!outer) return

    const handleMouseMove = (e) => {
      // Map viewport cursor to blob network's 500×500 logical space
      const blobRect = containerRef.current?.getBoundingClientRect()
      if (!blobRect) return
      const scaleX = 500 / blobRect.width
      const scaleY = 500 / blobRect.height
      const mx = (e.clientX - blobRect.left)  * scaleX
      const my = (e.clientY - blobRect.top)   * scaleY

      nodesRef.current.forEach(node => {
        const dx = mx - node.restX
        const dy = my - node.restY
        let tx = node.restX + dx * 0.08
        let ty = node.restY + dy * 0.08
        const dispX = tx - node.restX
        const dispY = ty - node.restY
        const dist  = Math.sqrt(dispX * dispX + dispY * dispY)
        if (dist > 22) { const s = 22 / dist; tx = node.restX + dispX * s; ty = node.restY + dispY * s }
        node.targetX = tx
        node.targetY = ty
      })
      startRaf()
    }

    const handleMouseLeave = () => {
      nodesRef.current.forEach(node => { node.targetX = node.restX; node.targetY = node.restY })
      startRaf()
    }

    outer.addEventListener('mousemove', handleMouseMove, { passive: true })
    outer.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      outer.removeEventListener('mousemove', handleMouseMove)
      outer.removeEventListener('mouseleave', handleMouseLeave)
      if (rafRef.current)       cancelAnimationFrame(rafRef.current)
      if (centerRafRef.current) cancelAnimationFrame(centerRafRef.current)
    }
  }, [outerRef, startRaf])

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '500px', height: '500px', flexShrink: 0 }}
    >
      {/* SVG connection lines */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
        viewBox="0 0 500 500"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="lineGrad" cx="0%" cy="0%" r="100%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.06)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
          </radialGradient>
        </defs>
        {SATELLITE_NODES.map((node, i) => (
          <line
            key={node.id}
            ref={el => { lineRefs.current[i] = el }}
            x1={CX} y1={CY}
            x2={restX(node.angleDeg)}
            y2={restY(node.angleDeg)}
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="1.5"
            strokeDasharray="4 7"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Center node — AI Recruiter */}
      <div
        ref={centerElRef}
        onClick={() => onSelectNode('center')}
        onMouseEnter={() => {
          centerHoveredRef.current = true
          setHoveredId('center')
          startCenterRaf()
          // brighten all lines
          lineRefs.current.forEach(l => {
            l?.setAttribute('stroke', 'rgba(0,0,0,0.35)')
            l?.setAttribute('stroke-dasharray', '4 5')
          })
        }}
        onMouseLeave={() => {
          centerHoveredRef.current = false
          setHoveredId(null)
          startCenterRaf()
          lineRefs.current.forEach(l => {
            l?.setAttribute('stroke', 'rgba(0,0,0,0.18)')
            l?.setAttribute('stroke-dasharray', '4 7')
          })
        }}
        style={{
          position: 'absolute',
          left: `${CX}px`, top: `${CY}px`,
          transform: 'translate(-50%, -50%)',
          width: '120px', height: '120px',
          borderRadius: '50%',
          ...darkBlobStyle(selectedNode === 'center', hoveredId === 'center'),
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 3, cursor: 'pointer',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <span style={{ fontSize: '26px', lineHeight: 1, marginBottom: '5px' }}>
          {CENTER_NODE.icon}
        </span>
        <span style={{
          color: '#fff', fontSize: '10.5px', fontWeight: 700,
          textAlign: 'center', lineHeight: 1.25, padding: '0 8px', letterSpacing: '0.02em',
        }}>
          AI Recruiter
        </span>
        {hoveredId === 'center' && (
          <NodeTooltip text={CENTER_NODE.tooltip} isDark />
        )}
      </div>

      {/* Satellite nodes */}
      {SATELLITE_NODES.map((node, i) => {
        const isSelected = selectedNode === node.id
        const isHovered  = hoveredId === node.id
        return (
          <div
            key={node.id}
            ref={el => {
              if (nodesRef.current[i]) nodesRef.current[i].el = el
            }}
            onClick={() => onSelectNode(node.id)}
            onMouseEnter={() => {
              nodesRef.current[i].hovered = true
              setHoveredId(node.id)
              lineRefs.current[i]?.setAttribute('stroke', 'rgba(0,0,0,0.55)')
              lineRefs.current[i]?.setAttribute('stroke-width', '2')
              lineRefs.current[i]?.setAttribute('stroke-dasharray', '4 4')
              startRaf()
            }}
            onMouseLeave={() => {
              nodesRef.current[i].hovered = false
              setHoveredId(null)
              lineRefs.current[i]?.setAttribute('stroke', 'rgba(0,0,0,0.18)')
              lineRefs.current[i]?.setAttribute('stroke-width', '1.5')
              lineRefs.current[i]?.setAttribute('stroke-dasharray', '4 7')
              startRaf()
            }}
            style={{
              position: 'absolute',
              left: `${restX(node.angleDeg)}px`,
              top:  `${restY(node.angleDeg)}px`,
              transform: 'translate(-50%, -50%)',
              width: '86px', height: '86px',
              borderRadius: '50%',
              ...lightBlobStyle(isSelected, isHovered, node.color),
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              zIndex: 2, cursor: 'pointer',
              transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
              willChange: 'transform',
            }}
          >
            <span style={{ fontSize: '20px', lineHeight: 1, marginBottom: '4px' }}>
              {node.icon}
            </span>
            <span style={{
              fontSize: '9.5px', fontWeight: 700,
              color: isSelected ? '#fff' : '#1a1a1a',
              textAlign: 'center', padding: '0 5px', lineHeight: 1.2,
              letterSpacing: '0.01em',
              transition: 'color 0.3s ease',
            }}>
              {node.label}
            </span>
            {isHovered && <NodeTooltip text={node.tooltip} />}
          </div>
        )
      })}
    </div>
  )
}

// ── Metric card ────────────────────────────────────────────────────────────
function MetricCard({ value, label }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '20px 22px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    }}>
      <div style={{
        fontSize: '26px', fontWeight: 700,
        letterSpacing: '-0.03em', color: '#111',
        lineHeight: 1, marginBottom: '6px',
      }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: '#888', fontWeight: 500, lineHeight: 1.4 }}>
        {label}
      </div>
    </div>
  )
}

// ── Right panel — overview ─────────────────────────────────────────────────
function OverviewPanel({ onOpenCaseStudy }) {
  return (
    <div style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.33,1,0.68,1) forwards' }}>
      <p style={{
        fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: '#999', marginBottom: '12px',
      }}>
        AI Agents · SenseHQ
      </p>
      <h2 style={{
        fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 400,
        letterSpacing: '-0.03em', lineHeight: 1.1, color: '#111', marginBottom: '16px',
      }}>
        AI Recruiter Ecosystem
      </h2>
      <p style={{
        fontSize: '15px', lineHeight: 1.7, color: '#555',
        letterSpacing: '-0.01em', marginBottom: '28px', maxWidth: '460px',
      }}>
        An orchestrated network of specialised agents — from data sourcing to voice screening — that transformed manual recruiting into autonomous talent acquisition.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '28px' }}>
        {AI_AGENTS_METRICS.map(m => <MetricCard key={m.label} {...m} />)}
      </div>
      <button
        className="btn-dark"
        onClick={onOpenCaseStudy}
        style={{ fontSize: '14px', padding: '12px 28px' }}
      >
        Read Full Case Study →
      </button>
    </div>
  )
}

// ── Right panel — node detail ──────────────────────────────────────────────
function DetailPanel({ nodeId, onBack }) {
  const project = AGENT_PROJECTS[nodeId]
  if (!project) return null
  return (
    <div key={nodeId} style={{ animation: 'slideInRight 0.4s cubic-bezier(0.33,1,0.68,1) forwards' }}>
      <button
        onClick={onBack}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '13px', fontWeight: 600, color: '#999',
          letterSpacing: '-0.01em', marginBottom: '24px',
          padding: 0, display: 'flex', alignItems: 'center', gap: '6px',
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#111'}
        onMouseLeave={e => e.currentTarget.style.color = '#999'}
      >
        ← All Agents
      </button>
      <p style={{
        fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: '#999', marginBottom: '10px',
      }}>
        {project.subtitle}
      </p>
      <h2 style={{
        fontSize: 'clamp(32px, 3.5vw, 52px)', fontWeight: 400,
        letterSpacing: '-0.035em', lineHeight: 1.05, color: '#111', marginBottom: '20px',
      }}>
        {project.name}
      </h2>
      <p style={{
        fontSize: '16px', lineHeight: 1.75, color: '#555',
        letterSpacing: '-0.01em', marginBottom: '36px', maxWidth: '480px',
      }}>
        {project.desc}
      </p>
      <div style={{
        background: '#fff', borderRadius: '20px', padding: '24px 28px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: '28px',
      }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#bbb', marginBottom: '10px' }}>
          Role in the system
        </p>
        <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#444' }}>
          {nodeId === 'center'
            ? 'Orchestrates all sub-agents, manages state across the pipeline, and makes final placement decisions.'
            : 'Feeds outputs to the AI Recruiter orchestrator, contributing a specialised capability to the end-to-end hiring flow.'}
        </p>
      </div>
      <button
        className="btn-dark"
        style={{ fontSize: '13px', padding: '11px 24px', opacity: 0.9 }}
        onClick={onBack}
      >
        ← View All Agents
      </button>
    </div>
  )
}

// ── AI Agents tab ──────────────────────────────────────────────────────────
function AIAgentsTab({ onOpenCaseStudy }) {
  const [selectedNode, setSelectedNode]   = useState(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const outerRef = useRef(null)  // covers both columns — full mouse tracking area

  const handleSelectNode = (id) => { setSelectedNode(id); setHasInteracted(true) }
  const handleBack = () => setSelectedNode(null)

  return (
    <div
      ref={outerRef}
      style={{ display: 'flex', gap: '48px', alignItems: 'center' }}
      className="flex-col md:flex-row"
    >
      {/* Left: blob network + hint — hidden on small screens */}
      <div className="hidden md:flex" style={{ flexDirection: 'column', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        <BlobNetwork
          selectedNode={selectedNode}
          onSelectNode={handleSelectNode}
          outerRef={outerRef}
        />
        <p style={{
          fontSize: '12px', fontWeight: 500, color: '#aaa',
          letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px',
          opacity: hasInteracted ? 0 : 1,
          transition: 'opacity 0.7s ease',
          pointerEvents: 'none', userSelect: 'none',
        }}>
          <span style={{ fontSize: '14px' }}>👆</span>
          Click any agent to explore
        </p>
      </div>

      {/* Right: content panel */}
      <div style={{ flex: '1 1 0', minWidth: 0 }}>
        {selectedNode
          ? <DetailPanel nodeId={selectedNode} onBack={handleBack} />
          : <OverviewPanel onOpenCaseStudy={onOpenCaseStudy} />
        }
      </div>
    </div>
  )
}

// ── Placeholder tab ────────────────────────────────────────────────────────
function PlaceholderTab({ tabId }) {
  const data    = PLACEHOLDER_TABS[tabId]
  if (!data) return null
  const heading = CATEGORY_TABS.find(t => t.id === tabId)?.label || tabId
  return (
    <div style={{ paddingTop: '32px', paddingBottom: '16px' }}>
      <h3 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 600, letterSpacing: '-0.025em', color: '#111', marginBottom: '12px' }}>
        {heading}
      </h3>
      <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#666', marginBottom: '28px', maxWidth: '520px' }}>
        {data.tagline}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
        {data.projects.map(name => (
          <span key={name} style={{
            background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '999px', padding: '8px 18px',
            fontSize: '13px', fontWeight: 500, color: '#555', backdropFilter: 'blur(4px)',
          }}>
            {name}
          </span>
        ))}
      </div>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        fontSize: '12px', fontWeight: 600, color: '#bbb',
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ddd', display: 'inline-block' }} />
        Coming Soon
      </span>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
export default function ProjectsSection_2({ onOpenCaseStudy }) {
  const [activeTab, setActiveTab] = useState(0)
  const { ref: headRef } = useInView()
  const currentTabId = CATEGORY_TABS[activeTab].id

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <section
        id="projects_2"
        style={{
          paddingTop: '100px',
          paddingBottom: '100px',
          background: `
            linear-gradient(to bottom, rgb(234,232,225) 0%, transparent 14%),
            linear-gradient(to right, transparent 55%, rgb(234,232,225) 96%),
            radial-gradient(ellipse at 5% 58%, rgba(180,205,255,0.52) 0%, transparent 54%),
            radial-gradient(ellipse at 72% 32%, rgba(200,180,255,0.32) 0%, transparent 50%),
            rgb(234,232,225)
          `,
        }}
      >
        <div className="section-container">
          {/* Section header */}
          <div ref={headRef} className="reveal" style={{ marginBottom: '48px' }}>
            <p style={{
              fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#999', marginBottom: '12px',
            }}>
              Selected Work
            </p>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400,
              letterSpacing: '-0.03em', lineHeight: 1.1, color: '#111', marginBottom: '32px',
            }}>
              Projects
            </h2>

            {/* Tab pills */}
            <div style={{
              display: 'inline-flex', gap: '6px',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '999px', padding: '5px',
              border: '1px solid rgba(0,0,0,0.08)', flexWrap: 'wrap',
            }}>
              {CATEGORY_TABS.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(i)}
                  style={{
                    background: activeTab === i ? '#111' : 'transparent',
                    color: activeTab === i ? '#fff' : '#555',
                    borderRadius: '999px', padding: '9px 20px',
                    fontSize: '13.5px', fontWeight: activeTab === i ? 600 : 450,
                    border: 'none', cursor: 'pointer',
                    transition: 'background 0.25s ease, color 0.25s ease',
                    letterSpacing: '-0.01em', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (activeTab !== i) { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; e.currentTarget.style.color = '#111' } }}
                  onMouseLeave={e => { if (activeTab !== i) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555' } }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div key={currentTabId} style={{ animation: 'fadeInUp 0.35s cubic-bezier(0.33,1,0.68,1) forwards' }}>
            {currentTabId === 'ai-agents'
              ? <AIAgentsTab onOpenCaseStudy={onOpenCaseStudy} />
              : <PlaceholderTab tabId={currentTabId} />
            }
          </div>
        </div>
      </section>
    </>
  )
}
