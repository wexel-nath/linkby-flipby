import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { mockProducts, mockUsers } from "@/data/mockData"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, Plus } from "lucide-react"
import { useNavigateToLogin } from "@/hooks/use-navigate-to-login"

const ProductList = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const navigateToLogin = useNavigateToLogin()
  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const getSellerName = (sellerId: string) => {
    return mockUsers.find((u) => u.id === sellerId)?.name || "Unknown"
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold">Flipby</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">Hi, {user.name}!</span>
                <div className="flex gap-2">
                  <Button onClick={() => navigate("/products/new")}>
                    <Plus className="mr-2" />
                    Sell
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <span className="text-sm text-muted-foreground">Browse our marketplace</span>
                <Button onClick={() => navigateToLogin()}>Login</Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!user && (
          <div className="mb-6 rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Browse our marketplace! Click any product to view details. Login to make purchases or offers.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer transition-all hover:shadow-lg"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                {product.images[0] ? (
                  <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">No Image</div>
                )}
                {(product.status === "Reserved" || product.status === "Sold") && (
                  <Badge
                    className="absolute bottom-2 right-2"
                    variant={product.status === "Sold" ? "destructive" : "secondary"}
                  >
                    {product.status}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-lg font-bold text-primary">${product.price}</p>
                <p className="text-sm text-muted-foreground">Sold by {getSellerName(product.sellerId)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

export default ProductList
