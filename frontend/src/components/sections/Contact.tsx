import { Check, Copy, Mail } from 'lucide-react'
import { useState } from 'react'

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

  async function handleCopyEmail() {
    if (!profile) return
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable or permission denied - the mailto button
      // below still works as a fallback.
    }
  }

  return (
    <section id="contact" className="scroll-mt-20 border-t border-border py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="05 · Contact"
          title="Let's work together"
          description="Have a role or a project in mind? I'd love to hear from you."
        />

        <div className="mt-12">
          {isLoading ? (
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          ) : isError || !profile ? (
            <p className="text-destructive">Could not load contact details from the API.</p>
          ) : (
            <Reveal>
              <p className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {profile.email}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  className="h-12 rounded-lg px-6 text-base"
                  render={<a href={`mailto:${profile.email}`} />}
                >
                  <Mail className="size-4" aria-hidden="true" />
                  Email me
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-lg px-6 text-base"
                  onClick={handleCopyEmail}
                >
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
                  className="h-12 rounded-lg px-6 text-base"
                  render={<a href={profile.github} target="_blank" rel="noreferrer" />}
                >
                  <GitHubIcon className="size-4" />
                  GitHub
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-lg px-6 text-base"
                  render={<a href={profile.linkedin} target="_blank" rel="noreferrer" />}
                >
                  <LinkedInIcon className="size-4" />
                  LinkedIn
                </Button>
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  )
}
