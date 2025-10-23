import { User } from '@/types'

export const mockUsers: User[] = [
  {
    id: '1',
    createdAt: new Date('2024-12-01T09:00:00'),
    email: 'john@example.com',
    name: 'John Doe',
    password: 'password123',
  },
  {
    id: '2',
    createdAt: new Date('2024-12-15T14:30:00'),
    email: 'jane@example.com',
    name: 'Jane Smith',
    password: 'password123',
  },
  {
    id: '3',
    createdAt: new Date('2025-01-05T11:15:00'),
    email: 'bob@example.com',
    name: 'Bob Wilson',
    password: 'password123',
  },
]
