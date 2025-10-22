import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { mockOffers, mockProducts, mockUsers } from '@/data/mockData'
import { useNavigateToLogin } from '@/hooks/use-navigate-to-login'
import { useToast } from '@/hooks/use-toast'

const ProductDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showOfferDialog, setShowOfferDialog] = useState(false)
  const [offerPrice, setOfferPrice] = useState('')
  const navigateToLogin = useNavigateToLogin()
  const product = mockProducts.find((p) => p.id === id)
  const seller = mockUsers.find((u) => u.id === product?.sellerId)
  const productOffers = mockOffers.filter((o) => o.productId === id)

  if (!product) {
    return <div>Product not found</div>
  }

  const isSeller = user?.id === product.sellerId
  const isBuyer = user?.id !== product.sellerId
  const userOffers = productOffers.filter((o) => o.buyerId === user?.id)
  const hasActiveOffer = userOffers.length > 0
  const lastOffer = productOffers[productOffers.length - 1]
  const canPurchase =
    !hasActiveOffer ||
    (lastOffer && lastOffer.accepted) ||
    (lastOffer && lastOffer.offerBy === 'buyer' && lastOffer.accepted)

  const isReservedForAnotherBuyer =
    product.status === 'Reserved' && product.reservedForBuyerId !== user?.id

  const handlePurchase = () => {
    toast({
      title: 'Purchase complete',
      description: 'Product marked as sold',
    })
    navigate('/products')
  }

  const handleMakeOffer = () => {
    if (!offerPrice || parseFloat(offerPrice) <= 0) {
      toast({
        title: 'Invalid price',
        description: 'Please enter a valid offer price',
        variant: 'destructive',
      })
      return
    }
    toast({
      title: 'Offer sent',
      description: 'Your counter-offer has been submitted',
    })
    setShowOfferDialog(false)
    setOfferPrice('')
  }

  const handleAcceptOffer = () => {
    toast({ title: 'Offer accepted', description: 'Product is now reserved' })
    navigate('/products')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/products')}>
            <ArrowLeft className="mr-2" />
            Back to Products
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <Badge
                  variant={
                    product.status === 'Sold'
                      ? 'destructive'
                      : product.status === 'Reserved'
                        ? 'secondary'
                        : 'default'
                  }
                >
                  {product.status}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-primary">${product.price}</p>
              <p className="text-sm text-muted-foreground">Sold by {seller?.name}</p>
            </div>

            <p className="text-foreground">{product.description}</p>

            {!user && product.status === 'Available' && (
              <div className="space-y-2">
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Login to purchase this item or make an offer
                  </p>
                  <Button onClick={() => navigateToLogin('/products/' + id)}>Login to Buy</Button>
                </div>
              </div>
            )}

            {user && isBuyer && product.status === 'Available' && (
              <div className="space-y-2">
                {canPurchase && (
                  <Button className="w-full" onClick={handlePurchase}>
                    Purchase Now
                  </Button>
                )}
                {!hasActiveOffer && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowOfferDialog(true)}
                  >
                    Make Counter Offer
                  </Button>
                )}
              </div>
            )}

            {user && isBuyer && isReservedForAnotherBuyer && (
              <p className="text-sm text-muted-foreground">
                This product is reserved for another buyer
              </p>
            )}

            {user && productOffers.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">Negotiation History</h2>
                  <div className="space-y-4">
                    {productOffers.map((offer) => {
                      const offerUser = mockUsers.find((u) => u.id === offer.buyerId)
                      return (
                        <div
                          key={offer.id}
                          className="flex items-center justify-between border-b border-border pb-4 last:border-0"
                        >
                          <div>
                            <p className="font-medium">
                              {offer.offerBy === 'buyer' ? offerUser?.name : seller?.name}
                              <span className="ml-2 text-sm text-muted-foreground">
                                ({offer.offerBy})
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {offer.timestamp.toLocaleString()}
                            </p>
                            <p className="font-semibold">${offer.price}</p>
                          </div>
                          {offer.accepted && <Badge variant="secondary">Accepted</Badge>}
                          {!offer.accepted && isSeller && offer.offerBy === 'buyer' && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleAcceptOffer}>
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowOfferDialog(true)}
                              >
                                Counter
                              </Button>
                            </div>
                          )}
                          {!offer.accepted &&
                            isBuyer &&
                            offer.offerBy === 'seller' &&
                            offer.buyerId === user?.id && (
                              <div className="flex gap-2">
                                <Button size="sm" onClick={handleAcceptOffer}>
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setShowOfferDialog(true)}
                                >
                                  Counter
                                </Button>
                              </div>
                            )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make Counter Offer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="offer-price">Your Offer Price ($)</Label>
              <Input
                id="offer-price"
                type="number"
                min="0"
                step="0.01"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder="Enter your offer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOfferDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMakeOffer}>Submit Offer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductDetails
