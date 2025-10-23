import { offerModel, productModel } from '../models'
import { CreateOfferRequest, Offer, OfferBy, ProductStatus } from '../types'

export class OfferService {
  async getOfferById(id: string): Promise<Offer | null> {
    return offerModel.getById(id)
  }

  async createOffer(offerData: CreateOfferRequest, userId: string): Promise<Offer> {
    // Validate price amount is positive
    if (offerData.priceAmount <= 0) {
      throw new Error('Offer amount must be positive')
    }

    // Check if product exists and is available
    const product = await productModel.getById(offerData.productId)
    if (!product) {
      throw new Error('Product not found')
    }

    if (product.status !== ProductStatus.Available) {
      throw new Error('Product is not available for offers')
    }

    // Prevent users from making offers on their own products
    if (product.userId === userId && offerData.offerBy === OfferBy.Buyer) {
      throw new Error('Cannot make buyer offer on your own product')
    }

    return offerModel.create(offerData, userId)
  }

  async getOffersByProductId(productId: string): Promise<Offer[]> {
    return offerModel.getByProductId(productId)
  }

  async getOffersByUserId(userId: string): Promise<Offer[]> {
    return offerModel.getByUserId(userId)
  }

  async acceptOffer(offerId: string, userId: string): Promise<Offer | null> {
    const offer = await offerModel.getById(offerId)
    if (!offer) {
      throw new Error('Offer not found')
    }

    // Check if the user is authorized to accept this offer
    const product = await productModel.getById(offer.productId)
    if (!product) {
      throw new Error('Product not found')
    }

    // Only product owner can accept buyer offers, only buyers can accept seller offers
    if (offer.offerBy === OfferBy.Buyer && product.userId !== userId) {
      throw new Error('Only product owner can accept buyer offers')
    }

    if (offer.offerBy === OfferBy.Seller && offer.userId !== userId) {
      throw new Error('Only offer maker can accept seller offers')
    }

    // Accept the offer
    const acceptedOffer = await offerModel.acceptOffer(offerId)

    // Update product status to Reserved
    if (acceptedOffer) {
      await productModel.updateStatus(product.id, ProductStatus.Reserved)
    }

    return acceptedOffer
  }

  async getAllOffers(): Promise<Offer[]> {
    return offerModel.getAll()
  }
}

export const offerService = new OfferService()
