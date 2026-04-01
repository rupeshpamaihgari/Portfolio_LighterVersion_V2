export function CaseStudyImage({ src, alt, style = {} }) {
  return (
    <div
      className="cs-media-frame"
      style={{
        borderRadius: '18px',
        overflow: 'hidden',
        margin: '28px 0',
        background: '#f5f4f1',
        border: '1.5px solid #e8e6e0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06), inset 0 1px 2px rgba(0,0,0,0.03)',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          transition: 'transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.015)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      />
    </div>
  )
}

export function CaseStudyVideo({ src, style = {} }) {
  return (
    <div
      className="cs-media-frame"
      style={{
        borderRadius: '18px',
        overflow: 'hidden',
        margin: '28px 0',
        background: '#000',
        border: '1.5px solid rgba(255,255,255,0.08)',
        aspectRatio: '16/9',
        position: 'relative',
        boxShadow: '0 6px 24px rgba(0,0,0,0.1), inset 0 1px 3px rgba(0,0,0,0.08)',
        ...style,
      }}
    >
      <iframe
        src={src}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        allow="autoplay"
        allowFullScreen
      />
    </div>
  )
}

export function CaseStudyScrollableImage({ src, alt }) {
  return (
    <div
      className="cs-media-frame"
      style={{
        borderRadius: '18px',
        overflow: 'auto',
        margin: '28px 0',
        background: '#f5f4f1',
        border: '1.5px solid #e8e6e0',
        maxHeight: '480px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06), inset 0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </div>
  )
}
