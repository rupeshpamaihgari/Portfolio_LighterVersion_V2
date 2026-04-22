export default function CaseStudyCallout({ children }) {
  return (
    <div
      style={{
        background: 'rgba(244,165,138,0.08)',
        borderLeft: '3px solid #F4A58A',
        borderRadius: '0 14px 14px 0',
        padding: '20px 24px',
        margin: '28px 0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <p
        style={{
          fontSize: '14.5px',
          lineHeight: 1.7,
          color: '#444',
          fontWeight: 500,
          margin: 0,
        }}
      >
        {children}
      </p>
    </div>
  )
}
