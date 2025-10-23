import cors from 'cors'
import express from 'express'

import { config } from './config'
import { routes } from './controllers'
import { errorHandler } from './middleware'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/', routes)

// Error handling middleware (must be last)
app.use(errorHandler)

// Start server
app.listen(config.port, () => {
  console.log(`Server: running on port ${config.port} (${config.nodeEnv})`)
})

export default app
