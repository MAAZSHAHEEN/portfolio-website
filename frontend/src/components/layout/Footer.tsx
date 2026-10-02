import { Mail } from 'lucide-react'

import { GitHubIcon, LinkedInIcon } from '@/components/icons'
import { useProfile } from '@/lib/queries'

export function Footer() {
  const { data: profile } = useProfile()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p>
          &copy; {year} {profile?.name ?? 'Portfolio'}. All rights reserved.
        </p>

        {profile ? (
          <ul className="flex items-center gap-4">
            <li>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:outline-none"
              >
                <GitHubIcon className="size-4" />
              </a>
            </li>
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:outline-none"
              >
                <LinkedInIcon className="size-4" />
              </a>
            </li>
            <li>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:outline-none"
              >
                <Mail className="size-4" aria-hidden="true" />
              </a>
            </li>
          </ul>
        ) : null}
      </div>
    </footer>
  )
}
