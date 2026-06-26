"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MessageCircle, Star, Truck, Shield, Clock, Package, ChevronLeft, ChevronRight, Phone, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Service {
  _id: string
  name: string
  price: number
  description: string
  images?: string[]
  category: string
  duration?: string
  location?: string
}

export default function ServiceSlugPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/by-slug/${encodeURIComponent(params.slug)}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) setService(result.data)
        }
      } catch (error) {
        console.error("Error fetching service:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [params.slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading service details...</p>
      </div>
    </div>
  )

  if (!service) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Service Not Found</h2>
        <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
        <Link href="/"><Button className="bg-blue-600 hover:bg-blue-700">Back to Home</Button></Link>
      </div>
    </div>
  )

  const images = service.images && service.images.length > 0 ? service.images : ["/placeholder.jpg"]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b bg-gray-50">
        <div className="container mx-auto px-6 py-3 max-w-7xl">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-blue-600">Services</Link>
            <span>/</span>
            <span className="text-gray-900">{service.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - Image Gallery */}
          <div>
            <div className="relative bg-white rounded-lg overflow-hidden mb-4 group">
              <div className="aspect-square relative">
                <Image src={images[selectedImage]} alt={service.name} fill className="object-center" />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right - Service Info */}
          <div>
            <p className="text-sm text-gray-600 mb-2">{service.category?.split('>')[0]?.trim()}</p>
            <h1 className="text-3xl font-semibold text-gray-900 mb-4 leading-tight">{service.name}</h1>

            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
              <div className="flex">{[1,2,3,4,5].map(star => <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
              <span className="text-sm text-gray-600">4.9 (87 reviews)</span>
            </div>

            <div className="mb-8">
              <Button onClick={() => router.push(`/enquiry?itemType=service&id=${service._id}`)} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold">
                <MessageCircle className="h-5 w-5 mr-2" /> Place Enquiry
              </Button>
            </div>

            {(service.duration || service.location) && (
              <div className="mb-6 space-y-3">
                {service.duration && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Duration</p>
                      <p className="text-sm text-gray-600">{service.duration}</p>
                    </div>
                  </div>
                )}
                {service.location && (
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Service Area</p>
                      <p className="text-sm text-gray-600">{service.location}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About this service</h2>
              <p className="text-gray-700 leading-relaxed">{service.description}</p>
            </div>

            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-700">+91-8433661506</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-700">customer@adminza.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-700">Mon - Fri: 9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
