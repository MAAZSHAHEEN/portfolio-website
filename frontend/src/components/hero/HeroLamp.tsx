import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent, ReactNode } from 'react'

import { useReducedMotion } from '@/hooks/useReducedMotion'

type LampStyle = CSSProperties & {
  '--lamp-progress': number
  '--lamp-rest': number
}
type Drag = { pointerId: number; startX: number; offset: number }

/** CSS owns idle/settling motion; React only handles pointer input and phase changes. */
export function HeroLamp({ name, children }: { name: string; children: ReactNode }) {
  const [isOn, setIsOn] = useState(true)
  const [offset, setOffset] = useState(0)
  const [motion, setMotion] = useState<'auto' | 'drag' | 'settling' | 'waiting'>('auto')
  const scene = useRef<HTMLDivElement>(null)
  const drag = useRef<Drag | null>(null)
  const reducedMotion = useReducedMotion()
  const title = name.endsWith('.') ? name : `${name}.`

  useEffect(() => {
    if (reducedMotion || (motion !== 'settling' && motion !== 'waiting')) return
    const timer = window.setTimeout(
      () => setMotion(motion === 'settling' ? 'waiting' : 'auto'),
      motion === 'settling' ? 1350 : 2500,
    )
    return () => window.clearTimeout(timer)
  }, [motion, reducedMotion])

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (
      reducedMotion ||
      event.pointerType !== 'mouse' ||
      event.button !== 0 ||
      !window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)').matches
    )
      return
    // Read the animated value BEFORE removing the CSS animation, including mid-settle.
    const current = scene.current
      ? Number.parseFloat(getComputedStyle(scene.current).getPropertyValue('--lamp-progress'))
      : 0
    const position = Number.isFinite(current) ? current : 0
    setOffset(position)
    drag.current = { pointerId: event.pointerId, startX: event.clientX, offset: position }
    event.currentTarget.setPointerCapture(event.pointerId)
    setMotion('drag')
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current
    if (!current || current.pointerId !== event.pointerId) return
    if (
      reducedMotion ||
      !window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)').matches
    ) {
      endDrag(event)
      return
    }
    setOffset(Math.max(-64, Math.min(64, current.offset + event.clientX - current.startX)))
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.pointerId !== event.pointerId) return
    drag.current = null
    setMotion('settling')
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div
      ref={scene}
      className="lamp-scene"
      data-light={isOn ? 'on' : 'off'}
      data-motion={reducedMotion ? 'stationary' : motion}
      style={
        {
          '--lamp-progress': motion === 'drag' ? offset : 0,
          '--lamp-rest': offset,
        } as LampStyle
      }
    >
      <div className="lamp-stage">
        <div className="lamp-beam" aria-hidden="true" />
        <div className="lamp-ambient" aria-hidden="true" />
        <div className="lamp-rig" aria-hidden="true">
          <svg className="lamp-cable" viewBox="-120 0 240 140" fill="none">
            <path d="M0 0 V140" />
          </svg>
          <div
            className="lamp-fixture"
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={endDrag}
          >
            <span className="lamp-neck" />
            <span className="lamp-shade" />
            <span className="lamp-rim" />
            <span className="lamp-bulb" />
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isOn}
          aria-label="Hero lamp"
          className="lamp-switch"
          onClick={() => setIsOn((on) => !on)}
        >
          <span className="lamp-switch-track" aria-hidden="true">
            <span />
          </span>
          <span>{isOn ? 'ON' : 'OFF'}</span>
        </button>
      </div>
      <div className="lamp-copy">
        <h1 className="hero-name lamp-name">
          <span>{title}</span>
          <span className="lamp-name-light" aria-hidden="true">
            {title}
          </span>
        </h1>
        {children}
      </div>
    </div>
  )
}
