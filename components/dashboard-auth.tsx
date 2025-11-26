"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, User, AlertCircle } from "lucide-react"

// Create a context for dashboard logout
export const DashboardLogoutContext = createContext<{ handleLogout: () => void } | null>(null)

export function useDashboardLogout() {
  const context = useContext(DashboardLogoutContext)
  if (!context) {
    throw new Error("useDashboardLogout must be used within DashboardAuth")
  }
  return context
}

interface DashboardAuthProps {
  children: React.ReactNode
}

export function DashboardAuth({ children }: DashboardAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if there's a valid session (within 24 hours)
    const checkSession = () => {
      const authData = localStorage.getItem("dashboard_auth")
      if (authData) {
        try {
          const { timestamp } = JSON.parse(authData)
          const now = Date.now()
          const sessionDuration = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
          
          // Check if session is still valid (within 24 hours)
          if (timestamp && (now - timestamp) < sessionDuration) {
            setIsAuthenticated(true)
            return
          } else {
            // Session expired, clear it
            localStorage.removeItem("dashboard_auth")
          }
        } catch (error) {
          // Invalid format, clear it
          localStorage.removeItem("dashboard_auth")
        }
      }
      setIsAuthenticated(false)
    }
    
    checkSession()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simple authentication check
    if (username === "admin_01" && password === "admin@123") {
      // Store authentication with timestamp for 24-hour session
      const authData = {
        authenticated: true,
        timestamp: Date.now()
      }
      localStorage.setItem("dashboard_auth", JSON.stringify(authData))
      setIsAuthenticated(true)
    } else {
      setError("Invalid username or password")
    }
    
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("dashboard_auth")
    setIsAuthenticated(false)
    setUsername("")
    setPassword("")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Dashboard Access
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Enter your credentials to access the admin dashboard
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
              <p className="text-sm text-blue-700">Username: <code className="bg-blue-100 px-1 rounded">admin_01</code></p>
              <p className="text-sm text-blue-700">Password: <code className="bg-blue-100 px-1 rounded">admin@123</code></p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <DashboardLogoutContext.Provider value={{ handleLogout }}>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </DashboardLogoutContext.Provider>
  )
}
