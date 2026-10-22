import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjects } from '@/lib/queries'

export function Projects() {
  const { data: projects, isLoading, isError } = useProjects()
  return (
    <section id="projects" className="section-shell" aria-labelledby="projects-title">
      <Container>
        <SectionHeading
          id="projects-title"
          eyebrow="01 / Selected work"
          title="Selected projects"
          description="Three projects, each with the problem it solves, the stack behind it, and links to the live app, code or case study."
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
      </Container>
    </section>
  )
}
