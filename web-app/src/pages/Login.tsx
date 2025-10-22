import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const target = searchParams.get("target") || "/products"

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(target)
    }
  }, [user, navigate, target])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const success = login(email, password)
    if (success) {
      navigate(target)
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Flipby</CardTitle>
          <CardDescription>Sign in to buy or sell your belongings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Demo accounts: john@example.com, jane@example.com, bob@example.com (password: password123)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
