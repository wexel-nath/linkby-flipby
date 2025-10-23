import { pool } from '../db/connection'
import { CreateProductRequest, Product } from '../types'

export class ProductModel {
  async getById(id: string): Promise<Product | null> {
    const query = `
      SELECT 
        p.id,
        p.created_at as "createdAt",
        p.user_id as "userId",
        u.name as "userName",
        p.name,
        p.price_amount as "priceAmount",
        p.price_currency as "priceCurrency",
        p.description,
        p.images,
        p.purchased_by as "purchasedBy",
        CASE
          WHEN p.purchased_by IS NOT NULL THEN 'Sold'
          WHEN EXISTS (
            SELECT 1
            FROM offer o 
            WHERE o.product_id = p.id AND o.accepted_at IS NOT NULL
          ) THEN 'Reserved'
          ELSE 'Available'
        END as "status"
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
      INSERT INTO product (user_id, name, price_amount, price_currency, description, images)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `
    const args = [
      userId,
      productData.name,
      productData.priceAmount,
      productData.priceCurrency,
      productData.description,
      productData.images,
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
        u.name as "userName",
        p.name,
        p.price_amount as "priceAmount",
        p.price_currency as "priceCurrency",
        p.description,
        p.images,
        p.purchased_by as "purchasedBy",
        CASE
          WHEN p.purchased_by IS NOT NULL THEN 'Sold'
          WHEN EXISTS (
            SELECT 1
            FROM offer o 
            WHERE o.product_id = p.id AND o.accepted_at IS NOT NULL
          ) THEN 'Reserved'
          ELSE 'Available'
        END as "status"
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
        u.name as "userName",
        p.name,
        p.price_amount as "priceAmount",
        p.price_currency as "priceCurrency",
        p.description,
        p.images,
        p.purchased_by as "purchasedBy",
        CASE
          WHEN p.purchased_by IS NOT NULL THEN 'Sold'
          WHEN EXISTS (
            SELECT 1
            FROM offer o 
            WHERE o.product_id = p.id AND o.accepted_at IS NOT NULL
          ) THEN 'Reserved'
          ELSE 'Available'
        END as "status"
      FROM product p
      JOIN "user" u ON p.user_id = u.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
    `
    const result = await pool.query(query, [userId])

    return result.rows as Product[]
  }

  async updatePurchasedBy(id: string, purchasedBy: string): Promise<Product | null> {
    const query = 'UPDATE product SET purchased_by = $1 WHERE id = $2'
    await pool.query(query, [purchasedBy, id])

    return this.getById(id)
  }
}

export const productModel = new ProductModel()
