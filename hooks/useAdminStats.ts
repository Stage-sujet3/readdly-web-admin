"use client"

import { useEffect, useState } from "react"
import { getAdminStats } from "@/services/user.service"

export interface AdminStats {
  totalUsers: number
  totalParents: number
  totalOrthophonistes: number
  totalEnfants: number
  activeUsers: number
  growth: {
    users: number
    parents: number
    orthos: number
    enfants: number
  }
  monthlyGrowth: { month: string; users: number }[]
  weeklyActivity: { day: string; activities: number }[]
  verifiedOrthophonistes: number
  pendingOrthophonistes: number
  totalMessages: number
  totalRatings: number
}

export function useAdminStats() {
  const [statsData, setStatsData] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        // Add timeout configuration to prevent timeout errors
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
        
        const response = await getAdminStats(controller.signal)
        clearTimeout(timeoutId)
        
        console.log("[useAdminStats] API Response:", response)
        
        if (response.data?.success) {
          console.log("[useAdminStats] Stats Data:", response.data.data)
          setStatsData(response.data.data)
        } else {
          console.error("[useAdminStats] API Error:", response.data)
          setError("Impossible de récupérer les statistiques")
        }
      } catch (err: any) {
        console.error("[useAdminStats] Failed:", err)
        setError(err?.message || "Erreur réseau")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return { statsData, loading, error }
}
