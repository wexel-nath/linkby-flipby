import { pool } from '../db/connection'
import { CreateUserRequest, User } from '../types'

export class UserModel {
  async getById(id: string): Promise<User | null> {
    const query = `
        SELECT
            id,
            created_at as "createdAt",
            email,
            name
        FROM "user"
        WHERE id = $1
    `
    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as User
  }

  async getByEmail(email: string): Promise<User | null> {
    const query = `
        SELECT
            id,
            created_at as "createdAt",
            email,
            name
        FROM "user"
        WHERE email = $1
    `
    const result = await pool.query(query, [email])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as User
  }

  async create(userData: CreateUserRequest): Promise<User> {
    const query = `
      INSERT INTO "user" (email, name, password_hash)
      VALUES ($1, $2, crypt($3, gen_salt('bf')))
      RETURNING id, created_at as "createdAt", email, name
    `
    const args = [userData.email, userData.name, userData.password]
    const result = await pool.query(query, args)

    return result.rows[0] as User
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const query = `
        SELECT
            id,
            created_at as "createdAt",
            email,
            name
        FROM "user"
        WHERE email = $1 AND password_hash = crypt($2, password_hash)
    `
    const result = await pool.query(query, [email, password])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as User
  }
}

export const userModel = new UserModel()
