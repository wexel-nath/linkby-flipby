import { Request, Response } from 'express'

import { productService } from '../services'
import { ProductStatus } from '../types'
import { ResponseWrapper } from '../utils/responseWrapper'

export class ProductController {
  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const product = await productService.getProductById(id)

      if (!product) {
        ResponseWrapper.error(res, 'Product not found', 404)
        return
      }

      ResponseWrapper.success(res, product)
    } catch (error) {
      ResponseWrapper.error(res, 'Internal server error', 500)
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData = req.body
      const { userId } = req.body // In a real app, this would come from auth middleware

      if (!userId) {
        ResponseWrapper.error(res, 'userId is required', 400)
        return
      }

      const product = await productService.createProduct(productData, userId)

      ResponseWrapper.success(res, product, 201)
    } catch (error) {
      if (error instanceof Error) {
        ResponseWrapper.error(res, error.message, 400)
      } else {
        ResponseWrapper.error(res, 'Internal server error', 500)
      }
    }
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const { available } = req.query

      let products
      if (available === 'true') {
        products = await productService.getAvailableProducts()
      } else {
        products = await productService.getAllProducts()
      }

      ResponseWrapper.success(res, products)
    } catch (error) {
      ResponseWrapper.error(res, 'Internal server error', 500)
    }
  }

  async getUserProducts(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params
      const products = await productService.getProductsByUserId(userId)

      ResponseWrapper.success(res, products)
    } catch (error) {
      ResponseWrapper.error(res, 'Internal server error', 500)
    }
  }

  async updateProductStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { status, userId } = req.body // In a real app, userId would come from auth middleware

      if (!userId) {
        ResponseWrapper.error(res, 'userId is required', 400)
        return
      }

      if (!Object.values(ProductStatus).includes(status)) {
        ResponseWrapper.error(res, 'Invalid status', 400)
        return
      }

      const product = await productService.updateProductStatus(id, status, userId)

      if (!product) {
        ResponseWrapper.error(res, 'Product not found', 404)
        return
      }

      ResponseWrapper.success(res, product)
    } catch (error) {
      if (error instanceof Error) {
        ResponseWrapper.error(res, error.message, 400)
      } else {
        ResponseWrapper.error(res, 'Internal server error', 500)
      }
    }
  }
}

export const productController = new ProductController()
