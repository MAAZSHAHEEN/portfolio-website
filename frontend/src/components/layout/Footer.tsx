import { ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Container } from '@/components/layout/Container'
import { NAV_LINKS } from '@/lib/nav'
import { useProfile } from '@/lib/queries'

export function Footer() {
  const { data: profile } = useProfile()
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-grid">
          <div>
            <Link to="/" className="focus-link footer-name">
              {profile?.name ?? 'Portfolio'}
            </Link>
            {profile ? <p className="footer-role">{profile.title}</p> : null}
          </div>
          <nav aria-label="Footer">
            <p className="footer-label">Navigate</p>
            <ul className="footer-links footer-links-grid">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {profile ? (
            <div>
              <p className="footer-label">Connect</p>
              <ul className="footer-links">
                <li>
                  <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </li>
                <li>
                  <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a className="text-link" href={`mailto:${profile.email}`}>
                    Email
                  </a>
                </li>
                <li>
                  <a className="text-link" href={profile.resumeUrl} download>
                    CV
                  </a>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} {profile?.name ?? 'Portfolio'}. Built with React and
            FastAPI.
          </p>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              window.scrollTo({ top: 0 })
              document.getElementById('main-content')?.focus({ preventScroll: true })
            }}
          >
            Back to top <ArrowUp className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </Container>
    </footer>
  )
}
