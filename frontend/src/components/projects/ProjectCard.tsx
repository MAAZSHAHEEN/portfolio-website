import { ArrowUpRight, BookOpen, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

import { GitHubIcon } from '@/components/icons'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  index: number
  total: number
}

export function ProjectCard({ project, index, total }: ProjectCardProps) {
  const number = String(index + 1).padStart(2, '0')
  const headingId = `project-${project.slug}-title`

  return (
    <article className="project-card" aria-labelledby={headingId}>
      <div className="project-meta" aria-hidden="true">
        <span className="project-number">{number}</span>
        <span className="project-meta-total">/ {String(total).padStart(2, '0')}</span>
        <span className="project-meta-rule" />
        <span className="project-meta-tag">
          {project.liveUrl ? 'Live API docs' : 'Source code'}
        </span>
      </div>

      <div className="project-main">
        <h3 id={headingId} className="project-title">
          <Link to={`/projects/${project.slug}`} className="focus-link">
            {project.name}
          </Link>
        </h3>
        <p className="project-summary">{project.description}</p>
        <div className="project-problem">
          <p className="project-label">Problem</p>
          <p>{project.problem}</p>
        </div>
      </div>

      <div className="project-aside">
        <p className="project-label">Stack</p>
        <ul className="tech-list" aria-label={`Technologies used in ${project.name}`}>
          {project.stack.map((tech) => (
            <li className="tech-tag" key={tech}>
              {tech}
            </li>
          ))}
        </ul>
        <ul className="project-links" aria-label={`Links for ${project.name}`}>
          <li>
            <Link
              to={`/projects/${project.slug}`}
              className="text-link text-brand-link project-link-primary"
              aria-label={`Read the case study for ${project.name}`}
            >
              <BookOpen className="size-4" aria-hidden="true" />
              Case study
              <ArrowUpRight className="size-4 project-link-arrow" aria-hidden="true" />
            </Link>
          </li>
          {project.githubUrl ? (
            <li>
              <a
                className="text-link"
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`View code for ${project.name} on GitHub`}
              >
                <GitHubIcon className="size-4" />
                Code
              </a>
            </li>
          ) : null}
          {project.liveUrl ? (
            <li>
              <a
                className="text-link"
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open the live API docs for ${project.name}`}
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                Live API
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  )
}
