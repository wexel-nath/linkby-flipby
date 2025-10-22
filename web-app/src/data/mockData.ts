import { Offer, Product, User } from '@/types'

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    password: 'password123',
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    password: 'password123',
  },
  {
    id: '3',
    email: 'bob@example.com',
    name: 'Bob Wilson',
    password: 'password123',
  },
]

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Vintage Camera',
    price: 250,
    description:
      'Classic 35mm film camera in excellent condition. Perfect for photography enthusiasts.',
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=500&h=500&fit=crop',
    ],
    sellerId: '1',
    status: 'Available',
  },
  {
    id: '2',
    name: 'Designer Leather Jacket',
    price: 450,
    description: 'Genuine leather jacket, size M. Barely worn, like new condition.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=500&h=500&fit=crop',
    ],
    sellerId: '2',
    status: 'Available',
  },
  {
    id: '3',
    name: 'Gaming Laptop',
    price: 1200,
    description: 'High-performance gaming laptop with RTX graphics. 16GB RAM, 512GB SSD.',
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop'],
    sellerId: '1',
    status: 'Reserved',
    reservedForBuyerId: '3',
  },
  {
    id: '4',
    name: 'Acoustic Guitar',
    price: 180,
    description: 'Beautiful acoustic guitar with a rich, warm tone. Includes case and strap.',
    images: ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&h=500&fit=crop'],
    sellerId: '3',
    status: 'Sold',
  },
  {
    id: '5',
    name: 'Smart Watch',
    price: 320,
    description: 'Latest model smartwatch with fitness tracking and heart rate monitor.',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'],
    sellerId: '2',
    status: 'Available',
  },
  {
    id: '6',
    name: 'Professional Camera Kit',
    price: 850,
    description:
      'Complete photography kit including DSLR camera, multiple lenses, tripod, and accessories. Perfect for professional photographers or serious hobbyists.',
    images: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=500&fit=crop',
    ],
    sellerId: '1',
    status: 'Available',
  },
  {
    id: '7',
    name: 'Vintage Book Collection',
    price: 75,
    description:
      'Rare collection of vintage books from the 1950s. Great condition, perfect for collectors or literature enthusiasts. No photos available - contact seller for viewing.',
    images: [],
    sellerId: '3',
    status: 'Available',
  },
]

export const mockOffers: Offer[] = [
  {
    id: '1',
    productId: '3',
    buyerId: '3',
    price: 1100,
    timestamp: new Date('2025-01-15T10:00:00'),
    offerBy: 'buyer',
    accepted: false,
  },
  {
    id: '2',
    productId: '3',
    buyerId: '3',
    price: 1150,
    timestamp: new Date('2025-01-15T11:30:00'),
    offerBy: 'seller',
    accepted: true,
  },
]
