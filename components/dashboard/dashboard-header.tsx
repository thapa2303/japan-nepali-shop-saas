import type { ReactNode } from "react"

interface DashboardHeaderProps {
  title: string
  description?: string
  children?: ReactNode
}

export function DashboardHeader({ title, description, children }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-balance">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground text-pretty">{description}</p>
        ) : null}
      </div>
      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </div>
  )
}
