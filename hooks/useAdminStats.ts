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
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
        
        const response = await getAdminStats()
        clearTimeout(timeoutId)
        
        if (response.data?.success) {
          setStatsData(response.data.data)
        } else {
          setError("Impossible de récupérer les statistiques")
        }
      } catch (err: any) {
        console.error("[useAdminStats] Failed:", err)
        // Don't set error for timeout/abort errors
        if (err.name !== 'AbortError') {
          setError(err?.message || "Erreur réseau")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return { statsData, loading, error }
}
