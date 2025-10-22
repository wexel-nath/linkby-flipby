import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface ImageCarouselProps {
  images: string[]
  altPrefix: string
  className?: string
}

export const ImageCarousel = ({
  images,
  altPrefix,
  className = 'h-full w-full',
}: ImageCarouselProps) => {
  if (images.length === 0) {
    return <div className="flex h-full w-full items-center justify-center bg-muted">No Image</div>
  }

  return (
    <Carousel className={className}>
      <CarouselContent className="h-full">
        {images.map((image, index) => (
          <CarouselItem key={index} className="h-full">
            <img
              src={image}
              alt={`${altPrefix} ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <div onClick={(e) => e.stopPropagation()}>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </div>
      )}
    </Carousel>
  )
}
