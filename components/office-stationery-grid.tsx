"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Package, TrendingUp, Search } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Toast, useToast } from "@/components/toast"
import { toSlug } from "@/lib/slug"

const stationeryProducts = [
  {
    id: 1,
    name: "Premium Office Stationery Bundle",
    category: "Combo Sets",
    price: 3500,
    originalPrice: 4500,
    rating: 4.8,
    reviews: 189,
    vendor: "OfficeSupply Pro",
    image: "/office-stationery-bundle.jpg",
    badge: "Best Seller",
    inStock: true,
    stock: 45,
  },
  {
    id: 2,
    name: "Executive Desk Organizer Set",
    category: "Desk Accessories",
    price: 2800,
    originalPrice: 3500,
    rating: 4.7,
    reviews: 156,
    vendor: "ModernOffice Solutions",
    image: "/desk-organizer-set.jpg",
    badge: "Popular",
    inStock: true,
    stock: 32,
  },
  {
    id: 3,
    name: "Wireless Keyboard & Mouse Combo",
    category: "Computer Accessories",
    price: 2499,
    rating: 4.6,
    reviews: 234,
    vendor: "TechGear India",
    image: "/wireless-keyboard-mouse-set.jpg",
    inStock: true,
    stock: 67,
  },
  {
    id: 4,
    name: "LED Desk Lamp - Modern Design",
    category: "Desk Lighting",
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviews: 421,
    vendor: "LightingPro",
    image: "/led-desk-lamp-modern.jpg",
    badge: "Top Rated",
    inStock: true,
    stock: 28,
  },
  {
    id: 5,
    name: "Premium Pen Collection (12 Pcs)",
    category: "Writing Instruments",
    price: 899,
    rating: 4.5,
    reviews: 312,
    vendor: "PenMaster India",
    image: "/placeholder.jpg",
    inStock: true,
    stock: 150,
  },
]

export function OfficeStationeryGrid() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("relevance")
  const { toasts, showToast, hideToast } = useToast()

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const handleAddToCart = (productName: string) => {
    showToast(`${productName} added to cart!`)
  }

  const sortedProducts = [...stationeryProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "popular":
        return b.reviews - a.reviews
      default:
        return 0
    }
  })

  return (
    <div>
      {/* Stats Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
            <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stationeryProducts.length}+</p>
            <p className="text-sm text-muted-foreground">Products Available</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">4.6</p>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
            <Star className="h-6 w-6 text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">15K+</p>
            <p className="text-sm text-muted-foreground">Happy Customers</p>
          </div>
        </div>
      </div>

      {/* Horizontal Filter Bar */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search stationery..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* All Types Dropdown */}
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]">
              <option>All Types</option>
              <option>Individual Items</option>
              <option>Bundles & Sets</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* All Categories Dropdown */}
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]">
              <option>All Categories</option>
              <option>Paper Products</option>
              <option>Writing Materials</option>
              <option>Files & Folders</option>
              <option>Office Tools</option>
              <option>Desk Essentials</option>
              <option>Combo Sets</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* All Places Dropdown */}
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]">
              <option>All Places</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Bangalore</option>
              <option>Chennai</option>
              <option>Kolkata</option>
              <option>Hyderabad</option>
              <option>Pune</option>
              <option>Ahmedabad</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Sort Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <p className="text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{sortedProducts.length}</span> results
        </p>
        <select
          className="border rounded-md px-4 py-2 text-sm bg-background"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="relevance">Sort by: Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sortedProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200 p-0 overflow-hidden">
            <div className="relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              {product.badge && (
                <Badge className="absolute top-2 left-2 text-xs" variant="secondary">
                  {product.badge}
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              <Link href={`/${toSlug(product.name)}`}>
                <h3 className="font-bold text-sm mb-1 text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              
              <div className="w-full h-px bg-gray-300 mb-2"></div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 rounded-md transition-colors"
                onClick={() => handleAddToCart(product.name)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-10">
        <Button variant="outline" size="lg" className="min-w-[200px]">
          Load More Products
        </Button>
      </div>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  )
}
