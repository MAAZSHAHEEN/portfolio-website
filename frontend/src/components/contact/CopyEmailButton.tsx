import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

interface CopyEmailButtonProps {
  email: string
  className?: string
  label?: string
}

/** Copies the address and says "Copied" for 2 s; falls back to mailto when the
 * Clipboard API is missing or denied, so the button always does something useful. */
export function CopyEmailButton({ email, className, label = 'Copy email' }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <button
      type="button"
      className={cn('copy-email', className)}
      onClick={() => void copy()}
      data-copied={copied ? 'true' : 'false'}
    >
      {copied ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      <span>{copied ? 'Copied' : label}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? `${email} copied to clipboard` : ''}
      </span>
    </button>
  )
}
