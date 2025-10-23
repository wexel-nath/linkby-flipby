import { userModel } from '../models'
import { CreateUserRequest, User } from '../types'

export class UserService {
  async getUserById(id: string): Promise<User | null> {
    return userModel.getById(id)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return userModel.getByEmail(email)
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    // Check if user already exists
    const existingUser = await userModel.getByEmail(userData.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    return userModel.create(userData)
  }

  async getAllUsers(): Promise<User[]> {
    return userModel.getAll()
  }
}

export const userService = new UserService()
