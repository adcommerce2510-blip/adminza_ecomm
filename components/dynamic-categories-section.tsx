"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { AnimatedWrapper, StaggeredContainer } from "@/components/animated-wrapper"

interface Category {
  _id: string
  name: string
  description?: string
}

// Mapping category names to their images
const getCategoryImage = (categoryName: string): string => {
  const categoryImageMap: { [key: string]: string } = {
    "Office Stationery": "/office-stationery-bundle.jpg",
    "IT Support": "/it-network-setup-office.jpg",
    "IT Support & Network": "/it-network-setup-office.jpg",
    "Cleaning Solutions": "/office-cleaning.png",
    "Business Promotion": "/corporate-branding-materials.jpg",
    "Office Support Solutions": "/modern-office-desk-setup.jpg",
    "Office Furniture & Interior": "/modern-office-desk-front-view.jpg",
    "Printing Solutions": "/large-format-printing-banners.jpg",
    "AMC Services": "/ergonomic-office-chair.png",
    "Corporate Gifting": "/desk-organizer-set.jpg"
  }
  
  return categoryImageMap[categoryName] || "/placeholder.jpg"
}

// Check if category needs upward shift
const shouldShiftImageUp = (categoryName: string): boolean => {
  const categoriesToShiftUp = [
    "Office Stationery",
    "Printing Solutions",
    "Business Promotion",
    "IT Support",
    "Office Support Solutions",
    "Office Furniture & Interior"
  ]
  
  return categoriesToShiftUp.includes(categoryName)
}

export function DynamicCategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setCategories(result.data)
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="animate-pulse bg-gray-200 h-8 w-64 mx-auto mb-4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-96 mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
                <div className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
                <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedWrapper animation="fade-in-up">
          <div className="text-center max-w-3xl mx-auto mb-12 pt-12">
            <AnimatedWrapper animation="fade-in" delay={200}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Explore Our <span className="gradient-text bg-clip-text text-transparent" style={{background: 'linear-gradient(135deg, #000000 0%, #0300ff 100%)', WebkitBackgroundClip: 'text'}}>Categories</span>
              </h2>
            </AnimatedWrapper>
            <AnimatedWrapper animation="fade-in-up" delay={400}>
              <p className="text-xl text-gray-600 leading-relaxed">
                Discover a wide range of products and services tailored for your business needs
              </p>
            </AnimatedWrapper>
          </div>
        </AnimatedWrapper>

        <StaggeredContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-')
              
              return (
                <AnimatedWrapper key={category._id} animation="fade-in-up" delay={index * 100}>
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-white rounded-lg" style={{ overflow: 'hidden' }}>
                    <CardContent className="p-0 overflow-hidden relative rounded-lg" style={{ overflow: 'hidden' }}>
                      <div className="h-1.5 bg-white overflow-hidden"></div>
                      <div className="relative w-full bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden z-0 rounded-t-lg" style={{ height: '192px', width: '100%', maxHeight: '192px', minHeight: '192px', overflow: 'hidden', clipPath: 'inset(0 0 0 0)' }}>
                        <div className="absolute left-0 right-0 overflow-hidden rounded-t-lg" style={{ 
                          width: '100%',
                          ...(shouldShiftImageUp(category.name) ? {
                            top: '-80px',
                            height: 'calc(100% + 80px)'
                          } : {
                            top: '0',
                            bottom: '0',
                            height: '192px',
                            maxHeight: '192px'
                          }),
                          clipPath: 'inset(0 0 0 0)'
                        }}>
                          <Image
                            src={getCategoryImage(category.name)}
                            alt={category.name}
                            fill
                            className="object-cover z-0"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ 
                              objectFit: 'cover', 
                              objectPosition: 'top'
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.jpg"
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="p-6 relative z-20 bg-white rounded-b-lg overflow-hidden">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                        
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {category.description || `Explore our comprehensive range of ${category.name.toLowerCase()} products and services designed for your business needs.`}
                        </p>
                        
                        <Link href={`/categories/${categorySlug}`}>
                          <Button className="w-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200">
                            Explore Category
                            <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedWrapper>
              )
            })}
          </div>
        </StaggeredContainer>
      </div>
    </section>
  )
}
