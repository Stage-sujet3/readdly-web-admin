"use client"
import { StatsGrid } from "@/features/dashboard/components/StatsGrid"
import { EngagementStats } from "@/features/dashboard/components/EngagementStats"
import dynamic from "next/dynamic"

// Dynamic imports for chart components to optimize bundle size
const ChartsSection = dynamic(() => import("@/features/dashboard/components/ChartsSection").then(mod => mod.ChartsSection), { 
  ssr: false,
  loading: () => <div className="h-96 bg-slate-50 rounded-3xl animate-pulse" />
})
const LibraryChartsSection = dynamic(() => import("@/features/dashboard/components/LibraryChartsSection").then(mod => mod.LibraryChartsSection), { 
  ssr: false,
  loading: () => <div className="h-96 bg-slate-50 rounded-3xl animate-pulse" />
})
const ActivitySection = dynamic(() => import("@/features/dashboard/components/ActivitySection").then(mod => mod.ActivitySection), { 
  ssr: false,
  loading: () => <div className="h-96 bg-slate-50 rounded-3xl animate-pulse" />
})

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <StatsGrid />
      <EngagementStats />
      <ChartsSection />
      <ActivitySection />
      <LibraryChartsSection />
    </div>
  )
}
