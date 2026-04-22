import { useState } from 'react'

const PALETTE = ['#F4A58A', '#B8D4F8', '#B8F4D4', '#F8E4A0', '#D4B8F8', '#c8f4f0']

export default function CaseStudyAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        const accent = PALETTE[i % PALETTE.length]
        return (
          <div
            key={i}
            style={{
              background: isOpen ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              overflow: 'hidden',
              borderTop: `1.5px solid ${isOpen ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.06)'}`,
              borderRight: `1.5px solid ${isOpen ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.06)'}`,
              borderBottom: `1.5px solid ${isOpen ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.06)'}`,
              borderLeft: isOpen ? `3px solid ${accent}` : '3px solid transparent',
              transition: 'all 0.35s cubic-bezier(0.33, 1, 0.68, 1)',
              boxShadow: isOpen ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            <button
              onClick={() => toggle(i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                gap: '16px',
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isOpen ? accent : '#ddd',
                    flexShrink: 0,
                    transition: 'background 0.3s ease',
                  }}
                />
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#111',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.title}
                </span>
              </div>
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
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 5L7 10L12 5"
                    stroke={isOpen ? accent : '#aaa'}
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
