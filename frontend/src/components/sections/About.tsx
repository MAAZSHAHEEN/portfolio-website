import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/lib/queries'

export function About() {
  const { data: profile, isLoading, isError } = useProfile()
  return (
    <section id="about" className="section-shell">
      <Container>
        <SectionHeading eyebrow="02 / About" title="Behind the code" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          {isLoading ? (
            <>
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-60 w-full" />
            </>
          ) : isError || !profile ? (
            <p role="alert" className="text-destructive">
              Could not load profile from the API.
            </p>
          ) : (
            <>
              <Reveal>
                <p className="max-w-2xl text-lg leading-loose text-muted-foreground">
                  {profile.bio}
                </p>
                <p className="mt-6 font-mono text-sm text-muted-foreground">{profile.location}</p>
              </Reveal>
              <Reveal delay={0.1} className="opportunity-panel">
                <h3 className="mb-6 text-lg font-semibold">Currently looking for</h3>
                <dl className="space-y-5 text-sm">
                  <div>
                    <dt className="eyebrow mb-2">Roles</dt>
                    <dd className="leading-relaxed">{profile.lookingFor.roles.join(' / ')}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow mb-2">Focus</dt>
                    <dd className="leading-relaxed">{profile.lookingFor.fields.join(' / ')}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow mb-2">Locations</dt>
                    <dd className="leading-relaxed">{profile.lookingFor.locations.join(' / ')}</dd>
                  </div>
                </dl>
              </Reveal>
            </>
          )}
        </div>
      </Container>
    </section>
  )
}
