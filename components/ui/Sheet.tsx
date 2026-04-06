import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function Sheet({ open, onOpenChange, children, size = "md" }: SheetProps) {
  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    full: "sm:max-w-full",
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed z-50 gap-4 bg-white/90 backdrop-blur-xl p-6 shadow-2xl overflow-y-auto right-0 top-0 h-full w-full border-l border-white/60",
              sizeClasses[size] || sizeClasses.md
            )}
          >
            <button 
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Fermer</span>
            </button>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
