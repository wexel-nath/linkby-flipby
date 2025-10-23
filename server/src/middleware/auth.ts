import { NextFunction, Request, Response } from 'express'

import { User } from '../types'
import { JwtUtils } from '../utils/jwt'
import { ResponseWrapper } from '../utils/responseWrapper'

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = JwtUtils.extractTokenFromHeader(req.headers.authorization)
    const user = JwtUtils.verifyToken(token)

    req.user = user
    next()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication failed'
    ResponseWrapper.error(res, message, 401)
  }
}
