import { useCallback, useEffect, useState } from 'react'

import { apiService } from '@/services/api'
import { Product, ProductStatus } from '@/types'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await apiService.request<Product[]>('/products')

        if (response.data) {
          setProducts(response.data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const refetch = async () => {
    try {
      setProducts([])
      setIsLoading(true)
      setError(null)

      const response = await apiService.request<Product[]>('/products')

      if (response.data) {
        setProducts(response.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    products,
    isLoading,
    error,
    refetch,
    // Filtered products
    availableProducts: products.filter((p) => p.status === ProductStatus.Available),
    reservedProducts: products.filter((p) => p.status === ProductStatus.Reserved),
    soldProducts: products.filter((p) => p.status === ProductStatus.Sold),
  }
}

export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setProduct(null)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await apiService.request<Product>(`/products/${productId}`)

        if (response.data) {
          setProduct(response.data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  return {
    product,
    isLoading,
    error,
  }
}

export interface CreateProductData {
  name: string
  priceAmount: number
  priceCurrency: string
  description: string
}

export const useCreateProduct = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProduct = useCallback(async (productData: CreateProductData, images?: File[]) => {
    try {
      setIsLoading(true)
      setError(null)

      const formData = new FormData()

      // Add product data as JSON string
      formData.append('productData', JSON.stringify(productData))

      // Add images if provided
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image)
        })
      }

      const response = await apiService.requestMultipart<Product>('/products', formData)

      if (response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to create product')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    createProduct,
    isLoading,
    error,
  }
}
