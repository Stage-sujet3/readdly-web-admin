import { useEffect, useState } from "react"
import { me, logout } from "@/services/auth.service"

export function useAuth() {
    const [user, setUser] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        const fetchMe = async () => {
            try {
                setLoading(true)
                const response = await me()
                if (!cancelled) {
                    setUser(response.data)
                    setError(null)
                }
            } catch (e: any) {
                if (!cancelled) {
                    // Pas connecté / erreur → on remet user à null
                    setUser(null)
                    setError(null)
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        fetchMe()

        return () => {
            cancelled = true
        }
    }, [])

    const signOut = async () => {
        await logout()
        setUser(null)
    }

    return { user, loading, error, signOut }
}
