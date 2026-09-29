import { GraduationCap } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/lib/queries'

export function Education() {
  const { data: profile, isLoading, isError } = useProfile()

  return (
    <section id="education" className="scroll-mt-20 border-t border-border py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="04 · Education" title="Education" />

        <div className="mt-12 space-y-6">
          {isLoading ? (
            <Skeleton className="h-20 w-full max-w-xl" />
          ) : isError || !profile ? (
            <p className="text-destructive">Could not load education from the API.</p>
          ) : (
            profile.education.map((entry, index) => (
              <Reveal key={`${entry.institution}-${entry.degree}`} delay={index * 0.05}>
                <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand-link">
                    <GraduationCap className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{entry.degree}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{entry.institution}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {entry.startYear} &ndash; {entry.endYear}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>
      </Container>
    </section>
  )
}
