import { useNavigate } from 'react-router-dom'

import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
import { useAuth } from '@/contexts/AuthContext'
import { useProducts } from '@/hooks/use-products'

const ProductList = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { products, isLoading } = useProducts()

  const title = user ? `Hi, ${user.name}!` : 'Browse our marketplace!'

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-sm text-muted-foreground">Click any product to view details.</p>
        {!user && (
          <p className="text-sm text-muted-foreground mt-2">Login to make purchases or offers.</p>
        )}
        {isLoading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 mt-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/products/${product.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default ProductList
