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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Star, Search, Filter, Grid, List, Clock, MapPin } from "lucide-react"
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
  subCategory?: string
  level2Category?: string
  duration?: string
  location?: string
  vendor: string
  status: string
}

export default function AllServicesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const subcategoryParam = searchParams.get('subcategory')
  const subSubcategoryParam = searchParams.get('subSubcategory')
  
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isEnquiryDialogOpen, setIsEnquiryDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredContactMethod: "email",
    serviceName: "",
    servicePrice: "",
    serviceDescription: "",
    serviceCategory: ""
  })

  useEffect(() => {
    const fetchServices = async () => {
      try {
        let url = '/api/services'
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
            setServices(result.data)
            // If we have a category parameter, set it as the selected category
            if (categoryParam) {
              setSelectedCategory(categoryParam)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching services:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [categoryParam, subcategoryParam, subSubcategoryParam])

  const handlePlaceEnquiry = (service: Service) => {
    router.push(`/enquiry?itemType=service&id=${service._id}`)
  }

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedService) return
    
    try {
      const enquiryData = {
        userId: "guest", // For now, we'll use "guest" as userId
        userEmail: enquiryForm.email,
        itemId: selectedService._id,
        itemType: "service",
        itemName: selectedService.name,
        message: enquiryForm.message,
        phone: enquiryForm.phone,
        preferredContactMethod: enquiryForm.preferredContactMethod,
        status: "pending"
      }
      
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enquiryData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert(`Enquiry submitted successfully for ${selectedService.name}!\n\nWe'll contact you soon with more details.`)
        setIsEnquiryDialogOpen(false)
        setEnquiryForm({ name: "", email: "", phone: "", message: "", preferredContactMethod: "email", serviceName: "", servicePrice: "", serviceDescription: "", serviceCategory: "" })
        setSelectedService(null)
      } else {
        alert('Error submitting enquiry: ' + result.error)
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error)
      alert('Error submitting enquiry. Please try again.')
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || !selectedCategory || service.category.includes(selectedCategory)
    
    return matchesSearch && matchesCategory
  })

  const sortedServices = [...filteredServices].sort((a, b) => {
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

  const categories = Array.from(new Set(services.map(s => s.category.split('>')[0]?.trim()).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
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
              {categoryParam ? `${categoryParam} Services` : 'All Services'}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {categoryParam ? `${categoryParam} Services` : 'All Services'}
          </h1>
          <p className="text-gray-600">
            {categoryParam 
              ? `Discover all services in the ${categoryParam} category`
              : 'Discover our complete range of professional services'
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
                  placeholder="Search services..."
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
            Showing {sortedServices.length} of {services.length} services
          </div>
        </div>

        {/* Services Grid/List */}
        {sortedServices.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {sortedServices.map((service) => (
              <Card key={service._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/service/${service._id}`}>
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="aspect-square bg-gray-100 overflow-hidden relative">
                      {service.images && service.images.length > 0 ? (
                        <div className="absolute inset-0" style={{ transform: 'translateY(40%)' }}>
                          <Image
                            src={service.images[0]}
                            alt={service.name}
                            fill
                            className="object-cover"
                            style={{ objectPosition: 'center' }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MessageCircle className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {service.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {service.description ? (() => {
                          const words = service.description.split(' ');
                          const truncated = words.slice(0, 5).join(' ');
                          return words.length > 5 ? truncated + '...' : truncated;
                        })() : ''}
                      </p>

                      {/* Service Details */}
                      <div className="space-y-2 mb-3">
                        {service.duration && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.duration}
                          </div>
                        )}
                        {service.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            {service.location}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600 ml-1">4.9</span>
                        </div>
                        {/* Price hidden for services */}
                      </div>

                      <Button
                        onClick={(e) => {
                          e.preventDefault()
                          handlePlaceEnquiry(service)
                        }}
                        className="w-full"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Place Enquiry
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Enquiry modal removed: navigation goes to /enquiry */}
       
      <Footer />
    </div>
  )
}