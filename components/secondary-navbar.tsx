"use client"

import { DynamicNavbar } from "./dynamic-navbar"

export function SecondaryNavbar() {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm relative w-full max-w-full min-w-0 overflow-x-hidden">
      <div className="w-full max-w-full py-3 px-2 sm:px-4 min-w-0">
        <DynamicNavbar />
      </div>
    </div>
  )
}
