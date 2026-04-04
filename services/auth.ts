// Authentication service
import { COLORS } from '@/utils/constants'

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
}

class AuthService {
  private token: string | null = null

  constructor() {
    this.token = this.getToken()
  }

  // Get token from localStorage
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  }

  // Set token in localStorage
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
      this.token = token
    }
  }

  // Remove token from localStorage
  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      this.token = null
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  // Get current user
  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }

  // Logout user
  logout(): void {
    this.removeToken()
  }

  // Login user (mock implementation)
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Mock API call - replace with actual API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        this.setToken(data.token)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      }

      return data
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: 'Login failed',
      }
    }
  }
}

export const authService = new AuthService()
