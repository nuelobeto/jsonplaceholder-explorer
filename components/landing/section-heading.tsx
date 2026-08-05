// components/landing/section-heading.tsx
import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  eyebrow: string
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
}

/** Shared eyebrow + title + lede so every section leads with the same rhythm. */
export const SectionHeading = ({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) => {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      <p className="reveal-item text-xs font-medium uppercase tracking-[0.2em] text-brand">
        {eyebrow}
      </p>
      <h2 className="reveal-item mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="reveal-item mt-4 text-pretty text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}
