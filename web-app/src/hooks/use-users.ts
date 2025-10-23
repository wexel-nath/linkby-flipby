import { useEffect, useState } from 'react'

import { apiService } from '@/services/api'
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

        const response = await apiService.request<User[]>('/users')

        if (response.data) {
          setUsers(response.data)
        }
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

        const response = await apiService.request<User>(`/users/${userId}`)

        if (response.data) {
          setUser(response.data)
        }
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
