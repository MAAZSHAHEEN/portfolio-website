import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useSkills } from '@/lib/queries'

export function Skills() {
  const { data: skillGroups, isLoading, isError } = useSkills()

  return (
    <section id="skills" className="scroll-mt-20 border-t border-border py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="02 · Skills" title="What I work with" />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full" />
            ))
          ) : isError || !skillGroups ? (
            <p className="text-destructive">Could not load skills from the API.</p>
          ) : (
            skillGroups.map((group, index) => (
              <Reveal key={group.group} delay={index * 0.05}>
                <div>
                  <h3 className="font-display text-base font-semibold">{group.group}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Badge key={item} variant="outline" className="px-3 py-1 text-sm">
                        {item}
                      </Badge>
                    ))}
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
