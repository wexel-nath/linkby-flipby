export interface User {
  id: string
  createdAt: Date
  email: string
  name: string
}

export interface CreateUserRequest {
  email: string
  name: string
  password: string
}
