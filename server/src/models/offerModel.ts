import { pool } from '../db/connection'
import { CreateOfferRequest, Offer } from '../types'

export class OfferModel {
  async getById(id: string): Promise<Offer | null> {
    const query = `
      SELECT 
        id,
        created_at as "createdAt",
        product_id as "productId",
        user_id as "userId",
        offer_by as "offerBy",
        offer_by_name as "offerByName",
        price_amount as "priceAmount",
        accepted_at as "acceptedAt"
      FROM offer 
      WHERE id = $1
    `
    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as Offer
  }

  async create(offerData: CreateOfferRequest, userId: string): Promise<Offer> {
    const query = `
      INSERT INTO offer (product_id, user_id, offer_by, offer_by_name, price_amount)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING 
        id,
        created_at as "createdAt",
        product_id as "productId",
        user_id as "userId",
        offer_by as "offerBy",
        offer_by_name as "offerByName",
        price_amount as "priceAmount",
        accepted_at as "acceptedAt"
    `
    const args = [
      offerData.productId,
      userId,
      offerData.offerBy,
      offerData.offerByName,
      offerData.priceAmount,
    ]
    const result = await pool.query(query, args)

    return result.rows[0] as Offer
  }

  async getByProductId(productId: string): Promise<Offer[]> {
    const query = `
      SELECT 
        id,
        created_at as "createdAt",
        product_id as "productId",
        user_id as "userId",
        offer_by as "offerBy",
        offer_by_name as "offerByName",
        price_amount as "priceAmount",
        accepted_at as "acceptedAt"
      FROM offer 
      WHERE product_id = $1
      ORDER BY created_at DESC
    `
    const result = await pool.query(query, [productId])

    return result.rows as Offer[]
  }

  async getByUserId(userId: string): Promise<Offer[]> {
    const query = `
      SELECT 
        id,
        created_at as "createdAt",
        product_id as "productId",
        user_id as "userId",
        offer_by as "offerBy",
        offer_by_name as "offerByName",
        price_amount as "priceAmount",
        accepted_at as "acceptedAt"
      FROM offer 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `
    const result = await pool.query(query, [userId])

    return result.rows as Offer[]
  }

  async acceptOffer(id: string): Promise<Offer | null> {
    const query = `
      UPDATE offer 
      SET accepted_at = NOW() 
      WHERE id = $1
      RETURNING 
        id,
        created_at as "createdAt",
        product_id as "productId",
        user_id as "userId",
        offer_by as "offerBy",
        offer_by_name as "offerByName",
        price_amount as "priceAmount",
        accepted_at as "acceptedAt"
    `
    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as Offer
  }

  async getAll(): Promise<Offer[]> {
    const query = `
      SELECT 
        id,
        created_at as "createdAt",
        product_id as "productId",
        user_id as "userId",
        offer_by as "offerBy",
        offer_by_name as "offerByName",
        price_amount as "priceAmount",
        accepted_at as "acceptedAt"
      FROM offer 
      ORDER BY created_at DESC
    `
    const result = await pool.query(query)

    return result.rows as Offer[]
  }
}

export const offerModel = new OfferModel()
