export enum ProductStatus {
  Available = 'Available',
  Reserved = 'Reserved',
  Sold = 'Sold',
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

export interface CreateProductRequest {
  name: string
  priceAmount: number
  priceCurrency: string
  description: string
  images: string[]
  status: ProductStatus
}
