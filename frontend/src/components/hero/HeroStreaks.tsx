import type { CSSProperties } from 'react'

// Stable decorative values; no randomness, timers, or per-frame React updates.
// Each trace plays once during the intro (CSS), then again only while the hero is hovered.
const streaks = [
  [3, 12, 26, 0.6, 8.7, -2.1],
  [81, 23, 34, 0.5, 11.3, -6.5],
  [8, 42, 22, 0.65, 9.1, -4.8],
  [87, 57, 30, 0.45, 12.7, -0.9],
  [1, 72, 38, 0.55, 10.4, -7.2],
  [78, 82, 24, 0.5, 8.3, -3.4],
  [15, 26, 32, 0.45, 13.1, -9.6],
  [74, 8, 28, 0.6, 9.7, -5.7],
  [10, 88, 20, 0.5, 11.9, -1.6],
  [91, 35, 36, 0.55, 10.1, -8.3],
  [19, 59, 25, 0.45, 12.3, -4.1],
  [83, 70, 29, 0.6, 9.3, -6.8],
] as const

export function HeroStreaks() {
  return (
    <div className="hero-streaks" aria-hidden="true">
      {streaks.map(([left, top, length, opacity, duration, delay], index) => (
        <span
          key={index}
          className="hero-streak"
          style={
            {
              '--streak-left': `${left}%`,
              '--streak-top': `${top}%`,
              '--streak-length': `${length}px`,
              '--streak-opacity': opacity,
              '--streak-duration': `${duration}s`,
              '--streak-delay': `${(Math.abs(delay) / 4).toFixed(2)}s`,
              '--streak-tone': `var(--streak-${['amber', 'neutral', 'gold'][index % 3]})`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
