import { Request, Response } from 'express'

import { userService } from '../services'
import { ResponseWrapper } from '../utils/responseWrapper'

export class UserController {
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const user = await userService.getUserById(id)

      if (!user) {
        ResponseWrapper.error(res, 'User not found', 404)
        return
      }

      ResponseWrapper.success(res, user)
    } catch (error) {
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
        ResponseWrapper.error(res, 'Internal server error', 500)
      }
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers()
      ResponseWrapper.success(res, users)
    } catch (error) {
      ResponseWrapper.error(res, 'Internal server error', 500)
    }
  }

  async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.query

      if (!email || typeof email !== 'string') {
        ResponseWrapper.error(res, 'Email parameter is required', 400)
        return
      }

      const user = await userService.getUserByEmail(email)

      if (!user) {
        ResponseWrapper.error(res, 'User not found', 404)
        return
      }

      ResponseWrapper.success(res, user)
    } catch (error) {
      ResponseWrapper.error(res, 'Internal server error', 500)
    }
  }
}

export const userController = new UserController()
