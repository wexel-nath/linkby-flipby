import { Request, Response } from 'express'

import { offerService } from '../services'
import { ResponseWrapper } from '../utils/responseWrapper'

export class OfferController {
  async createOffer(req: Request, res: Response): Promise<void> {
    try {
      const offerData = req.body
      const userId = req.user?.id
      if (!userId) {
        ResponseWrapper.error(res, 'User not authenticated', 401)
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

  async acceptOffer(req: Request, res: Response): Promise<void> {
    try {
      const { offerId } = req.params
      const userId = req.user?.id
      if (!userId) {
        ResponseWrapper.error(res, 'User not authenticated', 401)
        return
      }

      const offer = await offerService.acceptOffer(offerId, userId)

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
}

export const offerController = new OfferController()
