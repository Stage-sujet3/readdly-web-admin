"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Library, 
  MessageSquare, 
  BarChart3, 
  Settings,
  User as UserIcon,
  LogOut
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { path: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { path: "/dashboard/users", label: "Utilisateurs", icon: Users },
    { path: "/dashboard/roles", label: "Rôles", icon: Shield },
    { path: "/dashboard/library", label: "Bibliothèque", icon: Library },
    { path: "/dashboard/messages", label: "Messages", icon: MessageSquare },
    { path: "/dashboard/statistics", label: "Stats", icon: BarChart3 },
    { path: "/dashboard/settings", label: "Paramètres", icon: Settings },
  ]

  return (
    <div className="fixed left-6 top-6 bottom-6 w-64 z-50">
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="h-full bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] shadow-premium flex flex-col overflow-hidden"
      >
        {/* Logo Section */}
        <div className="p-8 pb-6 text-center">
          <Link href="/dashboard" className="inline-flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform border border-indigo-50 relative overflow-hidden">
               <Image 
                  src="/images/logo-readdly.png"
                  alt="Readdly"
                  fill
                  sizes="64px"
                  className="object-contain p-2"
                  priority
               />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1a2a4a] tracking-tight">Readdly</h1>
              <p className="text-[9px] font-bold text-[#5f6ad8] uppercase tracking-[0.2em] mt-0.5">Admin</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link key={item.path} href={item.path}>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 relative group ${
                    isActive 
                      ? "text-white shadow-lg shadow-indigo-500/20" 
                      : "text-slate-500 hover:text-[#5f6ad8] hover:bg-white/50 font-medium"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-[#5f6ad8] to-[#444fc0] rounded-2xl -z-10"
                    />
                  )}
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "group-hover:text-[#5f6ad8]"}`} />
                  <span className={`text-sm tracking-tight ${isActive ? "font-bold" : "font-semibold"}`}>{item.label}</span>
                  {isActive && (
                    <motion.div 
                       initial={{ opacity: 0, scale: 0 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-sm"
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 mt-auto">
          <div className="p-4 bg-gradient-to-br from-indigo-50/50 to-white/50 border border-white/60 rounded-3xl group shadow-sm">
            <button className="w-full flex items-center justify-center gap-2 py-2 bg-white/80 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-xl transition-all border border-white/60 text-[11px] font-bold shadow-sm">
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </div>
  )
}
