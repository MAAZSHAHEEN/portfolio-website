import { useEffect, useRef } from 'react'

/** Optional, non-interactive overlay. Native cursors always remain available. */
export function CustomCursor() {
  const root = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLSpanElement>(null)
  const ring = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = root.current
    const point = dot.current
    const halo = ring.current
    if (!node || !point || !halo) return
    const media = window.matchMedia(
      '(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    )
    let frame = 0
    let x = 0
    let y = 0
    let ringX = 0
    let ringY = 0
    let visible = false
    let selecting = false
    let pressed = false
    let lamp = false

    function hide() {
      visible = false
      node!.dataset.visible = 'false'
      cancelAnimationFrame(frame)
      frame = 0
    }
    function paint() {
      frame = 0
      if (!visible || document.hidden || !media.matches) return
      ringX += (x - ringX) * 0.45
      ringY += (y - ringY) * 0.45
      point!.style.transform = `translate3d(${x}px, ${y}px, 0)`
      halo!.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      if (Math.abs(x - ringX) + Math.abs(y - ringY) > 0.2) frame = requestAnimationFrame(paint)
    }
    function move(event: PointerEvent) {
      if (!media.matches || event.pointerType !== 'mouse' || document.hidden || selecting) {
        hide()
        return
      }
      const target = event.target instanceof Element ? event.target : null
      if (
        target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')
      ) {
        hide()
        return
      }
      x = event.clientX
      y = event.clientY
      if (!visible) {
        ringX = x
        ringY = y
        point!.style.transform = `translate3d(${x}px, ${y}px, 0)`
        halo!.style.transform = `translate3d(${x}px, ${y}px, 0)`
        visible = true
        node!.dataset.visible = 'true'
      }
      lamp = Boolean(target?.closest('.lamp-fixture'))
      node!.dataset.mode = lamp
        ? pressed
          ? 'grabbing'
          : 'grab'
        : target?.closest('a, button, summary, [role="button"], [role="switch"]')
          ? 'link'
          : target?.closest('.project-card')
            ? 'project'
            : 'normal'
      if (!frame) frame = requestAnimationFrame(paint)
    }
    function down() {
      pressed = true
      if (lamp) node!.dataset.mode = 'grabbing'
    }
    function up() {
      pressed = false
      selecting = false
      if (lamp) node!.dataset.mode = 'grab'
    }
    function selection() {
      selecting = true
      hide()
    }
    function reset() {
      pressed = false
      selecting = false
      lamp = false
      hide()
    }
    function out(event: PointerEvent) {
      if (!event.relatedTarget) hide()
    }
    function keyboard(event: KeyboardEvent) {
      if (event.key === 'Tab' || event.key === 'Escape') hide()
    }
    document.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerout', out, { passive: true })
    document.addEventListener('selectstart', selection)
    document.addEventListener('keydown', keyboard)
    document.addEventListener('visibilitychange', reset)
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    window.addEventListener('pointercancel', up, { passive: true })
    window.addEventListener('blur', reset)
    media.addEventListener('change', reset)
    return () => {
      hide()
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerout', out)
      document.removeEventListener('selectstart', selection)
      document.removeEventListener('keydown', keyboard)
      document.removeEventListener('visibilitychange', reset)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      window.removeEventListener('blur', reset)
      media.removeEventListener('change', reset)
    }
  }, [])

  return (
    <div ref={root} className="custom-cursor" data-visible="false" aria-hidden="true">
      <span ref={dot} className="cursor-position cursor-dot">
        <span />
      </span>
      <span ref={ring} className="cursor-position cursor-ring">
        <span />
      </span>
    </div>
  )
}
