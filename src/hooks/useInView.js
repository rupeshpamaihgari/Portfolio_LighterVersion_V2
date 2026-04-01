import { useEffect, useRef, useState } from 'react'

/**
 * useInView — triggers a visible state when the element enters the viewport.
 * Adds/removes the "visible" class on the ref'd element for CSS transitions.
 *
 * @param {Object} options
 * @param {number} options.threshold  - IntersectionObserver threshold (0–1)
 * @param {string} options.rootMargin - IntersectionObserver rootMargin
 * @param {boolean} options.once     - fire only once (don't un-reveal on scroll out)
 * @returns {{ ref: React.RefObject, inView: boolean }}
 */
export function useInView({
  threshold = 0.12,
  rootMargin = '0px 0px -60px 0px',
  once = true,
} = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          el.classList.add('visible')
          if (once) observer.unobserve(el)
        } else if (!once) {
          setInView(false)
          el.classList.remove('visible')
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, inView }
}

/**
 * useStaggerInView — reveals a container with staggered child animations.
 */
export function useStaggerInView(options = {}) {
  const { ref, inView } = useInView(options)
  return { ref, inView }
}

export default useInView
