import { Router } from 'express'

import { healthRoutes } from './healthRoutes'

const router = Router()

router.use('/', healthRoutes)

export { router as routes }
