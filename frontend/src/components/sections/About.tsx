import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/lib/queries'

export function About() {
  const { data: profile, isLoading, isError } = useProfile()
  return (
    <section id="about" className="section-shell" aria-labelledby="about-title">
      <Container>
        <div className="about-grid">
          <SectionHeading id="about-title" eyebrow="02 / About" title="Behind the code" />
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : isError || !profile ? (
            <p role="alert" className="text-destructive">
              Could not load profile from the API.
            </p>
          ) : (
            <div className="min-w-0">
              <Reveal>
                <p className="about-bio">{profile.bio}</p>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="opportunity-panel">
                  <h3 className="opportunity-title">
                    <span className="status-dot" aria-hidden="true" />
                    Currently looking for
                  </h3>
                  <dl className="opportunity-list">
                    <div>
                      <dt>Roles</dt>
                      <dd>{profile.lookingFor.roles.join(' · ')}</dd>
                    </div>
                    <div>
                      <dt>Focus</dt>
                      <dd>{profile.lookingFor.fields.join(' · ')}</dd>
                    </div>
                    <div>
                      <dt>Locations</dt>
                      <dd>{profile.lookingFor.locations.join(' · ')}</dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
