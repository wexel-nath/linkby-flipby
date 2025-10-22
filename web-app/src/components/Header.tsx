import { LogOut, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigateToLogin } from '@/hooks/use-navigate-to-login'

export const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const navigateToLogin = useNavigateToLogin()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <h2
          className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors"
          onClick={() => navigate('/')}
        >
          Flipby
        </h2>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex gap-2">
              <Button onClick={() => navigate('/products/new')}>
                <Plus className="mr-2" />
                Sell
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button onClick={() => navigateToLogin()}>Login</Button>
          )}
        </div>
      </div>
    </header>
  )
}
