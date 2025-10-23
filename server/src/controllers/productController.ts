import { Request, Response } from 'express'

import { productService } from '../services'
import { convertFilePathsToUrls } from '../utils/imageUtils'
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
      const userId = req.user?.id
      if (!userId) {
        ResponseWrapper.error(res, 'User not authenticated', 401)
        return
      }

      // Handle multipart form data
      const files = req.files as Express.Multer.File[]
      const { productData } = req.body

      // Parse JSON product data from form field
      let parsedProductData
      try {
        parsedProductData = typeof productData === 'string' ? JSON.parse(productData) : productData
      } catch (error) {
        ResponseWrapper.error(res, 'Invalid product data JSON', 400)
        return
      }

      // Extract image paths from uploaded files and convert to URLs
      const imagePaths = files ? files.map((file) => file.path) : []
      const imageUrls = convertFilePathsToUrls(imagePaths)

      // Combine parsed data with image URLs
      const completeProductData = {
        ...parsedProductData,
        images: imageUrls,
      }

      const product = await productService.createProduct(completeProductData, userId)

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
