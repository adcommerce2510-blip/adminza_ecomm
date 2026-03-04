"use client"

import { DynamicNavbar } from "./dynamic-navbar"

export function SecondaryNavbar() {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm relative w-full overflow-x-hidden min-w-0">
      {/* Row 1: first 9 tabs; Row 2: 10th onwards. Rows use flex-nowrap; scroll if needed */}
      <div className="w-full max-w-full py-3 px-1 min-w-0">
        <DynamicNavbar />
      </div>
    </div>
  )
}
