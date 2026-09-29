import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjects } from '@/lib/queries'

export function Projects() {
  const { data: projects, isLoading, isError } = useProjects()

  return (
    <section id="projects" className="scroll-mt-20 border-t border-border py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="03 · Projects"
          title="Selected projects"
          description="Backend-focused projects covering APIs, auth, databases, and AI-assisted tooling."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-72 w-full" />
            ))
          ) : isError || !projects ? (
            <p className="text-destructive">Could not load projects from the API.</p>
          ) : (
            projects.map((project, index) => (
              <Reveal key={project.slug} delay={index * 0.08}>
                <ProjectCard project={project} />
              </Reveal>
            ))
          )}
        </div>
      </Container>
    </section>
  )
}
