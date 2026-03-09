import type { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  )
}
