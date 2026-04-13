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
  { id: 'vibe-codes',     label: 'Vibe Codes' },
]

const PLACEHOLDER_TABS = {
  automations:    { tagline: 'Workflow automation across the recruiting lifecycle.', projects: ['Workflows', 'List Builder', 'Surveys'] },
  analytics:      { tagline: 'Dashboards that turn data into decisions.', projects: ['Landing Dashboard', 'Survey Analytics', 'Voiceflows', 'Redeployments', 'AI Recruiter'] },
  'design-system': { tagline: 'A shared language of components, tokens, and patterns.', projects: ['Form Components', 'Colors & Typography', 'AI Components'] },
  mobile:         { tagline: 'Native-feeling apps for the modern workforce.', projects: ['Betterjobs', 'Attendance App'] },
  arvr:           { tagline: 'Spatial computing experiences from hackathons to enterprise.', projects: ['Hololens-Automated Home Designer', "Bayer's Digital Label", 'Alina-Intelligent Assistant', 'Accudrive-DriverAssistant', 'Game - Where is my way'] },
  'vibe-codes':   { tagline: 'AI-assisted builds shipped fast — ideas turned into real products with vibe coding.', projects: ['Portfolio V2', 'Claude Code Experiments', 'Rapid Prototypes'] },
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

const toRad  = (deg) => deg * Math.PI / 180
const restX  = (deg) => CX + ORBIT_R * Math.cos(toRad(deg))
const restY  = (deg) => CY + ORBIT_R * Math.sin(toRad(deg))

const SATELLITE_NODES = [
  { id: 'senseiq',   label: 'SenseIQ',     icon: '🧠', angleDeg: 300, tooltipBelow: false,
    color: { light: '#ddeeff', mid: '#B8D4F8', dark: '#7aaee8' },
    tooltip: 'Scores and ranks candidates using behavioural signals and fit analysis.' },
  { id: 'listbuild', label: 'List Builder', icon: '📋', angleDeg: 218, tooltipBelow: false,
    color: { light: '#d4fce8', mid: '#B8F4D4', dark: '#7adcaa' },
    tooltip: 'Builds targeted candidate lists from multiple job boards autonomously.' },
  { id: 'data',      label: 'Data Agent',   icon: '⚡', angleDeg: 158, tooltipBelow: true,
    color: { light: '#fdf2c4', mid: '#F8E4A0', dark: '#e8c84a' },
    tooltip: 'Cleans and enriches raw candidate data for downstream agent consumption.' },
  { id: 'voice',     label: 'Voice Agent',  icon: '🎙', angleDeg: 108, tooltipBelow: true,
    color: { light: '#fdddd4', mid: '#F4A58A', dark: '#e07858' },
    tooltip: 'Conducts AI-powered phone screens and surfaces key evaluation signals.' },
  { id: 'screen',    label: 'Screening',    icon: '✅', angleDeg: 28, tooltipBelow: false,
    color: { light: '#ecdeff', mid: '#D4B8F8', dark: '#b080f0' },
    tooltip: 'Runs structured evaluations — 20 qualified candidates per 100 applicants.' },
]

const CENTER_NODE = {
  id: 'center', label: 'AI Recruiter', icon: '🤖',
  tooltip: 'Orchestrates all sub-agents to deliver end-to-end autonomous recruiting.',
}

// Cyclic tooltip order: SenseIQ → Screening → Voice Agent → Data Agent → List Builder → AI Recruiter
const CYCLIC_ORDER   = ['senseiq', 'screen', 'voice', 'data', 'listbuild', 'center']
const CYCLE_DURATION = 3000   // ms tooltip stays visible
const CYCLE_OUT_MS   = 280    // ms slide-out animation

// ── Tooltip node lookup by id ──────────────────────────────────────────────
const NODE_TOOLTIP = {
  center: CENTER_NODE.tooltip,
  ...Object.fromEntries(SATELLITE_NODES.map(n => [n.id, n.tooltip])),
}

// ── 3D blob style helpers ──────────────────────────────────────────────────
const darkBlobStyle = (hovered, glowing) => ({
  background: 'radial-gradient(circle at 38% 30%, #666 0%, #1c1c1c 45%, #000 100%)',
  boxShadow: (glowing || hovered)
    ? 'inset 0 2px 10px rgba(255,255,255,0.14), 0 0 0 1.2px rgba(255,255,255,0.18), 0 0 55px 18px rgba(200,200,200,0.38), 0 16px 48px rgba(0,0,0,0.45)'
    : 'inset 0 2px 8px rgba(255,255,255,0.10), 0 12px 36px rgba(0,0,0,0.38)',
})

const lightBlobStyle = (selected, hovered, color, glowing) => ({
  background: selected
    ? 'radial-gradient(circle at 38% 30%, #666 0%, #1c1c1c 45%, #000 100%)'
    : `radial-gradient(circle at 38% 30%, ${color.light} 0%, ${color.mid} 55%, ${color.dark} 100%)`,
  border: selected ? 'none' : `1.5px solid ${color.dark}44`,
  boxShadow: (glowing || hovered) && !selected
    ? `inset 0 -4px 10px rgba(0,0,0,0.08), 0 0 0 1.2px ${color.mid}bb, 0 0 52px 16px ${color.mid}77, 0 10px 32px ${color.mid}55`
    : selected
      ? 'inset 0 2px 8px rgba(255,255,255,0.10), 0 0 0 3px rgba(0,0,0,0.15), 0 12px 32px rgba(0,0,0,0.3)'
      : `inset 0 -3px 8px rgba(0,0,0,0.06), 0 6px 20px ${color.mid}55`,
})

// ── Tooltip component ──────────────────────────────────────────────────────
// color: { light, mid, dark } for satellites; null = dark theme for center blob
function NodeTooltip({ text, isExiting, below = false, color = null }) {
  const isDark = color === null
  const bg     = isDark ? '#1c1c1c' : color.light
  const border = isDark ? 'rgba(255,255,255,0.12)' : color.mid
  const body   = isDark ? 'rgba(255,255,255,0.82)' : '#333'
  const hint   = isDark ? 'rgba(255,255,255,0.4)'  : color.dark

  return (
    <div style={{
      position: 'absolute',
      ...(below
        ? { top: 'calc(100% + 14px)', bottom: 'auto' }
        : { bottom: 'calc(100% + 14px)', top: 'auto' }),
      left: '50%',
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: '12px',
      padding: '10px 14px',
      boxShadow: isDark
        ? '0 6px 24px rgba(0,0,0,0.32)'
        : `0 6px 24px ${color.mid}55`,
      width: '178px',
      pointerEvents: 'none',
      zIndex: 20,
      animation: isExiting
        ? (below ? 'tooltipSlideOutDown 0.28s ease forwards' : 'tooltipSlideOut 0.28s ease forwards')
        : (below ? 'tooltipSlideInDown 0.28s cubic-bezier(0.33,1,0.68,1) forwards' : 'tooltipSlideIn 0.28s cubic-bezier(0.33,1,0.68,1) forwards'),
    }}>
      <p style={{ fontSize: '11.5px', color: body, lineHeight: 1.5, marginBottom: '5px', fontWeight: 500 }}>
        {text}
      </p>
      <p style={{ fontSize: '10px', color: hint, fontWeight: 600, letterSpacing: '0.03em' }}>
        Click to view project details
      </p>
      {/* Arrow — points toward the blob */}
      <div style={{
        position: 'absolute',
        ...(below
          ? { bottom: '100%', top: 'auto', borderBottom: `7px solid ${bg}`, borderTop: 'none' }
          : { top: '100%', bottom: 'auto', borderTop: `7px solid ${bg}`, borderBottom: 'none' }),
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
      }} />
    </div>
  )
}

// ── BlobNetwork ────────────────────────────────────────────────────────────
function BlobNetwork({ selectedNode, onSelectNode, outerRef }) {
  const containerRef     = useRef(null)
  // Initialise synchronously so ref callbacks (which fire before effects) can set .el
  const nodesRef         = useRef(
    SATELLITE_NODES.map(n => ({
      restX: restX(n.angleDeg), restY: restY(n.angleDeg),
      currentX: restX(n.angleDeg), currentY: restY(n.angleDeg),
      targetX:  restX(n.angleDeg), targetY:  restY(n.angleDeg),
      currentScale: 1, hovered: false, el: null,
    }))
  )
  const lineRefs         = useRef([])
  const rafRef           = useRef(null)
  const centerElRef      = useRef(null)
  const centerScaleRef   = useRef(1)
  const centerHoveredRef = useRef(false)
  const centerRafRef     = useRef(null)

  const [hoveredId,    setHoveredId]    = useState(null)
  const [blobEntered,  setBlobEntered]  = useState(false)
  const [blobAnimDone, setBlobAnimDone] = useState(false)
  const [cyclicId,     setCyclicId]     = useState(null)
  const [exitingId,    setExitingId]    = useState(null)

  const cycleRef    = useRef({ index: 0, timer: null, active: false })
  const isPausedRef = useRef(false)

  // Pause cycle when hovering or a node is selected
  useEffect(() => {
    isPausedRef.current = hoveredId !== null || selectedNode !== null
  }, [hoveredId, selectedNode])

  // ── Entry animation via IntersectionObserver ────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setBlobEntered(true)
        obs.disconnect()
      }
    }, { threshold: 0.35 })
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  // ── Cyclic tooltip cycle ────────────────────────────────────────────────
  const stopCycle = useCallback(() => {
    const c = cycleRef.current
    c.active = false
    if (c.timer) clearTimeout(c.timer)
    setCyclicId(null)
    setExitingId(null)
  }, [])

  const runStep = useCallback(() => {
    const c = cycleRef.current
    if (!c.active) return

    if (isPausedRef.current) {
      // Re-check after 500ms if still paused
      c.timer = setTimeout(runStep, 500)
      return
    }

    const id = CYCLIC_ORDER[c.index]
    setCyclicId(id)
    setExitingId(null)

    c.timer = setTimeout(() => {
      if (!c.active) return
      // Slide out current
      setExitingId(id)
      setCyclicId(null)
      setTimeout(() => {
        if (!c.active) return
        c.index = (c.index + 1) % CYCLIC_ORDER.length
        runStep()
      }, CYCLE_OUT_MS)
    }, CYCLE_DURATION)
  }, [])

  const startCycle = useCallback(() => {
    const c = cycleRef.current
    if (c.active) return
    c.active = true
    c.index  = 0
    runStep()
  }, [runStep])

  // Start cycle after entry animation settles (1.4s delay)
  useEffect(() => {
    if (!blobEntered) return
    const t = setTimeout(startCycle, 1400)
    return () => {
      clearTimeout(t)
      stopCycle()
    }
  }, [blobEntered, startCycle, stopCycle])

  // ── Hand off transform control to rAF after entry animation settles ─────
  useEffect(() => {
    if (!blobEntered) return
    // Max stagger: delay 0.55s + duration 0.7s = 1.25s → 1.3s is safely after
    const t = setTimeout(() => setBlobAnimDone(true), 1300)
    return () => clearTimeout(t)
  }, [blobEntered])

  // ── Center blob rAF ────────────────────────────────────────────────────
  const startCenterRaf = useCallback(() => {
    const tick = () => {
      const target = centerHoveredRef.current ? 1.12 : 1.0
      centerScaleRef.current += (target - centerScaleRef.current) * 0.14
      if (centerElRef.current) {
        centerElRef.current.style.transform = `scale(${centerScaleRef.current.toFixed(4)})`
      }
      if (Math.abs(target - centerScaleRef.current) > 0.003)
        centerRafRef.current = requestAnimationFrame(tick)
      else centerRafRef.current = null
    }
    if (!centerRafRef.current) centerRafRef.current = requestAnimationFrame(tick)
  }, [])

  // ── Satellite rAF ─────────────────────────────────────────────────────
  const startRaf = useCallback(() => {
    const tick = () => {
      let settled = true
      nodesRef.current.forEach((node, i) => {
        node.currentX += (node.targetX - node.currentX) * 0.12
        node.currentY += (node.targetY - node.currentY) * 0.12
        const ts = node.hovered ? 1.18 : 1.0
        node.currentScale += (ts - node.currentScale) * 0.14
        if (Math.abs(node.targetX - node.currentX) > 0.1 ||
            Math.abs(node.targetY - node.currentY) > 0.1 ||
            Math.abs(ts - node.currentScale) > 0.004) settled = false
        const ox = node.currentX - node.restX
        const oy = node.currentY - node.restY
        if (node.el)
          node.el.style.transform = `translate(${ox.toFixed(2)}px, ${oy.toFixed(2)}px) scale(${node.currentScale.toFixed(4)})`
        const line = lineRefs.current[i]
        if (line) {
          line.setAttribute('x2', node.currentX.toFixed(2))
          line.setAttribute('y2', node.currentY.toFixed(2))
        }
      })
      if (!settled) rafRef.current = requestAnimationFrame(tick)
      else rafRef.current = null
    }
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick)
  }, [])

  // ── Section-wide mouse tracking ────────────────────────────────────────
  useEffect(() => {
    const outer = outerRef?.current
    if (!outer) return
    const handleMouseMove = (e) => {
      const blobRect = containerRef.current?.getBoundingClientRect()
      if (!blobRect) return
      const scaleX = 500 / blobRect.width
      const scaleY = 500 / blobRect.height
      const mx = (e.clientX - blobRect.left) * scaleX
      const my = (e.clientY - blobRect.top)  * scaleY
      nodesRef.current.forEach(node => {
        const dx = mx - node.restX
        const dy = my - node.restY
        let tx = node.restX + dx * 0.08
        let ty = node.restY + dy * 0.08
        const dd = Math.sqrt((tx - node.restX) ** 2 + (ty - node.restY) ** 2)
        if (dd > 22) { const s = 22 / dd; tx = node.restX + (tx - node.restX) * s; ty = node.restY + (ty - node.restY) * s }
        node.targetX = tx
        node.targetY = ty
      })
      startRaf()
    }
    const handleMouseLeave = () => {
      nodesRef.current.forEach(n => { n.targetX = n.restX; n.targetY = n.restY })
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

  // ── Entry animation stagger per node ──────────────────────────────────
  // Centering is done via margin (not transform), so transform is purely rAF-owned.
  // We set it here only during the entry pop-in window; after blobAnimDone rAF owns it.
  const satelliteEntryStyle = (i) => {
    if (!blobEntered) return {
      opacity: 0,
      transform: 'scale(0.3)',
      transition: 'none',
    }
    if (blobAnimDone) return {
      opacity: 1,
      // no transform key → React won't clear what rAF has set
    }
    return {
      opacity: 1,
      transform: 'scale(1)',
      transition: `transform 0.7s cubic-bezier(0.34,1.4,0.64,1) ${0.15 + i * 0.1}s, opacity 0.5s ease ${0.15 + i * 0.1}s`,
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '500px', height: '500px', flexShrink: 0 }}>

      {/* SVG connection lines — fade in after blobs */}
      <svg
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible',
          opacity: blobEntered ? 1 : 0,
          transition: 'opacity 0.6s ease 0.8s',
        }}
        viewBox="0 0 500 500"
        preserveAspectRatio="xMidYMid meet"
      >
        {SATELLITE_NODES.map((node, i) => (
          <line
            key={node.id}
            ref={el => { lineRefs.current[i] = el }}
            x1={CX} y1={CY}
            x2={restX(node.angleDeg)} y2={restY(node.angleDeg)}
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="1.5"
            strokeDasharray="4 7"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Center node */}
      <div
        ref={centerElRef}
        onClick={() => onSelectNode('center')}
        onMouseEnter={() => {
          centerHoveredRef.current = true
          setHoveredId('center')
          startCenterRaf()
          lineRefs.current.forEach(l => { l?.setAttribute('stroke', 'rgba(0,0,0,0.35)'); l?.setAttribute('stroke-dasharray', '4 5') })
        }}
        onMouseLeave={() => {
          centerHoveredRef.current = false
          setHoveredId(null)
          startCenterRaf()
          lineRefs.current.forEach(l => { l?.setAttribute('stroke', 'rgba(0,0,0,0.18)'); l?.setAttribute('stroke-dasharray', '4 7') })
        }}
        style={{
          position: 'absolute',
          // margin-centering avoids translate(-50%,-50%) in transform — rAF owns transform fully
          left: `${CX - 60}px`, top: `${CY - 60}px`,
          ...(blobAnimDone ? {} : {
            transform: blobEntered ? 'scale(1)' : 'scale(0.3)',
          }),
          opacity: blobEntered ? 1 : 0,
          transition: blobEntered
            ? (blobAnimDone
              ? 'box-shadow 0.3s ease'
              : 'transform 0.75s cubic-bezier(0.34,1.4,0.64,1) 0.05s, opacity 0.5s ease 0.05s, box-shadow 0.3s ease')
            : 'none',
          width: '120px', height: '120px', borderRadius: '50%',
          ...darkBlobStyle(hoveredId === 'center', cyclicId === 'center' || exitingId === 'center'),
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 3, cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '26px', lineHeight: 1, marginBottom: '5px' }}>{CENTER_NODE.icon}</span>
        <span style={{ color: '#fff', fontSize: '10.5px', fontWeight: 700, textAlign: 'center', lineHeight: 1.25, padding: '0 10px', letterSpacing: '0.02em' }}>
          AI Recruiter
        </span>
        {/* Hover tooltip */}
        {hoveredId === 'center' && <NodeTooltip text={CENTER_NODE.tooltip} isExiting={false} />}
        {/* Cyclic tooltip (only if not hovered) */}
        {hoveredId !== 'center' && cyclicId  === 'center' && <NodeTooltip text={CENTER_NODE.tooltip} isExiting={false} />}
        {hoveredId !== 'center' && exitingId === 'center' && <NodeTooltip text={CENTER_NODE.tooltip} isExiting={true} />}
      </div>

      {/* Satellite nodes */}
      {SATELLITE_NODES.map((node, i) => {
        const isSelected = selectedNode === node.id
        const isHovered  = hoveredId === node.id
        const entryStyle = satelliteEntryStyle(i)
        return (
          <div
            key={node.id}
            ref={el => { if (nodesRef.current[i]) nodesRef.current[i].el = el }}
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
              // margin-centering: rAF fully owns transform (no translate conflict)
              left: `${restX(node.angleDeg) - 43}px`,
              top:  `${restY(node.angleDeg) - 43}px`,
              // Only include transform in React style during entry window
              ...(entryStyle.transform !== undefined ? { transform: entryStyle.transform } : {}),
              opacity: entryStyle.opacity,
              transition: blobAnimDone
                ? 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
                : entryStyle.transition
                  ? entryStyle.transition + ', background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
                  : 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
              width: '86px', height: '86px', borderRadius: '50%',
              ...lightBlobStyle(isSelected, isHovered, node.color, !isSelected && (isHovered || cyclicId === node.id || exitingId === node.id)),
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              zIndex: 2, cursor: 'pointer', willChange: 'transform',
            }}
          >
            <span style={{ fontSize: '20px', lineHeight: 1, marginBottom: '4px' }}>{node.icon}</span>
            <span style={{ fontSize: '9.5px', fontWeight: 700, color: isSelected ? '#fff' : '#1a1a1a', textAlign: 'center', padding: '0 5px', lineHeight: 1.2, letterSpacing: '0.01em', transition: 'color 0.3s ease' }}>
              {node.label}
            </span>
            {/* Hover tooltip */}
            {isHovered && <NodeTooltip text={node.tooltip} isExiting={false} below={node.tooltipBelow} color={node.color} />}
            {/* Cyclic tooltip (only if not hovered) */}
            {!isHovered && cyclicId  === node.id && <NodeTooltip text={node.tooltip} isExiting={false} below={node.tooltipBelow} color={node.color} />}
            {!isHovered && exitingId === node.id && <NodeTooltip text={node.tooltip} isExiting={true}  below={node.tooltipBelow} color={node.color} />}
          </div>
        )
      })}
    </div>
  )
}

