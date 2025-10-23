import React, { createContext, useContext, useEffect, useState } from 'react'

import { apiService } from '@/services/api'
import { User } from '@/types'

interface LoginResponse {
  user: User
  token: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('user_data')
    apiService.clearAuthToken()
  }

  // Check for existing token on mount
  useEffect(() => {
    // Set up automatic logout on 401 responses
    apiService.setUnauthorizedHandler(logout)

    const token = sessionStorage.getItem('auth_token')
    const userData = sessionStorage.getItem('user_data')

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        // Set the token for future API requests
        apiService.setAuthToken(token)
      } catch (error) {
        console.error('Failed to parse stored user data:', error)
        sessionStorage.removeItem('auth_token')
        sessionStorage.removeItem('user_data')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await apiService.request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      if (response.data) {
        const { user: userData, token } = response.data
        setUser(userData)

        // Store token and user data in sessionStorage
        sessionStorage.setItem('auth_token', token)
        sessionStorage.setItem('user_data', JSON.stringify(userData))

        // Set token for future API requests
        apiService.setAuthToken(token)

        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
