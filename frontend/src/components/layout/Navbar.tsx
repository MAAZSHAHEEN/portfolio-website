import { Download, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Container } from '@/components/layout/Container'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/lib/nav'
import { useProfile } from '@/lib/queries'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  // Starts false so prerendered markup matches; the effect syncs the real position.
  const [scrolled, setScrolled] = useState(false)
  const { data: profile } = useProfile()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        document.getElementById('menu-toggle')?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-transparent bg-background/95 transition-[background-color,border-color,box-shadow] duration-300',
        scrolled && 'border-border bg-background/85 shadow-sm backdrop-blur-md',
      )}
    >
      <Container>
        <nav aria-label="Primary" className="flex min-h-18 items-center justify-between gap-3">
          <Link to="/" onClick={() => setIsOpen(false)} className="focus-link nav-brand">
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
              <a href={profile.resumeUrl} download className="nav-cv hidden md:inline-flex">
                <Download className="size-3.5" aria-hidden="true" />
                CV
              </a>
            ) : null}
            <ThemeToggle />
            <button
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
        <div id="mobile-nav" hidden={!isOpen} className="border-t border-border py-3 md:hidden">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-link nav-link flex min-h-12 w-full rounded-lg px-3 hover:bg-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {profile ? (
              <li>
                <a
                  href={profile.resumeUrl}
                  download
                  onClick={() => setIsOpen(false)}
                  className="text-link flex min-h-12 w-full gap-2 rounded-lg px-3 hover:bg-accent"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download CV
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </Container>
    </header>
  )
}
