import { useEffect, useState } from 'react'

import { mockOffers } from '@/data/mockData'
import { Offer, Product } from '@/types'

export const useOffersByProduct = (productId: string) => {
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductOffers = async () => {
      if (!productId) {
        setOffers([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 100))

        // TODO: Replace with actual API call
        // const response = await fetch(`/api/offers?productId=${productId}`)
        // const data = await response.json()

        const productOffers = mockOffers.filter((o) => o.productId === productId)
        setOffers(productOffers)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product offers')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductOffers()
  }, [productId])

  return {
    offers,
    isLoading,
    error,
    hasOffers: offers.length > 0,
    acceptedOffers: offers.filter((o) => o.acceptedAt),
    pendingOffers: offers.filter((o) => !o.acceptedAt),
  }
}

// Combined hook for product with its offers
export const useProductWithOffers = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductWithOffers = async () => {
      if (!productId) {
        setProduct(null)
        setOffers([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 100))

        // TODO: Replace with actual API calls
        // const [productResponse, offersResponse] = await Promise.all([
        //   fetch(`/api/products/${productId}`),
        //   fetch(`/api/offers?productId=${productId}`)
        // ])
        // const productData = await productResponse.json()
        // const offersData = await offersResponse.json()

        const { mockProducts } = await import('@/data/mockData')
        const foundProduct = mockProducts.find((p) => p.id === productId)
        const productOffers = mockOffers.filter((o) => o.productId === productId)

        setProduct(foundProduct || null)
        setOffers(productOffers)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product with offers')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductWithOffers()
  }, [productId])

  return {
    product,
    offers,
    isLoading,
    error,
    hasOffers: offers.length > 0,
    acceptedOffers: offers.filter((o) => o.acceptedAt),
    pendingOffers: offers.filter((o) => !o.acceptedAt),
  }
}
