import type { ReactNode } from "react"

interface PageShellProps {
  title: string
  description?: string
  children: ReactNode
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div>
      <div className="border-b bg-secondary/30">
        <div className="container px-4 py-12 md:py-16">
          <h1 className="text-balance text-3xl font-bold md:text-4xl">{title}</h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="container px-4 py-10 md:py-12">{children}</div>
    </div>
  )
}

interface ProseProps {
  children: ReactNode
}

// Simple legal/long-form content wrapper with consistent spacing.
export function Prose({ children }: ProseProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 leading-relaxed text-muted-foreground">{children}</div>
  )
}

interface LegalSectionProps {
  heading: string
  children: ReactNode
}

export function LegalSection({ heading, children }: LegalSectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-foreground">{heading}</h2>
      {children}
    </section>
  )
}
