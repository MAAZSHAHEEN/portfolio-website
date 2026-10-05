import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { Skeleton } from '@/components/ui/skeleton'
import { useSkills } from '@/lib/queries'

export function Skills() {
  const { data: groups, isLoading, isError } = useSkills()
  return (
    <section id="skills" className="section-shell">
      <Container>
        <SectionHeading eyebrow="03 / Skills & tools" title="The stack behind the work" />
        <div className="skills-grid mt-10">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full" />
            ))
          ) : isError || !groups ? (
            <p role="alert" className="text-destructive">
              Could not load skills from the API.
            </p>
          ) : (
            groups.map((group, index) => (
              <Reveal
                key={group.group}
                delay={index * 0.08}
                className={`skill-panel ${index === 0 ? 'skill-panel-primary' : ''}`}
              >
                <h3 className="font-mono text-sm font-medium text-brand-link">{group.group}</h3>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-3 font-mono text-sm leading-relaxed text-muted-foreground"
                    >
                      <span aria-hidden="true" className="font-mono text-brand-link">
                        /
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))
          )}
        </div>
      </Container>
    </section>
  )
}
