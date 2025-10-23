import { Request, Response } from 'express'

import { offerService } from '../services'
import { ResponseWrapper } from '../utils/responseWrapper'

export class OfferController {
  async getOffer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const offer = await offerService.getOfferById(id)

      if (!offer) {
        ResponseWrapper.error(res, 'Offer not found', 404)
        return
      }

      ResponseWrapper.success(res, offer)
    } catch (error) {
      ResponseWrapper.error(res, 'Internal server error', 500)
    }
  }

  async createOffer(req: Request, res: Response): Promise<void> {
    try {
      const offerData = req.body
      const { userId } = req.body // In a real app, this would come from auth middleware

      if (!userId) {
        ResponseWrapper.error(res, 'userId is required', 400)
        return
      }

      const offer = await offerService.createOffer(offerData, userId)

      ResponseWrapper.success(res, offer, 201)
    } catch (error) {
      if (error instanceof Error) {
        ResponseWrapper.error(res, error.message, 400)
      } else {
        ResponseWrapper.error(res, 'Internal server error', 500)
      }
    }
  }

  async getProductOffers(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params
      const offers = await offerService.getOffersByProductId(productId)

      ResponseWrapper.success(res, offers)
    } catch (error) {
      ResponseWrapper.error(res, 'Internal server error', 500)
    }
  }

  async getUserOffers(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params
      const offers = await offerService.getOffersByUserId(userId)

      ResponseWrapper.success(res, offers)
    } catch (error) {
      ResponseWrapper.error(res, 'Internal server error', 500)
    }
  }

  async acceptOffer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { userId } = req.body // In a real app, this would come from auth middleware

      if (!userId) {
        ResponseWrapper.error(res, 'userId is required', 400)
        return
      }

      const offer = await offerService.acceptOffer(id, userId)

      if (!offer) {
        ResponseWrapper.error(res, 'Offer not found', 404)
        return
      }

      ResponseWrapper.success(res, offer)
    } catch (error) {
      if (error instanceof Error) {
        ResponseWrapper.error(res, error.message, 400)
      } else {
        ResponseWrapper.error(res, 'Internal server error', 500)
      }
    }
  }

  async getAllOffers(req: Request, res: Response): Promise<void> {
    try {
      const offers = await offerService.getAllOffers()
      ResponseWrapper.success(res, offers)
    } catch (error) {
      ResponseWrapper.error(res, 'Internal server error', 500)
    }
  }
}

export const offerController = new OfferController()
