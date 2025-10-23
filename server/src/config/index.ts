export interface Config {
  port: number
  nodeEnv: string
  databaseUrl: string
  jwtSecret: string
  jwtExpiresIn: string
  uploadsDir: string
  baseUrl: string
}

export const config: Config = {
  port: parseInt(process.env.PORT || '8080'),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'jwt-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  uploadsDir: process.env.UPLOADS_DIR || './uploads',
  baseUrl: process.env.BASE_URL || '',
}
