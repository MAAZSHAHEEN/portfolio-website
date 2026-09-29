import { ExternalLink } from 'lucide-react'

import { GitHubIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Project } from '@/types'

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <article>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {project.name}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">{project.description}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <Badge key={tech} variant="secondary">
            {tech}
          </Badge>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button render={<a href={project.githubUrl} target="_blank" rel="noreferrer" />}>
          <GitHubIcon className="size-4" />
          View code
        </Button>
        {project.liveUrl ? (
          <Button
            variant="outline"
            render={<a href={project.liveUrl} target="_blank" rel="noreferrer" />}
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Live demo
          </Button>
        ) : null}
      </div>

      <div className="mt-14 space-y-10 border-t border-border pt-10">
        <section>
          <h2 className="font-display text-xl font-semibold">The problem</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{project.problem}</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">Architecture</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{project.architecture}</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">What I learned</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{project.whatILearned}</p>
        </section>
      </div>
    </article>
  )
}
