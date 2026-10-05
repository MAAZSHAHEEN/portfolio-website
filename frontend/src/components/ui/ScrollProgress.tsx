import { useEffect, useRef } from 'react'

export function ScrollProgress() {
  const line = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = line.current
    if (!node) return
    let frame = 0
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    function paint() {
      frame = 0
      const range = document.documentElement.scrollHeight - window.innerHeight
      const progress = range > 0 ? Math.max(0, Math.min(1, window.scrollY / range)) : 0
      node!.style.transform = `scaleX(${progress})`
    }
    function update() {
      if (!media.matches && !document.hidden && !frame) frame = requestAnimationFrame(paint)
    }
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null
    observer?.observe(document.body)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    document.addEventListener('visibilitychange', update)
    media.addEventListener('change', update)
    update()
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      document.removeEventListener('visibilitychange', update)
      media.removeEventListener('change', update)
    }
  }, [])

  return <div ref={line} className="scroll-progress" aria-hidden="true" />
}
