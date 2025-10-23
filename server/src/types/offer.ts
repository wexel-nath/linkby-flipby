export enum OfferBy {
  Buyer = 'Buyer',
  Seller = 'Seller',
}

export interface Offer {
  id: string
  createdAt: Date
  productId: string
  userId: string
  offerBy: OfferBy
  offerByName: string
  priceAmount: number
  acceptedAt?: Date
}

export interface CreateOfferRequest {
  productId: string
  offerBy: OfferBy
  offerByName: string
  priceAmount: number
}
