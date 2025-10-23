import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CurrencySelector } from '@/components/CurrencySelector'
import { Header } from '@/components/Header'
import { ImageUploader } from '@/components/ImageUploader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigateToLogin } from '@/hooks/use-navigate-to-login'
import { useCreateProduct } from '@/hooks/use-products'
import { useToast } from '@/hooks/use-toast'

const ProductRegistration = () => {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<File[]>([])
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const navigateToLogin = useNavigateToLogin()
  const { createProduct, isLoading, error } = useCreateProduct()

  // Redirect to login if not authenticated, with target URL
  useEffect(() => {
    if (!user) {
      navigateToLogin('/products/new')
    }
  }, [user, navigateToLogin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !amount || !description) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    try {
      const productData = {
        name,
        priceAmount: Number(amount) * 100, // Convert to cents
        priceCurrency: currency,
        description,
      }

      await createProduct(productData, images)

      toast({
        title: 'Product registered',
        description: 'Your product has been listed successfully',
      })
      navigate('/')
    } catch (err) {
      toast({
        title: 'Registration Failed',
        description: error || 'Failed to register product. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Register New Product</h1>
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label>Price</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-48">
                    <CurrencySelector value={currency} onValueChange={setCurrency} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <ImageUploader images={images} onImagesChange={setImages} label="Images" />

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default ProductRegistration
