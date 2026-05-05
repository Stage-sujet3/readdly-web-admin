"use client"

import { useState, useEffect } from "react"
import { Users, UserPlus, Activity, ShieldCheck, TrendingUp, Users2, Stethoscope, Baby } from "lucide-react"
import { motion } from "framer-motion"
import { useAdminStats } from "@/hooks/useAdminStats"
import { Skeleton } from "@/components/ui/Skeleton"

export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="w-12 h-12 rounded-2xl" />
            <Skeleton className="w-16 h-5" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-20 h-8" />
            <Skeleton className="w-32 h-4" />
          </div>
          <div className="mt-5">
            <Skeleton className="w-full h-2 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Simplified count-up component
function CountUp({ value }: { value: number | string }) {
  const [count, setCount] = useState(0)
  const numericValue = typeof value === 'string' ? parseInt(value) || 0 : value

  useEffect(() => {
    if (numericValue === 0) return
    
    const timer = setTimeout(() => {
      setCount(numericValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [numericValue])

  return <>{numericValue === 0 ? "0" : count}</>
}

export function StatsGrid() {
  const { statsData, loading } = useAdminStats();

  if (loading) {
    return <StatsGridSkeleton />;
  }

  const stats = [
    {
      title: "Utilisateurs Totaux",
      value: statsData ? statsData.totalUsers : 0,
      change: statsData?.growth?.users !== undefined ? `${(statsData.growth.users ?? 0) > 0 ? '+' : ''}${statsData.growth.users ?? 0}%` : "0%",
      isPositive: (statsData?.growth?.users ?? 0) >= 0,
      icon: Users,
      color: "text-indigo-500",
      gradient: "from-indigo-500/20 to-indigo-500/5",
      bgGradient: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Parents",
      value: statsData ? statsData.totalParents : 0,
      change: statsData?.growth?.parents !== undefined ? `${(statsData.growth.parents ?? 0) > 0 ? '+' : ''}${statsData.growth.parents ?? 0}%` : "0%",
      isPositive: (statsData?.growth?.parents ?? 0) >= 0,
      icon: Users2,
      color: "text-purple-500",
      gradient: "from-purple-500/20 to-purple-500/5",
      bgGradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Orthophonistes",
      value: statsData ? statsData.totalOrthophonistes : 0,
      change: statsData?.growth?.orthos !== undefined ? `${(statsData.growth.orthos ?? 0) > 0 ? '+' : ''}${statsData.growth.orthos ?? 0}%` : "0%",
      isPositive: (statsData?.growth?.orthos ?? 0) >= 0,
      icon: Stethoscope,
      color: "text-pink-500",
      gradient: "from-pink-500/20 to-pink-500/5",
      bgGradient: "from-pink-500 to-pink-600",
    },
    {
      title: "Enfants",
      value: statsData ? statsData.totalEnfants : 0,
      change: statsData?.growth?.enfants !== undefined ? `${(statsData.growth.enfants ?? 0) > 0 ? '+' : ''}${statsData.growth.enfants ?? 0}%` : "0%",
      isPositive: (statsData?.growth?.enfants ?? 0) >= 0,
      icon: Baby,
      color: "text-amber-500",
      gradient: "from-amber-500/20 to-amber-500/5",
      bgGradient: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="flex items-center gap-1">
              {stat.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
              )}
              <span className={`text-sm font-bold ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-slate-900">
              <CountUp value={stat.value} />
            </h3>
            <p className="text-sm font-medium text-slate-600">{stat.title}</p>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${stat.bgGradient} transition-all duration-1000`}
              style={{ width: `${Math.min(100, (stat.value as number) / 2)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
