import { config } from '@/lib/config'

export interface ApiResponse<T> {
  data?: T
  message?: string
}

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    console.log('baseUrl', baseUrl)
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
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
}

export const apiService = new ApiService(config.apiBaseUrl)
