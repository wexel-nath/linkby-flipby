import { Router } from 'express'

import { healthController, offerController, productController, userController } from './index'

const router = Router()

// Health routes
router.get('/health', (req, res) => healthController.getHealth(req, res))

// User routes
router.get('/users', (req, res) => userController.getAllUsers(req, res))
router.get('/users/search', (req, res) => userController.getUserByEmail(req, res))
router.get('/users/:id', (req, res) => userController.getUser(req, res))
router.post('/users', (req, res) => userController.createUser(req, res))

// Product routes
router.get('/products', (req, res) => productController.getAllProducts(req, res))
router.get('/products/:id', (req, res) => productController.getProduct(req, res))
router.post('/products', (req, res) => productController.createProduct(req, res))
router.put('/products/:id/status', (req, res) => productController.updateProductStatus(req, res))
router.get('/products/user/:userId', (req, res) => productController.getUserProducts(req, res))

// Offer routes
router.get('/offers', (req, res) => offerController.getAllOffers(req, res))
router.get('/offers/:id', (req, res) => offerController.getOffer(req, res))
router.post('/offers', (req, res) => offerController.createOffer(req, res))
router.put('/offers/:id/accept', (req, res) => offerController.acceptOffer(req, res))
router.get('/offers/product/:productId', (req, res) => offerController.getProductOffers(req, res))
router.get('/offers/user/:userId', (req, res) => offerController.getUserOffers(req, res))

export { router as routes }
