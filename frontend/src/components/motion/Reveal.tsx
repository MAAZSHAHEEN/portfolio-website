import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import { useReducedMotion } from '@/hooks/useReducedMotion'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Stagger delay in seconds, useful when rendering a list of Reveals. */
  delay?: number
}

/** Fades and slides content in once it scrolls into view. No-ops when the
 * user prefers reduced motion. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const element = useRef<HTMLDivElement>(null)
  const revealed = useRef(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const node = element.current
    if (!node || reduced || revealed.current || !('IntersectionObserver' in window)) return
    const show = () => {
      revealed.current = true
      node.classList.remove('reveal-pending')
      observer.disconnect()
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) show()
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
    )
    observer.observe(node)
    node.classList.add('reveal-pending')
    node.addEventListener('focusin', show)
    return () => {
      observer.disconnect()
      node.removeEventListener('focusin', show)
      node.classList.remove('reveal-pending')
    }
  }, [reduced])

  return (
    <div
      ref={element}
      className={`reveal ${className ?? ''}`}
      style={{ '--reveal-delay': `${Math.max(0, Math.min(delay, 0.24))}s` } as CSSProperties}
    >
      {children}
    </div>
  )
}
