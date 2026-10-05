import { GraduationCap } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/lib/queries'

export function Education() {
  const { data: profile, isLoading, isError } = useProfile()
  return (
    <section id="education" className="section-shell">
      <Container>
        <SectionHeading eyebrow="04 / Education" title="Academic foundation" />
        <div className="mt-10 space-y-5">
          {isLoading ? (
            <Skeleton className="h-28 w-full" />
          ) : isError || !profile ? (
            <p role="alert" className="text-destructive">
              Could not load education from the API.
            </p>
          ) : (
            profile.education.map((entry, index) => (
              <Reveal
                key={`${entry.institution}-${entry.degree}`}
                delay={index * 0.05}
                className="education-row"
              >
                <GraduationCap className="size-6 shrink-0 text-brand-link" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-semibold">{entry.degree}</h3>
                  <p className="mt-2 text-muted-foreground">{entry.institution}</p>
                </div>
                <p className="font-mono text-sm text-muted-foreground">
                  {entry.startYear} &ndash; {entry.endYear}
                </p>
              </Reveal>
            ))
          )}
        </div>
      </Container>
    </section>
  )
}
