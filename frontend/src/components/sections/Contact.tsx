import { ArrowUpRight, Check, Copy, Download, Mail } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { GitHubIcon, LinkedInIcon } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/lib/queries'

export function Contact() {
  const { data: profile, isLoading, isError } = useProfile()
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function handleCopyEmail() {
    if (!profile) return
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable or permission denied - the mailto link
      // still works as a fallback.
    }
  }

  return (
    <section id="contact" className="section-shell" aria-labelledby="contact-title">
      <Container>
        <div className="contact-panel">
          <span className="contact-glow" aria-hidden="true" />
          <SectionHeading
            id="contact-title"
            eyebrow="05 / Contact"
            title="Let's work together"
            description="Have a role or a project in mind? I'd love to hear from you."
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

                <div className="contact-actions">
                  <Button size="lg" render={<a href={`mailto:${profile.email}`} />}>
                    <Mail className="size-4" aria-hidden="true" />
                    Email me
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleCopyEmail}>
                    {copied ? (
                      <Check className="size-4" aria-hidden="true" />
                    ) : (
                      <Copy className="size-4" aria-hidden="true" />
                    )}
                    <span aria-live="polite">{copied ? 'Copied!' : 'Copy email'}</span>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    render={<a href={profile.resumeUrl} download />}
                  >
                    <Download className="size-4" aria-hidden="true" />
                    Download CV
                  </Button>
                </div>

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
