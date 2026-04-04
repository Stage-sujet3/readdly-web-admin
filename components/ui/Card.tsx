import type { ReactNode } from "react"
import { motion } from 'framer-motion'
import { ANIMATIONS } from '@/utils/constants'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'elevated' | 'outlined'
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const getVariantStyles = (variant: string): string => {
  switch (variant) {
    case 'glass':
      return 'bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg'
    case 'elevated':
      return 'bg-white border border-white/60 shadow-xl shadow-premium'
    case 'outlined':
      return 'bg-white border border-slate-200 shadow-sm'
    default:
      return 'bg-white border border-white/60 shadow-lg'
  }
}

const getPaddingStyles = (padding: string): string => {
  switch (padding) {
    case 'none':
      return 'p-0'
    case 'sm':
      return 'p-4'
    case 'md':
      return 'p-6'
    case 'lg':
      return 'p-8'
    default:
      return 'p-6'
  }
}

export function Card({ 
  children, 
  className = "", 
  variant = 'default',
  hover = false,
  padding = 'md',
  onClick
}: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-300'
  const variantStyles = getVariantStyles(variant)
  const paddingStyles = getPaddingStyles(padding)
  const hoverStyles = hover ? 'hover:shadow-xl hover:shadow-premium hover:-translate-y-1' : ''

  return (
    <motion.div
      className={`${baseStyles} ${variantStyles} ${paddingStyles} ${hoverStyles} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATIONS.normal / 1000 }}
      whileHover={hover ? { scale: 1.02 } : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-lg font-bold text-slate-800 ${className}`}>{children}</h3>
}

export function CardDescription({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-sm text-slate-600 ${className}`}>{children}</p>
}

export function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mt-4 pt-4 border-t border-slate-200 ${className}`}>{children}</div>
}
