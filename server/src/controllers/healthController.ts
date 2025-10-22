import { Request, Response } from 'express'

import { healthService } from '../services'

export class HealthController {
  async getHealth(req: Request, res: Response): Promise<void> {
    try {
      const healthStatus = await healthService.getHealthStatus()

      const statusCode = healthStatus.status === 'ok' ? 200 : 503
      res.status(statusCode).json(healthStatus)
    } catch (error) {
      console.error('Health check failed:', error)
      res.status(503).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        message: 'Health check failed',
      })
    }
  }
}

export const healthController = new HealthController()
