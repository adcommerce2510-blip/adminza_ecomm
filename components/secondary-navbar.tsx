"use client"

import { DynamicNavbar } from "./dynamic-navbar"
import Link from "next/link"

export function SecondaryNavbar() {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm relative w-full max-w-full min-w-0">
      <div className="w-full max-w-full py-3 px-2 sm:px-4 min-w-0 flex flex-wrap items-center gap-1">
        {/* Mobile Tabs for Main Links */}
        <div className="flex lg:hidden items-center gap-2 mr-1 pr-2 border-r border-gray-200 flex-shrink-0">
          <Link href="/" className="text-xs font-bold text-gray-800 bg-blue-50 px-3 py-1.5 rounded-full whitespace-nowrap">Home</Link>
          <Link href="/about" className="text-xs font-semibold text-gray-500 hover:text-blue-600 px-2 flex-shrink-0">About</Link>
          <Link href="/contact" className="text-xs font-semibold text-gray-500 hover:text-blue-600 px-2 flex-shrink-0">Contact</Link>
        </div>
        <div className="flex-1 min-w-0">
          <DynamicNavbar />
        </div>
      </div>
    </div>
  )
}
