import { config } from '@/lib/config'

export interface ApiResponse<T> {
  data?: T
  message?: string
}

class ApiService {
  private baseUrl: string
  private authToken: string | null = null
  private onUnauthorized: (() => void) | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setAuthToken(token: string) {
    this.authToken = token
  }

  clearAuthToken() {
    this.authToken = null
  }

  setUnauthorizedHandler(handler: () => void) {
    this.onUnauthorized = handler
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      }

      // Add Authorization header if token exists
      if (this.authToken) {
        headers.Authorization = `Bearer ${this.authToken}`
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers,
        ...options,
      })

      if (!response.ok) {
        // Handle 401 Unauthorized - likely expired token
        if (response.status === 401 && this.onUnauthorized) {
          this.onUnauthorized()
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      return {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  async requestMultipart<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {}

      // Add Authorization header if token exists
      if (this.authToken) {
        headers.Authorization = `Bearer ${this.authToken}`
      }

      // Don't set Content-Type for multipart - let browser set it with boundary

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        // Handle 401 Unauthorized - likely expired token
        if (response.status === 401 && this.onUnauthorized) {
          this.onUnauthorized()
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Multipart API request failed:', error)
      return {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }
}

export const apiService = new ApiService(config.apiBaseUrl)
