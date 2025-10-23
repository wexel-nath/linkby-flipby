import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Offer } from '@/types'

interface OfferItemProps {
  offer: Offer
  isActionable: boolean
  onAcceptOffer: () => void
  onMakeCounterOffer: () => void
}

const formatDate = (date: Date) => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export const OfferItem = ({
  offer,
  isActionable,
  onAcceptOffer,
  onMakeCounterOffer,
}: OfferItemProps) => {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{offer.userName}</span>
              <Badge variant="outline" className="text-xs">
                {offer.offerBy}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">{formatDate(offer.createdAt)}</div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <div className="font-semibold">${offer.priceAmount}</div>
            </div>
            {!!offer.acceptedAt && <Badge>Accepted</Badge>}
            {isActionable && (
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={onAcceptOffer}>
                  Accept
                </Button>
                <Button size="sm" variant="outline" onClick={onMakeCounterOffer}>
                  Counter
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
