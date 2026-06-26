"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Star, Search, Grid, List, Clock, MapPin, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toSlug } from "@/lib/slug"

interface Item {
  _id: string
  name: string
  price: number
  mrp?: number
  offerPrice?: number
  finalPrice?: number
  discount?: number
  description: string
  images?: string[]
  category: string
  subCategory?: string
  level2Category?: string
  stock?: number
  duration?: string
  location?: string
}

interface ListingScreenProps {
  mainUse: 'product' | 'service'
  category?: string
  subcategory?: string
  subSubcategory?: string
  title: string
  description?: string
}

export function ListingScreen({ 
  mainUse, 
  category, 
  subcategory, 
  subSubcategory, 
  title, 
  description 
}: ListingScreenProps) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [cartItems, setCartItems] = useState<any[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)) } catch { setCartItems([]) }
    }

    const fetchItems = async () => {
      try {
        const endpoint = mainUse === 'product' ? '/api/products' : '/api/services'
        const params = new URLSearchParams()
        if (category) params.append('category', category)
        if (subcategory) params.append('subcategory', subcategory)
        if (subSubcategory) params.append('subSubcategory', subSubcategory)
        
        const res = await fetch(`${endpoint}${params.toString() ? '?' + params.toString() : ''}`)
        if (res.ok) {
          const result = await res.json()
          if (result.success) setItems(result.data)
        }
      } catch (error) {
        console.error("Error fetching items:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [category, subcategory, subSubcategory, mainUse])

  const addToCart = (product: Item) => {
    const existing = cartItems.find(i => i.id === product._id)
    if (existing) {
      const updated = cartItems.map(i => i.id === product._id ? { ...i, quantity: i.quantity + 1 } : i)
      setCartItems(updated)
      localStorage.setItem("cart", JSON.stringify(updated))
    } else {
      const newItems = [...cartItems, { 
        id: product._id, name: product.name, 
        price: product.finalPrice || product.price, 
        image: product.images?.[0], category: product.category, quantity: 1 
      }]
      setCartItems(newItems)
      localStorage.setItem("cart", JSON.stringify(newItems))
    }
    window.dispatchEvent(new Event("cartUpdated"))
    alert(`${product.name} added to cart!`)
  }

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "price-low") return (a.finalPrice || a.price) - (b.finalPrice || b.price)
    if (sortBy === "price-high") return (b.finalPrice || b.price) - (a.finalPrice || a.price)
    return a.name.localeCompare(b.name)
  })

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Breadcrumb */}
      <div className="border-b bg-gray-50">
        <div className="container mx-auto px-6 py-3 max-w-7xl">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900">{title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{description || `Discover our selection of ${title.toLowerCase()}`}</p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="pl-10" 
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">Price: Low-High</SelectItem>
              <SelectItem value="price-high">Price: High-Low</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-md">
            <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-600"}`}><Grid className="h-4 w-4" /></button>
            <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-600"}`}><List className="h-4 w-4" /></button>
          </div>
        </div>

        {sortedItems.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
            {sortedItems.map(item => (
              <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/${toSlug(item.name)}`}>
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {item.images?.[0] ? (
                        <div className="absolute inset-0" style={{ transform: 'translateY(40%)' }}>
                          <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          {mainUse === 'product' ? <ShoppingCart className="h-12 w-12" /> : <MessageCircle className="h-12 w-12" />}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      
                      {mainUse === 'service' && (
                        <div className="space-y-1 mb-3">
                          {item.duration && <div className="flex items-center text-xs text-gray-500"><Clock className="h-3 w-3 mr-1" />{item.duration}</div>}
                          {item.location && <div className="flex items-center text-xs text-gray-500"><MapPin className="h-3 w-3 mr-1" />{item.location}</div>}
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-blue-600">
                          {mainUse === 'product' ? `₹${(item.finalPrice || item.price || 0).toLocaleString()}` : 'Get Quote'}
                        </span>
                      </div>

                      <Button 
                        onClick={(e) => {
                          e.preventDefault()
                          if (mainUse === 'product') addToCart(item)
                          else window.location.href = `/enquiry?itemType=service&id=${item._id}`
                        }}
                        className="w-full"
                      >
                        {mainUse === 'product' ? "Add to Cart" : "Enquire Now"}
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
