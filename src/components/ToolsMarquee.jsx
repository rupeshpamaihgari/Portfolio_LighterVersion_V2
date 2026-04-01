const tools = [
  { name: 'Figma',    icon: '🎨' },
  { name: 'Framer',   icon: '⚡' },
  { name: 'Notion',   icon: '📝' },
  { name: 'Webflow',  icon: '🌊' },
  { name: 'Hotjar',   icon: '🔥' },
  { name: 'Sketch',   icon: '💎' },
  { name: 'Miro',     icon: '🗺️' },
  { name: 'Zeplin',   icon: '🔧' },
  { name: 'Adobe XD', icon: '✏️' },
]

// Duplicate for seamless loop
const doubled = [...tools, ...tools]

function ToolChip({ icon, name }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: '#ffffff',
        border: '1.5px solid rgba(0,0,0,0.1)',
        borderRadius: '999px',
        padding: '9px 18px',
        whiteSpace: 'nowrap',
        fontSize: '13.5px',
        fontWeight: 500,
        color: '#333',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: '16px', lineHeight: 1 }}>{icon}</span>
      <span>{name}</span>
    </div>
  )
}

export default function ToolsMarquee() {
  return (
    <div
      style={{
        paddingTop: '28px',
        paddingBottom: '0',
      }}
    >
      {/* Label */}
      <p
        style={{
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#999',
          marginBottom: '16px',
        }}
      >
        Tools which I use on a daily basis.
      </p>

      {/* Marquee */}
      <div
        className="marquee-wrapper"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      >
        <div
          className="marquee-track animate-marquee"
          style={{ gap: '12px' }}
        >
          {doubled.map((tool, i) => (
            <div key={i} style={{ paddingRight: '12px' }}>
              <ToolChip icon={tool.icon} name={tool.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
