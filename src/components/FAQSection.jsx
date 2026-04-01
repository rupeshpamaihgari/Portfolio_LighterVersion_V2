import { useState } from 'react'
import useInView from '../hooks/useInView'

const faqs = [
  {
    question: 'What is your design process?',
    answer:
      'My design process involves four key phases: research, design, prototype, and test. In research, I gather deep insights about users through interviews, surveys, and competitive analysis. In design, I create wireframes and high-fidelity visual designs grounded in those insights. In prototype, I build interactive models that simulate the real product experience. In test, I collect user feedback to validate decisions and continually refine the solution until it truly works.',
  },
  {
    question: 'What tools and software do you use for UX design?',
    answer:
      'I use Figma for design, prototyping, and design system management. Notion keeps documentation, research notes, and project plans organized. Hotjar and FullStory provide user analytics and session recordings. Framer powers interactive prototyping and production-quality web development. Miro facilitates remote workshops and journey mapping. The exact toolkit adapts to each project\'s needs, always prioritizing what best serves the work.',
  },
  {
    question: 'How do you measure the success of your UX designs?',
    answer:
      'Success is measured through a combination of qualitative and quantitative signals. I conduct moderated usability testing sessions to observe real users interacting with designs. Analytics data tracks task completion rates, drop-off points, and engagement patterns. User satisfaction scores (NPS, SUS, CSAT) provide benchmarks. Ultimately, the north star is whether the design moves meaningful business metrics — conversion rates, retention, and activation — while genuinely improving user satisfaction.',
  },
  {
    question: 'Do you work with early-stage startups or established companies?',
    answer:
      'Both. With early-stage startups, the focus is often on rapid validation — getting to a testable product quickly without over-designing. With established companies, the work tends to involve deeper design systems, complex workflows, and scaling existing products. In both cases, the goal is the same: solve the right problem in the most user-centered, business-aligned way possible.',
  },
]

function FAQItem({ faq, index, isOpen, onToggle }) {
  return (
    <div
      style={{
        borderBottom: '1px solid rgba(0,0,0,0.09)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => onToggle(index)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '24px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
        aria-expanded={isOpen}
      >
        <span
          style={{
            fontSize: 'clamp(15px, 1.8vw, 18px)',
            fontWeight: isOpen ? 600 : 500,
            color: isOpen ? '#111' : '#333',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
            transition: 'color 0.2s ease, font-weight 0.2s ease',
          }}
        >
          {faq.question}
        </span>
        <span
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: isOpen ? '#111' : '#f0efea',
            color: isOpen ? '#fff' : '#555',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 300,
            flexShrink: 0,
            transition: 'background 0.25s ease, color 0.25s ease, transform 0.3s ease',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </span>
      </button>

      <div
        className={`accordion-content${isOpen ? ' open' : ''}`}
        style={{
          maxHeight: isOpen ? '300px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.33, 1, 0.68, 1)',
        }}
      >
        <p
          style={{
            fontSize: '15px',
            lineHeight: 1.75,
            color: '#555',
            fontWeight: 400,
            paddingBottom: '24px',
            maxWidth: '720px',
            letterSpacing: '-0.01em',
          }}
        >
          {faq.answer}
        </p>
      </div>
    </div>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)
  const { ref: headRef } = useInView()
  const { ref: bodyRef } = useInView({ rootMargin: '0px 0px -40px 0px' })

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section
      id="faq"
      style={{
        paddingTop: '120px',
        paddingBottom: '120px',
      }}
    >
      <div
        className="section-container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '80px',
          alignItems: 'start',
        }}
      >
        {/* Left — header */}
        <div ref={headRef} className="reveal" style={{ position: 'sticky', top: '100px' }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: '12px',
            }}
          >
            FAQ
          </p>
          <h2
            style={{
              fontSize: 'clamp(26px, 3vw, 40px)',
              fontWeight: 650,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: '#111',
              marginBottom: '16px',
            }}
          >
            Common Queries Answered
          </h2>
          <p
            style={{
              fontSize: '14.5px',
              lineHeight: 1.65,
              color: '#777',
              letterSpacing: '-0.01em',
            }}
          >
            Everything you need to know about working together. Can't find an answer? Reach out directly.
          </p>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '24px',
              fontSize: '13.5px',
              fontWeight: 500,
              color: '#111',
              textDecoration: 'none',
              borderBottom: '1px solid #111',
              paddingBottom: '2px',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.65' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
          >
            Get in touch ↗
          </a>
        </div>

        {/* Right — accordion */}
        <div ref={bodyRef} className="reveal">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
