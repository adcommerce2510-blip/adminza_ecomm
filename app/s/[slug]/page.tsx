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
  const categoryLabel = service.category?.replace(/>/g, " / ").replace(/\//g, " / ") || ""

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
            <span className="text-slate-800 font-medium truncate">{service.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-6xl">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-start">
          <div className="lg:sticky lg:top-28 self-start">
            <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={images[selectedImage]}
                  alt={service.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 560px"
                  priority
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                    >
                      <ChevronLeft className="h-5 w-5 text-slate-700" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                    >
                      <ChevronRight className="h-5 w-5 text-slate-700" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              Service
            </span>
            {categoryLabel && <p className="mt-3 text-sm text-slate-500">{categoryLabel}</p>}
            <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              {service.name}
            </h1>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex">{[1,2,3,4,5].map(star => <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
              <span className="text-sm text-slate-500">4.9 (87 reviews)</span>
            </div>

            {(service.duration || service.location) && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.duration && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">Duration</span>
                    </div>
                    <p className="text-base font-semibold text-slate-900">{service.duration}</p>
                  </div>
                )}
                {service.location && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <Truck className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">Service Area</span>
                    </div>
                    <p className="text-base font-semibold text-slate-900">{service.location}</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6">
              <Button
                onClick={() => router.push(`/enquiry?itemType=service&id=${service._id}`)}
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
              <p className="text-slate-600 leading-7 text-[15px]">{service.description}</p>
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
