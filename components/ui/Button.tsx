import { motion } from 'framer-motion'
import { COLORS, ANIMATIONS } from '@/utils/constants'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  className?: string
  onClick?: () => void
  children: React.ReactNode
}

const getVariantStyles = (variant: ButtonVariant): string => {
  switch (variant) {
    case 'primary':
      return 'bg-gradient-to-r from-[#5f6ad8] to-[#444fc0] text-white hover:shadow-lg hover:shadow-[#5f6ad8]/25'
    case 'secondary':
      return 'bg-white/80 backdrop-blur-xl text-slate-700 border border-white/60 hover:bg-white hover:shadow-lg'
    case 'danger':
      return 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25'
    case 'ghost':
      return 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
    case 'outline':
      return 'border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
    default:
      return 'bg-gradient-to-r from-[#5f6ad8] to-[#444fc0] text-white hover:shadow-lg hover:shadow-[#5f6ad8]/25'
  }
}

const getSizeStyles = (size: ButtonSize): string => {
  switch (size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm rounded-lg'
    case 'md':
      return 'px-4 py-2 text-sm rounded-xl'
    case 'lg':
      return 'px-6 py-3 text-base rounded-2xl'
    default:
      return 'px-4 py-2 text-sm rounded-xl'
  }
}

export default function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  children,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#5f6ad8] focus:ring-offset-2'
  const variantStyles = getVariantStyles(variant)
  const sizeStyles = getSizeStyles(size)
  const disabledStyles = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${disabledStyles} ${className}`}
      onClick={onClick}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: ANIMATIONS.fast / 1000 }}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </motion.button>
  )
}

export { Button }
