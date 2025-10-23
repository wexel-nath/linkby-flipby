import { Router } from 'express'

import { authenticateToken } from '../middleware'
import { uploadProductImages } from '../middleware/upload'
import { healthController, offerController, productController, userController } from './index'

const router = Router()

// Health routes
router.get('/health', (req, res) => healthController.getHealth(req, res))

// Auth routes (public)
router.post('/auth/login', (req, res) => userController.login(req, res))
router.post('/users', (req, res) => userController.createUser(req, res))

// User routes
router.get('/user', authenticateToken, (req, res) => userController.getUser(req, res))

// Product routes
router.post('/products', authenticateToken, uploadProductImages, (req, res) =>
  productController.createProduct(req, res),
)
router.get('/products', (req, res) => productController.getAllProducts(req, res))
router.get('/products/:productId', (req, res) => productController.getProduct(req, res))
router.put('/products/:productId/purchase', authenticateToken, (req, res) =>
  productController.purchaseProduct(req, res),
)

// Offer routes
router.get('/products/:productId/offers', (req, res) => offerController.getProductOffers(req, res))
router.post('/products/:productId/offers', authenticateToken, (req, res) =>
  offerController.createOffer(req, res),
)
router.put('/products/:productId/offers/:offerId/accept', authenticateToken, (req, res) =>
  offerController.acceptOffer(req, res),
)

export { router as routes }
