"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X, Package, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  _id: string
  productId?: string
  productName?: string
  name?: string
  customerId?: string
  customerName?: string
  quantity: number
  price: number
  notes?: string
  isNew?: boolean
}

interface RetopUpModalProps {
  isOpen: boolean
  onClose: () => void
  customer: {
    _id: string
    name: string
  } | null
  products: Array<{ _id: string; name: string }>
  customerProducts: Product[]
  setCustomerProducts: (products: Product[]) => void
  isRetopUpMode: boolean
  eshopInventory: Array<{ _id: string; quantity: number; price: number }>
  onUpdate: () => Promise<void>
}

export function RetopUpModal({
  isOpen,
  onClose,
  customer,
  products,
  customerProducts,
  setCustomerProducts,
  isRetopUpMode,
  eshopInventory,
  onUpdate
}: RetopUpModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll and ensure modal is positioned correctly
  useEffect(() => {
    if (isOpen && mounted) {
      // Store current scroll position
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
      
      // Prevent scrolling by locking body
      const originalBodyOverflow = document.body.style.overflow
      const originalBodyPosition = document.body.style.position
      const originalBodyTop = document.body.style.top
      const originalBodyLeft = document.body.style.left
      const originalBodyRight = document.body.style.right
      const originalBodyWidth = document.body.style.width
      const originalHtmlOverflow = document.documentElement.style.overflow
      
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.width = '100%'
      document.documentElement.style.overflow = 'hidden'
      
      // Ensure overlay is positioned correctly in viewport
      if (overlayRef.current) {
        overlayRef.current.style.position = 'fixed'
        overlayRef.current.style.top = '0'
        overlayRef.current.style.left = '0'
        overlayRef.current.style.right = '0'
        overlayRef.current.style.bottom = '0'
        overlayRef.current.style.width = '100vw'
        overlayRef.current.style.height = '100vh'
        overlayRef.current.style.margin = '0'
        overlayRef.current.style.zIndex = '9999'
      }
      
      // Cleanup: restore scroll position when modal closes
      return () => {
        document.body.style.overflow = originalBodyOverflow
        document.body.style.position = originalBodyPosition
        document.body.style.top = originalBodyTop
        document.body.style.left = originalBodyLeft
        document.body.style.right = originalBodyRight
        document.body.style.width = originalBodyWidth
        document.documentElement.style.overflow = originalHtmlOverflow
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen, mounted])

  if (!isOpen || !mounted) return null

  const handleAddProduct = () => {
    const newProduct: Product = {
      _id: `temp_${Date.now()}`,
      productId: "",
      productName: "",
      customerId: customer?._id || "",
      customerName: customer?.name || "",
      quantity: 1,
      price: 0,
      notes: "",
      isNew: true
    }
    setCustomerProducts([...customerProducts, newProduct])
  }

  const handleRemoveProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this product?')) {
      return
    }

    // If it's a new product (not saved yet), just remove from state
    if (productId.startsWith('temp_')) {
      setCustomerProducts(customerProducts.filter((p) => p._id !== productId))
      return
    }

    // If it's an existing product, delete from database
    try {
      const response = await fetch(`/api/eshop-inventory/${productId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        setCustomerProducts(customerProducts.filter((p) => p._id !== productId))
        alert('Product removed successfully')
      } else {
        alert('Error removing product: ' + result.error)
      }
    } catch (error) {
      console.error('Error removing product:', error)
      alert('Error removing product')
    }
  }

  const handleUpdate = async () => {
    try {
      await onUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating products:', error)
    }
  }

  const modalContent = (
    <div 
      ref={overlayRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: '1rem',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
      onClick={onClose}
    >
      {/* MODAL CARD (Scrollable Container) */}
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
        style={{
          position: 'relative',
          zIndex: 10000
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER (Non-scrollable) */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 sm:p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-200 transition-colors p-1"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="text-center pr-8 sm:pr-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 flex items-center justify-center gap-2">
              <Package className="h-5 w-5 sm:h-6 sm:w-6" />
              {isRetopUpMode ? "Re-top Up Stock" : "Edit Products"}
            </h2>
            <p className="text-sm sm:text-base md:text-lg opacity-90">
              {customer?.name}
            </p>
            <p className="text-xs sm:text-sm opacity-80 mt-1">
              {isRetopUpMode 
                ? "Enter additional quantities to add to current stock"
                : "Manage products and quantities for this customer"
              }
            </p>
          </div>
        </div>

        {/* CONTENT AREA (Scrollable) */}
        <div className="p-3 sm:p-6">
          <div className="space-y-6">
            {/* Add Product Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Customer Products</h3>
              <Button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <Table className="min-w-[1200px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Product Name</TableHead>
                    <TableHead className="w-[120px]">Price (₹)</TableHead>
                    <TableHead className="w-[120px]">Discount (₹)</TableHead>
                    <TableHead className="w-[100px]">
                      {isRetopUpMode ? "Add Qty" : "Quantity"}
                    </TableHead>
                    <TableHead className="w-[200px]">Notes</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No products added yet. Click "Add Product" to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    customerProducts.map((product, index) => (
                      <TableRow key={product._id || index}>
                        <TableCell>
                          {product.isNew ? (
                            <Select
                              value={product.productId || ""}
                              onValueChange={(value) => {
                                const selectedProduct = products.find(p => p._id === value)
                                const updatedProducts = [...customerProducts]
                                updatedProducts[index] = { 
                                  ...product, 
                                  productId: value,
                                  productName: selectedProduct?.name || "",
                                  name: selectedProduct?.name || ""
                                }
                                setCustomerProducts(updatedProducts)
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Product" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((p) => (
                                  <SelectItem key={p._id} value={p._id}>
                                    {p.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="font-medium">{product.name || product.productName}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={product.price}
                            onChange={(e) => {
                              const updatedProducts = [...customerProducts]
                              updatedProducts[index] = { ...product, price: parseFloat(e.target.value) || 0 }
                              setCustomerProducts(updatedProducts)
                            }}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-green-600 font-medium">
                            ₹{((product.price * 0.4)).toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => {
                              const updatedProducts = [...customerProducts]
                              updatedProducts[index] = { ...product, quantity: parseInt(e.target.value) || 0 }
                              setCustomerProducts(updatedProducts)
                            }}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={product.notes || ""}
                            onChange={(e) => {
                              const updatedProducts = [...customerProducts]
                              updatedProducts[index] = { ...product, notes: e.target.value }
                              setCustomerProducts(updatedProducts)
                            }}
                            placeholder="Add notes..."
                            className="w-48"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveProduct(product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Summary Section */}
            {customerProducts.length > 0 && (() => {
              const subTotal = customerProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0)
              const grandTotalDiscount = customerProducts.reduce((sum, product) => sum + ((product.price * 0.4) * product.quantity), 0)
              const taxAmount = customerProducts.reduce((sum, product) => sum + ((product.price * 0.18) * product.quantity), 0)
              const grandTotalPrice = subTotal + taxAmount
              const totalQuantity = customerProducts.reduce((sum, product) => sum + product.quantity, 0)

              return (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Sub Total:</span>
                    <div className="flex space-x-8">
                      <span className="text-sm font-medium">₹{subTotal.toFixed(1)}</span>
                      <span className="text-sm font-medium text-green-600">₹{grandTotalDiscount.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tax:</span>
                    <div className="flex space-x-8">
                      <span className="text-sm font-medium">₹{taxAmount.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Discount:</span>
                    <div className="flex space-x-8">
                      <span className="text-sm font-medium">₹{grandTotalDiscount.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-lg font-bold">Grand Total:</span>
                    <div className="flex space-x-8">
                      <span className="text-lg font-bold">₹{grandTotalPrice.toFixed(1)}</span>
                      <span className="text-sm font-medium text-green-600">₹{grandTotalDiscount.toFixed(1)}</span>
                      <span className="text-sm font-medium">{totalQuantity}</span>
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={handleUpdate}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
              >
                <Package className="h-4 w-4 mr-2" />
                {isRetopUpMode ? "Update Stock" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Render modal at document body level using portal to ensure viewport positioning
  if (typeof window !== 'undefined' && document.body) {
    return createPortal(modalContent, document.body)
  }
  return null
}
