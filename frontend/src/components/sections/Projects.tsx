import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjects } from '@/lib/queries'

export function Projects() {
  const { data: projects, isLoading, isError } = useProjects()
  return (
    <section id="projects" className="section-shell">
      <Container>
        <SectionHeading
          eyebrow="01 / Selected work"
          title="Selected projects"
          description="Explore the implementation and engineering decisions behind each project."
        />
        <div className="mt-10 space-y-5">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full" />
            ))
          ) : isError || !projects ? (
            <p role="alert" className="text-destructive">
              Could not load projects from the API.
            </p>
          ) : (
            projects.map((project, index) => (
              <Reveal key={project.slug} delay={index * 0.09}>
                <ProjectCard project={project} index={index} />
              </Reveal>
            ))
          )}
        </div>
      </Container>
    </section>
  )
}
