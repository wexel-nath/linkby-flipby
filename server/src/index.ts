import cors from 'cors'
import express from 'express'

import { errorHandler } from './middleware'
import { routes } from './routes'

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api', routes)

// Error handling middleware (must be last)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/healthz`)
})

export default app
