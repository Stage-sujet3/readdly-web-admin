import { api } from './api'
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
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Server logout failed:', error)
    } finally {
      this.removeToken()
    }
  }

  // Update password
  async updatePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await api.put('/auth/profile/password', { currentPassword, newPassword })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password update failed'
      }
    }
  }

  // Login user (Standard SuperTokens EmailPassword implementation)
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/signin', {
        formFields: [
          { id: 'email', value: email },
          { id: 'password', value: password }
        ]
      })

      if (response.data.status === 'OK') {
        const user = response.data.user
        // Note: SuperTokens handles tokens via cookies (withCredentials: true)
        // We set a dummy token to satisfy the isAuthenticated check if needed, 
        // or just rely on the session cookie.
        this.setToken('st-session-active') 
        
        const userData = {
          id: user.id,
          email: user.email,
          name: "Administrateur",
          role: "ADMIN"
        }
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(userData))
        }

        return { success: true, user: userData }
      }

      return {
        success: false,
        message: response.data.status === 'WRONG_CREDENTIALS_ERROR' 
          ? 'Identifiants incorrects' 
          : 'Erreur lors de la connexion'
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return {
        success: false,
        message: 'Erreur technique de connexion'
      }
    }
  }
}

export const authService = new AuthService()
