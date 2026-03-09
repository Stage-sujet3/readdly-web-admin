"use client"

import { Users, UserPlus, Activity, ShieldCheck, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { useAdminStats } from "@/hooks/useAdminStats"

export function StatsGrid() {
  const { statsData } = useAdminStats();

  const stats = [
    {
      title: "Utilisateurs Totaux",
      value: statsData ? statsData.totalUsers : "...",
      change: statsData?.growth?.users !== undefined ? `${(statsData.growth.users ?? 0) > 0 ? '+' : ''}${statsData.growth.users ?? 0}%` : "...",
      isPositive: (statsData?.growth?.users ?? 0) >= 0,
      icon: Users,
      color: "text-indigo-500",
      gradient: "from-indigo-500/20 to-indigo-500/5",
    },
    {
      title: "Parents",
      value: statsData ? statsData.totalParents : "...",
      change: statsData?.growth?.parents !== undefined ? `${(statsData.growth.parents ?? 0) > 0 ? '+' : ''}${statsData.growth.parents ?? 0}%` : "...",
      isPositive: (statsData?.growth?.parents ?? 0) >= 0,
      icon: UserPlus,
      color: "text-emerald-500",
      gradient: "from-emerald-500/20 to-emerald-500/5",
    },
    {
      title: "Orthophonistes",
      value: statsData ? statsData.totalOrthophonistes : "...",
      change: statsData?.growth?.orthos !== undefined ? `${(statsData.growth.orthos ?? 0) > 0 ? '+' : ''}${statsData.growth.orthos ?? 0}%` : "...",
      isPositive: (statsData?.growth?.orthos ?? 0) >= 0,
      icon: ShieldCheck,
      color: "text-violet-500",
      gradient: "from-violet-500/20 to-violet-500/5",
    },
    {
      title: "Enfants (Patients)",
      value: statsData ? statsData.totalEnfants : "...",
      change: statsData?.growth?.enfants !== undefined ? `${(statsData.growth.enfants ?? 0) > 0 ? '+' : ''}${statsData.growth.enfants ?? 0}%` : "...",
      isPositive: (statsData?.growth?.enfants ?? 0) >= 0,
      icon: Activity,
      color: "text-orange-500",
      gradient: "from-orange-500/20 to-orange-500/5",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/60 shadow-premium group relative overflow-hidden cursor-default"
        >
          <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-[#1a2a4a] tabular-nums tracking-tighter">{stat.value}</h3>
              <div className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-4 h-4 rounded-full ${stat.isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  <TrendingUp className={`w-2.5 h-2.5 ${stat.isPositive ? 'text-emerald-600' : 'text-red-500'} ${!stat.isPositive && 'rotate-180'}`} />
                </div>
                <span className={`text-xs font-bold tracking-tight ${stat.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>{stat.change}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">vs mois dernier</span>
              </div>
            </div>
            
            <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-2xl border border-white/40 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
              <stat.icon className={`w-6 h-6 ${stat.color} drop-shadow-sm`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
