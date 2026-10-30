import { Download, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { Container } from '@/components/layout/Container'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { CV_DOWNLOAD_NAME } from '@/lib/cv'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/lib/nav'
import { useProfile } from '@/lib/queries'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  // Starts false so prerendered markup matches; the effect syncs the real position.
  const [scrolled, setScrolled] = useState(false)
  const { data: profile } = useProfile()
  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // While open: Esc closes and returns focus, Tab stays inside the bar + menu,
  // the page behind does not scroll, and wide viewports close it automatically.
  useEffect(() => {
    if (!isOpen) return
    const close = (restoreFocus: boolean) => {
      setIsOpen(false)
      if (restoreFocus) toggle.current?.focus()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close(true)
        return
      }
      if (event.key !== 'Tab' || !header.current) return
      const items = [...header.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null,
      )
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    const wide = window.matchMedia('(min-width: 768px)')
    const onWide = () => wide.matches && close(false)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    wide.addEventListener('change', onWide)
    document.querySelector<HTMLElement>('#mobile-nav a')?.focus()
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
      wide.removeEventListener('change', onWide)
    }
  }, [isOpen])

  return (
    <header
      ref={header}
      className={cn('site-header', (scrolled || isOpen) && 'site-header-scrolled')}
    >
      <Container>
        <nav aria-label="Primary" className="flex min-h-16 items-center justify-between gap-3">
          <Link to="/" className="focus-link nav-brand">
            <span className="nav-brand-mark" aria-hidden="true" />
            {profile?.name ?? 'Portfolio'}
          </Link>
          <div className="flex items-center gap-2 lg:gap-5">
            <ul className="hidden items-center gap-5 md:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-link nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {profile ? (
              <a
                href={profile.resumeUrl}
                download={CV_DOWNLOAD_NAME}
                className="nav-cv"
                aria-label="Download CV (PDF)"
              >
                <Download className="size-3.5" aria-hidden="true" />
                CV
              </a>
            ) : null}
            <ThemeToggle />
            <button
              ref={toggle}
              id="menu-toggle"
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex size-11 items-center justify-center rounded-lg border border-border md:hidden"
            >
              {isOpen ? (
                <X className="size-4" aria-hidden="true" />
              ) : (
                <Menu className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </Container>
      <div id="mobile-nav" hidden={!isOpen} className="mobile-nav md:hidden">
        <Container>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link to={link.href} onClick={() => setIsOpen(false)} className="mobile-nav-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {profile ? (
            <div className="mobile-nav-foot">
              <a href={`mailto:${profile.email}`} className="text-link">
                {profile.email}
              </a>
              <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          ) : null}
        </Container>
      </div>
    </header>
  )
}
