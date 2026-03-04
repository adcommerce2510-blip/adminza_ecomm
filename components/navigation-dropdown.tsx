"use client"

import { useState, useRef, useLayoutEffect } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const DROPDOWN_WIDTH = 320
const NESTED_WIDTH = 288
const VIEWPORT_PADDING = 8

interface SubCategory {
  name: string
  href: string
  nested?: SubCategory[]
}

interface NavigationDropdownProps {
  title: string
  subcategories: SubCategory[]
}

function NestedMenuItem({ subcategory }: { subcategory: SubCategory }) {
  const [isNestedOpen, setIsNestedOpen] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [nestedStyle, setNestedStyle] = useState<React.CSSProperties>({})
  const rowRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsNestedOpen(true)
  }

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsNestedOpen(false)
    }, 200)
    setTimeoutId(id)
  }

  useLayoutEffect(() => {
    if (!isNestedOpen || !rowRef.current || typeof window === "undefined") return
    const rect = rowRef.current.getBoundingClientRect()
    let left = rect.right + 4
    if (left + NESTED_WIDTH > window.innerWidth - VIEWPORT_PADDING) {
      left = rect.left - NESTED_WIDTH - 4
    }
    if (left < VIEWPORT_PADDING) left = VIEWPORT_PADDING
    const top = Math.max(VIEWPORT_PADDING, Math.min(rect.top, window.innerHeight - 200 - VIEWPORT_PADDING))
    setNestedStyle({
      position: "fixed",
      left: `${left}px`,
      top: `${top}px`,
      width: `${NESTED_WIDTH}px`,
      zIndex: 10000,
    })
  }, [isNestedOpen])

  if (!subcategory.nested) {
    return (
      <Link
        href={subcategory.href}
        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
      >
        {subcategory.name}
      </Link>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={rowRef}
        className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer border-b border-gray-100 transition-colors duration-150"
      >
        <span className="font-medium">{subcategory.name}</span>
        <ChevronRight className="h-4 w-4 text-gray-500" />
      </div>

      {isNestedOpen && nestedStyle.left !== undefined &&
        createPortal(
          <div
            className="bg-white border border-gray-200 shadow-xl rounded-lg"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={nestedStyle}
          >
            <div className="py-3 px-2 max-h-[70vh] overflow-y-auto">
              <div className="text-sm text-gray-700 font-medium mb-3 px-3 py-2 bg-gray-50 rounded-md mx-2">
                {subcategory.name}
              </div>
              {subcategory.nested.map((nestedItem, index) => (
                <Link
                  key={index}
                  href={nestedItem.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md mx-1 transition-colors duration-150"
                >
                  {nestedItem.name}
                </Link>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

export function NavigationDropdown({ title, subcategories }: NavigationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false)
    }, 200)
    setTimeoutId(id)
  }

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || typeof window === "undefined") return
    const rect = triggerRef.current.getBoundingClientRect()
    let left = rect.left
    if (left + DROPDOWN_WIDTH > window.innerWidth - VIEWPORT_PADDING) {
      left = window.innerWidth - DROPDOWN_WIDTH - VIEWPORT_PADDING
    }
    if (left < VIEWPORT_PADDING) left = VIEWPORT_PADDING
    setDropdownStyle({
      position: "fixed",
      left: `${left}px`,
      top: `${rect.bottom + 4}px`,
      width: `${DROPDOWN_WIDTH}px`,
      zIndex: 9999,
    })
  }, [isOpen])

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={triggerRef}
        type="button"
        className="flex items-center space-x-1 px-2 py-1 text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && dropdownStyle.left !== undefined &&
        createPortal(
          <div
            className="bg-white border border-gray-200 shadow-xl rounded-lg"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={dropdownStyle}
          >
            <div className="py-3 px-2 max-h-[70vh] overflow-y-auto">
              <div className="text-sm text-gray-700 font-medium mb-3 px-3 py-2 bg-gray-50 rounded-md mx-2">
                {title} Categories
              </div>
              {subcategories.map((subcategory, index) => (
                <NestedMenuItem key={index} subcategory={subcategory} />
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
