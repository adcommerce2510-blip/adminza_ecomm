"use client"

import { useState, useEffect } from "react"
import { NavigationDropdown } from "./navigation-dropdown"

interface SubCategory {
  name: string
  href: string
  nested?: SubCategory[]
}

interface NavbarCategory {
  title: string
  href: string
  subcategories: SubCategory[]
}

export function DynamicNavbar() {
  const [categories, setCategories] = useState<NavbarCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching navbar categories...")
        const response = await fetch('/api/categories/navbar', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache'
        })
        console.log("Response status:", response.status)
        console.log("Response headers:", Object.fromEntries(response.headers.entries()))
        
        if (response.ok) {
          const result = await response.json()
          console.log("API result:", result)
          
          if (result.success && result.data) {
            console.log("Categories loaded:", result.data.length)
            console.log("Categories in order:", result.data.map((c: any) => c.title))
            setCategories(result.data)
          } else {
            console.error("API returned error:", result.error)
            console.error("API result details:", result)
          }
        } else {
          const errorText = await response.text()
          console.error("Failed to fetch categories, status:", response.status)
          console.error("Error response:", errorText)
        }
      } catch (error) {
        console.error("Error fetching navbar categories:", error)
        console.error("Error details:", error instanceof Error ? error.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    // Add a small delay to ensure the server is ready
    const timeoutId = setTimeout(fetchCategories, 100)
    
    return () => clearTimeout(timeoutId)
  }, [])

  if (loading) {
    return (
      <nav className="hidden lg:flex items-center justify-start w-full">
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
          <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-6 w-28 rounded"></div>
        </div>
      </nav>
    )
  }

  if (categories.length === 0) {
    return (
      <nav className="hidden lg:flex items-center justify-start w-full">
        <span className="text-gray-500 text-sm">No categories found</span>
      </nav>
    )
  }

  return (
    <nav className="flex items-center gap-x-2 w-full max-w-full min-w-0 overflow-x-auto no-scrollbar scroll-smooth py-1">
      {categories.map((category, index) => (
        <div key={index} className="flex-shrink-0 lg:flex-shrink">
          <NavigationDropdown
            title={category.title}
            subcategories={category.subcategories}
          />
        </div>
      ))}
    </nav>
  )
}
