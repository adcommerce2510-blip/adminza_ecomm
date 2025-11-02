"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Star, Search, Filter, Grid, List } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  price: number
  description: string
  images?: string[]
  category: string
  subCategory?: string
  level2Category?: string
  stock: number
  vendor: string
  status: string
}

export default function AllProductsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const subcategoryParam = searchParams.get('subcategory')
  const subSubcategoryParam = searchParams.get('subSubcategory')
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [cartItems, setCartItems] = useState<any[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error parsing cart data:", error)
        setCartItems([])
      }
    }

    const fetchProducts = async () => {
      try {
        let url = '/api/products'
        const params = new URLSearchParams()
        
        if (categoryParam) {
          params.append('category', categoryParam)
        }
        if (subcategoryParam) {
          params.append('subcategory', subcategoryParam)
        }
        if (subSubcategoryParam) {
          params.append('subSubcategory', subSubcategoryParam)
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`
        }
        
        const response = await fetch(url)
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setProducts(result.data)
            // If we have a category parameter, set it as the selected category
            if (categoryParam) {
              setSelectedCategory(categoryParam)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoryParam, subcategoryParam, subSubcategoryParam])

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product._id)
    
    if (existingItem) {
      const updatedItems = cartItems.map(item =>
        item.id === product._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      setCartItems(updatedItems)
      localStorage.setItem("cart", JSON.stringify(updatedItems))
    } else {
      const newItems = [...cartItems, { 
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        category: product.category,
        quantity: 1
      }]
      setCartItems(newItems)
      localStorage.setItem("cart", JSON.stringify(newItems))
    }

    alert(`${product.name} added to cart!`)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || !selectedCategory || product.category.includes(selectedCategory)
    
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const categories = Array.from(new Set(products.map(p => p.category.split('>')[0]?.trim()).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Breadcrumb */}
      <div className="border-b bg-gray-50">
        <div className="container mx-auto px-6 py-3 max-w-7xl">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900">
              {subSubcategoryParam 
                ? `${subSubcategoryParam} Products` 
                : subcategoryParam 
                ? `${subcategoryParam} Products` 
                : categoryParam 
                ? `${categoryParam} Products` 
                : 'All Products'
              }
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {subSubcategoryParam 
              ? `${subSubcategoryParam} Products` 
              : subcategoryParam 
              ? `${subcategoryParam} Products` 
              : categoryParam 
              ? `${categoryParam} Products` 
              : 'All Products'
            }
          </h1>
          <p className="text-gray-600">
            {subSubcategoryParam 
              ? `Discover all products in the ${subSubcategoryParam} category`
              : subcategoryParam 
              ? `Discover all products in the ${subcategoryParam} category`
              : categoryParam 
              ? `Discover all products in the ${categoryParam} category`
              : 'Discover our complete range of products'
            }
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border rounded-md">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {sortedProducts.length} of {products.length} products
          </div>
        </div>

        {/* Products Grid/List */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {sortedProducts.map((product) => (
              <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow" style={{ overflow: 'hidden' }}>
                <Link href={`/product/${product._id}`} style={{ display: 'block', overflow: 'hidden' }}>
                  <CardContent className="p-0 overflow-hidden" style={{ overflow: 'hidden' }}>
                    {/* Image */}
                    <div className="aspect-square bg-gray-100 overflow-hidden relative" style={{ overflow: 'hidden !important', isolation: 'isolate', position: 'relative', contain: 'layout style paint' }}>
                      {product.images && product.images.length > 0 ? (
                        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden" style={{ 
                          transform: 'translateY(40%)', 
                          height: '100%',
                          width: '100%',
                          maxHeight: '100%',
                          maxWidth: '100%',
                          clipPath: 'inset(0 0 0 0)'
                        }}>
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            style={{ objectPosition: 'center' }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {product.description ? (() => {
                          const words = product.description.split(' ');
                          const truncated = words.slice(0, 5).join(' ');
                          return words.length > 5 ? truncated + '...' : truncated;
                        })() : ''}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600 ml-1">4.8</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </div>

                      <Button
                        onClick={(e) => {
                          e.preventDefault()
                          addToCart(product)
                        }}
                        className="w-full"
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
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