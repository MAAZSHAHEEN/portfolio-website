import { ArrowRight, Download } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { CopyEmailButton } from '@/components/contact/CopyEmailButton'
import { HeroLamp } from '@/components/hero/HeroLamp'
import { HeroStreaks } from '@/components/hero/HeroStreaks'
import { GitHubIcon, LinkedInIcon } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CV_DOWNLOAD_NAME } from '@/lib/cv'
import { useProfile, useProjects, useSkills } from '@/lib/queries'

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

/** Splits "a · b" so narrow screens can stack the parts as two clean lines. */
function AvailabilityParts({ text }: { text: string }) {
  const parts = text.split(' · ')
  return parts.map((part, index) => (
    <Fragment key={part}>
      <span className="hero-availability-part">{part}</span>
      {index < parts.length - 1 ? <span className="hero-availability-sep"> · </span> : null}
    </Fragment>
  ))
}

export function Hero() {
  const { data: profile, isLoading, isError } = useProfile()
  const { data: skills } = useSkills()
  const { data: projects } = useProjects()
  const backend = skills?.[0]
  const featured = projects?.find((project) => project.featured) ?? projects?.[0]

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
            <HeroLamp name={profile.name} eyebrow={profile.title}>
              <p className="hero-availability">
                <span className="status-dot" aria-hidden="true" />
                <span className="hero-availability-text">
                  <AvailabilityParts text={profile.availability} />
                </span>
              </p>
              <p className="hero-tagline">{profile.tagline}</p>
              <div className="hero-actions">
                <Button
                  size="lg"
                  render={<Link to={featured ? `/projects/${featured.slug}` : '/#projects'} />}
                >
                  View case studies <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<a href={profile.resumeUrl} download={CV_DOWNLOAD_NAME} />}
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download CV (PDF)
                </Button>
              </div>
              <ul className="hero-socials" aria-label="Profiles and contact">
                <li>
                  <CopyEmailButton email={profile.email} className="text-link" />
                </li>
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
              </ul>
            </HeroLamp>
            <dl className="hero-meta">
              <div>
                <dt>Based in</dt>
                <dd>
                  <MetaList items={[profile.location, profile.timezone]} />
                </dd>
              </div>
              <div>
                <dt>Looking for</dt>
                <dd>
                  <MetaList items={profile.lookingFor.locations} />
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
