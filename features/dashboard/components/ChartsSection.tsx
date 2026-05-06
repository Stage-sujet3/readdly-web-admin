"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { useAdminStats } from "@/hooks/useAdminStats"


export function ChartsSection() {
  const { statsData } = useAdminStats();

  const userRoleData = [
    { name: "Enfants", value: statsData?.totalEnfants || 0, color: "#f98806ff" },
    { name: "Parents", value: statsData?.totalParents || 0, color: "#8B5CF6" },
    { name: "Orthophonistes", value: statsData?.totalOrthophonistes || 0, color: "#EC4899" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* User Distribution - Full Pie Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-premium"
      >
        <h3 className="text-xl font-bold text-slate-800 mb-8 px-2">Répartition des Utilisateurs</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height={350} minWidth={300} minHeight={350}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
              >
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 px-2">
          {userRoleData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm font-medium text-slate-600">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Monthly User Growth - Rounded Bar Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-premium"
      >
        <h3 className="text-xl font-bold text-slate-800 mb-8 px-2">Croissance Utilisateurs (6 Mois)</h3>
        <div className="h-[350px] w-full">
          {statsData?.monthlyGrowth?.length ? (
            <ResponsiveContainer width="100%" height={350} minWidth={300} minHeight={350}>
              <BarChart data={statsData.monthlyGrowth} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="month" 
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
                  cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="users" 
                  fill="#6366F1" 
                  radius={[12, 12, 0, 0]} 
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <TrendingUp className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">Aucune donnée de croissance disponible</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
