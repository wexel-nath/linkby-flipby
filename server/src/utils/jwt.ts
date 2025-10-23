import * as jwt from 'jsonwebtoken'

import { config } from '../config'
import { User } from '../types'

export class JwtUtils {
  static generateToken(payload: User): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: '1d', // 1 day expiration
    })
  }

  static verifyToken(token: string): User {
    try {
      const user = jwt.verify(token, config.jwtSecret) as User
      console.log('user', user)
      return user
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  }

  static extractTokenFromHeader(authHeader: string | undefined): string {
    if (!authHeader) {
      throw new Error('Authorization header is missing')
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header must start with Bearer')
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    if (!token) {
      throw new Error('Token is missing from authorization header')
    }

    return token
  }
}
