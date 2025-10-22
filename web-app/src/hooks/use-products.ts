import { useEffect, useState } from 'react'

import { mockProducts } from '@/data/mockData'
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

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 100))

        // TODO: Replace with actual API call
        // const response = await fetch('/api/products')
        // const data = await response.json()

        setProducts([...mockProducts])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const refetch = () => {
    setProducts([])
    setIsLoading(true)
    setError(null)
    // Re-trigger the effect
    setTimeout(() => {
      setProducts([...mockProducts])
      setIsLoading(false)
    }, 100)
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

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 100))

        // TODO: Replace with actual API call
        // const response = await fetch(`/api/products/${productId}`)
        // const data = await response.json()

        const foundProduct = mockProducts.find((p) => p.id === productId)
        setProduct(foundProduct || null)
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
