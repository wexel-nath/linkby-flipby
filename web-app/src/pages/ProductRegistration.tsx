import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CurrencySelector } from '@/components/CurrencySelector'
import { ImageUploader } from '@/components/ImageUploader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigateToLogin } from '@/hooks/use-navigate-to-login'
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

  // Redirect to login if not authenticated, with target URL
  useEffect(() => {
    if (!user) {
      navigateToLogin('/products/new')
    }
  }, [user, navigateToLogin])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Product registered',
      description: 'Your product has been listed successfully',
    })
    navigate('/products')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Register New Product</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
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

              <ImageUploader images={images} onImagesChange={setImages} label="Product Images" />

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/products')}
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
