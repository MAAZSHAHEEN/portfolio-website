import { ArrowUpRight, Download, Mail } from 'lucide-react'

import { CopyEmailButton } from '@/components/contact/CopyEmailButton'
import { GitHubIcon, LinkedInIcon } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CV_DOWNLOAD_NAME } from '@/lib/cv'
import { useProfile } from '@/lib/queries'

export function Contact({ eyebrow }: { eyebrow: string }) {
  const { data: profile, isLoading, isError } = useProfile()

  return (
    <section id="contact" className="section-shell" aria-labelledby="contact-title">
      <Container>
        <div className="contact-panel">
          <span className="contact-glow" aria-hidden="true" />
          <SectionHeading
            id="contact-title"
            eyebrow={eyebrow}
            title="Let's talk backend"
            description={profile ? `${profile.availability}.` : undefined}
          />

          <div className="mt-8">
            {isLoading ? (
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-40" />
              </div>
            ) : isError || !profile ? (
              <p role="alert" className="text-destructive">
                Could not load contact details from the API.
              </p>
            ) : (
              <Reveal delay={0.06}>
                <a className="contact-email" href={`mailto:${profile.email}`}>
                  {profile.email}
                  <ArrowUpRight className="contact-email-arrow" aria-hidden="true" />
                </a>
                <p className="contact-where">
                  {profile.location} · {profile.timezone}
                </p>

                <div className="contact-actions">
                  <Button size="lg" render={<a href={`mailto:${profile.email}`} />}>
                    <Mail className="size-4" aria-hidden="true" />
                    Email me
                  </Button>
                  <CopyEmailButton email={profile.email} className="copy-email-button" />
                  <Button
                    size="lg"
                    variant="outline"
                    render={<a href={profile.resumeUrl} download={CV_DOWNLOAD_NAME} />}
                  >
                    <Download className="size-4" aria-hidden="true" />
                    Download CV (PDF)
                  </Button>
                </div>
                {profile.resumeUpdated ? (
                  <p className="cv-updated">CV last updated {profile.resumeUpdated}</p>
                ) : null}

                <ul className="contact-socials" aria-label="Profiles">
                  <li>
                    <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">
                      <GitHubIcon className="size-4" />
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-link"
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <LinkedInIcon className="size-4" />
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </Reveal>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
