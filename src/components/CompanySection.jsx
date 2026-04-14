import useInView from '../hooks/useInView'

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

export default function CompanySection() {
  const { ref: leftRef }  = useInView()
  const { ref: rightRef } = useInView({ rootMargin: '0px 0px -40px 0px' })

  return (
    <section
      id="company"
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
        {/* LEFT — Impact stat */}
        <div ref={leftRef} className="reveal">
          {/* Eyebrow */}
          <p style={{
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#999', marginBottom: '20px',
          }}>
            Impact of AI Integration
          </p>

          {/* Big number */}
          <div style={{
            fontSize: 'clamp(72px, 9vw, 120px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
            color: '#111',
            marginBottom: '12px',
          }}>
            8–10 hrs
          </div>

          {/* Sub label */}
          <p style={{
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
            fontSize: '14.5px', lineHeight: 1.7, color: '#777',
            maxWidth: '380px', letterSpacing: '-0.01em',
          }}>
            Startups and scale-ups that invest in experienced product design early save significantly on costly redesigns, engineering rework, and failed product launches.
          </p>

          {/* Accent bar */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '36px' }}>
            {['#F4A58A', '#B8D4F8', '#B8F4D4', '#F8E4A0'].map((color, i) => (
              <div key={i} style={{
                height: '4px', flex: i === 0 ? '3' : '1',
                borderRadius: '2px', background: color,
              }} />
            ))}
          </div>
        </div>

        {/* RIGHT — Tool stack blobs */}
        <div ref={rightRef} className="reveal">
          <p style={{
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#999', marginBottom: '8px',
          }}>
            All tool stack
          </p>
          <p style={{
            fontSize: '14px', color: '#aaa', marginBottom: '28px',
            letterSpacing: '-0.01em', lineHeight: 1.5,
          }}>
            Tools I use across the design workflow
          </p>

          {/* Blobs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {TOOLS.map((tool) => (
              <div
                key={tool.name}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.85)',
                  border: `1.5px solid ${tool.color}88`,
                  borderRadius: '999px',
                  padding: '9px 16px 9px 10px',
                  boxShadow: `0 2px 10px ${tool.color}33`,
                  backdropFilter: 'blur(4px)',
                  transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = `0 6px 18px ${tool.color}55`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = `0 2px 10px ${tool.color}33`
                }}
              >
                {/* Coloured dot */}
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
