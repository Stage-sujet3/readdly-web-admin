"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Bell, User as UserIcon, Search, Command } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  
  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean)
    if (parts.length <= 1) return "Tableau de bord"
    const lastPart = parts[parts.length - 1]
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace('-', ' ')
  }

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-6 z-40 px-6 mb-12" /* Increased mb-12 for more space between header and content */
    >
      <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-premium px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-xl font-bold text-[#1a2a4a] leading-none mb-1">
              {getPageTitle()}
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm animate-pulse"></div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Santé du système : Optimale</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-indigo-50/50 border border-white/80 rounded-2xl px-5 py-2.5 w-80 group focus-within:bg-white focus-within:border-[#5f6ad8]/30 transition-all shadow-inner">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-[#5f6ad8] transition-colors" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="bg-transparent border-none outline-none text-sm ml-3 w-full text-slate-700 placeholder:text-slate-400 font-medium"
            />
            <div className="flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md shadow-sm">
               <Command className="w-3 h-3 text-slate-400" />
               <span className="text-[10px] font-bold text-slate-400">K</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-3 bg-white hover:bg-indigo-50 rounded-2xl shadow-sm border border-slate-100 transition-all group"
            >
              <Bell className="w-5 h-5 text-slate-500 group-hover:text-[#5f6ad8] transition-colors" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full shadow-sm"></span>
            </motion.button>
            
            <div className="h-8 w-px bg-slate-200 mx-2"></div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-[1.25rem] shadow-sm border border-slate-100 cursor-pointer group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-[#5f6ad8] to-[#444fc0] text-white rounded-[0.8rem] flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-3 transition-transform">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-[#1a2a4a] leading-tight text-right">Administrateur</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