// ── Metric card ────────────────────────────────────────────────────────────
function MetricCard({ value, label }) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.03em', color: '#111', lineHeight: 1, marginBottom: '6px' }}>{value}</div>
      <div style={{ fontSize: '12px', color: '#888', fontWeight: 500, lineHeight: 1.4 }}>{label}</div>
    </div>
  )
}

// ── Right panel — overview ─────────────────────────────────────────────────
function OverviewPanel({ onOpenCaseStudy }) {
  return (
    <div style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.33,1,0.68,1) forwards' }}>
      <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>
        AI Agents · SenseHQ
      </p>
      <h2 style={{ fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#111', marginBottom: '16px' }}>
        AI Recruiter Ecosystem
      </h2>
      <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#555', letterSpacing: '-0.01em', marginBottom: '28px', maxWidth: '460px' }}>
        An orchestrated network of specialised agents — from data sourcing to voice screening — that transformed manual recruiting into autonomous talent acquisition.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '28px' }}>
        {AI_AGENTS_METRICS.map(m => <MetricCard key={m.label} {...m} />)}
      </div>
      <button className="btn-dark" onClick={onOpenCaseStudy} style={{ fontSize: '14px', padding: '12px 28px' }}>
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
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#999', letterSpacing: '-0.01em', marginBottom: '24px', padding: 0, display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s ease' }}
        onMouseEnter={e => e.currentTarget.style.color = '#111'}
        onMouseLeave={e => e.currentTarget.style.color = '#999'}
      >
        ← All Agents
      </button>
      <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: '10px' }}>{project.subtitle}</p>
      <h2 style={{ fontSize: 'clamp(32px, 3.5vw, 52px)', fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 1.05, color: '#111', marginBottom: '20px' }}>{project.name}</h2>
      <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#555', letterSpacing: '-0.01em', marginBottom: '36px', maxWidth: '480px' }}>{project.desc}</p>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '24px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: '28px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#bbb', marginBottom: '10px' }}>Role in the system</p>
        <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#444' }}>
          {nodeId === 'center'
            ? 'Orchestrates all sub-agents, manages state across the pipeline, and makes final placement decisions.'
            : 'Feeds outputs to the AI Recruiter orchestrator, contributing a specialised capability to the end-to-end hiring flow.'}
        </p>
      </div>
      <button className="btn-dark" style={{ fontSize: '13px', padding: '11px 24px', opacity: 0.9 }} onClick={onBack}>← View All Agents</button>
    </div>
  )
}

