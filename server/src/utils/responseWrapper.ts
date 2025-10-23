import { Response } from 'express'

export interface ApiResponse<T = any> {
  data: T
}

export interface ApiErrorResponse {
  error: string
}

export class ResponseWrapper {
  static success<T>(res: Response, data: T, statusCode: number = 200): void {
    const response: ApiResponse<T> = { data }
    res.status(statusCode).json(response)
  }

  static error(res: Response, message: string, statusCode: number = 500): void {
    const response: ApiErrorResponse = { error: message }
    res.status(statusCode).json(response)
  }
}
