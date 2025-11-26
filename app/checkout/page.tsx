"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, FileText, CreditCard, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  category?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [checkoutType, setCheckoutType] = useState<"billing" | "quotation">("billing")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    company: "",
    gstNumber: "",
    notes: ""
  })

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error parsing cart data:", error)
      }
    }
    
    // Load user data if logged in
    const user = localStorage.getItem("user")
    if (user) {
      try {
        const userData = JSON.parse(user)
        setFormData(prev => ({
          ...prev,
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          city: userData.city || "",
          state: userData.state || "",
          zipCode: userData.zipCode || ""
        }))
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
    
    setLoading(false)
  }, [])

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (cartItems.length === 0) {
      alert("Your cart is empty!")
      return
    }

    // Get logged in user info
    const userInfo = localStorage.getItem("user")
    let userEmail = formData.email

    if (userInfo) {
      try {
        const user = JSON.parse(userInfo)
        userEmail = user.email || formData.email
      } catch (error) {
        console.error("Error parsing user info:", error)
      }
    }

    // HANDLE QUOTATION SUBMISSION
    if (checkoutType === "quotation") {
      setSubmitting(true) // Show loading state
      
      const quotationData = {
        userEmail,
        userName: formData.name,
        userPhone: formData.phone,
        userAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: "India"
        },
        items: cartItems.map((item: any) => ({
          itemId: item.id,
          itemName: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getTotalPrice(),
        description: formData.notes,
        company: formData.company,
        gstNumber: formData.gstNumber,
        status: "request",
        quotationDate: new Date().toISOString()
      }

      console.log('Sending quotation data:', quotationData)

      try {
        const response = await fetch("/api/quotations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(quotationData)
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("API Error response:", errorData)
          throw new Error(errorData.error || "Failed to create quotation")
        }

        const result = await response.json()
        console.log("Quotation created:", result)

        // Clear cart AFTER successful submission (but don't trigger redirects)
        localStorage.removeItem("cart")
        setCartItems([])
        
        // Dispatch event to notify other components
        window.dispatchEvent(new Event("cartUpdated"))
        
        // Directly redirect to view quotation without going through cart
        if (result.success && result.data && result.data._id) {
          // Use replace instead of push to avoid going back to cart
          router.replace(`/user-quotation?id=${result.data._id}`)
        } else {
          setSubmitting(false)
          alert("Quotation request submitted successfully! You can view it in your Accounts.")
          router.replace("/my-accounts")
        }
      } catch (error) {
        setSubmitting(false)
        console.error("Error creating quotation:", error)
        const errorMsg = error instanceof Error ? error.message : "Unknown error"
        alert(`Error submitting quotation: ${errorMsg}`)
      }
      return
    }

    // HANDLE BILLING/ORDER SUBMISSION
    setSubmitting(true) // Show loading state
    
    const orderData = {
      userEmail,
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email || userEmail,
      items: cartItems.map((item: any) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        hslCode: item.hslCode || ''
      })),
      totalAmount: getTotalPrice() * 1.18, // Including 18% tax
      shippingAddress: {
        receiverName: formData.name,
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: "India"
      },
      phone: formData.phone,
      company: formData.company,
      gstNumber: formData.gstNumber,
      notes: formData.notes,
      status: "Order Placed",
      orderDate: new Date().toISOString()
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const result = await response.json()
      console.log("Order created:", result)

      // Generate invoice and redirect to invoice page BEFORE clearing cart
      if (result.success && result.data) {
        const order = result.data
        
        // Prepare invoice data - capture cartItems BEFORE clearing
        const invoiceItems = cartItems.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
          hslCode: item.hslCode || ''
        }))

        // Try to find customer from eshop-inventory or use order data
        let customerId = order.userId || order._id || order._id
        
        // Encode items for URL
        const encodedItems = encodeURIComponent(JSON.stringify(invoiceItems))
        
        // Encode customer email for URL
        const customerEmail = encodeURIComponent(formData.email || order.customerEmail || userEmail || '')
        
        // Clear cart AFTER capturing data (but don't trigger redirects)
        localStorage.removeItem("cart")
        setCartItems([])
        
        // Dispatch event to notify other components
        window.dispatchEvent(new Event("cartUpdated"))
        
        // Redirect directly to public invoice page using replace to avoid cart page
        router.replace(`/invoice?customerId=${customerId}&items=${encodedItems}&orderId=${order._id}&customerEmail=${customerEmail}`)
      } else {
        // Clear cart
        localStorage.removeItem("cart")
        setCartItems([])
        window.dispatchEvent(new Event("cartUpdated"))
        
        setSubmitting(false)
        alert("Order placed successfully! You can view it in your Accounts.")
        router.replace("/my-accounts")
      }
    } catch (error) {
      setSubmitting(false)
      console.error("Error creating order:", error)
      alert("There was an error processing your order. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show loading overlay when submitting (quotation or billing)
  if (submitting) {
    const loadingMessage = checkoutType === "quotation" 
      ? "Processing Your Quotation Request"
      : "Processing Your Order"
    const loadingDescription = checkoutType === "quotation"
      ? "Please wait while we submit your quotation request..."
      : "Please wait while we process your order..."
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{loadingMessage}</h3>
            <p className="text-gray-600">{loadingDescription}</p>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
            <Link href="/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Cart</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-1">Complete your order</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Checkout Options</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={checkoutType}
                  onValueChange={(value) => setCheckoutType(value as "billing" | "quotation")}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="billing" id="billing" />
                    <Label htmlFor="billing" className="flex items-center space-x-3 flex-1 cursor-pointer">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                      <div>
                        <div className="font-semibold">Checkout to Billing</div>
                        <div className="text-sm text-gray-600">Complete purchase with payment</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="quotation" id="quotation" />
                    <Label htmlFor="quotation" className="flex items-center space-x-3 flex-1 cursor-pointer">
                      <FileText className="h-6 w-6 text-green-600" />
                      <div>
                        <div className="font-semibold">Request Quotation</div>
                        <div className="text-sm text-gray-600">Get a customized quote for your order</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* QUOTATION FORM - Show items */}
                  {checkoutType === "quotation" && (
                    <div className="mb-6">
                      <Label className="text-base font-semibold mb-3 block">Items Requested</Label>
                      <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                        <div className="pt-3 border-t mt-3">
                          <div className="flex justify-between">
                            <span className="font-semibold">Estimated Total:</span>
                            <span className="font-bold text-lg">₹{getTotalPrice().toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* User Details Section */}
                      <div className="mt-6 pt-6 border-t">
                        <Label className="text-base font-semibold mb-4 block">Your Details</Label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label htmlFor="quotation-name">Full Name *</Label>
                            <Input
                              id="quotation-name"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              placeholder="Your full name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="quotation-phone">Phone Number *</Label>
                            <Input
                              id="quotation-phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              placeholder="Contact number"
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <Label htmlFor="quotation-company">Company Name</Label>
                          <Input
                            id="quotation-company"
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                            placeholder="Company name (optional)"
                          />
                        </div>

                        <div className="mb-4">
                          <Label htmlFor="quotation-address">Address</Label>
                          <Input
                            id="quotation-address"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            placeholder="Street address"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label htmlFor="quotation-city">City</Label>
                            <Input
                              id="quotation-city"
                              value={formData.city}
                              onChange={(e) => setFormData({...formData, city: e.target.value})}
                              placeholder="City"
                            />
                          </div>
                          <div>
                            <Label htmlFor="quotation-state">State</Label>
                            <Input
                              id="quotation-state"
                              value={formData.state}
                              onChange={(e) => setFormData({...formData, state: e.target.value})}
                              placeholder="State"
                            />
                          </div>
                          <div>
                            <Label htmlFor="quotation-zip">ZIP Code</Label>
                            <Input
                              id="quotation-zip"
                              value={formData.zipCode}
                              onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                              placeholder="ZIP Code"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="quotation-gst">GST Number (Optional)</Label>
                          <Input
                            id="quotation-gst"
                            value={formData.gstNumber}
                            onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                            placeholder="GST registration number"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BILLING FORM - Show shipping fields */}
                  {checkoutType === "billing" && (
                    <div className="mb-6 pb-6 border-b">
                      <Label className="text-base font-semibold mb-3 block">Shipping Address</Label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor="receiverName">Receiver Name *</Label>
                          <Input
                            id="receiverName"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Full name of recipient"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="receiverPhone">Receiver Phone *</Label>
                          <Input
                            id="receiverPhone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="Contact number"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Delivery Address *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          placeholder="Street address"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP Code *</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* COMMON FIELDS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                    <Input
                      id="gstNumber"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">
                      {checkoutType === "quotation" ? "Special Requirements or Notes" : "Additional Notes"}
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder={checkoutType === "quotation" 
                        ? "Describe your requirements or specifications..." 
                        : "Any special instructions or requirements..."}
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    {checkoutType === "billing" ? "Complete Purchase" : "Request Quotation"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <ShoppingBag className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Items ({getTotalItems()})</span>
                      <span>₹{getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (18%)</span>
                      <span>₹{(getTotalPrice() * 0.18).toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{(getTotalPrice() * 1.18).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}