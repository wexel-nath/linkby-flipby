import { useEffect, useState } from 'react'

import { apiService } from '@/services/api'
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

        const response = await apiService.request<Offer[]>(`/products/${productId}/offers`)
        if (response.data) {
          setOffers(response.data)
        }
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

        const [productResponse, offersResponse] = await Promise.all([
          apiService.request<Product>(`/products/${productId}`),
          apiService.request<Offer[]>(`/products/${productId}/offers`),
        ])

        if (productResponse.data) {
          setProduct(productResponse.data)
        }

        if (offersResponse.data) {
          setOffers(offersResponse.data)
        }
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
