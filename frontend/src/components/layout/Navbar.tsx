import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Container } from '@/components/layout/Container'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/lib/nav'
import { useProfile } from '@/lib/queries'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 20,
  )
  const { data: profile } = useProfile()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
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
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="focus-link inline-flex min-h-11 items-center font-mono text-sm font-medium tracking-tight"
          >
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
          </ul>
        </div>
      </Container>
    </header>
  )
}
