import { Request, Response } from 'express'

import { productService } from '../services'
import { ResponseWrapper } from '../utils/responseWrapper'

export class ProductController {
  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params
      const product = await productService.getProductById(productId)

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
      const userId = req.user?.id
      if (!userId) {
        ResponseWrapper.error(res, 'User not authenticated', 401)
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
      const products = await productService.getAllProducts()

      ResponseWrapper.success(res, products)
    } catch (error) {
      ResponseWrapper.error(res, 'Internal server error', 500)
    }
  }
}

export const productController = new ProductController()
