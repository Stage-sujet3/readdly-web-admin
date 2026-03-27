import axios from "axios"

// Direct connection to the API Gateway (no Next.js proxy)
// The gateway handles CORS for both localhost:3001 and localhost:3003
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    // Required for SuperTokens session cookies
    withCredentials: true,
    timeout: 20000,
})

// Redirect to login on 401 (expired session)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
                window.location.href = "/"
            }
        }
        return Promise.reject(error)
    }
)
