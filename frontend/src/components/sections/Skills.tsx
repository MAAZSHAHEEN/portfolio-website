import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { Skeleton } from '@/components/ui/skeleton'
import { useSkills } from '@/lib/queries'

export function Skills() {
  const { data: groups, isLoading, isError } = useSkills()
  const [primary, ...rest] = groups ?? []

  return (
    <section id="skills" className="section-shell" aria-labelledby="skills-title">
      <Container>
        <SectionHeading
          id="skills-title"
          eyebrow="03 / Skills & tools"
          title="The stack behind the work"
        />
        <div className="skills-layout">
          {isLoading ? (
            <>
              <Skeleton className="h-72 w-full" />
              <Skeleton className="h-72 w-full" />
            </>
          ) : isError || !groups || !primary ? (
            <p role="alert" className="text-destructive">
              Could not load skills from the API.
            </p>
          ) : (
            <>
              <Reveal className="skill-primary">
                <div className="skill-primary-head">
                  <h3 className="skill-group-title">{primary.group}</h3>
                  <span className="project-label" aria-hidden="true">
                    Primary focus
                  </span>
                </div>
                <ul className="skill-primary-list">
                  {primary.items.map((item, index) => (
                    <li key={item}>
                      <span className="skill-index" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.08} className="skill-rows">
                {rest.map((group) => (
                  <div key={group.group} className="skill-row">
                    <h3 className="skill-group-title">{group.group}</h3>
                    <ul className="skill-inline">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Reveal>
            </>
          )}
        </div>
      </Container>
    </section>
  )
}
