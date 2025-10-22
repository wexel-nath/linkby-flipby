import { useEffect, useState } from 'react'

import { mockUsers } from '@/data/mockData'
import { User } from '@/types'

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 100))

        // TODO: Replace with actual API call
        // const response = await fetch('/api/users')
        // const data = await response.json()

        setUsers([...mockUsers])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return {
    users,
    isLoading,
    error,
  }
}

export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setUser(null)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 100))

        // TODO: Replace with actual API call
        // const response = await fetch(`/api/users/${userId}`)
        // const data = await response.json()

        const foundUser = mockUsers.find((u) => u.id === userId)
        setUser(foundUser || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  return {
    user,
    isLoading,
    error,
  }
}
