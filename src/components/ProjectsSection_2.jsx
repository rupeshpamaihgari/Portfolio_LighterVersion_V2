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
  { value: '50K+ hrs', label: 'Manager time saved (HCA)' },
  { value: '404K',     label: 'Meetings scheduled YTD' },
  { value: '$4.6M',    label: 'Post-Pilot ARR' },
  { value: '11.1 hrs', label: 'Fastest Time to fill' },
]

const AGENT_PROJECTS = {
  center:    { name: 'AI Recruiter (Orchestrator)', subtitle: 'The Orchestrator',   desc: 'End-to-end autonomous recruiting — coordinates all agents from sourcing to placement, managing the full candidate journey without human intervention.' },
  senseiq:   { name: 'Sense IQ',        subtitle: 'Intelligence Layer', desc: 'Scores and ranks candidates using behavioural signals, fit analysis, and historical hiring data — surfacing the best matches instantly.' },
  listbuild: { name: 'Matching Agent',  subtitle: 'Matching Agent',     desc: 'Autonomously builds targeted candidate lists from multiple job boards and talent databases, keeping pipelines full without manual sourcing effort.' },
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

// Pentagon order (72° apart clockwise from top): Sense IQ → Matching → Voice → Screening → Data
const SATELLITE_NODES = [
  { id: 'senseiq',   label: 'Sense IQ',       icon: '🧠', angleDeg: 270, tooltipBelow: true,  nudgeX: 0,
    color: { light: '#ddeeff', mid: '#B8D4F8', dark: '#7aaee8' },
    tooltip: 'Foundational chat interface layer with a knowledge base of all Sense products.' },
  { id: 'listbuild', label: 'Matching Agent',  icon: '🔗', angleDeg: 342, tooltipBelow: false, nudgeX: -32,
    color: { light: '#d4fce8', mid: '#B8F4D4', dark: '#7adcaa' },
    tooltip: 'Runs candidate matching against open jobs to surface the most relevant talent.' },
  { id: 'voice',     label: 'Voice Agent',     icon: '🎙', angleDeg: 54,  tooltipBelow: false, nudgeX: -20,
    color: { light: '#fdddd4', mid: '#F4A58A', dark: '#e07858' },
    tooltip: 'Multichannel agent that calls or chats with matched candidates on behalf of recruiters.' },
  { id: 'screen',    label: 'Screening Agent', icon: '✅', angleDeg: 126, tooltipBelow: false, nudgeX: 20,
    color: { light: '#ecdeff', mid: '#D4B8F8', dark: '#b080f0' },
    tooltip: 'Understands resume, job description, and call transcript to screen and score candidates.' },
  { id: 'data',      label: 'Data Agent',      icon: '📊', angleDeg: 198, tooltipBelow: false, nudgeX: 32,
    color: { light: '#fdf2c4', mid: '#F8E4A0', dark: '#e8c84a' },
    tooltip: 'Delivers prescriptive and predictive analytics to recruiters on AI Recruiter performance.' },
]

const CENTER_NODE = {
  id: 'center', label: 'AI Recruiter', icon: '🤖',
  tooltip: 'Orchestrates all sub-agents to deliver end-to-end autonomous recruiting.',
}

// Cyclic tooltip order follows pentagon: Sense IQ → Matching → Voice → Screening → Data → AI Recruiter
const CYCLIC_ORDER   = ['senseiq', 'listbuild', 'voice', 'screen', 'data', 'center']
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
function NodeTooltip({ text, isExiting, below = false, color = null, nudgeX = 0 }) {
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
      left: nudgeX === 0 ? '50%' : `calc(50% + ${nudgeX}px)`,
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
      {/* Arrow — points toward the blob, counter-offset to stay centered on blob */}
      <div style={{
        position: 'absolute',
        ...(below
          ? { bottom: '100%', top: 'auto', borderBottom: `7px solid ${bg}`, borderTop: 'none' }
          : { top: '100%', bottom: 'auto', borderTop: `7px solid ${bg}`, borderBottom: 'none' }),
        left: nudgeX === 0 ? '50%' : `calc(50% - ${nudgeX}px)`,
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
  const edgeRefs         = useRef([])
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
      // Update pentagon edges — both endpoints follow their blobs
      nodesRef.current.forEach((node, i) => {
        const next = nodesRef.current[(i + 1) % nodesRef.current.length]
        const edge = edgeRefs.current[i]
        if (edge) {
          edge.setAttribute('x1', node.currentX.toFixed(2))
          edge.setAttribute('y1', node.currentY.toFixed(2))
          edge.setAttribute('x2', next.currentX.toFixed(2))
          edge.setAttribute('y2', next.currentY.toFixed(2))
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
        let tx = node.restX + dx * 0.14
        let ty = node.restY + dy * 0.14
        const dd = Math.sqrt((tx - node.restX) ** 2 + (ty - node.restY) ** 2)
        if (dd > 42) { const s = 42 / dd; tx = node.restX + (tx - node.restX) * s; ty = node.restY + (ty - node.restY) * s }
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
        {/* Spokes: center → each satellite */}
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
        {/* Pentagon edges: consecutive satellite → satellite, refs let RAF update endpoints */}
        {SATELLITE_NODES.map((node, i) => {
          const next = SATELLITE_NODES[(i + 1) % SATELLITE_NODES.length]
          return (
            <line
              key={`edge-${node.id}`}
              ref={el => { edgeRefs.current[i] = el }}
              x1={restX(node.angleDeg)} y1={restY(node.angleDeg)}
              x2={restX(next.angleDeg)} y2={restY(next.angleDeg)}
              stroke="rgba(0,0,0,0.28)"
              strokeWidth="1.2"
              strokeDasharray="3 8"
              strokeLinecap="round"
            />
          )
        })}
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
          AI Recruiter{'\n'}(Orchestrator)
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
              zIndex: (isHovered || cyclicId === node.id || exitingId === node.id) ? 20 : 2,
              cursor: 'pointer', willChange: 'transform',
            }}
          >
            <span style={{ fontSize: '20px', lineHeight: 1, marginBottom: '4px' }}>{node.icon}</span>
            <span style={{ fontSize: '9.5px', fontWeight: 700, color: isSelected ? '#fff' : '#1a1a1a', textAlign: 'center', padding: '0 5px', lineHeight: 1.2, letterSpacing: '0.01em', transition: 'color 0.3s ease' }}>
              {node.label}
            </span>
            {/* Hover tooltip */}
            {isHovered && <NodeTooltip text={node.tooltip} isExiting={false} below={node.tooltipBelow} color={node.color} nudgeX={node.nudgeX} />}
            {/* Cyclic tooltip (only if not hovered) */}
            {!isHovered && cyclicId  === node.id && <NodeTooltip text={node.tooltip} isExiting={false} below={node.tooltipBelow} color={node.color} nudgeX={node.nudgeX} />}
            {!isHovered && exitingId === node.id && <NodeTooltip text={node.tooltip} isExiting={true}  below={node.tooltipBelow} color={node.color} nudgeX={node.nudgeX} />}
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

// ── Automations tab data ───────────────────────────────────────────────────
const AUTOMATION_METRICS = [
  { value: '70%',      label: 'Growth in Candidate response rate' },
  { value: '97%',      label: 'QoQ workflow growth Q2→Q3 2025' },
  { value: '1,101',    label: 'Active workflows by Q3 2025' },
  { value: '199',      label: 'Agencies with active workflows' },
  { value: '10×',      label: 'Active journeys per customer' },
  { value: '3×',       label: 'Weekly start capacity per recruiter (Carvana)' },
]

// ── Automations overview panel (right side) ────────────────────────────────
function AutomationsOverviewPanel({ onOpenCaseStudy }) {
  return (
    <div style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.33,1,0.68,1) forwards' }}>
      <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>
        Automations · SenseHQ
      </p>
      <h2 style={{ fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#111', marginBottom: '16px' }}>
        Workflow Builder 2.0
      </h2>
      <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#555', letterSpacing: '-0.01em', marginBottom: '28px', maxWidth: '460px' }}>
        Evolved recruiting automation from linear sequences to a visual node-based canvas — the central nervous system where Messaging, Voice, Chatbot, and Scheduling converge into always-on workflows.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '28px' }}>
        {AUTOMATION_METRICS.map(m => <MetricCard key={m.label} {...m} />)}
      </div>
      <button className="btn-dark" onClick={onOpenCaseStudy} style={{ fontSize: '14px', padding: '12px 28px' }}>
        Read Full Case Study →
      </button>
    </div>
  )
}

// ── Workflow illustration data ─────────────────────────────────────────────
const WORKFLOW_BLOCKS = [
  { id: 'trigger', badge: 'Trigger',       badgeIcon: '▶',
    title: 'New Application in ATS',
    sub:   'When a candidate applies to an open role',
    color: { light: '#d4fce8', mid: '#B8F4D4', dark: '#7adcaa' } },
  { id: 'ai',      badge: 'AI Evaluation', badgeIcon: '🧠',
    title: 'Candidate Scoring',
    sub:   'Resume · JD match · behavioural signals',
    color: { light: '#ddeeff', mid: '#B8D4F8', dark: '#7aaee8' } },
  { id: 'action',  badge: 'Action',        badgeIcon: '⚡',
    title: 'Send Communications',
    sub:   'SMS + email to candidate & recruiter',
    color: { light: '#fdddd4', mid: '#F4A58A', dark: '#e07858' } },
  { id: 'output',  badge: 'Output',        badgeIcon: '✅',
    title: 'Pipeline Updated',
    sub:   'ATS synced · recruiter notified',
    color: { light: '#fdf2c4', mid: '#F8E4A0', dark: '#e8c84a' } },
]

const TILT_DEPTHS = [1.0, 0.70, 0.42, 0.18]

// ── ArrowConnector ─────────────────────────────────────────────────────────
function ArrowConnector() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '28px', alignItems: 'center' }}>
      <svg width="16" height="28" viewBox="0 0 16 28" fill="none">
        <line x1="8" y1="0" x2="8" y2="20"
              stroke="rgba(0,0,0,0.18)" strokeWidth="1.5"
              strokeDasharray="3 4" strokeLinecap="round" />
        <polygon points="8,28 3,19 13,19" fill="rgba(0,0,0,0.18)" />
      </svg>
    </div>
  )
}

