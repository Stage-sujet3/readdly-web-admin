import axios from "axios"

/**
 * Proxied API client for the user-service REST via Next.js rewrites.
 * 
 * Next.js rewrites `/user-service/:path*` → `http://localhost:3001/:path*`
 * This avoids CORS issues entirely since the request is same-origin.
 * 
 * The user-service findByIdU() includes `enfants: true` via Prisma,
 * so GET /user-service/users/:id returns the full parent object with children.
 */
export const userServiceApi = axios.create({
  baseURL: typeof window !== 'undefined' 
    ? `${window.location.origin}/user-service`
    : "http://localhost:3001",
  timeout: 10000,
})
