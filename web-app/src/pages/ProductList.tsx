import { useNavigate } from 'react-router-dom'

import { Header } from '@/components/Header'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { mockProducts, mockUsers } from '@/data/mockData'

const ProductList = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const getSellerName = (sellerId: string) => {
    return mockUsers.find((u) => u.id === sellerId)?.name || 'Unknown'
  }

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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {mockProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer transition-all hover:shadow-lg"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    No Image
                  </div>
                )}
                {(product.status === 'Reserved' || product.status === 'Sold') && (
                  <Badge
                    className="absolute bottom-2 right-2"
                    variant={product.status === 'Sold' ? 'destructive' : 'secondary'}
                  >
                    {product.status}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-lg font-bold text-primary">${product.price}</p>
                <p className="text-sm text-muted-foreground">
                  Sold by {getSellerName(product.sellerId)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

export default ProductList
