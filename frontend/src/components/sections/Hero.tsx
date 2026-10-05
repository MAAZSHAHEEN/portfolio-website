import { ArrowRight, Download, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { HeroLamp } from '@/components/hero/HeroLamp'
import { HeroStreaks } from '@/components/hero/HeroStreaks'
import { GitHubIcon, LinkedInIcon } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile, useSkills } from '@/lib/queries'

export function Hero() {
  const { data: profile, isLoading, isError } = useProfile()
  const { data: skills } = useSkills()
  const backend = skills?.[0]

  return (
    <section id="hero" className="hero-shell lamp-hero">
      <HeroStreaks />
      <Container>
        {isLoading ? (
          <div className="mx-auto max-w-2xl space-y-5 py-12">
            <Skeleton className="mx-auto h-5 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="mx-auto h-8 w-2/3" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError || !profile ? (
          <p role="alert" className="text-destructive">
            Could not load profile from the API.
          </p>
        ) : (
          <>
            <HeroLamp name={profile.name}>
              <p className="hero-role">{profile.title}</p>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {profile.tagline}
              </p>
              <p className="mt-4 flex items-center justify-center gap-2 font-mono text-xs text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden="true" />
                {profile.location}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button size="lg" render={<Link to="/#projects" />}>
                  View Projects <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<a href={profile.resumeUrl} download />}
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download CV
                </Button>
                <Button size="lg" variant="ghost" render={<Link to="/#contact" />}>
                  Contact
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-5">
                <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">
                  <GitHubIcon className="size-4" />
                  GitHub
                </a>
                <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">
                  <LinkedInIcon className="size-4" />
                  LinkedIn
                </a>
              </div>
            </HeroLamp>
            {backend ? (
              <details className="lamp-profile mx-auto mt-6 max-w-2xl">
                <summary className="font-mono text-xs text-muted-foreground">
                  Technical profile <span className="ml-2 text-brand-link">/ {backend.group}</span>
                </summary>
                <ul className="flex flex-wrap justify-center gap-2 px-4 pt-2">
                  {backend.items.map((skill) => (
                    <li key={skill} className="tech-tag">
                      {skill}
                    </li>
                  ))}
                </ul>
                <div className="pb-3 text-center">
                  <Link to="/#skills" className="text-link">
                    Explore the stack <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </details>
            ) : null}
          </>
        )}
      </Container>
    </section>
  )
}
