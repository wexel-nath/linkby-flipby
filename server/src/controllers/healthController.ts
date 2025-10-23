import { Request, Response } from 'express'

import { ResponseWrapper } from '../utils/responseWrapper'

export class HealthController {
  async getHealth(req: Request, res: Response): Promise<void> {
    ResponseWrapper.success(res, { status: 'ok' })
  }
}

export const healthController = new HealthController()
