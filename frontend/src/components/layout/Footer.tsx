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
            <Link to="/" className="focus-link text-lg font-semibold">
              {profile?.name ?? 'Portfolio'}
            </Link>
            {profile ? <p className="mt-3 text-sm text-muted-foreground">{profile.title}</p> : null}
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow mb-3">Navigate</p>
            <ul className="grid grid-cols-2 gap-x-5">
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
              <p className="eyebrow mb-3">Connect</p>
              <ul>
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
              </ul>
            </div>
          ) : null}
        </div>
        <p className="border-t border-border py-6 font-mono text-xs leading-relaxed text-muted-foreground">
          &copy; {new Date().getFullYear()} {profile?.name ?? 'Portfolio'}. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}
