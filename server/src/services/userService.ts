import { userModel } from '../models'
import { CreateUserRequest, User } from '../types'

export class UserService {
  async getUserById(id: string): Promise<User | null> {
    return userModel.getById(id)
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    // Check if user already exists
    const existingUser = await userModel.getByEmail(userData.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    return userModel.create(userData)
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    return userModel.authenticateUser(email, password)
  }
}

export const userService = new UserService()
