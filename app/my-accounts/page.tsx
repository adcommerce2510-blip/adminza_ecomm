"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, ShoppingCart, FileText, Mail, Calendar, DollarSign, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function MyAccountsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [orders, setOrders] = useState<any[]>([])
  const [quotations, setQuotations] = useState<any[]>([])
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const fetchUserData = () => {
      const user = localStorage.getItem("user")
      if (user) {
        const userData = JSON.parse(user)
        setUserEmail(userData.email)
      }
    }

    const fetchSubmissions = async () => {
      try {
        setLoading(true)
        const user = localStorage.getItem("user")
        if (!user) return

        const userData = JSON.parse(user)
        const email = userData.email

        // Fetch orders
        const ordersRes = await fetch(`/api/orders?email=${encodeURIComponent(email)}`)
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json()
          setOrders(ordersData.success ? ordersData.data : [])
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
      } catch (error) {
        console.error('Error fetching submissions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
    fetchSubmissions()
  }, [])

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
      case 'viewed':
      case 'quoted':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
      case 'responded':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
      case 'rejected':
      case 'closed':
        return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-gray-600 mt-2">Manage your profile, orders, quotations, and enquiries</p>
          </div>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-4xl grid-cols-4 mb-8">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="quotations" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Quotations
              </TabsTrigger>
              <TabsTrigger value="enquiries" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Enquiries
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings Tab */}
            <TabsContent value="profile" className="space-y-6">
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
                        <p className="text-gray-900">Rush</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <p className="text-gray-900">kick@gmail.com</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <p className="text-gray-900">+91 98765 43210</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <p className="text-gray-900">123 Main Street, City, State 12345</p>
                      </div>
                    </div>
                    <div className="text-center pt-6">
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
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
                        You haven't placed any orders yet
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Items</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order._id}>
                              <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                              <TableCell className="font-semibold">₹{order.totalAmount?.toLocaleString() || '0'}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{order.items?.length || 0} items</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Quotations Tab */}
            <TabsContent value="quotations" className="space-y-6">
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
                        You haven't submitted any quotation requests yet
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Items Requested</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {quotations.map((quote) => (
                            <TableRow key={quote._id}>
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
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enquiries Tab */}
            <TabsContent value="enquiries" className="space-y-6">
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
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
