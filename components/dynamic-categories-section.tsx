"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { toSlug } from "@/lib/slug"

interface Category {
  _id: string
  name: string
  description?: string
  image?: string
}

const CATEGORY_FALLBACKS: Record<string, string> = {
  "office stationery":
    "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=800&auto=format&fit=crop",
  "it support":
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
  "it support & network":
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
  "cleaning solutions":
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
  "business promotion":
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop",
  "office support solutions":
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
  "office furniture & interior":
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop",
  "office furniture interior":
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop",
  "printing solutions":
    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop",
  "printing services":
    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop",
  "amc services":
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop",
  "corporate gifting":
    "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=800&auto=format&fit=crop",
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop"

function normalizeCategoryName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ")
}

function resolveImageUrl(image: string): string {
  const trimmed = image.trim()
  if (!trimmed) return ""
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed
  }
  return `/${trimmed.replace(/^\/+/, "")}`
}

function getFallbackImage(category: Category): string {
  const normalized = normalizeCategoryName(category.name)
  if (CATEGORY_FALLBACKS[normalized]) return CATEGORY_FALLBACKS[normalized]
  if (normalized.includes("printing")) return CATEGORY_FALLBACKS["printing solutions"]
  return DEFAULT_IMAGE
}

function getCategoryCardImage(category: Category): string {
  if (category.image?.trim()) return resolveImageUrl(category.image)
  return getFallbackImage(category)
}

function CategoryCard({ category }: { category: Category }) {
  const fallback = getFallbackImage(category)
  const [src, setSrc] = useState(() => getCategoryCardImage(category))

  useEffect(() => {
    const primary = getCategoryCardImage(category)
    const probe = new window.Image()
    probe.onload = () => setSrc(primary)
    probe.onerror = () => setSrc(fallback)
    probe.src = primary
  }, [category._id, category.name, category.image, fallback])

  const imageUrl = src.replace(/"/g, "")

  return (
    <Link href={`/${toSlug(category.name)}`} className="explore-category-card">
      <div
        className="explore-category-card__media"
        style={{ backgroundImage: `url("${imageUrl}")` }}
        role="img"
        aria-label={category.name}
      />
      <div className="explore-category-card__label">{category.name}</div>
    </Link>
  )
}

export function DynamicCategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (response.ok) {
          const result = await response.json()
          if (result.success) setCategories(result.data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <section className="explore-categories-section">
      <div className="explore-categories-section__inner">
        <h2 className="explore-categories-section__title">Explore Categories</h2>

        {loading ? (
          <div className="explore-categories-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="explore-category-card explore-category-card--loading" />
            ))}
          </div>
        ) : (
          <div className="explore-categories-grid">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
