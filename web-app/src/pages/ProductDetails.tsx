import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { Header } from '@/components/Header'
import { ImageCarousel } from '@/components/ImageCarousel'
import { OfferItem } from '@/components/OfferItem'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { useNavigateToLogin } from '@/hooks/use-navigate-to-login'
import { useProductWithOffers } from '@/hooks/use-offers'
import { useToast } from '@/hooks/use-toast'
import { OfferBy, ProductStatus } from '@/types'

const getProductBadgeVariant = (status: ProductStatus): BadgeProps['variant'] => {
  switch (status) {
    case ProductStatus.Sold:
      return 'destructive'
    case ProductStatus.Reserved:
      return 'secondary'
    default:
      return 'default'
  }
}

const ProductDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showOfferDialog, setShowOfferDialog] = useState(false)
  const [offerPrice, setOfferPrice] = useState('')
  const navigateToLogin = useNavigateToLogin()

  const { product, offers: productOffers, isLoading } = useProductWithOffers(id || '')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
    )
  }

  if (!product) {
    return <div>Product not found</div>
  }

  const sortedOffers = productOffers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const isSeller = user?.id === product.userId

  const userOffers = sortedOffers.filter((o) => o.userId === user?.id)
  const hasActiveOffer = userOffers.length > 0
  const lastOffer = sortedOffers[0]
  const canPurchase =
    !hasActiveOffer ||
    (lastOffer && !!lastOffer.acceptedAt) ||
    (lastOffer && lastOffer.offerBy === OfferBy.Buyer && !!lastOffer.acceptedAt)

  const isReservedForAnotherBuyer =
    product.status === ProductStatus.Reserved && product.reservedForBuyerId !== user?.id

  const handlePurchase = () => {
    toast({
      title: 'Purchase complete',
      description: 'Product marked as sold',
    })
    navigate('/')
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
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="mr-2" />
          Back to Products
        </Button>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <ImageCarousel images={product.images} altPrefix={product.name} />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <Badge variant={getProductBadgeVariant(product.status)}>{product.status}</Badge>
              </div>
              <p className="text-2xl font-bold text-primary">${product.priceAmount}</p>
              <p className="text-sm text-muted-foreground">Listed by {product.userName}</p>
            </div>

            <p className="text-foreground">{product.description}</p>

            {!user && product.status === ProductStatus.Available && (
              <div className="space-y-2">
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Login to purchase this item or make an offer
                  </p>
                  <Button onClick={() => navigateToLogin('/products/' + id)}>Login to Buy</Button>
                </div>
              </div>
            )}

            {user && !isSeller && product.status === ProductStatus.Available && (
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

            {user && !isSeller && isReservedForAnotherBuyer && (
              <p className="text-sm text-muted-foreground">
                This product is reserved for another buyer
              </p>
            )}

            {user && sortedOffers.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold">Negotiation History</h2>
                <div className="space-y-4">
                  {sortedOffers.map((offer, index) => {
                    const isActionable =
                      index === 0 &&
                      !offer.acceptedAt &&
                      ((isSeller && offer.offerBy === OfferBy.Buyer) ||
                        (!isSeller && offer.offerBy === OfferBy.Seller))

                    return (
                      <OfferItem
                        key={offer.id}
                        offer={offer}
                        isActionable={isActionable}
                        onAcceptOffer={handleAcceptOffer}
                        onMakeCounterOffer={() => setShowOfferDialog(true)}
                      />
                    )
                  })}
                </div>
              </div>
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
