import { CheckCircle2, Mail } from 'lucide-react'
import { type FormEvent, useState } from 'react'

import { GitHubIcon, LinkedInIcon } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useProfile, useSubmitContact } from '@/lib/queries'

const MAX_NAME_LENGTH = 100
const MAX_MESSAGE_LENGTH = 2000

export function Contact() {
  const { data: profile, isLoading: isProfileLoading } = useProfile()
  const { mutate, isPending, isSuccess, isError, error, reset } = useSubmitContact()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  // Honeypot: hidden from real users; bots that autofill every field will
  // populate it, and the backend silently drops the submission.
  const [company, setCompany] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    reset()
    mutate(
      { name, email, message, company },
      {
        onSuccess: () => {
          setName('')
          setEmail('')
          setMessage('')
          setCompany('')
        },
      },
    )
  }

  return (
    <section id="contact" className="scroll-mt-20 border-t border-border py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="05 · Contact"
          title="Let's work together"
          description="Have a role or a project in mind? I'd love to hear from you."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <h3 className="font-display text-lg font-semibold">Get in touch</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The fastest way to reach me is email, or connect on GitHub / LinkedIn.
            </p>

            {isProfileLoading ? (
              <div className="mt-6 space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-40" />
              </div>
            ) : profile ? (
              <ul className="mt-6 space-y-3 text-sm">
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="focus-visible:ring-ring inline-flex items-center gap-2 rounded-sm text-foreground transition-colors hover:text-brand-link focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <Mail className="size-4 text-brand-link" aria-hidden="true" />
                    {profile.email}
                  </a>
                </li>
                <li>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-visible:ring-ring inline-flex items-center gap-2 rounded-sm text-foreground transition-colors hover:text-brand-link focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <GitHubIcon className="size-4 text-brand-link" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-visible:ring-ring inline-flex items-center gap-2 rounded-sm text-foreground transition-colors hover:text-brand-link focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <LinkedInIcon className="size-4 text-brand-link" />
                    LinkedIn
                  </a>
                </li>
              </ul>
            ) : null}
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            {isSuccess ? (
              <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-6">
                <CheckCircle2 className="size-5 shrink-0 text-brand-link" aria-hidden="true" />
                <div>
                  <p className="font-medium">Message sent</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Thanks for reaching out - I'll get back to you soon.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot field - hidden from sighted and screen-reader users. */}
                <div className="h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      maxLength={MAX_NAME_LENGTH}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    maxLength={MAX_MESSAGE_LENGTH}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                  />
                </div>

                {isError ? (
                  <p role="alert" className="text-sm text-destructive">
                    {error instanceof Error
                      ? 'Something went wrong sending your message. Please try again or email me directly.'
                      : 'Something went wrong.'}
                  </p>
                ) : null}

                <Button type="submit" disabled={isPending} className="h-10 px-6">
                  {isPending ? 'Sending...' : 'Send message'}
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
