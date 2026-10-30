import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { AdditionalProjectCard } from '@/components/projects/AdditionalProjectCard'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdditionalProjects, useProjects } from '@/lib/queries'

export function Projects({ eyebrow }: { eyebrow: string }) {
  const { data: projects, isLoading, isError } = useProjects()
  const { data: extras } = useAdditionalProjects()
  return (
    <section id="projects" className="section-shell" aria-labelledby="projects-title">
      <Container>
        <SectionHeading
          id="projects-title"
          eyebrow={eyebrow}
          title="Selected projects"
          description="Each case study covers the problem, my role, the architecture and the trade-offs, with links to the code or the live app."
        />
        <div className="project-list">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-72 w-full" />
            ))
          ) : isError || !projects ? (
            <p role="alert" className="text-destructive">
              Could not load projects from the API.
            </p>
          ) : (
            projects.map((project, index) => (
              <Reveal key={project.slug} delay={index * 0.08}>
                <ProjectCard project={project} index={index} total={projects.length} />
              </Reveal>
            ))
          )}
        </div>
        {extras?.length ? (
          <section
            id="additional-projects"
            className="extra-section"
            aria-labelledby="additional-projects-title"
          >
            <h3 id="additional-projects-title" className="extra-section-title">
              Additional projects
            </h3>
            <div className="extra-list">
              {extras.map((project) => (
                <AdditionalProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </section>
  )
}
