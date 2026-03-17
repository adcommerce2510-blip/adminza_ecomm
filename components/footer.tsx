"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"

interface NavbarCategory {
  title: string
  href?: string
  subcategories?: { name: string; href: string }[]
}

export function Footer() {
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories/navbar", { cache: "no-store" })
        const data = await res.json()
        if (data?.success && Array.isArray(data.data)) {
          setNavbarCategories(data.data)
        }
      } catch (e) {
        console.warn("Footer: could not load navbar categories", e)
      }
    }
    fetchCategories()
  }, [])
  return (
    <footer className="border-t border-blue-700 relative z-30" style={{background: 'linear-gradient(135deg, #000000 0%, #0300ff 100%)'}}>
       <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_minmax(0,1.5fr)_minmax(10rem,1fr)] gap-6 lg:gap-x-4 min-w-0">
          {/* Company Info */}
          <div className="min-w-0">
             <div className="flex flex-col items-center mb-3">
                 <img 
                   src="/logo.png" 
                   alt="Adminza Logo" 
                   style={{height: '100px', width: 'auto'}}
                   className="object-contain mb-2"
                 />
               <span className="text-2xl font-bold text-white">Adminza.in</span>
             </div>
            <div className="space-y-1">
              <div className="flex items-start text-sm text-gray-300 gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="break-words">B-427, Balaji Bhavan, Plot No.42A, Sector-11, CBD Belapur, Navi Mumbai 400614</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Phone className="h-4 w-4 mr-2" />
                <span>+91-8433661506</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                <span>customer@adminza.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 sm:mt-8 ml-0 sm:ml-6 min-w-0 lg:ml-2">
             <h3 className="font-semibold mb-3 text-white text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors text-base">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="text-gray-300 hover:text-white transition-colors text-base">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-base">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-white transition-colors text-base">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-gray-300 hover:text-white transition-colors text-base">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Services - same categories as navbar; grid 5×1, 5×2, or 5×3; each name single line; contained so no overlap */}
          <div className="mt-6 sm:mt-8 ml-0 sm:ml-6 min-w-0 overflow-hidden lg:ml-2 lg:max-w-md">
             <h3 className="font-semibold mb-3 text-white text-lg">Popular Services</h3>
            {(() => {
              const list = navbarCategories.length > 0
                ? navbarCategories.map((cat) => {
                    const slug = cat.title.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")
                    const href = cat.subcategories?.[0]?.href ?? `/categories/${slug}`
                    return { key: cat.title, title: cat.title, href }
                  })
                : [
                    { key: "office-stationery", title: "Office Stationery", href: "/categories/office-stationery" },
                    { key: "it-support", title: "IT Support", href: "/categories/it-support" },
                    { key: "cleaning-solutions", title: "Cleaning Solutions", href: "/categories/cleaning-solutions" },
                    { key: "printing-solutions", title: "Printing Solutions", href: "/categories/printing-solutions" },
                    { key: "amc-services", title: "AMC Services", href: "/categories/amc-services" },
                  ]
              const n = list.length
              const cols = n <= 5 ? 1 : n <= 10 ? 2 : 3
              const rows = Math.ceil(n / cols)
              return (
                <ul
                  className="grid w-full"
                  style={{
                    gridTemplateColumns: cols === 1 ? "1fr" : `repeat(${cols}, minmax(10rem, 1fr))`,
                    gridTemplateRows: `repeat(${rows}, 1.75rem)`,
                    gap: "0.375rem 1.25rem",
                  }}
                >
                  {list.map((item) => (
                    <li key={item.key} className="flex items-center min-w-0">
                      <Link
                        href={item.href}
                        title={item.title}
                        className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base block whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )
            })()}
          </div>

          {/* Legal - pushed right to use space and avoid overlap */}
          <div className="mt-6 sm:mt-8 ml-0 sm:ml-6 min-w-0 lg:ml-8 lg:pl-6 lg:justify-self-end lg:text-right">
             <h3 className="font-semibold mb-3 text-white text-lg">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors text-base">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors text-base">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white transition-colors text-base">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors text-base">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

         <div className="border-t border-blue-700 mt-6 pt-6 text-center text-gray-300">
          <p>&copy; 2025 Adminza.in. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
