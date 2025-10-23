import { useCallback, useEffect, useState } from 'react'

import { apiService } from '@/services/api'
import { Offer, OfferBy, Product } from '@/types'

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

export interface CreateOfferData {
  productId: string
  offerBy: OfferBy
  priceAmount: number
}

export const useCreateOffer = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOffer = useCallback(async (offerData: CreateOfferData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiService.request<Offer>(`/products/${offerData.productId}/offers`, {
        method: 'POST',
        body: JSON.stringify(offerData),
      })

      if (response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to create offer')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create offer'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    createOffer,
    isLoading,
    error,
  }
}

export const useAcceptOffer = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const acceptOffer = useCallback(async (productId: string, offerId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiService.request<Offer>(
        `/products/${productId}/offers/${offerId}/accept`,
        {
          method: 'PUT',
        },
      )

      if (response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to accept offer')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept offer'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    acceptOffer,
    isLoading,
    error,
  }
}
