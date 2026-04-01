export default function CaseStudyCallout({ children }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(16px)',
        borderLeft: '4px solid transparent',
        borderImage: 'linear-gradient(to bottom, #111, #555) 1',
        borderRadius: '0 14px 14px 0',
        padding: '24px 28px 24px 28px',
        margin: '28px 0',
        position: 'relative',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '20px',
          left: '28px',
          fontSize: '20px',
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        💡
      </span>
      <p
        style={{
          fontSize: '14.5px',
          lineHeight: 1.7,
          color: '#333',
          fontWeight: 400,
          margin: 0,
          paddingLeft: '32px',
        }}
      >
        {children}
      </p>
    </div>
  )
}
