export interface HealthResponse {
  status: 'ok' | 'error'
  timestamp: string
  uptime: number
  version?: string
  environment?: string
}

export interface HealthCheck {
  name: string
  status: 'healthy' | 'unhealthy'
  message?: string
}
