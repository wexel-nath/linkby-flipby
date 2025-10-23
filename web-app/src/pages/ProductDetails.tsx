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
import { useAcceptOffer, useCreateOffer, useProductWithOffers } from '@/hooks/use-offers'
import { usePurchaseProduct } from '@/hooks/use-products'
import { useToast } from '@/hooks/use-toast'
import { formatPrice, getProductReservedFor } from '@/lib/utils'
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
  const { purchaseProduct, isLoading: isPurchasing, error: purchaseError } = usePurchaseProduct()
  const { createOffer, isLoading: isCreatingOffer, error: createOfferError } = useCreateOffer()
  const { acceptOffer, error: acceptOfferError } = useAcceptOffer()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
    )
  }

  if (!product) {
    return <div>Product not found</div>
  }

  const sortedOffers = productOffers.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const isSeller = user?.id === product.userId

  const userOffers = sortedOffers.filter((o) => o.userId === user?.id)
  const hasActiveOffer = userOffers.length > 0
  const canPurchase = !hasActiveOffer || userOffers.find((o) => !!o.acceptedAt)

  const reservedFor = getProductReservedFor(sortedOffers)
  const isReservedForAnotherBuyer = reservedFor && reservedFor !== user?.id

  const handlePurchase = async () => {
    if (!id) {
      return
    }

    try {
      await purchaseProduct(id)
      toast({
        title: 'Purchase complete',
        description: 'Product purchased successfully',
      })
      navigate('/')
    } catch (err) {
      toast({
        title: 'Purchase failed',
        description: purchaseError || 'Failed to purchase product. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleMakeOffer = async () => {
    if (!offerPrice || parseFloat(offerPrice) <= 0) {
      toast({
        title: 'Invalid price',
        description: 'Please enter a valid offer price',
        variant: 'destructive',
      })
      return
    }

    if (!id) return

    try {
      const offerBy = product.userId === user?.id ? OfferBy.Seller : OfferBy.Buyer

      await createOffer({
        productId: id,
        offerBy,
        priceAmount: Math.round(parseFloat(offerPrice) * 100),
      })

      toast({
        title: 'Offer sent',
        description: 'Your counter-offer has been submitted',
      })
      setShowOfferDialog(false)
      setOfferPrice('')

      // Refresh the page to show the new offer
      window.location.reload()
    } catch (err) {
      toast({
        title: 'Failed to create offer',
        description: createOfferError || 'Failed to create offer. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleAcceptOffer = async (offerId: string) => {
    if (!id) {
      return
    }

    try {
      await acceptOffer(id, offerId)
      toast({
        title: 'Offer accepted',
        description: 'Product is now reserved',
      })
      // Refresh the page to show the accepted offer
      window.location.reload()
    } catch (err) {
      toast({
        title: 'Failed to accept offer',
        description: acceptOfferError || 'Failed to accept offer. Please try again.',
        variant: 'destructive',
      })
    }
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
              <p className="text-2xl font-bold text-primary">{formatPrice(product.priceAmount)}</p>
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

            {user && !isSeller && (
              <div className="space-y-2">
                {canPurchase && product.status !== ProductStatus.Sold && (
                  <Button className="w-full" onClick={handlePurchase} disabled={isPurchasing}>
                    {isPurchasing ? 'Purchasing...' : 'Purchase Now'}
                  </Button>
                )}
                {!hasActiveOffer && product.status === ProductStatus.Available && (
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
                  {sortedOffers.map((offer) => {
                    const isActionable =
                      product.status === ProductStatus.Available &&
                      ((isSeller && offer.offerBy === OfferBy.Buyer) ||
                        (!isSeller && offer.offerBy === OfferBy.Seller))

                    return (
                      <OfferItem
                        key={offer.id}
                        offer={offer}
                        isActionable={isActionable}
                        onAcceptOffer={() => handleAcceptOffer(offer.id)}
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
            <Button onClick={handleMakeOffer} disabled={isCreatingOffer}>
              {isCreatingOffer ? 'Submitting...' : 'Submit Offer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductDetails
