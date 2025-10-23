export interface Config {
  port: number
  nodeEnv: string
  databaseUrl: string
}

export const config: Config = {
  port: parseInt(process.env.PORT || '8080'),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
}
