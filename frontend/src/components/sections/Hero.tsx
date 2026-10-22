import { ArrowRight, Download, Mail } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { HeroLamp } from '@/components/hero/HeroLamp'
import { HeroStreaks } from '@/components/hero/HeroStreaks'
import { GitHubIcon, LinkedInIcon } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile, useSkills } from '@/lib/queries'

/** Keeps each item intact; separators trail items so wrapped lines never start with one. */
function MetaList({ items }: { items: string[] }) {
  return items.map((item, index) => (
    <Fragment key={item}>
      <span className="hero-meta-item">
        {item}
        {index < items.length - 1 ? '\u00a0·' : ''}
      </span>
      {index < items.length - 1 ? ' ' : ''}
    </Fragment>
  ))
}

export function Hero() {
  const { data: profile, isLoading, isError } = useProfile()
  const { data: skills } = useSkills()
  const backend = skills?.[0]

  return (
    <section id="hero" aria-label="Introduction" className="hero-shell lamp-hero">
      <HeroStreaks />
      <Container>
        {isLoading ? (
          <div className="mx-auto max-w-2xl space-y-5 py-16">
            <Skeleton className="mx-auto h-24 w-24 rounded-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="mx-auto h-8 w-2/3" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError || !profile ? (
          <p role="alert" className="py-16 text-center text-destructive">
            Could not load profile from the API.
          </p>
        ) : (
          <>
            <HeroLamp name={profile.name}>
              <p className="hero-role">{profile.title}</p>
              <p className="hero-availability">
                <span className="status-dot" aria-hidden="true" />
                {profile.availability}
              </p>
              <p className="hero-tagline">{profile.tagline}</p>
              <div className="hero-actions">
                <Button size="lg" render={<Link to="/#projects" />}>
                  View projects <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<a href={profile.resumeUrl} download />}
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download CV
                </Button>
              </div>
              <ul className="hero-socials" aria-label="Profiles and contact">
                <li>
                  <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">
                    <GitHubIcon className="size-4" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">
                    <LinkedInIcon className="size-4" />
                    LinkedIn
                  </a>
                </li>
                <li>
                  <Link className="text-link" to="/#contact">
                    <Mail className="size-4" aria-hidden="true" />
                    Contact
                  </Link>
                </li>
              </ul>
            </HeroLamp>
            <dl className="hero-meta">
              <div>
                <dt>Based in</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>
                  <MetaList items={profile.lookingFor.fields} />
                </dd>
              </div>
              {backend ? (
                <div>
                  <dt>Core stack</dt>
                  <dd>
                    <MetaList items={backend.items.slice(0, 4)} />{' '}
                    <Link to="/#skills" className="hero-meta-link">
                      + more<span className="sr-only"> skills</span>
                    </Link>
                  </dd>
                </div>
              ) : null}
            </dl>
          </>
        )}
      </Container>
    </section>
  )
}
