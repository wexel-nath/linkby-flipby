import { pool } from '../db/connection'
import { CreateProductRequest, Product, ProductStatus } from '../types'

export class ProductModel {
  async getById(id: string): Promise<Product | null> {
    const query = `
      SELECT 
        p.id,
        p.created_at as "createdAt",
        p.user_id as "userId",
        u.name as "listedByName",
        p.name,
        p.price_amount as "priceAmount",
        p.price_currency as "priceCurrency",
        p.description,
        p.images,
        p.status,
        CASE
          WHEN p.status = 'Reserved' THEN (
            SELECT o.user_id 
            FROM offer o 
            WHERE o.product_id = p.id 
              AND o.accepted_at IS NOT NULL 
              AND o.offer_by = 'Buyer'
            LIMIT 1
          )
          ELSE NULL
        END as "reservedForBuyerId"
      FROM product p
      JOIN "user" u ON p.user_id = u.id
      WHERE p.id = $1
    `
    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as Product
  }

  async create(productData: CreateProductRequest, userId: string): Promise<Product> {
    const query = `
      INSERT INTO product (user_id, name, price_amount, price_currency, description, images, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, created_at as "createdAt", user_id as "userId"
    `
    const args = [
      userId,
      productData.name,
      productData.priceAmount,
      productData.priceCurrency,
      productData.description,
      productData.images,
      productData.status,
    ]
    const result = await pool.query(query, args)

    const createdProduct = result.rows[0]

    // Get the full product with user name
    const fullProduct = await this.getById(createdProduct.id)
    return fullProduct!
  }

  async getAll(): Promise<Product[]> {
    const query = `
      SELECT 
        p.id,
        p.created_at as "createdAt",
        p.user_id as "userId",
        u.name as "listedByName",
        p.name,
        p.price_amount as "priceAmount",
        p.price_currency as "priceCurrency",
        p.description,
        p.images,
        p.status,
        CASE 
          WHEN p.status = 'Reserved' THEN (
            SELECT o.user_id 
            FROM offer o 
            WHERE o.product_id = p.id 
              AND o.accepted_at IS NOT NULL 
              AND o.offer_by = 'Buyer'
            LIMIT 1
          )
          ELSE NULL
        END as "reservedForBuyerId"
      FROM product p
      JOIN "user" u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `
    const result = await pool.query(query)

    return result.rows as Product[]
  }

  async getByUserId(userId: string): Promise<Product[]> {
    const query = `
      SELECT 
        p.id,
        p.created_at as "createdAt",
        p.user_id as "userId",
        u.name as "listedByName",
        p.name,
        p.price_amount as "priceAmount",
        p.price_currency as "priceCurrency",
        p.description,
        p.images,
        p.status,
        CASE 
          WHEN p.status = 'Reserved' THEN (
            SELECT o.user_id 
            FROM offer o 
            WHERE o.product_id = p.id 
              AND o.accepted_at IS NOT NULL 
              AND o.offer_by = 'Buyer'
            LIMIT 1
          )
          ELSE NULL
        END as "reservedForBuyerId"
      FROM product p
      JOIN "user" u ON p.user_id = u.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
    `
    const result = await pool.query(query, [userId])

    return result.rows as Product[]
  }

  async updateStatus(id: string, status: ProductStatus): Promise<Product | null> {
    const query = 'UPDATE product SET status = $1 WHERE id = $2'
    await pool.query(query, [status, id])

    return this.getById(id)
  }
}

export const productModel = new ProductModel()
