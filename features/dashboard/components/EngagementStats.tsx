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

  const pendingCount = statsData?.pendingOrthophonistes ?? 0;

  if (pendingCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 opacity-[0.03] rounded-[2.5rem]" />
      <div className="relative bg-white/40 backdrop-blur-xl border border-orange-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full animate-pulse" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-black text-[#1a2a4a] mb-1">
              {pendingCount} Orthophonistes en attente
            </h3>
            <p className="text-slate-500 font-medium">
              Il y a des demandes de vérification d'identité qui nécessitent votre attention.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-6 py-3 bg-white border border-orange-100 rounded-2xl shadow-sm">
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] block mb-0.5">Statut Actuel</span>
            <span className="text-lg font-bold text-[#1a2a4a]">Action Requise</span>
          </div>
          
          <button 
            onClick={() => window.location.href = '/dashboard/users?role=ORTHOPHONISTE&status=PENDING'}
            className="px-8 py-4 bg-[#1a2a4a] text-white rounded-2xl font-bold text-sm hover:bg-[#2a3a5a] transition-all shadow-lg shadow-slate-900/10 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
          >
            Vérifier maintenant
          </button>
        </div>
      </div>
    </motion.div>
  )
}
