import { productModel } from '../models'
import { CreateProductRequest, Product, ProductStatus } from '../types'

export class ProductService {
  async getProductById(id: string): Promise<Product | null> {
    return productModel.getById(id)
  }

  async createProduct(productData: CreateProductRequest, userId: string): Promise<Product> {
    // Validate price amount is positive
    if (productData.priceAmount <= 0) {
      throw new Error('Price amount must be positive')
    }
    if (!productData.priceCurrency) {
      throw new Error('Price currency is required')
    }
    if (!productData.name) {
      throw new Error('Name is required')
    }
    if (!productData.description) {
      productData.description = ''
    }

    // Default to empty array if images are not provided
    if (!productData.images) {
      productData.images = []
    }

    if (productData.images.length > 5) {
      throw new Error('Maximum 5 images allowed')
    }

    productData.status = ProductStatus.Available

    return productModel.create(productData, userId)
  }

  async getAllProducts(): Promise<Product[]> {
    return productModel.getAll()
  }

  async updateProductStatus(
    id: string,
    status: ProductStatus,
    userId: string,
  ): Promise<Product | null> {
    // Verify the product belongs to the user
    const product = await productModel.getById(id)
    if (!product) {
      throw new Error('Product not found')
    }

    if (product.userId !== userId) {
      throw new Error('Not authorized to update this product')
    }

    return productModel.updateStatus(id, status)
  }
}

export const productService = new ProductService()