// ── WorkflowIllustration ───────────────────────────────────────────────────
function WorkflowIllustration({ outerRef }) {
  const containerRef = useRef(null)
  const tiltRefs     = useRef([])
  const rotRef       = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 })
  const rafRef       = useRef(null)
  const [entered,   setEntered]   = useState(false)
  const [animDone,  setAnimDone]  = useState(false)

  // IntersectionObserver — trigger entry animation on scroll-into-view
  useEffect(() => {
    const el  = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        obs.disconnect()
        setEntered(true)
        const t = setTimeout(() => setAnimDone(true), 1300)
        return () => clearTimeout(t)
      }
    }, { threshold: 0.30 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // RAF tilt loop
  const startRaf = useCallback(() => {
    if (rafRef.current) return
    const tick = () => {
      const r = rotRef.current
      r.currentX += (r.targetX - r.currentX) * 0.10
      r.currentY += (r.targetY - r.currentY) * 0.10

      tiltRefs.current.forEach((el, i) => {
        if (!el) return
        const depth = TILT_DEPTHS[i] ?? 1
        el.style.transform =
          `perspective(700px) rotateX(${(r.currentX * depth).toFixed(3)}deg) rotateY(${(r.currentY * depth).toFixed(3)}deg)`
      })

      const doneX = Math.abs(r.targetX - r.currentX) < 0.01
      const doneY = Math.abs(r.targetY - r.currentY) < 0.01
      if (doneX && doneY) {
        rafRef.current = null
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  // Mouse tracking on the outer section ref
  useEffect(() => {
    const outer = outerRef?.current
    if (!outer) return

    const onMove = (e) => {
      const rect = outer.getBoundingClientRect()
      const cx   = rect.left + rect.width  / 2
      const cy   = rect.top  + rect.height / 2
      const dx   = e.clientX - cx
      const dy   = e.clientY - cy
      rotRef.current.targetY =  (dx / (rect.width  / 2)) * 26
      rotRef.current.targetX = -(dy / (rect.height / 2)) * 16
      startRaf()
    }
    const onLeave = () => {
      rotRef.current.targetX = 0
      rotRef.current.targetY = 0
      startRaf()
    }

    outer.addEventListener('mousemove', onMove)
    outer.addEventListener('mouseleave', onLeave)
    return () => {
      outer.removeEventListener('mousemove', onMove)
      outer.removeEventListener('mouseleave', onLeave)
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    }
  }, [outerRef, startRaf])

  return (
    <div
      ref={containerRef}
      className="hidden md:flex"
      style={{
        width: '420px', flexShrink: 0,
        flexDirection: 'column', justifyContent: 'center',
        padding: '24px 28px',
        background: 'rgba(255,255,255,0.35)',
        borderRadius: '24px',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      {WORKFLOW_BLOCKS.map((block, i) => {
        const { color } = block
        const delay = 0.1 + i * 0.15

        // Entry style: before entered → hidden + shifted; after entered → visible
        // After animDone, let the tilt wrapper fully own transforms
        const entryStyle = animDone
          ? { opacity: 1 }
          : entered
            ? {
                opacity: 1,
                transform: 'translateY(0) scale(1)',
                transition: `transform 0.65s cubic-bezier(0.34,1.4,0.64,1) ${delay}s, opacity 0.5s ease ${delay}s`,
              }
            : {
                opacity: 0,
                transform: 'translateY(16px) scale(0.92)',
                transition: `transform 0.65s cubic-bezier(0.34,1.4,0.64,1) ${delay}s, opacity 0.5s ease ${delay}s`,
              }

        return (
          <div key={block.id}>
            {/* tilt wrapper — RAF owns transform */}
            <div ref={el => { tiltRefs.current[i] = el }}>
              {/* entry wrapper — CSS transition owns opacity + translateY */}
              <div style={{
                ...entryStyle,
                background: '#fff',
                borderRadius: '20px',
                padding: '16px 20px',
                border: `1.5px solid ${color.dark}33`,
                boxShadow: `0 4px 20px ${color.mid}44`,
              }}>
                {/* Badge row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{
                    background: color.light, color: color.dark,
                    borderRadius: '999px', padding: '3px 10px',
                    fontSize: '11px', fontWeight: 700,
                  }}>
                    {block.badgeIcon} {block.badge}
                  </span>
                </div>
                {/* Title */}
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '4px' }}>
                  {block.title}
                </div>
                {/* Sub */}
                <div style={{ fontSize: '11.5px', color: '#888', lineHeight: 1.5 }}>
                  {block.sub}
                </div>
                {/* Accent line */}
                <div style={{ height: '2px', width: '32px', borderRadius: '2px', background: color.mid, marginTop: '12px' }} />
              </div>
            </div>
            {/* Arrow connector between blocks */}
            {i < WORKFLOW_BLOCKS.length - 1 && <ArrowConnector />}
          </div>
        )
      })}
    </div>
  )
}

// ── Automations tab (left illustration + right panel) ──────────────────────
function AutomationsTab({ onOpenCaseStudy, sectionRef }) {
  return (
    <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }} className="flex-col md:flex-row">
      {/* Left — workflow illustration */}
      <WorkflowIllustration outerRef={sectionRef} />
      {/* Right — overview panel */}
      <div style={{ flex: '1 1 0', minWidth: 0 }}>
        <AutomationsOverviewPanel onOpenCaseStudy={onOpenCaseStudy} />
      </div>
    </div>
  )
}

// ── Mobile tab ─────────────────────────────────────────────────────────────
const MOBILE_PROJECTS = [
  {
    title: 'Attendance Mobile App',
    subtitle: 'Betterplace · 2019–2021',
    thumb: 'https://rupeshpamaihgari.github.io/Portfolio-2026/Betterplace_Thumbnails/Attendance_Mobile.png',
    driveUrl: 'https://drive.google.com/file/d/1UN6BaK7dSt8rmJYjToqBcL2AKPWkUI8y/view?usp=sharing',
    tag: 'Mobile App',
  },
  {
    title: 'Attendance Admin Portal',
    subtitle: 'Betterplace · 2019–2021',
    thumb: 'https://rupeshpamaihgari.github.io/Portfolio-2026/Betterplace_Thumbnails/Attendance_Admin.png',
    driveUrl: 'https://drive.google.com/file/d/15sQIwlmsFu4vE2eL0k2qlx88zra7964r/view?usp=sharing',
    tag: 'Web Portal',
  },
  {
    title: 'Jobs Application',
    subtitle: 'Betterplace · 2019–2021',
    thumb: 'https://rupeshpamaihgari.github.io/Portfolio-2026/Betterplace_Thumbnails/Jobs%20App.png',
    driveUrl: 'https://drive.google.com/file/d/1yP_ZKInS5wyR9sSHFiFICL2eZ_piUHel/view?usp=sharing',
    tag: 'Mobile App',
  },
]

function MobileTab() {
  return (
    <div style={{ paddingTop: '8px', paddingBottom: '16px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>
          Betterplace · Blue-collar workforce
        </p>
        <h3 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 600, letterSpacing: '-0.025em', color: '#111', marginBottom: '10px' }}>
          Mobile
        </h3>
        <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#666', maxWidth: '480px' }}>
          Native-feeling apps for India's blue-collar workforce — attendance tracking, job applications, and admin tooling.
        </p>
      </div>

      {/* Thumbnail grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {MOBILE_PROJECTS.map((project) => (
          <a
            key={project.title}
            href={project.driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'block' }}
            onMouseEnter={e => {
              e.currentTarget.querySelector('.thumb-wrap').style.transform = 'translateY(-4px)'
              e.currentTarget.querySelector('.thumb-wrap').style.boxShadow = '0 12px 36px rgba(0,0,0,0.13)'
              e.currentTarget.querySelector('.drive-hint').style.opacity = '1'
            }}
            onMouseLeave={e => {
              e.currentTarget.querySelector('.thumb-wrap').style.transform = 'translateY(0)'
              e.currentTarget.querySelector('.thumb-wrap').style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'
              e.currentTarget.querySelector('.drive-hint').style.opacity = '0'
            }}
          >
            {/* Thumbnail */}
            <div
              className="thumb-wrap"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(0,0,0,0.07)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                position: 'relative',
                aspectRatio: '4/3',
              }}
            >
              <img
                src={project.thumb}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Drive hint overlay */}
              <div
                className="drive-hint"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                  borderRadius: '16px',
                }}
              >
                <span style={{
                  background: 'rgba(255,255,255,0.95)',
                  color: '#111',
                  fontSize: '12px', fontWeight: 600,
                  borderRadius: '999px',
                  padding: '8px 18px',
                  letterSpacing: '-0.01em',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  View on Drive ↗
                </span>
              </div>
            </div>

            {/* Card meta */}
            <div style={{ padding: '12px 4px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#111', letterSpacing: '-0.01em' }}>
                  {project.title}
                </span>
                <span style={{
                  fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: '#888', background: 'rgba(0,0,0,0.05)', borderRadius: '999px', padding: '3px 8px',
                }}>
                  {project.tag}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#aaa', margin: 0 }}>{project.subtitle}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

// ── AR/VR tab ──────────────────────────────────────────────────────────────
const ARVR_PROJECTS = [
  {
    id: 'hololens',
    title: 'Hololens — Automated Home Designer',
    tag: 'HoloLens · Mixed Reality',
    description:
      'A HoloLens experience that lets you design interior spaces in the air — placing furniture at true scale and seeing a room evolve in seconds. It also opens a clear path to upsell: integrating with furniture makers so the pieces you try can become the pieces you buy.',
    videoUrl: 'https://drive.google.com/file/d/1MmX8obDVQmi8dNixBg1dRsWQG8Z0F47_/preview',
    videoType: 'drive',
    color: { mid: '#B8D4F8', dark: '#7aaee8' },
  },
  {
    id: 'bayer',
    title: "Bayer's Digital Label",
    tag: 'Mobile · Computer Vision',
    description:
      'An intelligent mobile assistant for farmers — built to scan crops, identify diseases, and read product labels on the spot. It can also speak and listen in local languages, making expert guidance feel accessible in the field.',
    videoUrl: 'https://www.youtube.com/embed/l6kLjIw0_Gs',
    videoType: 'youtube',
    color: { mid: '#B8F4D4', dark: '#7adcaa' },
  },
  {
    id: 'alina',
    title: 'Alina — Intelligent Assistant',
    tag: 'Smart Home · AI Assistant',
    description:
      'A simple AI assistant for smart homes — built to monitor IoT-connected devices, spot issues early, and guide users through quick troubleshooting. The goal was calm, human help when something breaks.',
    videoUrl: 'https://www.youtube.com/embed/6I6ZcsgxCLU',
    videoType: 'youtube',
    color: { mid: '#D4B8F8', dark: '#b080f0' },
  },
  {
    id: 'accudrive',
    title: 'Accudrive — Driver Assistant',
    tag: 'XR · Driver Safety',
    description:
      'Inspired by my "Reality Virtually" work on safer roads, Accudrive explored how XR can coach better driving in the moment. It blends monitoring, feedback, and simulation to make training feel real — without real-world risk.',
    videoUrl: 'https://www.youtube.com/embed/K1FFypjD7PM',
    videoType: 'youtube',
    color: { mid: '#F4A58A', dark: '#e07858' },
  },
  {
    id: 'wheres-my-way',
    title: 'Where Is My Way — Game',
    tag: 'Game Design · Hackathon',
    description:
      "My game-dev roots still show up here — this project grew from the same competitive energy that helped me win HackerEarth's first Game Development Hackathon. I build playful worlds with serious intent: craft, emotion, and sharp UX choices.",
    videoUrl: 'https://www.youtube.com/embed/-eWyRrsDbRo',
    videoType: 'youtube',
    color: { mid: '#F8E4A0', dark: '#e8c84a' },
  },
]

function ARVRTab() {
  const [activeId, setActiveId]             = useState(ARVR_PROJECTS[0].id)
  const [hasInteracted, setHasInteracted]   = useState(false)
  const active = ARVR_PROJECTS.find(p => p.id === activeId)

  // Build the iframe URL — always muted by default; autoplay only after user clicks a project
  const videoSrc = (() => {
    const sep = active.videoUrl.includes('?') ? '&' : '?'
    if (active.videoType === 'youtube') {
      const base = `${active.videoUrl}${sep}mute=1&rel=0`
      return hasInteracted ? `${base}&autoplay=1` : base
    }
    // Google Drive preview: browsers already mute autoplay; just pass autoplay after interaction
    return hasInteracted ? `${active.videoUrl}${sep}autoplay=1` : active.videoUrl
  })()

  const handleSelect = (id) => {
    if (id === activeId) return
    setHasInteracted(true)
    setActiveId(id)
  }

  return (
    <div style={{ paddingTop: '8px', paddingBottom: '16px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>
          Spatial computing · Hackathons · Prototypes
        </p>
        <h3 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 600, letterSpacing: '-0.025em', color: '#111', marginBottom: '10px' }}>
          AR / VR
        </h3>
        <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#666', maxWidth: '520px' }}>
          Where storytelling becomes something you can step into — immersive experiences that blend craft, curiosity, and real-world problem solving.
        </p>
      </div>

      {/* Main layout: video left, project list right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: '28px', alignItems: 'start' }}>
        {/* ── Video player ── */}
        <div
          style={{
            aspectRatio: '16 / 9',
            borderRadius: '20px',
            overflow: 'hidden',
            background: '#111',
            boxShadow: `0 10px 32px ${active.color.mid}55, 0 2px 12px rgba(0,0,0,0.08)`,
            border: `1.5px solid ${active.color.dark}33`,
            position: 'relative',
            transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
          }}
        >
          <iframe
            key={active.id}
            src={videoSrc}
            title={active.title}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>

        {/* ── Project list ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {ARVR_PROJECTS.map((p) => {
            const isActive = p.id === activeId
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p.id)}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.95)'
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.55)'
                }}
                style={{
                  textAlign: 'left',
                  width: '100%',
                  display: 'block',
                  background: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                  border: `1.5px solid ${isActive ? p.color.dark + '55' : 'rgba(0,0,0,0.06)'}`,
                  borderRadius: '14px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  boxShadow: isActive
                    ? `0 6px 18px ${p.color.mid}55`
                    : '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
                }}
              >
                {/* Title row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: isActive ? '6px' : '2px' }}>
                  {/* Coloured play/indicator */}
                  <span style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: isActive ? p.color.dark : p.color.mid + '55',
                    color: isActive ? '#fff' : p.color.dark,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', flexShrink: 0,
                    transition: 'background 0.22s ease, color 0.22s ease',
                  }}>
                    ▶
                  </span>
                  <span style={{
                    fontSize: '13.5px', fontWeight: isActive ? 650 : 550,
                    color: '#111', letterSpacing: '-0.015em', lineHeight: 1.3,
                  }}>
                    {p.title}
                  </span>
                </div>

                {/* Tag row — always visible but subtle */}
                <p style={{
                  fontSize: '11px', color: '#999', margin: '0 0 0 32px',
                  letterSpacing: '0.02em',
                }}>
                  {p.tag}
                </p>

                {/* Expanding description */}
                <div
                  style={{
                    maxHeight: isActive ? '200px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.35s cubic-bezier(0.33,1,0.68,1), margin-top 0.25s ease',
                    marginTop: isActive ? '8px' : '0',
                    marginLeft: '32px',
                  }}
                >
                  <p style={{
                    fontSize: '12.5px', lineHeight: 1.6, color: '#666',
                    margin: 0, letterSpacing: '-0.005em',
                  }}>
                    {p.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Design System tab ─────────────────────────────────────────────────────
const DESIGN_SYSTEM_METRICS = [
  { value: '20+',     label: 'Contributed Components' },
  { value: '9',       label: 'Design token categories' },
  { value: '17+',     label: 'Active contributors' },
  { value: 'WCAG AA', label: 'Accessibility compliance' },
  { value: 'v0.6',    label: 'Current version · actively shipped' },
  { value: '10',      label: 'AI-native prompt components' },
]

function DesignSystemTab() {
  return (
    <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }} className="flex-col md:flex-row">
      {/* Left — image placeholder */}
      <div
        className="hidden md:flex"
        style={{
          width: '420px', flexShrink: 0,
          aspectRatio: '4 / 5',
          borderRadius: '24px',
          background: 'rgba(255,255,255,0.35)',
          border: '1.5px dashed rgba(0,0,0,0.10)',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <p style={{ fontSize: '13px', color: '#ccc', fontWeight: 500 }}>Image coming soon</p>
      </div>

      {/* Right — overview */}
      <div style={{ flex: '1 1 0', minWidth: 0, animation: 'fadeInUp 0.4s cubic-bezier(0.33,1,0.68,1) forwards' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>
          Design System · SenseHQ
        </p>
        <h2 style={{ fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#111', marginBottom: '16px' }}>
          Genesis
        </h2>
        <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#555', letterSpacing: '-0.01em', marginBottom: '28px', maxWidth: '460px' }}>
          Sense's foundational design system — the single source of truth for UI across the entire platform. From design tokens to AI-native components, Genesis ensures every product speaks the same design and interaction language, regardless of who builds it.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '28px' }}>
          {DESIGN_SYSTEM_METRICS.map(m => <MetricCard key={m.label} {...m} />)}
        </div>
        <a
          href="https://spaced-out.github.io/ui-design-system/?path=/docs/introduction--docs"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-dark"
          style={{ fontSize: '14px', padding: '12px 28px', display: 'inline-block', textDecoration: 'none' }}
        >
          View Storybook →
        </a>
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
              : currentTabId === 'automations'
              ? <AutomationsTab onOpenCaseStudy={onOpenCaseStudy} sectionRef={sectionRef} />
              : currentTabId === 'mobile'
              ? <MobileTab />
              : currentTabId === 'arvr'
              ? <ARVRTab />
              : currentTabId === 'design-system'
              ? <DesignSystemTab />
              : <PlaceholderTab tabId={currentTabId} />}
          </div>
        </div>
      </section>
    </>
  )
}
