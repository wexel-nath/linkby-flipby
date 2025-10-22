export enum ProductStatus {
  Available = 'Available',
  Reserved = 'Reserved',
  Sold = 'Sold',
}

export interface User {
  id: string
  createdAt: Date
  email: string
  name: string
  password: string
}

export interface Product {
  id: string
  createdAt: Date
  userId: string
  listedByName: string
  name: string
  priceAmount: number
  priceCurrency: string
  description: string
  images: string[]
  status: ProductStatus
  reservedForBuyerId?: string
}

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
