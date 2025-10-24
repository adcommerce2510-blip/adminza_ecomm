"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import { AnimatedWrapper, StaggeredContainer } from "@/components/animated-wrapper"

interface Category {
  _id: string
  name: string
  description?: string
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
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="p-0">
                      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-6xl opacity-20">
                            📁
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
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
