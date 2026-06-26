"use client"

import { useState, useEffect } from "react"
import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

interface Category {
  _id: string
  name: string
  description?: string
  image?: string
}

// Professional Unsplash fallbacks for categories
const getPublicImage = (categoryName: string): string => {
  const imageMap: { [key: string]: string } = {
    "Office Stationery": "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1000&auto=format&fit=crop",
    "IT Support": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop",
    "IT Support & Network": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    "Cleaning Solutions": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
    "Business Promotion": "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop",
    "Office Support Solutions": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
    "Office Furniture & Interior": "https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=1000&auto=format&fit=crop",
    "Printing Solutions": "https://images.unsplash.com/photo-1562654501-a0ccc0af3fb1?q=80&w=1000&auto=format&fit=crop",
    "AMC Services": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop",
    "Corporate Gifting": "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1000&auto=format&fit=crop"
  }
  
  return imageMap[categoryName] || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop"
}

import { toSlug } from "@/lib/slug"

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
      <section className="pt-2 pb-20 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[450px] rounded-xl bg-slate-50 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-2 pb-20 bg-white relative z-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-[10px] block mb-4">Our Excellence</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-tight">
            Explore Categories
          </h2>
          <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full opacity-80"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {categories.map((category) => {
            const bgUrl = getPublicImage(category.name)
            
            return (
              <Link 
                key={category._id} 
                href={`/${toSlug(category.name)}`} 
                className="group relative block h-[450px] w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700"
              >

                {/* Image Layer - Strictly clipped by parent rounded-2xl */}
                <div 
                  className="absolute inset-0 w-full h-full bg-cover transition-transform duration-1000 group-hover:scale-105"
                  style={{ 
                    backgroundImage: `url(${bgUrl})`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* Subtle darkening overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500"></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 pt-20 flex flex-col justify-end text-white transform transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-3xl lg:text-4xl font-extrabold mb-5 uppercase tracking-tighter leading-none break-words drop-shadow-lg">
                    {category.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-500">
                    <span className="text-[10px] font-black tracking-[0.25em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                      Experience Quality
                    </span>
                    <div className="h-px w-6 bg-blue-600 group-hover:w-10 transition-all duration-500"></div>
                    <ArrowRightIcon className="w-4 h-4 text-blue-600 transition-transform" strokeWidth={3} />
                  </div>
                </div>

                {/* Inset Border on Hover */}
                <div className="absolute inset-0 border-[6px] border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
