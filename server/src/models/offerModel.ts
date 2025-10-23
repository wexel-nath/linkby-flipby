import { pool } from '../db/connection'
import { CreateOfferRequest, Offer } from '../types'

export class OfferModel {
  async getById(id: string): Promise<Offer | null> {
    const query = `
      SELECT 
        o.id,
        o.created_at as "createdAt",
        o.product_id as "productId",
        o.user_id as "userId",
        u.name as "userName",
        o.offer_by as "offerBy",
        o.price_amount as "priceAmount",
        o.accepted_at as "acceptedAt"
      FROM offer o
      JOIN "user" u ON o.user_id = u.id
      WHERE o.id = $1
    `
    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as Offer
  }

  async create(offerData: CreateOfferRequest, userId: string): Promise<Offer> {
    const insertQuery = `
      INSERT INTO offer (product_id, user_id, offer_by, price_amount)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `
    const selectQuery = `
      SELECT 
        o.id,
        o.created_at as "createdAt",
        o.product_id as "productId",
        o.user_id as "userId",
        u.name as "userName",
        o.offer_by as "offerBy",
        o.price_amount as "priceAmount",
        o.accepted_at as "acceptedAt",
        o.accepted_by as "acceptedBy"
      FROM offer o
      JOIN "user" u ON o.user_id = u.id
      WHERE o.id = $1
    `
    const args = [offerData.productId, userId, offerData.offerBy, offerData.priceAmount]
    const insertResult = await pool.query(insertQuery, args)
    const offerId = insertResult.rows[0].id

    const selectResult = await pool.query(selectQuery, [offerId])
    return selectResult.rows[0] as Offer
  }

  async getByProductId(productId: string): Promise<Offer[]> {
    const query = `
      SELECT 
        o.id,
        o.created_at as "createdAt",
        o.product_id as "productId",
        o.user_id as "userId",
        u.name as "userName",
        o.offer_by as "offerBy",
        o.price_amount as "priceAmount",
        o.accepted_at as "acceptedAt",
        o.accepted_by as "acceptedBy"
      FROM offer o
      JOIN "user" u ON o.user_id = u.id
      WHERE o.product_id = $1
      ORDER BY o.created_at DESC
    `
    const result = await pool.query(query, [productId])

    return result.rows as Offer[]
  }

  async getByUserId(userId: string): Promise<Offer[]> {
    const query = `
      SELECT 
        o.id,
        o.created_at as "createdAt",
        o.product_id as "productId",
        o.user_id as "userId",
        u.name as "userName",
        o.offer_by as "offerBy",
        o.price_amount as "priceAmount",
        o.accepted_at as "acceptedAt",
        o.accepted_by as "acceptedBy"
      FROM offer o
      JOIN "user" u ON o.user_id = u.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `
    const result = await pool.query(query, [userId])

    return result.rows as Offer[]
  }

  async acceptOffer(offerId: string, userId: string): Promise<Offer | null> {
    const updateQuery = `
      UPDATE offer 
      SET
        accepted_at = NOW(),
        accepted_by = $1
      WHERE id = $2
      RETURNING id
    `
    const updateResult = await pool.query(updateQuery, [userId, offerId])

    if (updateResult.rows.length === 0) {
      return null
    }

    const selectQuery = `
      SELECT 
        o.id,
        o.created_at as "createdAt",
        o.product_id as "productId",
        o.user_id as "userId",
        u.name as "userName",
        o.offer_by as "offerBy",
        o.price_amount as "priceAmount",
        o.accepted_at as "acceptedAt",
        o.accepted_by as "acceptedBy"
      FROM offer o
      JOIN "user" u ON o.user_id = u.id
      WHERE o.id = $1
    `
    const selectResult = await pool.query(selectQuery, [offerId])
    return selectResult.rows[0] as Offer
  }

  async getAll(): Promise<Offer[]> {
    const query = `
      SELECT 
        o.id,
        o.created_at as "createdAt",
        o.product_id as "productId",
        o.user_id as "userId",
        u.name as "userName",
        o.offer_by as "offerBy",
        o.price_amount as "priceAmount",
        o.accepted_at as "acceptedAt",
        o.accepted_by as "acceptedBy"
      FROM offer o
      JOIN "user" u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `
    const result = await pool.query(query)

    return result.rows as Offer[]
  }
}

export const offerModel = new OfferModel()
