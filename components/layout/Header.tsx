"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Bell, User as UserIcon, Search, Command } from "lucide-react"

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const pathname = usePathname()
  
  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean)
    if (parts.length <= 1) return "Tableau de bord"
    const lastPart = parts[parts.length - 1]
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace('-', ' ')
  }

  return (
    <header className="sticky top-6 z-30 pl-10 pr-6 mb-12">
      <div className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-lg px-8 h-20 flex items-center justify-between">
        {/* Page Title Section */}
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 bg-gradient-to-b from-[#5f6ad8] to-[#444fc0] rounded-full"></div>
          <div>
            <h2 className="text-2xl font-bold text-[#1a2a4a] leading-none mb-1 tracking-tight">
              {getPageTitle()}
            </h2>
            <p className="text-xs font-medium text-slate-500">Vue d'ensemble et analyse</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className={`hidden lg:flex items-center bg-white/60 backdrop-blur-sm border rounded-2xl px-5 py-3 w-full transition-all duration-200 ${
            isSearchFocused 
              ? 'border-[#5f6ad8]/40 shadow-lg shadow-[#5f6ad8]/10 bg-white' 
              : 'border-white/60 shadow-inner'
          }`}>
            <Search className={`w-5 h-5 transition-colors ${
              isSearchFocused ? 'text-[#5f6ad8]' : 'text-slate-400'
            }`} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="bg-transparent border-none outline-none text-sm ml-3 w-full text-slate-700 placeholder:text-slate-400 font-medium"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md shadow-sm">
               <Command className="w-3 h-3 text-slate-400" />
               <span className="text-[10px] font-bold text-slate-400">K</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button className="relative p-3 bg-white/60 hover:bg-white/80 rounded-2xl shadow-sm border border-white/60 transition-all group">
              <Bell className="w-5 h-5 text-slate-500 group-hover:text-[#5f6ad8] transition-colors" />
              
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">3</span>
              </span>
            </button>
          </div>

          <div className="h-8 w-px bg-slate-200"></div>

          {/* User Profile - Simple Design */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#5f6ad8] to-[#444fc0] text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-[#1a2a4a] leading-tight">Administrateur</p>
              <p className="text-xs font-medium text-slate-500">admin@admin.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
