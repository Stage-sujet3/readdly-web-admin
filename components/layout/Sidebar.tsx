"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  Users, 
  Library, 
  MessageSquare, 
  User as UserIcon,
  LogOut,
  ChevronDown,
  UserCheck,
  Users2,
  X,
  BookOpen,
  BookA,
  FileText,
  Activity,
  Server,
  History,
  Star
} from "lucide-react"
import { useSidebar } from "@/contexts/SidebarContext"
import { useAdminStats } from "@/hooks/useAdminStats"
import { authService } from "@/services/auth"

export function Sidebar() {
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const pathname = usePathname()
  const router = useRouter()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { statsData } = useAdminStats()

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }, [])

  const handleLogout = useCallback(async () => {
    // Use authService for logout
    await authService.logout()
    
    // Redirect to login page
    router.push('/auth')
  }, [router])

  const navItems = [
    { 
      path: "/dashboard", 
      label: "Tableau de bord", 
      icon: LayoutDashboard,
      count: 0
    },
    { 
      path: "/dashboard/users", 
      label: "Utilisateurs", 
      icon: Users,
      count: statsData?.totalUsers || 0,
      hasSubmenu: true,
      submenu: [
        { path: "/dashboard/users/orthophonistes", label: "Orthophonistes", icon: UserCheck, count: statsData?.totalOrthophonistes || 0 },
        { path: "/dashboard/users/parents", label: "Parents", icon: Users2, count: statsData?.totalParents || 0 }
      ]
    },
    { 
      path: "/dashboard/library", 
      label: "Bibliothèque", 
      icon: Library,
      count: 0,
      hasSubmenu: true,
      submenu: [
        { path: "/dashboard/library/stories", label: "Histoires", icon: BookOpen, count: 0 },
        { path: "/dashboard/library/dictionary", label: "Dictionnaire", icon: BookA, count: 0 },
        { path: "/dashboard/library/texts", label: "Textes Éducatifs", icon: FileText, count: 0 }
      ]
    },
    { 
      path: "/dashboard/analytics/children", 
      label: "Analyses des Enfants", 
      icon: Activity,
      count: 0
    },
    { 
      path: "/dashboard/monitoring", 
      label: "Supervision Système", 
      icon: Server,
      count: 0
    },
    { 
      path: "/dashboard/audit", 
      label: "Historique d'Audit", 
      icon: History,
      count: 0
    },
    { 
      path: "/dashboard/messages", 
      label: "Centre de Feedback", 
      icon: MessageSquare,
      count: 0
    },
  ]

  return (
    <motion.div 
      className="fixed left-6 top-6 bottom-6 z-40"
      animate={{ width: isCollapsed ? '80px' : '320px' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="h-full bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg flex flex-col overflow-hidden"
      >
        {/* Logo Section */}
        <div className={`p-6 pb-4 text-center ${isCollapsed ? 'px-4' : 'px-8'}`}>
          <Link href="/dashboard" className="inline-flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md border border-indigo-50 relative overflow-hidden hover:scale-105 transition-transform">
               <Image 
                  src="/images/logo-readdly.png"
                  alt="Readdly"
                  fill
                  sizes="48px"
                  className="object-contain p-1.5"
                  priority
               />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <h1 className="text-lg font-bold text-[#1a2a4a] tracking-tight">Readdly</h1>
                  <p className="text-[8px] font-bold text-[#5f6ad8] uppercase tracking-[0.2em] mt-0.5">Admin</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Close Button - Only visible when sidebar is open */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="px-6"
            >
              <button
                onClick={toggleSidebar}
                className="ml-auto w-8 h-8 bg-white/80 hover:bg-white border border-white/60 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all group"
              >
                <X className="w-4 h-4 text-slate-500 group-hover:text-red-500 transition-colors" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            const isExpanded = expandedSections.includes(item.label)
            
            return (
              <div key={item.path}>
                <Link href={item.path}>
                  <div
                    onClick={(e) => {
                      if (isCollapsed) {
                        e.preventDefault()
                        toggleSidebar() // Open sidebar when clicking any item while collapsed
                      } else if (item.hasSubmenu) {
                        e.preventDefault()
                        toggleSection(item.label)
                      }
                    }}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-3 px-3 py-3 rounded-2xl transition-all duration-200 relative group ${
                      isActive 
                        ? "text-white shadow-md" 
                        : "text-slate-500 hover:text-[#5f6ad8] hover:bg-white/50 font-medium"
                    }`}
                  >
                    {isActive && (
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-[#5f6ad8] to-[#444fc0] rounded-2xl -z-10"
                      />
                    )}
                    
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "group-hover:text-[#5f6ad8]"}`} />
                      
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className={`text-sm tracking-tight ${isActive ? "font-bold" : "font-semibold"}`}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-2"
                        >
                          {item.count > 0 && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-[#5f6ad8] to-[#444fc0] text-white text-[10px] font-bold rounded-full min-w-[20px] text-center">
                              {item.count}
                            </span>
                          )}
                          
                          {item.hasSubmenu && (
                            <div
                              className={`transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          )}
                          
                          {isActive && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Link>

                {/* Submenu */}
                <AnimatePresence>
                  {!isCollapsed && item.hasSubmenu && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenu?.map((subItem) => {
                          const isSubActive = pathname === subItem.path
                          return (
                            <Link key={subItem.path} href={subItem.path}>
                              <div
                                className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                                  isSubActive
                                    ? "text-[#5f6ad8] bg-indigo-50 font-semibold"
                                    : "text-slate-400 hover:text-[#5f6ad8] hover:bg-white/30"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <subItem.icon className="w-4 h-4" />
                                  <span className="text-xs font-medium">{subItem.label}</span>
                                </div>
                                {subItem.count > 0 && (
                                  <span className="px-1.5 py-0.5 bg-gradient-to-r from-indigo-400 to-indigo-500 text-white text-[9px] font-bold rounded-full">
                                    {subItem.count}
                                  </span>
                                )}
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </nav>

        {/* User Card */}
        <div className={`p-3 mt-auto ${isCollapsed ? 'px-3' : 'px-4'}`}>
          <div className="p-3 bg-gradient-to-br from-indigo-50/50 to-white/50 border border-white/60 rounded-3xl shadow-sm">
            <AnimatePresence>
              {!isCollapsed ? (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/80 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-xl transition-all border border-white/60 text-[11px] font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnexion</span>
                </motion.button>
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center py-2.5 bg-white/80 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-xl transition-all border border-white/60"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </motion.div>
  )
}
