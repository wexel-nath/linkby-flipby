import { useState } from 'react'
import { GripVertical, Upload, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  images: File[]
  onImagesChange: (images: File[]) => void
  maxImages?: number
  maxFileSize?: number // in bytes
  label?: string
  className?: string
}

export const ImageUploader = ({
  images,
  onImagesChange,
  maxImages = 5,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  label = 'Product Images',
  className,
}: ImageUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null)
  const { toast } = useToast()

  const validateAndAddFiles = (files: File[]) => {
    if (images.length + files.length > maxImages) {
      toast({
        title: 'Too many images',
        description: `Maximum ${maxImages} images allowed`,
        variant: 'destructive',
      })
      return
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not an image file`,
          variant: 'destructive',
        })
        return false
      }
      if (file.size > maxFileSize) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds ${Math.round(maxFileSize / (1024 * 1024))}MB limit`,
          variant: 'destructive',
        })
        return false
      }
      return true
    })

    onImagesChange([...images, ...validFiles])
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    validateAndAddFiles(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Only show drag over state for file drops, not image reordering
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    // Only handle file drops here, not image reordering
    if (e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      validateAndAddFiles(files)
    }
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  // Image reordering handlers
  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedImageIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleImageDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedImageIndex === null || draggedImageIndex === dropIndex) {
      setDraggedImageIndex(null)
      return
    }

    const newImages = [...images]
    const draggedImage = newImages[draggedImageIndex]

    // Remove the dragged image from its original position
    newImages.splice(draggedImageIndex, 1)

    // Insert it at the new position
    newImages.splice(dropIndex, 0, draggedImage)

    onImagesChange(newImages)
    setDraggedImageIndex(null)
  }

  const handleImageDragEnd = () => {
    setDraggedImageIndex(null)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label>
        {label} (Max {maxImages}, up to {Math.round(maxFileSize / (1024 * 1024))}MB each)
      </Label>
      {images.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Drag images to reorder • First image will be the main photo
        </p>
      )}
      <div
        className={cn(
          'grid grid-cols-3 gap-4 rounded-lg border-2 border-dashed p-4 transition-colors',
          isDragOver ? 'border-primary bg-primary/5' : 'border-border bg-muted/20',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {images.map((file, index) => (
          <div
            key={index}
            className={cn(
              'relative aspect-square cursor-move transition-all duration-200',
              draggedImageIndex === index && 'opacity-50 scale-95',
              draggedImageIndex !== null && draggedImageIndex !== index && 'scale-105',
            )}
            draggable
            onDragStart={(e) => handleImageDragStart(e, index)}
            onDragOver={handleImageDragOver}
            onDrop={(e) => handleImageDrop(e, index)}
            onDragEnd={handleImageDragEnd}
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index + 1}`}
              className="h-full w-full rounded-md object-cover pointer-events-none"
            />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute right-1 top-1 h-6 w-6 z-10"
              onClick={() => removeImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
            {/* Drag handle indicator */}
            <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded flex items-center gap-1">
              <GripVertical className="h-3 w-3" />
              {index + 1}
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <label className="col-span-3 flex flex-col items-center justify-center py-8 text-center cursor-pointer">
            <Upload className="mb-4 h-12 w-12 text-muted-foreground hover:text-primary transition-colors" />
            <p className="text-lg font-medium text-muted-foreground">
              {isDragOver ? 'Drop your images here' : 'Drag and drop images or click to upload'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Supports JPG, PNG, GIF up to {Math.round(maxFileSize / (1024 * 1024))}MB each
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        )}
        {images.length > 0 && images.length < maxImages && (
          <label
            className={cn(
              'flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors',
              isDragOver
                ? 'border-primary bg-primary/10'
                : 'border-border bg-muted hover:bg-accent',
            )}
          >
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground text-center">Add more</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>
    </div>
  )
}
