"use client"

import { CheckCircle, Clock, XCircle, Zap } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/Progress"
import { useAdminStats } from "@/hooks/useAdminStats"

const defaultActivityData = [
  { day: "Lun", activities: 0 },
  { day: "Mar", activities: 0 },
  { day: "Mer", activities: 0 },
  { day: "Jeu", activities: 0 },
  { day: "Ven", activities: 0 },
  { day: "Sam", activities: 0 },
  { day: "Dim", activities: 0 },
]

export function ActivitySection() {
  const { statsData } = useAdminStats();

  // Derive pipeline values from real data
  const totalUsers = statsData?.totalUsers ?? 0
  const activeUsers = statsData?.activeUsers ?? 0
  const totalOrthophonistes = statsData?.totalOrthophonistes ?? 0
  const verifiedOrthos = statsData?.verifiedOrthophonistes ?? 0
  const pendingOrthos = statsData?.pendingOrthophonistes ?? 0
  
  const verifiedPercent = totalOrthophonistes > 0 ? Math.round((verifiedOrthos / totalOrthophonistes) * 100) : 0
  const pendingPercent = totalOrthophonistes > 0 ? Math.round((pendingOrthos / totalOrthophonistes) * 100) : 0
  const activePercent = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
  const efficiencyRate = totalUsers > 0 ? (activePercent).toFixed(1) : "0.0"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Weekly Activity Line Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl p-8 lg:col-span-2 rounded-[2.5rem] border border-white/60 shadow-premium"
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#1a2a4a]">Interaction Usage</h3>
            <div className="flex items-center gap-2 mt-1">
               <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/20"></span>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Score d'activité globale</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-2">
             <Zap className="w-3.5 h-3.5 text-[#5f6ad8]" />
             <span className="text-[10px] font-bold text-[#5f6ad8] uppercase tracking-wider">Suivi en direct</span>
          </div>
        </div>
        <div className="h-[300px] w-full min-h-[300px] min-w-[300px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
            <LineChart data={statsData?.weeklyActivity?.length ? statsData.weeklyActivity : defaultActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(95, 106, 216, 0.04)' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="activities" 
                stroke="#5f6ad8" 
                strokeWidth={3} 
                dot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: '#5f6ad8' }}
                activeDot={{ r: 7, strokeWidth: 0, fill: '#5f6ad8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Gestion des Orthophonistes — Dynamic from real data */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-premium"
      >
        <div className="mb-10">
          <h3 className="text-xl font-bold text-[#1a2a4a]">Gestion Orthophonistes</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">État des vérifications</p>
        </div>
        
        <div className="space-y-10">
          <div className="group cursor-default">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:rotate-6 transition-transform">
                  <Zap className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Inscrits</span>
              </div>
              <span className="text-base font-bold text-[#1a2a4a] tabular-nums tracking-tighter">{totalOrthophonistes}</span>
            </div>
            <Progress value={100} colorClass="bg-gradient-to-r from-blue-400 to-blue-600" className="h-2 shadow-sm" />
          </div>

          <div className="group cursor-default">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover:rotate-6 transition-transform">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vérifiés</span>
              </div>
              <span className="text-base font-bold text-[#1a2a4a] tabular-nums tracking-tighter">{verifiedOrthos}</span>
            </div>
            <Progress value={verifiedPercent} colorClass="bg-gradient-to-r from-emerald-400 to-emerald-600" className="h-2 shadow-sm" />
          </div>

          <div className="group cursor-default">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20 group-hover:rotate-6 transition-transform">
                  <Clock className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">En attente</span>
              </div>
              <span className="text-base font-bold text-[#1a2a4a] tabular-nums tracking-tighter">{pendingOrthos}</span>
            </div>
            <Progress value={pendingPercent} colorClass="bg-gradient-to-r from-orange-400 to-orange-600" className="h-2 shadow-sm" />
          </div>
        </div>

        <div className="mt-12 p-6 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10 group hover:bg-emerald-500/10 transition-colors">
           <div className="text-center">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Taux de Vérification</p>
              <p className="text-3xl font-bold text-emerald-600 tabular-nums">{verifiedPercent}<span className="text-base">%</span></p>
           </div>
        </div>
      </motion.div>
    </div>
  )
}
