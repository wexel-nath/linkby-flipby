import { Request, Response } from 'express'

import { userService } from '../services'
import { LoginRequest, LoginResponse } from '../types'
import { JwtUtils } from '../utils/jwt'
import { ResponseWrapper } from '../utils/responseWrapper'

export class UserController {
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        ResponseWrapper.error(res, 'User not authenticated', 401)
        return
      }

      const user = await userService.getUserById(userId)

      if (!user) {
        ResponseWrapper.error(res, 'User not found', 404)
        return
      }

      ResponseWrapper.success(res, user)
    } catch (error) {
      console.error(error)
      ResponseWrapper.error(res, 'Internal server error', 500)
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body
      const user = await userService.createUser(userData)

      ResponseWrapper.success(res, user, 201)
    } catch (error) {
      if (error instanceof Error) {
        ResponseWrapper.error(res, error.message, 400)
      } else {
        console.error(error)
        ResponseWrapper.error(res, 'Internal server error', 500)
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body

      if (!email || !password) {
        ResponseWrapper.error(res, 'Email and password are required', 400)
        return
      }

      const user = await userService.authenticateUser(email, password)

      if (!user) {
        ResponseWrapper.error(res, 'Invalid email or password', 401)
        return
      }

      const token = JwtUtils.generateToken(user)

      const response: LoginResponse = {
        user,
        token,
      }

      ResponseWrapper.success(res, response)
    } catch (error) {
      if (error instanceof Error) {
        ResponseWrapper.error(res, error.message, 400)
      } else {
        console.error(error)
        ResponseWrapper.error(res, 'Internal server error', 500)
      }
    }
  }
}

export const userController = new UserController()
