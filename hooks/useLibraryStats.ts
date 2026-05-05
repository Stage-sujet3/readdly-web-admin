"use client"

import { useEffect, useState } from "react"
import { api } from "@/services/api"

export interface LibraryStats {
  stories: {
    total: number
    byLanguage: { french: number; english: number; arabic: number }
    byLevel: { beginner: number; intermediate: number; advanced: number }
  }
  texts: {
    total: number
    byLanguage: { french: number; english: number; arabic: number }
    byLevel: { beginner: number; intermediate: number; advanced: number }
  }
  words: {
    total: number
    byLanguage: { french: number; english: number; arabic: number }
    byLevel: { beginner: number; intermediate: number; advanced: number }
  }
  // Legacy fields (for compatibility)
  totalStories: number
  byLanguage: { french: number; english: number; arabic: number }
  byLevel: { beginner: number; intermediate: number; advanced: number }
  totalWords: number
  totalTexts: number
}

export function useLibraryStats() {
  const [libraryStats, setLibraryStats] = useState<LibraryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const mutate = () => setRefreshKey(prev => prev + 1)

  useEffect(() => {
    async function fetchLibraryStats() {
      try {
        setLoading(true)
        const response = await api.get("/admin/library-stats", { timeout: 30000 })
        if (response.data?.success) {
          setLibraryStats(response.data.data)
          setError(null)
        } else {
          setError("Impossible de récupérer les statistiques de la bibliothèque")
        }
      } catch (err: any) {
        console.error("[useLibraryStats] Failed:", err)
        setError(err?.message || "Erreur réseau")
      } finally {
        setLoading(false)
      }
    }
    fetchLibraryStats()
  }, [refreshKey])

  return { libraryStats, loading, error, mutate }
}
