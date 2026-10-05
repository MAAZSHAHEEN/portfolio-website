import { ExternalLink } from 'lucide-react'
import { GitHubIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import type { Project } from '@/types'

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <article>
      <header className="border-b border-border pb-10">
        <p className="eyebrow">Project / Overview</p>
        <h1 className="detail-title">{project.name}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
          {project.stack.map((tech) => (
            <li className="tech-tag" key={tech}>
              {tech}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          {project.githubUrl ? (
            <Button render={<a href={project.githubUrl} target="_blank" rel="noreferrer" />}>
              <GitHubIcon className="size-4" />
              View code
            </Button>
          ) : null}
          {project.liveUrl ? (
            <Button
              variant="outline"
              render={<a href={project.liveUrl} target="_blank" rel="noreferrer" />}
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              Live API
            </Button>
          ) : null}
        </div>
      </header>
      <div className="detail-sections">
        <section>
          <h2>The problem</h2>
          <p>{project.problem}</p>
        </section>
        <section>
          <h2>Architecture</h2>
          <p>{project.architecture}</p>
        </section>
        <section>
          <h2>What I learned</h2>
          <p>{project.whatILearned}</p>
        </section>
      </div>
    </article>
  )
}
