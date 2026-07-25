"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart, Star, Truck, Shield, Clock, Package,
  ChevronLeft, ChevronRight, Check, Minus, Plus,
  MessageCircle, Phone, Mail
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { ListingScreen } from "@/components/ListingScreen"

interface Item {
  _id: string
  name: string
  price: number
  finalPrice?: number
  mrp?: number
  offerPrice?: number
  discount?: number
  description: string
  images?: string[]
  category: string
  stock?: number          // products only
  duration?: string       // services only
  location?: string       // services only
}

type ItemType = "product" | "service" | "category" | null


export default function SlugPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [item, setItem] = useState<Item | null>(null)
  const [categoryData, setCategoryData] = useState<any>(null)
  const [itemType, setItemType] = useState<ItemType>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [cartItems, setCartItems] = useState<any[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)) } catch { setCartItems([]) }
    }
  }, [])

  useEffect(() => {
    const resolve = async () => {
      const slug = params.slug

      // 1. Try product
      try {
        const res = await fetch(`/api/products/by-slug/${encodeURIComponent(slug)}`)
        if (res.ok) {
          const result = await res.json()
          if (result.success && result.data) {
            setItem(result.data)
            setItemType("product")
            setLoading(false)
            return
          }
        }
      } catch {}

      // 2. Try service
      try {
        const res = await fetch(`/api/services/by-slug/${encodeURIComponent(slug)}`)
        if (res.ok) {
          const result = await res.json()
          if (result.success && result.data) {
            setItem(result.data)
            setItemType("service")
            setLoading(false)
            return
          }
        }
      } catch {}

      // 3. Try Category/SubCategory/Level2
      try {
        const res = await fetch(`/api/categories/by-slug/${encodeURIComponent(slug)}`)
        if (res.ok) {
          const result = await res.json()
          if (result.success) {
            setCategoryData(result)
            setItemType("category")
            setLoading(false)
            return
          }
        }
      } catch {}

      setLoading(false)
    }
    resolve()
  }, [params.slug])

  // ── Product cart logic ──────────────────────────────────────────
  const addToCart = () => {
    if (!item) return
    const existing = cartItems.find(c => c.id === item._id)
    if (existing) {
      const updated = cartItems.map(c =>
        c.id === item._id ? { ...c, quantity: c.quantity + quantity } : c
      )
      setCartItems(updated)
      localStorage.setItem("cart", JSON.stringify(updated))
    } else {
      const newItems = [...cartItems, {
        id: item._id, name: item.name,
        price: item.finalPrice || item.price,
        image: item.images?.[0], category: item.category, quantity
      }]
      setCartItems(newItems)
      localStorage.setItem("cart", JSON.stringify(newItems))
    }
    window.dispatchEvent(new Event("cartUpdated"))
    alert(`${quantity} x ${item.name} added to cart!`)
  }

  // ── Loading / Not Found ─────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )

  // Render Category Listing
  if (itemType === "category" && categoryData) {
    return (
      <ListingScreen 
        mainUse={categoryData.mainUse}
        category={categoryData.category}
        subcategory={categoryData.subcategory}
        subSubcategory={categoryData.subSubcategory}
        title={categoryData.subSubcategory || categoryData.subcategory || categoryData.category}
        description={`Explore our collection of ${categoryData.mainUse}s in ${categoryData.level2 || categoryData.subcategory || categoryData.category}`}
      />
    )
  }

  if (!item || (itemType !== "product" && itemType !== "service")) return (
    <div className="min-h-screen">
      <Header />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
          <Link href="/"><Button className="bg-blue-600 hover:bg-blue-700">Back to Home</Button></Link>
        </div>
      </div>
      <Footer />
    </div>
  )


  const images = item.images && item.images.length > 0 ? item.images : []
  const isProduct = itemType === "product"
  const categoryLabel = item.category?.replace(/>/g, " / ").replace(/\//g, " / ") || ""

  // ── Improved Service Details Layout ─────────────────────────────
  if (!isProduct) {
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <div className="border-b bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 py-3 max-w-6xl">
            <nav className="flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-blue-600">Services</Link>
              <span>/</span>
              <span className="text-slate-800 font-medium truncate">{item.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-6xl">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-start">
            {/* Image - sticky on desktop */}
            <div className="lg:sticky lg:top-28 self-start">
              <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                <div className="relative aspect-[4/3] w-full">
                  {images.length > 0 ? (
                    <Image
                      src={images[selectedImage]}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 560px"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-20 w-20 text-slate-300" />
                    </div>
                  )}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImage(p => p === 0 ? images.length - 1 : p - 1)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5 text-slate-700" />
                      </button>
                      <button
                        onClick={() => setSelectedImage(p => p === images.length - 1 ? 0 : p + 1)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5 text-slate-700" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                        selectedImage === i ? "border-blue-600" : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                Service
              </span>
              {categoryLabel && (
                <p className="mt-3 text-sm text-slate-500">{categoryLabel}</p>
              )}
              <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                {item.name}
              </h1>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
                <span className="text-sm text-slate-500">4.9 (87 reviews)</span>
              </div>

              {(item.duration || item.location) && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {item.duration && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">Duration</span>
                      </div>
                      <p className="text-base font-semibold text-slate-900">{item.duration}</p>
                    </div>
                  )}
                  {item.location && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Truck className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">Service Area</span>
                      </div>
                      <p className="text-base font-semibold text-slate-900">{item.location}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6">
                <Button
                  onClick={() => router.push(`/enquiry?itemType=service&id=${item._id}`)}
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold shadow-sm"
                >
                  <MessageCircle className="h-5 w-5 mr-2" /> Place Enquiry
                </Button>
                <p className="mt-2 text-center text-xs text-slate-500">
                  Get a custom quote — our team will respond shortly
                </p>
              </div>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3">About this service</h2>
                <p className="text-slate-600 leading-7 text-[15px]">
                  {item.description || "Professional service tailored to your business needs."}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { icon: Shield, title: "Quality Assured", sub: "Verified delivery" },
                  { icon: Clock, title: "On-time", sub: "Reliable timelines" },
                  { icon: Star, title: "Expert Team", sub: "Skilled professionals" },
                  { icon: Phone, title: "Support", sub: "Quick assistance" },
                ].map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="rounded-xl border border-slate-200 p-3">
                    <Icon className="h-4 w-4 text-blue-600 mb-2" />
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500">{sub}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-slate-900 text-white p-5">
                <h3 className="font-semibold mb-3">Need help deciding?</h3>
                <div className="space-y-2 text-sm text-slate-200">
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-300" /> +91-8433661506</div>
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-300" /> customer@adminza.com</div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-blue-300" /> Mon–Fri, 9:00 AM – 6:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
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
            <Link href="/products" className="hover:text-blue-600">Products</Link>
            <span>/</span>
            <span className="text-gray-900">{item.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left – Image Gallery (sticky on desktop) */}
          <div className="lg:sticky lg:top-28 self-start">
            <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-4 group max-w-[360px] w-full">
              <div className="aspect-square relative overflow-hidden">
                {images.length > 0 ? (
                  <Image
                    src={images[selectedImage]} alt={item.name} fill
                    className="object-contain p-4" sizes="360px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="h-24 w-24 text-gray-300" />
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(p => p === 0 ? images.length - 1 : p - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    ><ChevronLeft className="h-5 w-5 text-gray-700" /></button>
                    <button
                      onClick={() => setSelectedImage(p => p === images.length - 1 ? 0 : p + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    ><ChevronRight className="h-5 w-5 text-gray-700" /></button>
                  </>
                )}
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${selectedImage === i ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-400'}`}
                  >
                    <div className="relative w-full h-full">
                      <Image src={img} alt={`View ${i + 1}`} fill className="object-contain p-1" sizes="80px" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right – Item Info */}
          <div>
            <p className="text-sm text-gray-600 mb-2">{item.category?.split('>')[0]?.trim()}</p>
            <h1 className="text-3xl font-semibold text-gray-900 mb-4 leading-tight">{item.name}</h1>

            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
              <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
              <span className="text-sm text-gray-600">4.8 (124 reviews)</span>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-semibold text-gray-900">
                ₹{(item.finalPrice || item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes (GST included)</p>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-900 mb-3 block">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}
                  className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(item.stock ?? 99, q + 1))} disabled={quantity >= (item.stock ?? 99)}
                  className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-8 pb-8 border-b">
              <Button onClick={addToCart} disabled={(item.stock ?? 0) === 0} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white">
                <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
              </Button>
            </div>

            <div className="mb-6">
              {(item.stock ?? 0) > 0
                ? <div className="flex items-center gap-2 text-green-600"><Check className="h-5 w-5" /><span className="font-medium">In Stock ({item.stock} units)</span></div>
                : <span className="font-medium text-red-600">Out of Stock</span>
              }
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About this product</h2>
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Truck, title: "Fast Delivery", sub: "2-3 business days" },
                { icon: Shield, title: "Secure Payment", sub: "100% safe & secure" },
                { icon: Star, title: "Quality Assured", sub: "Premium products" },
                { icon: Clock, title: "24/7 Support", sub: "Always available" },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <div><p className="text-sm font-medium text-gray-900">{title}</p><p className="text-xs text-gray-600">{sub}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
