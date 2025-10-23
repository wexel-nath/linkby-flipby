export enum ProductStatus {
  Available = 'Available',
  Reserved = 'Reserved',
  Sold = 'Sold',
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

export interface CreateProductRequest {
  name: string
  priceAmount: number
  priceCurrency: string
  description: string
  images: string[]
}
