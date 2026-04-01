import { useState } from 'react'

export default function CaseStudyAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={i}
            style={{
              background: isOpen
                ? 'rgba(255,255,255,0.85)'
                : 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              overflow: 'hidden',
              border: `1.5px solid ${isOpen ? 'rgba(17,17,17,0.12)' : '#ebebeb'}`,
              borderLeft: isOpen
                ? '3px solid #111'
                : '3px solid transparent',
              transition: 'all 0.35s cubic-bezier(0.33, 1, 0.68, 1)',
            }}
          >
            <button
              onClick={() => toggle(i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '22px 24px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                gap: '16px',
              }}
            >
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#111',
                  letterSpacing: '-0.01em',
                }}
              >
                {item.title}
              </span>
              <span
                style={{
                  flexShrink: 0,
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.35s cubic-bezier(0.33, 1, 0.68, 1)',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 5L7 10L12 5"
                    stroke="#555"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            <div
              style={{
                maxHeight: isOpen ? '9999px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.45s cubic-bezier(0.33, 1, 0.68, 1)',
              }}
            >
              <div style={{ padding: '0 24px 24px' }}>{item.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
