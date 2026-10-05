import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

import { GitHubIcon } from '@/components/icons'
import type { Project } from '@/types'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="project-card">
      <span className="project-number" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <h3 className="project-title">
          <Link to={`/projects/${project.slug}`} className="focus-link">
            {project.name}
          </Link>
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <Link to={`/projects/${project.slug}`} className="text-link mt-5 text-brand-link">
          View Project <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="project-stack">
        <p className="eyebrow mb-3">Built with</p>
        <ul className="flex flex-wrap gap-2" aria-label="Technologies">
          {project.stack.map((tech) => (
            <li className="tech-tag" key={tech}>
              {tech}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {project.githubUrl ? (
            <a
              className="text-link"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`View code for ${project.name}`}
            >
              <GitHubIcon className="size-4" />
              Code
            </a>
          ) : null}
          {project.liveUrl ? (
            <a
              className="text-link"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Live API for ${project.name}`}
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              Live API
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
