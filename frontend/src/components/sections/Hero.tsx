import { ArrowRight, Download } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/lib/queries'

export function Hero() {
  const { data: profile, isLoading, isError } = useProfile()

  return (
    <section id="hero" className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-96 bg-brand/10 blur-3xl"
      />
      <Container>
        {isLoading ? (
          <div className="max-w-2xl space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError || !profile ? (
          <p className="text-destructive">Could not load profile from the API.</p>
        ) : (
          <Reveal>
            <p className="text-sm font-semibold tracking-widest text-brand-link uppercase">
              {profile.location}
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              {profile.name}
            </h1>
            <p className="mt-4 text-xl text-muted-foreground sm:text-2xl">{profile.title}</p>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              {profile.tagline}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="h-11 rounded-lg px-6 text-base"
                render={<a href="#projects" />}
              >
                View Projects
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded-lg px-6 text-base"
                render={<a href={profile.resumeUrl} download />}
              >
                <Download className="size-4" aria-hidden="true" />
                Download CV
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-11 rounded-lg px-6 text-base"
                render={<a href="#contact" />}
              >
                Contact
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  )
}
