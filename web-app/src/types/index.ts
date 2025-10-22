export type ProductStatus = 'Available' | 'Reserved' | 'Sold'

export interface User {
  id: string
  email: string
  name: string
  password: string
}

export interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  sellerId: string
  status: ProductStatus
  reservedForBuyerId?: string
}

export interface Offer {
  id: string
  productId: string
  buyerId: string
  price: number
  timestamp: Date
  offerBy: 'buyer' | 'seller'
  accepted: boolean
}
