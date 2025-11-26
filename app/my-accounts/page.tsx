"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, ShoppingCart, FileText, Mail, RefreshCw, Eye, Package, ArrowLeft, LogOut } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function MyAccountsPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("profile")
  const [orders, setOrders] = useState<any[]>([])
  const [quotations, setQuotations] = useState<any[]>([])
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [stockInventory, setStockInventory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const [userData, setUserData] = useState<any>(null)
  const [refreshing, setRefreshing] = useState(false)
  
  // View details states
  const [viewingOrder, setViewingOrder] = useState<any>(null)
  const [viewingQuotation, setViewingQuotation] = useState<any>(null)
  const [viewingEnquiry, setViewingEnquiry] = useState<any>(null)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [isQuotationDialogOpen, setIsQuotationDialogOpen] = useState(false)
  const [isEnquiryDialogOpen, setIsEnquiryDialogOpen] = useState(false)

    const fetchSubmissions = async () => {
      try {
      setRefreshing(true)
        const user = localStorage.getItem("user")
        if (!user) return

      const userDataObj = JSON.parse(user)
      const email = userDataObj.email
      setUserEmail(email)
      setUserData(userDataObj)

      // Fetch orders - check both userEmail and customerEmail
      const ordersRes = await fetch(`/api/orders`)
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json()
        if (ordersData.success) {
          // Filter by email (check both userEmail and customerEmail)
          const filteredOrders = ordersData.data.filter((order: any) => 
            (order.userEmail && order.userEmail.toLowerCase() === email.toLowerCase()) ||
            (order.customerEmail && order.customerEmail.toLowerCase() === email.toLowerCase())
          )
          setOrders(filteredOrders)
        }
        }

        // Fetch quotations
        const quotationsRes = await fetch(`/api/quotations?email=${encodeURIComponent(email)}`)
        if (quotationsRes.ok) {
          const quotationsData = await quotationsRes.json()
          setQuotations(quotationsData.success ? quotationsData.data : [])
        }

        // Fetch enquiries
        const enquiriesRes = await fetch(`/api/enquiries?email=${encodeURIComponent(email)}`)
        if (enquiriesRes.ok) {
          const enquiriesData = await enquiriesRes.json()
          setEnquiries(enquiriesData.success ? enquiriesData.data : [])
        }

      // Fetch stock inventory with history - first get customer by email, then filter by customerId
      try {
        // First, fetch the customer to get their customerId
        const customersRes = await fetch(`/api/customers`)
        if (!customersRes.ok) {
          console.error('Failed to fetch customers')
          // Don't clear existing stock inventory if fetch fails
          return
        }
        
        const customersData = await customersRes.json()
        if (!customersData.success || !customersData.data) {
          console.error('Invalid customers data')
          // Don't clear existing stock inventory if data is invalid
          return
        }
        
        // Find customer by email
        const customer = customersData.data.find((c: any) => 
          c.email?.toLowerCase() === email.toLowerCase()
        )
        
        if (!customer) {
          // No customer found, set empty inventory
          setStockInventory([])
          return
        }
        
        const customerId = customer._id.toString()
        
        // Fetch current inventory and retop-up history in parallel
        let inventoryData = { success: false, data: [] }
        let historyData = { success: false, data: [] }
        
        try {
          const inventoryRes = await fetch(`/api/eshop-inventory`)
          if (inventoryRes.ok) {
            inventoryData = await inventoryRes.json()
          }
        } catch (err) {
          console.error('Error fetching inventory:', err)
        }
        
        try {
          const historyRes = await fetch(`/api/retopup-history?customerId=${encodeURIComponent(customerId)}`)
          if (historyRes.ok) {
            historyData = await historyRes.json()
          }
        } catch (err) {
          console.error('Error fetching history:', err)
        }
        
        // Build a comprehensive list of all product deliveries/updates
        const stockEntries: any[] = []
        
        if (inventoryData.success && Array.isArray(inventoryData.data)) {
          // Filter inventory by customerId
          const filteredInventory = inventoryData.data.filter((item: any) => 
            item.customerId === customerId || item.customerId === customer._id || item.customerId?.toString() === customerId
          )
          
          // For each product, create an entry from initial creation
          filteredInventory.forEach((item: any) => {
            const createdAt = new Date(item.createdAt || item.lastUpdated || Date.now())
            stockEntries.push({
              _id: `${item._id}_initial`,
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              quantityAdded: item.quantity, // Initial quantity added
              availableStock: item.quantity - (item.invoicedQuantity || 0),
              price: item.price,
              updateDate: createdAt,
              notes: item.notes || 'Initial product assignment',
              updateType: 'initial'
            })
          })
        }
        
        // Add entries from retop-up history
        if (historyData.success && Array.isArray(historyData.data)) {
          historyData.data.forEach((historyEntry: any) => {
            if (historyEntry.products && Array.isArray(historyEntry.products)) {
              historyEntry.products.forEach((product: any) => {
                const historyDate = new Date(historyEntry.date || historyEntry.createdAt || Date.now())
                stockEntries.push({
                  _id: `${historyEntry._id}_${product.productId}_${historyDate.getTime()}`,
                  productId: product.productId,
                  productName: product.productName,
                  quantity: product.newQuantity,
                  quantityAdded: product.quantityAdded,
                  availableStock: product.newQuantity, // At the time of this update
                  price: product.price,
                  updateDate: historyDate,
                  notes: historyEntry.notes || `Re-topped up with ${product.quantityAdded} units`,
                  updateType: 'retopup'
                })
              })
            }
          })
        }
        
        // Sort by date (newest first), then by product name
        const sortedEntries = stockEntries.sort((a: any, b: any) => {
          const dateA = new Date(a.updateDate).getTime()
          const dateB = new Date(b.updateDate).getTime()
          if (dateB !== dateA) {
            return dateB - dateA // Newest first
          }
          // If same date, sort by product name
          return (a.productName || '').localeCompare(b.productName || '')
        })
        
        // Only update state if we have data or explicitly want to clear it
        setStockInventory(sortedEntries)
      } catch (stockError) {
        console.error('Error fetching stock inventory:', stockError)
        // Don't clear existing stock inventory on error - keep what we have
      }
      } catch (error) {
        console.error('Error fetching submissions:', error)
      } finally {
        setLoading(false)
      setRefreshing(false)
      }
    }

  useEffect(() => {
    fetchSubmissions()
    
    // Auto-refresh every 30 seconds to sync with admin changes
    const interval = setInterval(() => {
      fetchSubmissions()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'request':
      case 'requested':
        return 'bg-orange-100 text-orange-800'
      case 'requested re-quote':
      case 'requested requote':
        return 'bg-purple-100 text-purple-800'
      case 'received re-quote':
      case 'received requote':
        return 'bg-indigo-100 text-indigo-800'
      case 'confirmed':
      case 'viewed':
      case 'quoted':
      case 'accepted':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
      case 'responded':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
      case 'order placed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
      case 'rejected':
      case 'closed':
        return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleViewOrder = (order: any) => {
    setViewingOrder(order)
    setIsOrderDialogOpen(true)
  }

  const handleViewQuotation = (quotation: any) => {
    setViewingQuotation(quotation)
    setIsQuotationDialogOpen(true)
  }

  const handleViewEnquiry = (enquiry: any) => {
    setViewingEnquiry(enquiry)
    setIsEnquiryDialogOpen(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r fixed left-0 top-0 z-10 h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">My Account</span>
            </div>
          </div>

          <nav className="px-4 space-y-2 pb-6">
            <Button 
              variant={activeSection === "profile" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveSection("profile")}
            >
                <User className="h-4 w-4 mr-2" />
                Profile
            </Button>
            
            <Button 
              variant={activeSection === "orders" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveSection("orders")}
            >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Orders
            </Button>
            
            <Button 
              variant={activeSection === "quotations" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveSection("quotations")}
            >
                <FileText className="h-4 w-4 mr-2" />
                Quotations
            </Button>
            
            <Button 
              variant={activeSection === "enquiries" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveSection("enquiries")}
            >
                <Mail className="h-4 w-4 mr-2" />
                Enquiries
            </Button>
            
            <Button 
              variant={activeSection === "stock" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveSection("stock")}
            >
              <Package className="h-4 w-4 mr-2" />
              Stock in Hand
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 ml-64">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex justify-between items-center">
              <Link href="/">
                <Button variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  {activeSection === "profile" && "Profile Settings"}
                  {activeSection === "orders" && "My Orders"}
                  {activeSection === "quotations" && "My Quotations"}
                  {activeSection === "enquiries" && "My Enquiries"}
                  {activeSection === "stock" && "Stock in Hand"}
                </h1>
                <p className="text-gray-600 mt-2">
                  {activeSection === "profile" && "Manage your profile information"}
                  {activeSection === "orders" && "View and track your orders"}
                  {activeSection === "quotations" && "View your quotations"}
                  {activeSection === "enquiries" && "View your enquiries"}
                  {activeSection === "stock" && "View your current stock inventory managed by admin"}
                </p>
              </div>
              <Button
                onClick={fetchSubmissions}
                disabled={refreshing}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Profile Section */}
            {activeSection === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <p className="text-gray-900">{userData?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <p className="text-gray-900">{userEmail || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <p className="text-gray-900">{userData?.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <p className="text-gray-900">
                          {userData?.address || userData?.city || userData?.state 
                            ? `${userData?.address || ''} ${userData?.city || ''} ${userData?.state || ''}`.trim() || 'N/A'
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Orders Section */}
            {activeSection === "orders" && (
              <Card>
                <CardHeader>
                  <CardTitle>My Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">Loading...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No orders found</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Orders will appear here when your quotations are accepted by admin
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order No.</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order._id}>
                              <TableCell className="font-medium">{order.orderNo || 'N/A'}</TableCell>
                              <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                              <TableCell className="font-semibold">₹{order.totalAmount?.toLocaleString() || '0'}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{order.items?.length || 0} items</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewOrder(order)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quotations Section */}
            {activeSection === "quotations" && (
              <Card>
                <CardHeader>
                  <CardTitle>My Quotations</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">Loading...</p>
                    </div>
                  ) : quotations.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No quotations found</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Quotations will appear here when admin converts your enquiries to quotations
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Quotation No.</TableHead>
                            <TableHead>Items Requested</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {quotations.map((quote) => (
                            <TableRow key={quote._id}>
                              <TableCell className="font-medium">{quote.quotationNo || 'N/A'}</TableCell>
                              <TableCell className="font-medium">
                                {quote.items && quote.items.length > 0 
                                  ? `${quote.items.length} item(s)` 
                                  : 'N/A'}
                              </TableCell>
                              <TableCell className="font-semibold">
                                ₹{quote.totalAmount ? quote.totalAmount.toLocaleString() : '0'}
                              </TableCell>
                              <TableCell>{new Date(quote.quotationDate).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(quote.status)}>
                                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/user-quotation?id=${quote._id}`)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Enquiries Section */}
            {activeSection === "enquiries" && (
              <Card>
                <CardHeader>
                  <CardTitle>My Enquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">Loading...</p>
                    </div>
                  ) : enquiries.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No enquiries found</p>
                      <p className="text-sm text-gray-500 mt-2">
                        You haven't submitted any enquiries for products or services yet
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {enquiries.map((enquiry) => (
                            <TableRow key={enquiry._id}>
                              <TableCell className="font-medium">{enquiry.itemName}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {enquiry.itemType}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(enquiry.enquiryDate).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(enquiry.status)}>
                                  {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewEnquiry(enquiry)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Stock in Hand Section */}
            {activeSection === "stock" && (
              <Card>
                <CardHeader>
                  <CardTitle>Stock in Hand</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">Loading...</p>
                    </div>
                  ) : stockInventory.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No stock inventory found</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Stock inventory will appear here when admin assigns products to you
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Quantity Added</TableHead>
                            <TableHead>Total Quantity</TableHead>
                            <TableHead>Available Stock</TableHead>
                            <TableHead>Price (₹)</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stockInventory.map((item) => {
                            const updateDate = item.updateDate || item.lastUpdated || item.updatedAt || item.createdAt
                            const availableStock = item.availableStock !== undefined 
                              ? item.availableStock 
                              : (item.quantity - (item.invoicedQuantity || 0))
                            return (
                              <TableRow key={item._id}>
                                <TableCell className="font-medium">{item.productName}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    +{item.quantityAdded || item.quantity}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-semibold">{item.quantity}</TableCell>
                                <TableCell>
                                  <Badge className={availableStock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                    {availableStock}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-semibold">₹{item.price?.toLocaleString() || '0'}</TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    {new Date(updateDate).toLocaleString('en-IN', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true
                                    })}
                                  </div>
                                </TableCell>
                                <TableCell className="max-w-xs">
                                  <p className="text-sm text-gray-600" title={item.notes || 'No notes'}>
                                    {item.notes || '-'}
                                  </p>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
        </div>
      </main>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {viewingOrder?.orderNo || 'N/A'}</DialogTitle>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Order Date</p>
                  <p className="text-sm">{new Date(viewingOrder.orderDate).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className={getStatusColor(viewingOrder.status)}>
                    {viewingOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-sm font-semibold">₹{viewingOrder.totalAmount?.toLocaleString() || '0'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer Name</p>
                  <p className="text-sm">{viewingOrder.customerName || viewingOrder.shippingAddress?.receiverName || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Items</p>
                <div className="space-y-2">
                  {viewingOrder.items?.map((item: any, index: number) => (
                    <div key={index} className="border p-3 rounded">
                      <p className="font-medium">{item.productName || item.itemName}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity} × ₹{item.price?.toLocaleString() || '0'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {viewingOrder.shippingAddress && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Shipping Address</p>
                  <p className="text-sm">
                    {viewingOrder.shippingAddress.street && `${viewingOrder.shippingAddress.street}, `}
                    {viewingOrder.shippingAddress.city && `${viewingOrder.shippingAddress.city}, `}
                    {viewingOrder.shippingAddress.state && `${viewingOrder.shippingAddress.state} `}
                    {viewingOrder.shippingAddress.zipCode && `${viewingOrder.shippingAddress.zipCode}`}
                  </p>
                </div>
              )}

              {viewingOrder.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Notes</p>
                  <p className="text-sm">{viewingOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quotation Details Dialog */}
      <Dialog open={isQuotationDialogOpen} onOpenChange={setIsQuotationDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quotation Details - {viewingQuotation?.quotationNo || 'N/A'}</DialogTitle>
          </DialogHeader>
          {viewingQuotation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Quotation Date</p>
                  <p className="text-sm">{new Date(viewingQuotation.quotationDate).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className={getStatusColor(viewingQuotation.status)}>
                    {viewingQuotation.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-sm font-semibold">₹{viewingQuotation.totalAmount?.toLocaleString() || '0'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer Name</p>
                  <p className="text-sm">{viewingQuotation.userName || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Items</p>
                <div className="space-y-2">
                  {viewingQuotation.items?.map((item: any, index: number) => (
                    <div key={index} className="border p-3 rounded">
                      <p className="font-medium">{item.itemName || item.productName}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity} × ₹{item.price?.toLocaleString() || '0'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {viewingQuotation.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                  <p className="text-sm">{viewingQuotation.description}</p>
                </div>
              )}

              {viewingQuotation.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Notes</p>
                  <p className="text-sm">{viewingQuotation.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Enquiry Details Dialog */}
      <Dialog open={isEnquiryDialogOpen} onOpenChange={setIsEnquiryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
          </DialogHeader>
          {viewingEnquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Item Name</p>
                  <p className="text-sm font-medium">{viewingEnquiry.itemName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <Badge variant="outline" className="capitalize">
                    {viewingEnquiry.itemType}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Enquiry Date</p>
                  <p className="text-sm">{new Date(viewingEnquiry.enquiryDate).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className={getStatusColor(viewingEnquiry.status)}>
                    {viewingEnquiry.status}
                  </Badge>
                </div>
              </div>
              
              {viewingEnquiry.message && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Message</p>
                  <p className="text-sm">{viewingEnquiry.message}</p>
                </div>
              )}

              {viewingEnquiry.responseNotes && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Admin Response</p>
                  <p className="text-sm">{viewingEnquiry.responseNotes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
