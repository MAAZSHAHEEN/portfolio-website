import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { useExperience } from '@/lib/queries'

/** Renders only when site.json has visible experience entries. */
export function Experience({ eyebrow }: { eyebrow: string }) {
  const { data: entries } = useExperience()
  if (!entries?.length) return null
  return (
    <section id="experience" className="section-shell" aria-labelledby="experience-title">
      <Container>
        <div className="about-grid">
          <SectionHeading id="experience-title" eyebrow={eyebrow} title="Experience" />
          <ul className="education-list min-w-0">
            {entries.map((entry) => (
              <li key={`${entry.company}-${entry.role}`} className="education-row">
                <span aria-hidden="true" />
                <div className="min-w-0">
                  <h3 className="education-degree">{entry.role}</h3>
                  <p className="education-school">
                    {entry.company}
                    {entry.location ? ` · ${entry.location}` : ''}
                  </p>
                  {entry.summary ? <p className="mt-2">{entry.summary}</p> : null}
                  {entry.highlights?.length ? (
                    <ul className="detail-list mt-2">
                      {entry.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <p className="education-years">
                  {entry.start} – {entry.end}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
