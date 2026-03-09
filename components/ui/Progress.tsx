interface ProgressProps {
  value: number
  className?: string
  colorClass?: string
}

export function Progress({ value, className = "", colorClass = "bg-primary" }: ProgressProps) {
  return (
    <div className={`w-full bg-muted rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full transition-all duration-500 ease-out ${colorClass}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