// ── AI Agents tab ──────────────────────────────────────────────────────────
function AIAgentsTab({ onOpenCaseStudy, sectionRef }) {
  const [selectedNode,   setSelectedNode]   = useState(null)
  const [hasInteracted,  setHasInteracted]  = useState(false)

  const handleSelectNode = (id) => { setSelectedNode(id); setHasInteracted(true) }

  return (
    <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }} className="flex-col md:flex-row">
      <div className="hidden md:flex" style={{ flexDirection: 'column', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        <BlobNetwork selectedNode={selectedNode} onSelectNode={handleSelectNode} outerRef={sectionRef} />
        <p style={{
          fontSize: '12px', fontWeight: 500, color: '#aaa', letterSpacing: '0.02em',
          display: 'flex', alignItems: 'center', gap: '6px',
          opacity: hasInteracted ? 0 : 1, transition: 'opacity 0.7s ease',
          pointerEvents: 'none', userSelect: 'none',
        }}>
          <span style={{ fontSize: '14px' }}>👆</span> Click any agent to explore
        </p>
      </div>
      <div style={{ flex: '1 1 0', minWidth: 0 }}>
        {selectedNode
          ? <DetailPanel nodeId={selectedNode} onBack={() => setSelectedNode(null)} />
          : <OverviewPanel onOpenCaseStudy={onOpenCaseStudy} />}
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
      <h3 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 600, letterSpacing: '-0.025em', color: '#111', marginBottom: '12px' }}>{heading}</h3>
      <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#666', marginBottom: '28px', maxWidth: '520px' }}>{data.tagline}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
        {data.projects.map(name => (
          <span key={name} style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '999px', padding: '8px 18px', fontSize: '13px', fontWeight: 500, color: '#555', backdropFilter: 'blur(4px)' }}>
            {name}
          </span>
        ))}
      </div>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#bbb', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
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
  const sectionRef   = useRef(null)
  const currentTabId = CATEGORY_TABS[activeTab].id

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes tooltipSlideIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes tooltipSlideOut {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to   { opacity: 0; transform: translateX(-50%) translateY(-8px); }
        }
        @keyframes tooltipSlideInDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes tooltipSlideOutDown {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to   { opacity: 0; transform: translateX(-50%) translateY(8px); }
        }
      `}</style>

      <section
        id="projects"
        ref={sectionRef}
        style={{
          paddingTop: '100px', paddingBottom: '100px',
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
          {/* Header */}
          <div ref={headRef} className="reveal" style={{ marginBottom: '48px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Selected Work</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#111', marginBottom: '32px' }}>Projects</h2>

            {/* Tab pills */}
            <div style={{ display: 'inline-flex', gap: '6px', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: '999px', padding: '5px', border: '1px solid rgba(0,0,0,0.08)', flexWrap: 'wrap' }}>
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
              ? <AIAgentsTab onOpenCaseStudy={onOpenCaseStudy} sectionRef={sectionRef} />
              : <PlaceholderTab tabId={currentTabId} />}
          </div>
        </div>
      </section>
    </>
  )
}
