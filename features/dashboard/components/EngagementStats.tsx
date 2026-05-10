"use client"

import { MessageSquare, Star, Zap, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useAdminStats } from "@/hooks/useAdminStats"
import { Skeleton } from "@/components/ui/Skeleton"

export function EngagementStats() {
  const { statsData, loading } = useAdminStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(2)].map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-3xl" />
        ))}
      </div>
    )
  }

  const engagementStats = [
    {
      title: "Messages Support",
      value: statsData?.totalMessages ?? 0,
      icon: MessageSquare,
      color: "text-blue-500",
      bg: "bg-blue-50",
      description: "Demandes et problèmes signalés"
    },
    {
      title: "Évaluations",
      value: statsData?.totalRatings ?? 0,
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-50",
      description: "Notes sur les fonctionnalités"
    },
    {
       title: "Utilisateurs Actifs",
       value: statsData?.activeUsers ?? 0,
       icon: Zap,
       color: "text-emerald-500",
       bg: "bg-emerald-50",
       description: "Comptes actifs actuellement"
    },
    {
       title: "Orthos en attente",
       value: statsData?.pendingOrthophonistes ?? 0,
       icon: Clock,
       color: "text-orange-500",
       bg: "bg-orange-50",
       description: "Vérifications à traiter"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {engagementStats.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-sm flex items-start gap-4"
        >
          <div className={`p-3 rounded-2xl ${stat.bg}`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-[#1a2a4a]">{stat.value}</p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">{stat.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
