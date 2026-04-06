import axios from "axios"

// Direct connection to the API Gateway (no Next.js proxy)
// The gateway handles CORS for both localhost:3001 and localhost:3003
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
    // Required for SuperTokens session cookies
    withCredentials: true, // Doit être true pour les cookies session
    timeout: 20000,
})

// Set rid header dynamically for different SuperTokens recipes
api.interceptors.request.use((config) => {
    const url = config.url || ""
    if (url.includes("/auth/signin") || url.includes("/auth/signup")) {
        config.headers["rid"] = "emailpassword"
    } else if (url.includes("/auth/me") || url.includes("/auth/logout")) {
        config.headers["rid"] = "session"
    } else {
        // Default for other API calls (often session protected)
        config.headers["rid"] = "session"
    }
    return config
})

// Redirect to login on 401 (expired session), but not for auth routes
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthRoute = typeof window !== "undefined" && window.location.pathname.startsWith("/auth")
        
        if (error.response?.status === 401 && !isAuthRoute) {
            // Only redirect if not already on an auth page, and clear local state if needed
            window.location.href = "/"
        }
        return Promise.reject(error)
    }
)
