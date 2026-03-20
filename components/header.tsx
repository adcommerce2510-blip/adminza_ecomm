"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, ShoppingCart, User, Menu, Phone, Mail, LogOut, ChevronDown, ChevronRight } from "lucide-react"
import Link from "next/link"
import { DynamicNavbar } from "./dynamic-navbar"
import { SecondaryNavbar } from "./secondary-navbar"
import { CartDropdown } from "./cart-dropdown"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"


export function Header() {
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const cartButtonRef = useRef<HTMLButtonElement>(null)
  const cartDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const userButtonRef = useRef<HTMLButtonElement>(null)
  const userDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [registerForm, setRegisterForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    gstNumber: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/navbar')
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setCategories(result.data)
          }
        }
      } catch (error) {
        console.error("Error fetching navbar categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const user = localStorage.getItem("user")
    
    if (loggedIn && user) {
      setIsLoggedIn(true)
      const userData = JSON.parse(user)
      setUserName(userData.name || "User")
      setUserEmail(userData.email || "")
    }

    // Load cart items from localStorage
    const loadCartItems = () => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error parsing cart data:", error)
        setCartItems([])
      }
      } else {
        setCartItems([])
      }
    }

    loadCartItems()

    // Listen for storage changes (when cart is updated from other tabs/components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        loadCartItems()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom events for same-tab updates
    const handleCartUpdate = () => {
      loadCartItems()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)

    // Poll for changes (fallback for same-tab updates)
    const interval = setInterval(loadCartItems, 500)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", handleCartUpdate)
      clearInterval(interval)
    }
  }, [])

  const handleCartDropdownEnter = () => {
    if (cartDropdownTimeoutRef.current) {
      clearTimeout(cartDropdownTimeoutRef.current)
    }
    setIsCartOpen(true)
  }

  const handleCartDropdownLeave = () => {
    cartDropdownTimeoutRef.current = setTimeout(() => {
      setIsCartOpen(false)
    }, 200) // 200ms delay before closing
  }

  const handleUserDropdownEnter = () => {
    if (userDropdownTimeoutRef.current) {
      clearTimeout(userDropdownTimeoutRef.current)
    }
    setIsUserDropdownOpen(true)
  }

  const handleUserDropdownLeave = () => {
    userDropdownTimeoutRef.current = setTimeout(() => {
      setIsUserDropdownOpen(false)
    }, 200) // 200ms delay before closing
  }

  // Function to update cart items (can be called from other components)
  const updateCartItems = () => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error parsing cart data:", error)
        setCartItems([])
      }
    } else {
      setCartItems([])
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
    setIsLoggedIn(false)
    setUserName("")
    setUserEmail("")
    setIsUserDropdownOpen(false)
    router.push("/")
    router.refresh()
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginForm)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.customer))
      localStorage.setItem("isLoggedIn", "true")

      // Update state
      setIsLoggedIn(true)
      setUserName(data.customer.name)
      setUserEmail(data.customer.email)
      setIsLoginDialogOpen(false)
      setLoginForm({ username: "", password: "" })
      
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password length
    if (registerForm.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: registerForm.name,
          username: registerForm.username,
          email: registerForm.email,
          phone: registerForm.phone,
          password: registerForm.password,
          address: registerForm.address,
          city: registerForm.city,
          state: registerForm.state,
          zipCode: registerForm.zipCode,
          country: registerForm.country
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.customer))
      localStorage.setItem("isLoggedIn", "true")

      // Update state
      setIsLoggedIn(true)
      setUserName(data.customer.name)
      setUserEmail(data.customer.email)
      setIsRegisterDialogOpen(false)
      setRegisterForm({
        name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        gstNumber: ""
      })
      
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const switchToRegister = () => {
    setIsLoginDialogOpen(false)
    setIsRegisterDialogOpen(true)
    setError("")
    setLoginForm({ username: "", password: "" })
  }

  const switchToLogin = () => {
    setIsRegisterDialogOpen(false)
    setIsLoginDialogOpen(true)
    setError("")
    setRegisterForm({
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      gstNumber: ""
    })
  }

  return (
    <header className="sticky top-0 z-40 shadow-lg">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/20 relative">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between py-2 sm:py-3 text-xs sm:text-sm">
            <div className="flex items-center space-x-3 sm:space-x-6 min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2 text-primary shrink-0">
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="font-medium truncate">+91 8433661506</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-primary">
                <Mail className="h-4 w-4" />
                <span className="font-medium truncate">customer@adminza.com</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm text-muted-foreground shrink-0">
              <span className="font-medium">Free shipping on orders above ₹5,000</span>
              <span>•</span>
              <span className="font-medium">24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 gap-2 min-w-0">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 shrink-0 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="Adminza Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col items-start -ml-1 sm:-ml-2 md:-ml-4">
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-clip-text text-transparent" style={{background: 'linear-gradient(135deg, #000000 0%, #0300ff 100%)', WebkitBackgroundClip: 'text'}}>Adminza.in</span>
                <div className="text-[10px] sm:text-xs text-gray-600 -mt-0.5">Business Solutions</div>
              </div>
            </Link>

          <div className="hidden md:flex flex-1 max-w-4xl mx-4 lg:mx-8 min-w-0">
              <div className="flex w-full items-center bg-white/15 backdrop-blur-sm rounded-2xl border-2 border-primary/30 overflow-hidden shadow-lg hover:border-primary/50 transition-all duration-300">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 z-10" />
                  <Input
                    placeholder="Search for products, services, or vendors..."
                    className="pl-12 pr-4 h-12 text-base bg-transparent border-0 focus:ring-0 focus:outline-none w-full placeholder:text-gray-500"
                  />
                </div>
                <Button size="sm" className="rounded-l-none rounded-r-2xl px-6 h-12 text-sm font-medium flex-shrink-0">
                  Search
                </Button>
              </div>
            </div>

            {/* Main Navigation - desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contact
              </Link>
            </nav>

          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              {/* User Account Dropdown - desktop */}
              {isLoggedIn ? (
                <div 
                  className="user-dropdown-container relative"
                  onMouseEnter={handleUserDropdownEnter}
                  onMouseLeave={handleUserDropdownLeave}
                >
                  <Button 
                    ref={userButtonRef}
                    variant="ghost" 
                    size="icon" 
                    className="hidden md:flex rounded-xl"
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                  
                  {/* User Dropdown Card */}
                  {isUserDropdownOpen && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                      onMouseEnter={handleUserDropdownEnter}
                      onMouseLeave={handleUserDropdownLeave}
                    >
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
                            <User className="h-7 w-7" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-lg truncate">{userName}</p>
                            <p className="text-sm text-orange-100 truncate mt-0.5">{userEmail}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3">
                        <Link 
                          href="/my-accounts" 
                          className="flex items-center px-4 py-3 hover:bg-orange-50 rounded-lg transition-all duration-200 group"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <div className="w-9 h-9 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center mr-3 transition-colors">
                            <User className="h-4 w-4 text-orange-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">My Accounts</span>
                        </Link>
                        
                        <div className="border-t border-gray-200 my-2"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-3 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                        >
                          <div className="w-9 h-9 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center mr-3 transition-colors">
                            <LogOut className="h-4 w-4 text-red-600" />
                          </div>
                          <span className="text-sm font-medium text-red-600">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hidden md:flex"
                  onClick={() => setIsLoginDialogOpen(true)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}

              {/* User Account - mobile */}
              {!isLoggedIn && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="flex md:hidden rounded-xl"
                  onClick={() => setIsLoginDialogOpen(true)}
                >
                  <User className="h-5 w-5" />
                </Button>
              )}

              {isLoggedIn && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="flex md:hidden rounded-xl"
                  onClick={() => router.push('/my-accounts')}
                >
                  <User className="h-5 w-5" />
                </Button>
              )}
              
              {/* Cart Button with Dropdown */}
              <div 
                className="cart-dropdown-container"
                onMouseEnter={handleCartDropdownEnter}
                onMouseLeave={handleCartDropdownLeave}
              >
                <Link href="/cart">
                  <Button 
                    ref={cartButtonRef}
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl relative"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center bg-red-500">
                        {cartItems.reduce((total, item) => total + (item.quantity || 1), 0)}
                      </span>
                    )}
                  </Button>
                </Link>
                
                <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} triggerRef={cartButtonRef} />
              </div>
              
              {/* Mobile menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden rounded-xl">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 border-r shadow-2xl flex flex-col h-full overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-accent p-6 text-white shrink-0 sticky top-0 z-20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold">Categories</h2>
                        <p className="text-sm opacity-80">Explore our products & services</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pt-2 bg-white">
                      <nav className="flex flex-col px-2 pb-12">
                        {/* Primary Links */}
                        <div className="mb-4 border-b pb-2">
                          <Link href="/" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-bold" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                          <Link href="/about" className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium block" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                          <Link href="/contact" className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium block" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
                        </div>

                        {/* Categories Accordion */}
                        <div className="space-y-1">
                          {categories.map((category, idx) => (
                            <div key={idx} className="border-b border-gray-100 last:border-0">
                              <div 
                                className="flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-blue-50 cursor-pointer rounded-lg transition-colors"
                                onClick={() => toggleCategory(category.title)}
                              >
                                <span className="font-semibold text-sm">{category.title}</span>
                                <div className={`transition-transform duration-300 ${expandedCategories[category.title] ? 'rotate-180' : ''}`}>
                                  <ChevronDown className="h-4 w-4 opacity-50" />
                                </div>
                              </div>
                              
                              {expandedCategories[category.title] && (
                                <div className="pl-4 pr-1 py-1 bg-gray-50/30 rounded-lg mt-1 space-y-0.5">
                                  {category.subcategories.map((sub: any, subIdx: number) => (
                                    <div key={subIdx}>
                                      {sub.nested && sub.nested.length > 0 ? (
                                        <>
                                          <div 
                                            className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:text-blue-600 cursor-pointer"
                                            onClick={() => toggleCategory(`${category.title}-${sub.name}`)}
                                          >
                                            <span className="font-medium text-[13px]">{sub.name}</span>
                                            <div className={`transition-transform duration-200 ${expandedCategories[`${category.title}-${sub.name}`] ? 'rotate-180' : ''}`}>
                                              <ChevronDown className="h-3 w-3 opacity-40" />
                                            </div>
                                          </div>
                                          {expandedCategories[`${category.title}-${sub.name}`] && (
                                            <div className="pl-4 border-l-2 border-primary/20 ml-2 space-y-0.5 my-1">
                                              {sub.nested.map((nested: any, nIdx: number) => (
                                                <Link 
                                                  key={nIdx}
                                                  href={nested.href}
                                                  className="block px-3 py-1.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-white rounded transition-colors"
                                                  onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                  {nested.name}
                                                </Link>
                                              ))}
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <Link 
                                          href={sub.href}
                                          className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 text-[13px]"
                                          onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                          {sub.name}
                                        </Link>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>

      <div className="border-t bg-card relative overflow-x-hidden min-w-0 hidden lg:block">
        <div className="w-full min-w-0">
          <SecondaryNavbar />
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none !top-[80px] sm:!top-[100px] !translate-y-0">
          <Card className="shadow-2xl border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl sm:text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    type="text"
                    placeholder="Enter your username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
                <p className="text-sm text-center text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={switchToRegister}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Register here
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen} modal={false}>
        <DialogContent className="max-w-2xl p-0 border-none bg-white shadow-none sm:shadow-2xl !absolute sm:!fixed !top-0 sm:!top-[40px] !left-0 sm:!left-[50%] !translate-x-0 sm:!translate-x-[-50%] !translate-y-0 h-auto sm:rounded-2xl z-50">
          <div className="p-6 pb-20">
            <div className="mb-6">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">Create an Account</DialogTitle>
              <DialogDescription className="mt-1 text-gray-500">
                Fill in your details to register
              </DialogDescription>
            </div>
            
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name *</Label>
                  <Input
                    id="register-name"
                    type="text"
                    className="h-11 border-gray-300 focus:border-blue-500 rounded-lg"
                    placeholder="Enter your full name"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-username">Username *</Label>
                  <Input
                    id="register-username"
                    type="text"
                    className="h-11 border-gray-300 focus:border-blue-500 rounded-lg"
                    placeholder="Enter your username"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email *</Label>
                  <Input
                    id="register-email"
                    type="email"
                    className="h-11 border-gray-300 focus:border-blue-500 rounded-lg"
                    placeholder="Enter your email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-phone">Phone *</Label>
                  <Input
                    id="register-phone"
                    type="tel"
                    className="h-11 border-gray-300 focus:border-blue-500 rounded-lg"
                    placeholder="Enter your phone number"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-address">Address</Label>
                <Input
                  id="register-address"
                  type="text"
                  className="h-11 border-gray-300 focus:border-blue-500 rounded-lg"
                  placeholder="Enter your address"
                  value={registerForm.address}
                  onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="register-city">City</Label>
                  <Input
                    id="register-city"
                    type="text"
                    className="h-11 border-gray-300 focus:border-blue-500 rounded-lg"
                    placeholder="City"
                    value={registerForm.city}
                    onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-state">State</Label>
                  <Input
                    id="register-state"
                    type="text"
                    className="h-11 border-gray-300 focus:border-blue-500 rounded-lg"
                    placeholder="State"
                    value={registerForm.state}
                    onChange={(e) => setRegisterForm({ ...registerForm, state: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-zipCode">ZIP Code</Label>
                  <Input
                    id="register-zipCode"
                    type="text"
                    className="h-11 border-gray-300 focus:border-blue-500 rounded-lg"
                    placeholder="ZIP"
                    value={registerForm.zipCode}
                    onChange={(e) => setRegisterForm({ ...registerForm, zipCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-gstNumber">GST Number (Optional)</Label>
                <Input
                  id="register-gstNumber"
                  type="text"
                  className="h-11 border-gray-300 focus:border-blue-500 rounded-lg"
                  placeholder="Enter GST Number (e.g., 27XXXXX1234X1Z5)"
                  value={registerForm.gstNumber}
                  onChange={(e) => setRegisterForm({ ...registerForm, gstNumber: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password *</Label>
                  <Input
                    id="register-password"
                    type="password"
                    className="h-11 border-gray-300 focus:border-blue-500 rounded-lg"
                    placeholder="Create a password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirmPassword">Confirm Password *</Label>
                  <Input
                    id="register-confirmPassword"
                    type="password"
                    className="h-11 border-gray-300 focus:border-blue-500 rounded-lg"
                    placeholder="Confirm your password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-bold rounded-xl mt-4" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              <p className="text-sm text-center text-gray-600 mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-blue-600 hover:underline font-bold"
                >
                  Login here
                </button>
              </p>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
