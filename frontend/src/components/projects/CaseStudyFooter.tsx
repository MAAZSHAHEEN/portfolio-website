import { ArrowRight, Download, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { CV_DOWNLOAD_NAME } from '@/lib/cv'
import { useProfile } from '@/lib/queries'
import type { Project } from '@/types'

/** Every case study ends with the next project and a way to get in touch. */
export function CaseStudyFooter({ next }: { next?: Project }) {
  const { data: profile } = useProfile()
  return (
    <div className="detail-next">
      {next ? (
        <nav aria-label="More projects">
          <Link to={`/projects/${next.slug}`} className="detail-next-link">
            <span className="project-label">Next project</span>
            <span className="detail-next-title">
              {next.name}
              <ArrowRight className="size-5" aria-hidden="true" />
            </span>
          </Link>
        </nav>
      ) : null}
      {profile ? (
        <div className="detail-cta">
          <p className="detail-cta-title">Hiring for a backend role?</p>
          <p className="detail-cta-text">{profile.availability}.</p>
          <div className="detail-actions">
            <Button render={<a href={`mailto:${profile.email}`} />}>
              <Mail className="size-4" aria-hidden="true" />
              Email me
            </Button>
            <Button
              variant="outline"
              render={<a href={profile.resumeUrl} download={CV_DOWNLOAD_NAME} />}
            >
              <Download className="size-4" aria-hidden="true" />
              Download CV (PDF)
            </Button>
            <Button variant="ghost" render={<Link to="/#contact" />}>
              All contact options
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
