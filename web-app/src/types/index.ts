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
  userName: string
  name: string
  priceAmount: number
  priceCurrency: string
  description: string
  images: string[]
  purchasedBy?: string
  status: ProductStatus
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
  userName: string
  offerBy: OfferBy
  priceAmount: number
  acceptedAt?: Date
  acceptedBy?: string
}
