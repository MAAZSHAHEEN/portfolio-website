import { GraduationCap } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/lib/queries'

export function Education() {
  const { data: profile, isLoading, isError } = useProfile()
  return (
    <section id="education" className="section-shell" aria-labelledby="education-title">
      <Container>
        <div className="about-grid">
          <SectionHeading
            id="education-title"
            eyebrow="04 / Education"
            title="Academic foundation"
          />
          <div className="min-w-0">
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : isError || !profile ? (
              <p role="alert" className="text-destructive">
                Could not load education from the API.
              </p>
            ) : (
              <Reveal>
                <ul className="education-list">
                  {profile.education.map((entry) => (
                    <li key={`${entry.institution}-${entry.degree}`} className="education-row">
                      <GraduationCap className="education-icon" aria-hidden="true" />
                      <div className="min-w-0">
                        <h3 className="education-degree">{entry.degree}</h3>
                        <p className="education-school">{entry.institution}</p>
                      </div>
                      <p className="education-years">
                        <time dateTime={String(entry.startYear)}>{entry.startYear}</time>
                        {' – '}
                        <time dateTime={String(entry.endYear)}>{entry.endYear}</time>
                      </p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
