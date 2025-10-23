import { ImageCarousel } from '@/components/ImageCarousel'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { Product, ProductStatus } from '@/types'

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={onClick}>
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <ImageCarousel images={product.images} altPrefix={product.name} />
        {(product.status === ProductStatus.Reserved || product.status === ProductStatus.Sold) && (
          <Badge
            className="absolute bottom-2 right-2 z-10"
            variant={product.status === ProductStatus.Sold ? 'destructive' : 'secondary'}
          >
            {product.status}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-lg font-bold text-primary">{formatPrice(product.priceAmount)}</p>
        <p className="text-sm text-muted-foreground">Listed by {product.userName}</p>
      </CardContent>
    </Card>
  )
}
