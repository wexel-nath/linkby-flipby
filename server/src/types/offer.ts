export enum OfferBy {
  Buyer = 'Buyer',
  Seller = 'Seller',
}

export interface Offer {
  id: string
  createdAt: Date
  productId: string
  userId: string
  userName: string
  offerBy: OfferBy
  priceAmount: number
  acceptedAt?: Date
}

export interface CreateOfferRequest {
  productId: string
  offerBy: OfferBy
  priceAmount: number
}
