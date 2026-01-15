"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useSearchParams, useRouter } from "next/navigation"
import { useDashboardLogout } from "@/components/dashboard-auth"
import { RetopUpModal } from "@/components/retop-up-modal"
import * as XLSX from 'xlsx'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Plus,
  Upload,
  Package,
  Settings,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Image as ImageIcon,
  FileText,
  DollarSign,
  Tag,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  Building,
  Star,
  TrendingUp,
  ShoppingCart,
  Users,
  BarChart3,
  ChevronDown,
  MoreVertical,
  Lock,
  LogOut,
  X,
  ArrowRight,
  ArrowLeft,
  Copy,
  RefreshCw,
  CheckCircle2 as CheckCircle,
  Clock,
  UserCircle
} from "lucide-react"

// API functions
const fetchProducts = async () => {
  const response = await fetch('/api/products')
  const data = await response.json()
  return data.success ? data.data : []
}

const fetchServices = async () => {
  const response = await fetch('/api/services')
  const data = await response.json()
  return data.success ? data.data : []
}

const createProduct = async (productData: any) => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })
  const data = await response.json()
  return data
}

const createService = async (serviceData: any) => {
  const response = await fetch('/api/services', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  })
  const data = await response.json()
  return data
}

const uploadFile = async (file: File, folder: string = 'batches') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })
  return await response.json()
}

const deleteProduct = async (id: string) => {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  })
  const data = await response.json()
  return data
}

const deleteService = async (id: string) => {
  const response = await fetch(`/api/services/${id}`, {
    method: 'DELETE',
  })
  const data = await response.json()
  return data
}

const updateProduct = async (id: string, productData: any) => {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })
  const data = await response.json()
  return data
}

const updateService = async (id: string, serviceData: any) => {
  const response = await fetch(`/api/services/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  })
  const data = await response.json()
  return data
}

const fetchOrders = async () => {
  const response = await fetch('/api/orders')
  const data = await response.json()
  return data.success ? data.data : []
}

const fetchQuotations = async () => {
  const response = await fetch('/api/quotations')
  const data = await response.json()
  return data.success ? data.data : []
}

const fetchEnquiries = async () => {
  const response = await fetch('/api/enquiries')
  const data = await response.json()
  return data.success ? data.data : []
}

const fetchInvoices = async () => {
  const response = await fetch('/api/invoices')
  const data = await response.json()
  return data.success ? data.data : []
}

const fetchCategories = async () => {
  const response = await fetch('/api/categories')
  const data = await response.json()
  return data.success ? data.data : []
}

const fetchSubCategories = async () => {
  const response = await fetch('/api/sub-categories')
  const data = await response.json()
  return data.success ? data.data : []
}

const fetchLevel2Categories = async () => {
  const response = await fetch('/api/level2-categories')
  const data = await response.json()
  return data.success ? data.data : []
}

const fetchEshopInventory = async () => {
  const response = await fetch('/api/eshop-inventory')
  const data = await response.json()
  return data.success ? data.data : []
}

const fetchCustomers = async () => {
  const response = await fetch('/api/customers')
  const data = await response.json()
  return data.success ? data.data : []
}

const fetchPurchaseOrders = async () => {
  const response = await fetch('/api/purchase-orders')
  const data = await response.json()
  return data.success ? data.data : []
}

const fetchWarehouseStock = async () => {
  const response = await fetch('/api/warehouse-stock')
  const data = await response.json()
  return data.success ? data.data : []
}

const fetchWasteEntries = async () => {
  const response = await fetch('/api/waste')
  const data = await response.json()
  return data.success ? data.data : []
}

const fetchOutwardEntries = async () => {
  const response = await fetch('/api/outwards')
  const data = await response.json()
  return data.success ? data.data : []
}

const fetchRelatedOutwards = async (referenceNumber: string, customerId: string, outwardDate: Date) => {
  if (!referenceNumber) return []
  try {
    const response = await fetch(`/api/outwards?referenceNumber=${encodeURIComponent(referenceNumber)}&customerId=${customerId}`)
    const data = await response.json()
    if (data.success) {
      // Filter by same date (within same day)
      const sameDate = new Date(outwardDate).toDateString()
      return data.data.filter((entry: any) => {
        const entryDate = new Date(entry.outwardDate || entry.createdAt).toDateString()
        return entryDate === sameDate
      })
    }
    return []
  } catch (error) {
    console.error('Error fetching related outwards:', error)
    return []
  }
}

const fetchInwardEntries = async () => {
  const response = await fetch('/api/inward')
  const data = await response.json()
  return data.success ? data.data : []
}

const updateEshopInventory = async (id: string, inventoryData: any) => {
  const response = await fetch(`/api/eshop-inventory/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inventoryData),
  })
  const data = await response.json()
  return data
}

const mainCategories = [
  { value: "product", label: "Product" },
  { value: "service", label: "Service" }
]

// Helper functions for Reports
const getGrandTotalFromInvoice = (inv: any): number => {
  if (!inv) return 0
  
  // Calculate grand total from invoice data
  const subtotal = inv.subtotal || 0
  const gstRate = inv.gstRate || 18
  const gstType = inv.gstType || 'CGST/SGST'
  
  let tax = 0
  if (gstType === 'IGST') {
    tax = subtotal * (gstRate / 100)
  } else {
    tax = subtotal * (gstRate / 100) // CGST + SGST = total GST
  }
  
  const additionalChargesTotal = (inv.additionalCharges || []).reduce((sum: number, charge: any) => sum + (charge.amount || 0), 0)
  const grandTotal = subtotal + tax + additionalChargesTotal
  
  return grandTotal || inv.total || 0
}

const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null
  
  try {
    // Try ISO format first
    if (dateString.includes('T') || dateString.includes('Z')) {
      return new Date(dateString)
    }
    
    // Try DD/MM/YYYY
    if (dateString.includes('/')) {
      const parts = dateString.split('/')
      if (parts.length === 3) {
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
      }
    }
    
    // Try DD-MM-YYYY
    if (dateString.includes('-') && dateString.split('-')[0].length <= 2) {
      const parts = dateString.split('-')
      if (parts.length === 3) {
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
      }
    }
    
    // Try YYYY-MM-DD
    if (dateString.includes('-')) {
      const parts = dateString.split('-')
      if (parts.length === 3 && parts[0].length === 4) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
      }
    }
    
    // Fallback to standard Date parsing
    return new Date(dateString)
  } catch (error) {
    console.error('Error parsing date:', dateString, error)
    return null
  }
}

const parseDateForMonth = (dateString: string): Date | null => {
  return parseDate(dateString)
}

// Invoice Reports Section Component
const InvoiceReportsSection = ({
  invoices,
  startDate,
  endDate,
  selectedCustomer,
  onStartDateChange,
  onEndDateChange,
  onCustomerChange,
  generatingReport,
  onGenerateReport
}: {
  invoices: any[]
  startDate: string
  endDate: string
  selectedCustomer: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onCustomerChange: (customer: string) => void
  generatingReport: boolean
  onGenerateReport: (generating: boolean) => void
}) => {
  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    let dateMatch = true
    if (startDate && endDate) {
      const invoiceDate = parseDate(inv.invoiceDate || inv.createdAt)
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // Include entire end date
      if (invoiceDate) {
        dateMatch = invoiceDate >= start && invoiceDate <= end
      }
    }
    
    const customerMatch = !selectedCustomer || inv.customerName === selectedCustomer
    
    return dateMatch && customerMatch
  })

  // Get unique customers
  const uniqueCustomers = Array.from(new Set(invoices.map(inv => inv.customerName).filter(Boolean))).sort()

  // Statistics
  const totalInvoices = invoices.length
  const totalRevenue = invoices.reduce((sum, inv) => sum + getGrandTotalFromInvoice(inv), 0)
  
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  const thisMonthInvoices = invoices.filter((inv) => {
    const invoiceDate = parseDateForMonth(inv.invoiceDate || inv.createdAt)
    if (!invoiceDate) return false
    return invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear
  })
  
  const thisMonthRevenue = thisMonthInvoices.reduce((sum, inv) => sum + getGrandTotalFromInvoice(inv), 0)
  
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
  
  const lastMonthInvoices = invoices.filter((inv) => {
    const invoiceDate = parseDateForMonth(inv.invoiceDate || inv.createdAt)
    if (!invoiceDate) return false
    return invoiceDate.getMonth() === lastMonth && invoiceDate.getFullYear() === lastMonthYear
  })
  
  const lastMonthRevenue = lastMonthInvoices.reduce((sum, inv) => sum + getGrandTotalFromInvoice(inv), 0)

  // Generate Excel Report
  const generateExcelReport = () => {
    if (!startDate && !endDate && !selectedCustomer) {
      alert('Please apply at least one filter (date range or customer) before generating a report.')
      return
    }

    if (filteredInvoices.length === 0) {
      alert('No invoices found matching the selected filters.')
      return
    }

    onGenerateReport(true)

    try {
      // Prepare data for Excel
      const excelData = filteredInvoices.map((inv, index) => {
        const grandTotal = getGrandTotalFromInvoice(inv)
        const cgst = inv.gstType === 'IGST' ? 0 : (inv.subtotal || 0) * ((inv.gstRate || 18) / 200)
        const sgst = inv.gstType === 'IGST' ? 0 : (inv.subtotal || 0) * ((inv.gstRate || 18) / 200)
        const additionalChargesTotal = (inv.additionalCharges || []).reduce((sum: number, charge: any) => sum + (charge.amount || 0), 0)
        
        return {
          'SR. NO': index + 1,
          'INVOICE NO': inv.invoiceNo || 'N/A',
          'CUSTOMER NAME': inv.customerName || 'N/A',
          'CUSTOMER EMAIL': inv.customerEmail || 'N/A',
          'CUSTOMER PHONE': inv.customerPhone || 'N/A',
          'CUSTOMER ADDRESS': inv.customerAddress || 'N/A',
          'CUSTOMER CITY': inv.customerCity || 'N/A',
          'CUSTOMER STATE': inv.customerState || 'N/A',
          'CUSTOMER ZIP CODE': inv.customerZipCode || 'N/A',
          'CUSTOMER GST': inv.customerGstNumber || 'N/A',
          'INVOICE DATE': inv.invoiceDate || 'N/A',
          'SUBTOTAL': (inv.subtotal || 0).toFixed(2),
          'CGST': cgst.toFixed(2),
          'SGST': sgst.toFixed(2),
          'ADDITIONAL CHARGES': additionalChargesTotal.toFixed(2),
          'GRAND TOTAL': grandTotal.toFixed(2),
          'ITEMS COUNT': (inv.items || []).length,
          'TOTAL QUANTITY': (inv.items || []).reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
        }
      })

      // Create workbook
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Set column widths
      const colWidths = [
        { wch: 8 },   // SR. NO
        { wch: 18 },  // INVOICE NO
        { wch: 25 },  // CUSTOMER NAME
        { wch: 25 },  // CUSTOMER EMAIL
        { wch: 15 },  // CUSTOMER PHONE
        { wch: 30 },  // CUSTOMER ADDRESS
        { wch: 15 },  // CUSTOMER CITY
        { wch: 15 },  // CUSTOMER STATE
        { wch: 12 },  // CUSTOMER ZIP CODE
        { wch: 18 },  // CUSTOMER GST
        { wch: 15 },  // INVOICE DATE
        { wch: 14 },  // SUBTOTAL
        { wch: 12 },  // CGST
        { wch: 12 },  // SGST
        { wch: 18 },  // ADDITIONAL CHARGES
        { wch: 14 },  // GRAND TOTAL
        { wch: 12 },  // ITEMS COUNT
        { wch: 14 }   // TOTAL QUANTITY
      ]
      ws['!cols'] = colWidths

      XLSX.utils.book_append_sheet(wb, ws, 'Invoice Report')

      // Generate filename
      let filename = 'Invoice_Report'
      if (startDate && endDate) {
        const start = new Date(startDate).toLocaleDateString('en-GB').replace(/\//g, '-')
        const end = new Date(endDate).toLocaleDateString('en-GB').replace(/\//g, '-')
        filename += `_${start}_to_${end}`
      }
      if (selectedCustomer) {
        filename += `_${selectedCustomer.replace(/[^a-zA-Z0-9]/g, '_')}`
      }
      if (!startDate && !endDate && selectedCustomer) {
        filename += '_AllDates'
      }
      filename += '.xlsx'

      // Download
      XLSX.writeFile(wb, filename)
      onGenerateReport(false)
    } catch (error) {
      console.error('Error generating Excel report:', error)
      alert('Error generating report. Please try again.')
      onGenerateReport(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-bold">{totalInvoices}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month Invoices</p>
                <p className="text-2xl font-bold">{thisMonthInvoices.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Month Invoices</p>
                <p className="text-2xl font-bold">{lastMonthInvoices.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">₹{thisMonthRevenue.toLocaleString('en-IN')}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="customer-select">Customer</Label>
              <Select value={selectedCustomer || "all"} onValueChange={(value) => onCustomerChange(value === "all" ? "" : value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All Customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {uniqueCustomers.map((customer) => (
                    <SelectItem key={customer} value={customer}>
                      {customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredInvoices.length} invoice(s)
              {(startDate || endDate || selectedCustomer) && (
                <span className="ml-2">
                  (Filtered: {startDate && endDate && `Date: ${startDate} to ${endDate}`}
                  {selectedCustomer && `, Customer: ${selectedCustomer}`})
                </span>
              )}
            </div>
            <Button
              onClick={generateExcelReport}
              disabled={generatingReport || (!startDate && !endDate && !selectedCustomer)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {generatingReport ? 'Generating...' : 'Generate Report'}
              <Download className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All Invoices Table */}
      <Card className="border-orange-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Invoices</CardTitle>
            <div className="text-sm text-muted-foreground">
              {filteredInvoices.length} of {invoices.length} invoice(s)
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SR. NO</TableHead>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Items Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No invoices found</p>
                        <p className="text-sm">
                          {invoices.length === 0 
                            ? 'Generated invoices will appear here'
                            : 'No invoices match the selected filters'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((inv, index) => {
                    const grandTotal = getGrandTotalFromInvoice(inv)
                    const itemsCount = (inv.items || []).length
                    
                    return (
                      <TableRow key={inv._id} className="hover:bg-orange-50">
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{inv.invoiceNo || 'N/A'}</TableCell>
                        <TableCell>{inv.customerName || 'N/A'}</TableCell>
                        <TableCell>
                          {inv.invoiceDate 
                            ? new Date(inv.invoiceDate).toLocaleDateString('en-IN')
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="font-semibold">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{itemsCount}</TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function DashboardPage() {
  const [products, setProducts] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false)
  const [isViewProductDialogOpen, setIsViewProductDialogOpen] = useState(false)
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false)
  const [isViewServiceDialogOpen, setIsViewServiceDialogOpen] = useState(false)
  const [viewingProduct, setViewingProduct] = useState<any>(null)
  const [viewingService, setViewingService] = useState<any>(null)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editingService, setEditingService] = useState<any>(null)
  const [viewProductPage, setViewProductPage] = useState(1)
  const [editProductPage, setEditProductPage] = useState(1)
  const [viewServicePage, setViewServicePage] = useState(1)
  const [editServicePage, setEditServicePage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadingExcel, setUploadingExcel] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const excelFileInputRef = useRef<HTMLInputElement>(null)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [activeSubSection, setActiveSubSection] = useState("all-items")
  const [isProductsManagementExpanded, setIsProductsManagementExpanded] = useState(false)
  const [isCustomerManagementExpanded, setIsCustomerManagementExpanded] = useState(false)
  const [isOrdersExpanded, setIsOrdersExpanded] = useState(false)
  const [isReportsExpanded, setIsReportsExpanded] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    mainUse: "",
    description: ""
  })
  const [subCategories, setSubCategories] = useState<any[]>([])
  const [isSubCategoryDialogOpen, setIsSubCategoryDialogOpen] = useState(false)
  const [subCategoryForm, setSubCategoryForm] = useState({
    name: "",
    mainCategory: "",
    mainUse: "",
    description: ""
  })
  const [level2Categories, setLevel2Categories] = useState<any[]>([])
  const [isLevel2CategoryDialogOpen, setIsLevel2CategoryDialogOpen] = useState(false)
  const [level2CategoryForm, setLevel2CategoryForm] = useState({
    name: "",
    mainCategory: "",
    subCategory: "",
    mainUse: "",
    description: ""
  })
  const [categoriesPage, setCategoriesPage] = useState(1)
  const [subCategoriesPage, setSubCategoriesPage] = useState(1)
  const [level2CategoriesPage, setLevel2CategoriesPage] = useState(1)
  const categoriesPerPage = 5
  const subCategoriesPerPage = 5
  const level2CategoriesPerPage = 5
  const [productsPage, setProductsPage] = useState(1)
  const [servicesPage, setServicesPage] = useState(1)
  const [allItemsPage, setAllItemsPage] = useState(1)
  const productsPerPage = 5
  const servicesPerPage = 5
  const allItemsPerPage = 5
  const [customers, setCustomers] = useState<any[]>([])
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<any>(null)
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  })
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  const [blockCustomerPage, setBlockCustomerPage] = useState(1)
  const [editCustomerPage, setEditCustomerPage] = useState(1)
  const [supplierPage, setSupplierPage] = useState(1)
  const blockCustomerPerPage = 5
  const editCustomerPerPage = 5
  const supplierPerPage = 5
  const [eshopInventory, setEshopInventory] = useState<any[]>([])
  const [isEshopDialogOpen, setIsEshopDialogOpen] = useState(false)
  const [editingEshopItem, setEditingEshopItem] = useState<any>(null)
  const [eshopForm, setEshopForm] = useState({
    productId: "",
    productName: "",
    customerId: "",
    customerName: "",
    quantity: "",
    price: 0,
    notes: "",
    deliveryType: "from_warehouse" as "from_warehouse" | "direct_from_supplier",
    supplierName: ""
  })
  const [multipleProducts, setMultipleProducts] = useState<any[]>([{
    productId: "",
    productName: "",
    quantity: 1,
    price: 0,
    notes: ""
  }])
  const [eshopSearchTerm, setEshopSearchTerm] = useState("")
  const [isRetopUpDialogOpen, setIsRetopUpDialogOpen] = useState(false)
  const [retopUpItem, setRetopUpItem] = useState<any>(null)
  const [retopUpQuantity, setRetopUpQuantity] = useState("")
  const [customerProductsForRetopUp, setCustomerProductsForRetopUp] = useState<any[]>([])
  const [retopUpCustomerId, setRetopUpCustomerId] = useState<string>("")
  const [retopUpCustomerName, setRetopUpCustomerName] = useState<string>("")
  const [retopUpNotes, setRetopUpNotes] = useState<string>("")
  const [retopUpPage, setRetopUpPage] = useState(1)
  const retopUpPerPage = 4
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)
  const [addProductDialogPage, setAddProductDialogPage] = useState(1)
  const addProductDialogPerPage = 3
  const [customerProductsPage, setCustomerProductsPage] = useState<Record<string, number>>({})
  const customerProductsPerPage = 5
  const [isEditInventoryDialogOpen, setIsEditInventoryDialogOpen] = useState(false)
  const [editingInventoryItem, setEditingInventoryItem] = useState<any>(null)
  const [editInventoryForm, setEditInventoryForm] = useState({
    productName: "",
    quantity: "",
    price: ""
  })
  const [isRecordUsageDialogOpen, setIsRecordUsageDialogOpen] = useState(false)
  const [recordUsageItem, setRecordUsageItem] = useState<any>(null)
  const [usedQuantity, setUsedQuantity] = useState("")
  const [orders, setOrders] = useState<any[]>([])
  const [orderSearchTerm, setOrderSearchTerm] = useState("")
  const [currentOrderPage, setCurrentOrderPage] = useState(1)
  const ordersPerPage = 5
  const [isViewOrderDialogOpen, setIsViewOrderDialogOpen] = useState(false)
  const [viewingOrder, setViewingOrder] = useState<any>(null)
  const [quotations, setQuotations] = useState<any[]>([])
  const [quotationSearchTerm, setQuotationSearchTerm] = useState("")
  const [currentQuotationPage, setCurrentQuotationPage] = useState(1)
  const quotationsPerPage = 5
  const [isViewQuotationDialogOpen, setIsViewQuotationDialogOpen] = useState(false)
  const [viewingQuotation, setViewingQuotation] = useState<any>(null)
  const [isEditQuotationDialogOpen, setIsEditQuotationDialogOpen] = useState(false)
  const [editingQuotation, setEditingQuotation] = useState<any>(null)
  const [isRequoteMessageDialogOpen, setIsRequoteMessageDialogOpen] = useState(false)
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [enquirySearchTerm, setEnquirySearchTerm] = useState("")
  const [currentEnquiryPage, setCurrentEnquiryPage] = useState(1)
  const enquiriesPerPage = 5
  const [isViewEnquiryDialogOpen, setIsViewEnquiryDialogOpen] = useState(false)
  const [viewingEnquiry, setViewingEnquiry] = useState<any>(null)
  const [isEditEnquiryDialogOpen, setIsEditEnquiryDialogOpen] = useState(false)
  const [editingEnquiry, setEditingEnquiry] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [invoiceStartDate, setInvoiceStartDate] = useState("")
  const [invoiceEndDate, setInvoiceEndDate] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [generatingReport, setGeneratingReport] = useState(false)
  const [isViewProductDetailsDialogOpen, setIsViewProductDetailsDialogOpen] = useState(false)
  const [viewingProductDetails, setViewingProductDetails] = useState<any>(null)
  const viewProductModalRef = useRef<HTMLDivElement>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [openOrderDropdownId, setOpenOrderDropdownId] = useState<string | null>(null)
  const [isEditOrderDialogOpen, setIsEditOrderDialogOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<any>(null)
  const [orderEditForm, setOrderEditForm] = useState({
    customerName: "",
    customerPhone: "",
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    },
    totalAmount: 0,
    status: "",
    items: [] as any[]
  })
  const [isEditMode, setIsEditMode] = useState(false)
  const [editForm, setEditForm] = useState({
    quantity: "",
    price: 0,
    notes: ""
  })
  const [customerProducts, setCustomerProducts] = useState<any[]>([])
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null)
  const [isRetopUpMode, setIsRetopUpMode] = useState(false)
  const [currentCustomerPage, setCurrentCustomerPage] = useState(1)
  const customersPerPage = 5
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  // Edit inventory item dialog state (My Customers)
  const [isEshopEditOpen, setIsEshopEditOpen] = useState(false)
  const [eshopEditForm, setEshopEditForm] = useState<{ id: string; productName: string; quantity: number; price: number; notes?: string }>({ id: "", productName: "", quantity: 1, price: 0, notes: "" })

  // Inventory Management States
  const [isInventoryManagementExpanded, setIsInventoryManagementExpanded] = useState(false)
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])
  const [currentPOPage, setCurrentPOPage] = useState(1)
  const poPerPage = 5
  const [warehouseStock, setWarehouseStock] = useState<any[]>([])
  const [currentWarehouseStockPage, setCurrentWarehouseStockPage] = useState(1)
  const warehouseStockPerPage = 5
  const [wasteEntries, setWasteEntries] = useState<any[]>([])
  const [outwardEntries, setOutwardEntries] = useState<any[]>([])
  const [isOutwardDialogOpen, setIsOutwardDialogOpen] = useState(false)
  const [outwardForm, setOutwardForm] = useState({
    customerId: "",
    customerName: "",
    warehouseName: "Main Warehouse",
    referenceNumber: "",
    notes: "",
    outwardDate: new Date().toISOString().split('T')[0],
    items: [] as Array<{
      productId: string
      productName: string
      quantity: number
      unitPrice: number
      outwardType: "offline_direct" | "sample" | "return_replacement"
      totalAmount: number
    }>
  })
  const [outwardFormPage, setOutwardFormPage] = useState(1)
  const [expandedProductIndex, setExpandedProductIndex] = useState<number | null>(null)
  const [currentOutwardPage, setCurrentOutwardPage] = useState(1)
  const outwardPerPage = 5
  const [currentWastePage, setCurrentWastePage] = useState(1)
  const wastePerPage = 5
  const [isViewOutwardDialogOpen, setIsViewOutwardDialogOpen] = useState(false)
  const [viewingOutward, setViewingOutward] = useState<any>(null)
  const [relatedOutwards, setRelatedOutwards] = useState<any[]>([])
  const [viewOutwardDialogPage, setViewOutwardDialogPage] = useState(1)
  const [isConvertSampleDialogOpen, setIsConvertSampleDialogOpen] = useState(false)
  const [convertingOutward, setConvertingOutward] = useState<any>(null)
  const [convertForm, setConvertForm] = useState({
    unitPrice: "",
    notes: ""
  })
  const [isViewStockDialogOpen, setIsViewStockDialogOpen] = useState(false)
  const [viewingStock, setViewingStock] = useState<any>(null)
  const [viewStockDialogPage, setViewStockDialogPage] = useState(1)
  const [isPODialogOpen, setIsPODialogOpen] = useState(false)
  const [isGRNDialogOpen, setIsGRNDialogOpen] = useState(false)
  const [isWasteDialogOpen, setIsWasteDialogOpen] = useState(false)
  const [isViewPODialogOpen, setIsViewPODialogOpen] = useState(false)
  const [viewingPO, setViewingPO] = useState<any>(null)
  const [poForm, setPOForm] = useState({
    supplierName: "",
    items: [] as any[],
    deliveryType: "to_warehouse" as "to_warehouse" | "direct_to_customer",
    poType: "standard" as "standard" | "reference",
    customerId: "",
    customerName: "",
    expectedDate: "",
    notes: ""
  })
  const [grnForm, setGRNForm] = useState({
    poNumber: "",
    receivedQuantity: "",
    warehouseName: "Main Warehouse",
    grnType: "GRN_CREATED" as "GRN_CREATED" | "DIRECT_GRN",
    supplierName: "",
    location: {},
    notes: "",
    items: [] as Array<{
      productId: string
      productName: string
      orderedQuantity: number
      receivedQuantity: number
      damagedQuantity: number
      lostQuantity: number
      unitPrice: number
    }>
  })
  const [isDirectGRN, setIsDirectGRN] = useState(false)
  const [isGRNTypeDialogOpen, setIsGRNTypeDialogOpen] = useState(false)
  const [wasteForm, setWasteForm] = useState({
    productId: "",
    productName: "",
    quantity: "",
    reason: "damaged" as "damaged" | "expired" | "lost" | "other",
    description: "",
    warehouseName: "Main Warehouse"
  })
  const [selectedPO, setSelectedPO] = useState<any>(null)
  const [inwardEntries, setInwardEntries] = useState<any[]>([])
  const [isInwardDialogOpen, setIsInwardDialogOpen] = useState(false)
  const [isViewInwardDialogOpen, setIsViewInwardDialogOpen] = useState(false)
  const [viewingInward, setViewingInward] = useState<any>(null)
  const [isEditInwardDialogOpen, setIsEditInwardDialogOpen] = useState(false)
  const [editingInward, setEditingInward] = useState<any>(null)
  const [editInwardForm, setEditInwardForm] = useState({
    supplierName: "",
    receivedDate: "",
    notes: "",
    items: [] as Array<{
      productId: string
      productName: string
      orderedQuantity: number
      receivedQuantity: number
      damagedQuantity: number
      lostQuantity: number
      acceptedQuantity: number
      unitPrice: number
    }>
  })
  const [isGenerateGRNFromInwardOpen, setIsGenerateGRNFromInwardOpen] = useState(false)
  const [selectedInward, setSelectedInward] = useState<any>(null)
  const [isSplitStock, setIsSplitStock] = useState(false)
  const [customerAllocations, setCustomerAllocations] = useState<Array<{
    customerId: string
    customerName: string
    sellingPrice: number
    itemAllocations: Array<{
      productId: string
      customerQuantity: number
    }>
  }>>([])
  const [expandedCustomerIndex, setExpandedCustomerIndex] = useState<number | null>(null)
  const [grnFormPage, setGrnFormPage] = useState(1)
  const [warehouses, setWarehouses] = useState<string[]>(["Main Warehouse", "Warehouse 2"])
  const [isAddingWarehouse, setIsAddingWarehouse] = useState(false)
  const [newWarehouseName, setNewWarehouseName] = useState("")
  const [isWarehouseDropdownOpen, setIsWarehouseDropdownOpen] = useState(false)
  const [isWarehouseDropdownOpen2, setIsWarehouseDropdownOpen2] = useState(false)
  const [inwardForm, setInwardForm] = useState({
    poNumber: "",
    inwardType: "PO_LINKED" as "PO_LINKED" | "DIRECT_INWARD",
    supplierName: "",
    receivedDate: new Date().toISOString().split('T')[0],
    items: [] as Array<{
      productId: string
      productName: string
      orderedQuantity: number
      receivedQuantity: number
      damagedQuantity: number
      lostQuantity: number
      acceptedQuantity: number
      unitPrice: number
    }>,
    notes: ""
  })
  const [isDirectInward, setIsDirectInward] = useState(false)
  const [isInwardTypeDialogOpen, setIsInwardTypeDialogOpen] = useState(false)
  const [inwardFormPage, setInwardFormPage] = useState(1)

  // Supplier Management States
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<any>(null)
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    notes: "",
    isActive: true
  })

  // Use logout function from context
  const { handleLogout } = useDashboardLogout()
  const router = useRouter()

  // Handle URL parameters for section navigation
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const section = searchParams.get('section')
    const subsection = searchParams.get('subsection')
    
    if (section) {
      setActiveSection(section)
      
      // Handle specific subsections
      if (section === 'customer-management') {
        setIsCustomerManagementExpanded(true)
        if (subsection === 'my-customers') {
          setActiveSubSection('my-customers')
        }
      }
    }
  }, [searchParams])

  // Update overlay height when PO dialog is open
  useEffect(() => {
    if (isViewPODialogOpen) {
      const updateOverlayHeight = () => {
        const overlay = document.querySelector('[data-overlay="po-view"]') as HTMLElement
        if (overlay) {
          const scrollHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight,
            window.innerHeight
          )
          overlay.style.height = scrollHeight + 'px'
          overlay.style.minHeight = scrollHeight + 'px'
        }
      }
      
      // Initial update
      updateOverlayHeight()
      
      // Update on scroll and resize
      window.addEventListener('scroll', updateOverlayHeight, true)
      window.addEventListener('resize', updateOverlayHeight)
      
      // Update when content changes
      const observer = new MutationObserver(updateOverlayHeight)
      observer.observe(document.body, { childList: true, subtree: true })
      
      return () => {
        window.removeEventListener('scroll', updateOverlayHeight, true)
        window.removeEventListener('resize', updateOverlayHeight)
        observer.disconnect()
      }
    }
  }, [isViewPODialogOpen])

  // Update overlay height when GRN dialog is open
  useEffect(() => {
    if (isGRNDialogOpen) {
      const updateOverlayHeight = () => {
        const overlay = document.querySelector('[data-overlay="grn-view"]') as HTMLElement
        if (overlay) {
          const scrollHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight,
            window.innerHeight
          )
          overlay.style.height = scrollHeight + 'px'
          overlay.style.minHeight = scrollHeight + 'px'
        }
      }
      
      // Initial update
      updateOverlayHeight()
      
      // Update on scroll and resize
      window.addEventListener('scroll', updateOverlayHeight, true)
      window.addEventListener('resize', updateOverlayHeight)
      
      // Update when content changes
      const observer = new MutationObserver(updateOverlayHeight)
      observer.observe(document.body, { childList: true, subtree: true })
      
      return () => {
        window.removeEventListener('scroll', updateOverlayHeight, true)
        window.removeEventListener('resize', updateOverlayHeight)
        observer.disconnect()
      }
    }
  }, [isGRNDialogOpen])

  // Reset pagination when switching between category subsections
  useEffect(() => {
    if (activeSubSection === "categories") {
      setCategoriesPage(1)
    } else if (activeSubSection === "sub-categories") {
      setSubCategoriesPage(1)
    } else if (activeSubSection === "level2-categories") {
      setLevel2CategoriesPage(1)
    } else if (activeSubSection === "products") {
      setProductsPage(1)
    } else if (activeSubSection === "services") {
      setServicesPage(1)
    } else if (activeSubSection === "all-items") {
      setAllItemsPage(1)
    }
  }, [activeSubSection])

  // Reset pagination when search term or category filter changes
  useEffect(() => {
    if (activeSubSection === "products" || activeSubSection === "all-items") {
      setProductsPage(1)
      setAllItemsPage(1)
    }
    if (activeSubSection === "services" || activeSubSection === "all-items") {
      setServicesPage(1)
      setAllItemsPage(1)
    }
  }, [searchTerm, selectedCategory, activeSubSection])

  // Update overlay height when Re-top Up dialog is open and scroll dialog into view
  useEffect(() => {
    if (isEshopDialogOpen && editingCustomerId) {
      const updateOverlayHeight = () => {
        const overlay = document.querySelector('[data-overlay="retopup-view"]') as HTMLElement
        if (overlay) {
          const scrollHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight,
            window.innerHeight
          )
          overlay.style.height = scrollHeight + 'px'
          overlay.style.minHeight = scrollHeight + 'px'
        }
      }
      
      // Initial update
      updateOverlayHeight()
      
      // Store current scroll position
      const currentScrollPosition = window.scrollY || window.pageYOffset
      
      // Prevent body scroll while dialog is open - this keeps the viewport in place
      const originalOverflow = document.body.style.overflow
      const originalPosition = document.body.style.position
      const originalTop = document.body.style.top
      const originalWidth = document.body.style.width
      
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${currentScrollPosition}px`
      document.body.style.width = '100%'
      
      // Update on scroll and resize
      window.addEventListener('scroll', updateOverlayHeight, true)
      window.addEventListener('resize', updateOverlayHeight)
      
      // Update when content changes
      const observer = new MutationObserver(updateOverlayHeight)
      observer.observe(document.body, { childList: true, subtree: true })
      
      // Cleanup: restore scroll position and remove listeners when dialog closes
      return () => {
        // Restore original body styles
        document.body.style.overflow = originalOverflow
        document.body.style.position = originalPosition
        document.body.style.top = originalTop
        document.body.style.width = originalWidth
        
        // Restore scroll position
        window.scrollTo(0, currentScrollPosition)
        
        // Remove event listeners
        window.removeEventListener('scroll', updateOverlayHeight, true)
        window.removeEventListener('resize', updateOverlayHeight)
        observer.disconnect()
      }
    }
  }, [isEshopDialogOpen, editingCustomerId])

  // Lock page scroll when View Product Details dialog is open
  useEffect(() => {
    if (isViewProductDetailsDialogOpen) {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
      
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
      
      if (viewProductModalRef.current) {
        viewProductModalRef.current.style.position = 'fixed'
        viewProductModalRef.current.style.top = '0'
        viewProductModalRef.current.style.left = '0'
        viewProductModalRef.current.style.right = '0'
        viewProductModalRef.current.style.bottom = '0'
        viewProductModalRef.current.style.width = '100vw'
        viewProductModalRef.current.style.height = '100vh'
        viewProductModalRef.current.style.margin = '0'
        viewProductModalRef.current.style.zIndex = '9999'
      }
      
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
  }, [isViewProductDetailsDialogOpen])

  // Reset customer page when search term changes
  useEffect(() => {
    setCurrentCustomerPage(1)
  }, [customerSearchTerm])

  // Lock page scroll when View Stock dialog is open
  useEffect(() => {
    if (isViewStockDialogOpen) {
      // Store current scroll position
      const currentScrollPosition = window.scrollY || window.pageYOffset
      
      // Prevent body scroll while dialog is open
      const originalOverflow = document.body.style.overflow
      const originalPosition = document.body.style.position
      const originalTop = document.body.style.top
      const originalWidth = document.body.style.width
      
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${currentScrollPosition}px`
      document.body.style.width = '100%'
      
      // Cleanup: restore scroll position and remove listeners when dialog closes
      return () => {
        document.body.style.overflow = originalOverflow
        document.body.style.position = originalPosition
        document.body.style.top = originalTop
        document.body.style.width = originalWidth
        window.scrollTo(0, currentScrollPosition)
      }
    }
  }, [isViewStockDialogOpen])

  // Update overlay height when Waste dialog is open
  useEffect(() => {
    if (isWasteDialogOpen) {
      const updateOverlayHeight = () => {
        const overlay = document.querySelector('[data-overlay="waste-view"]') as HTMLElement
        if (overlay) {
          const scrollHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight,
            window.innerHeight
          )
          overlay.style.height = scrollHeight + 'px'
          overlay.style.minHeight = scrollHeight + 'px'
        }
      }
      
      // Initial update
      updateOverlayHeight()
      
      // Update on scroll and resize
      window.addEventListener('scroll', updateOverlayHeight, true)
      window.addEventListener('resize', updateOverlayHeight)
      
      // Update when content changes
      const observer = new MutationObserver(updateOverlayHeight)
      observer.observe(document.body, { childList: true, subtree: true })
      
      return () => {
        window.removeEventListener('scroll', updateOverlayHeight, true)
        window.removeEventListener('resize', updateOverlayHeight)
        observer.disconnect()
      }
    }
  }, [isWasteDialogOpen])

  // Get categories for products (main categories with mainUse = "product")
  const productCategories = categories
    .filter((cat: any) => cat.mainUse === "product")
    .map((cat: any) => cat.name)

  // Get categories for services (main categories with mainUse = "service")  
  const serviceCategories = categories
    .filter((cat: any) => cat.mainUse === "service")
    .map((cat: any) => cat.name)

  // Helper functions for hierarchical category selection
  const getSubCategoriesForMainCategory = (mainCategoryName: string) => {
    return subCategories
      .filter((subCat: any) => subCat.mainCategory === mainCategoryName)
      .map((subCat: any) => subCat.name)
  }

  const getLevel2CategoriesForSubCategory = (mainCategoryName: string, subCategoryName: string) => {
    return level2Categories
      .filter((level2Cat: any) => 
        level2Cat.mainCategory === mainCategoryName && 
        level2Cat.subCategory === subCategoryName
      )
      .map((level2Cat: any) => level2Cat.name)
  }

  // Form states
  const [mainCategory, setMainCategory] = useState("")
  const [productForm, setProductForm] = useState({
    name: "",
    mainCategory: "",
    subCategory: "",
    level2Category: "",
    price: "", // Keep for backward compatibility
    mrp: "",
    offerPrice: "",
    gstPercentage: "",
    stock: "",
    description: "",
    hslCode: "",
    images: [] as string[]
  })

  const [serviceForm, setServiceForm] = useState({
    name: "",
    mainCategory: "",
    subCategory: "",
    level2Category: "",
    price: "",
    duration: "",
    description: "",
    location: "",
    images: [] as string[]
  })

  // Load data function - can be called on mount or refresh
  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      const [productsData, servicesData, categoriesData, subCategoriesData, level2CategoriesData, customersData, eshopData, ordersData, quotationsData, enquiriesData, invoicesData, purchaseOrdersData, warehouseStockData, wasteEntriesData, suppliersData, inwardEntriesData, outwardEntriesData] = await Promise.all([
        fetchProducts(),
        fetchServices(),
        fetchCategories(),
        fetchSubCategories(),
        fetchLevel2Categories(),
        fetchCustomers(),
        fetchEshopInventory(),
        fetchOrders(),
        fetchQuotations(),
        fetchEnquiries(),
        fetchInvoices(),
        fetchPurchaseOrders(),
        fetchWarehouseStock(),
        fetchWasteEntries(),
        fetch('/api/suppliers?isActive=true').then(res => res.json()).then(data => data.success ? data.data : []).catch(() => []),
        fetchInwardEntries(),
        fetchOutwardEntries()
      ])
      setProducts(productsData)
      setServices(servicesData)
      setCategories(categoriesData)
      setSubCategories(subCategoriesData)
      setLevel2Categories(level2CategoriesData)
      setCustomers(customersData)
      setEshopInventory(eshopData)
      setOrders(ordersData)
      setQuotations(quotationsData)
      setEnquiries(enquiriesData)
      setInvoices(invoicesData)
      setPurchaseOrders(purchaseOrdersData)
      setWarehouseStock(warehouseStockData)
      setWasteEntries(wasteEntriesData)
      setSuppliers(suppliersData)
      setInwardEntries(inwardEntriesData)
      setOutwardEntries(outwardEntriesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Close warehouse dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.warehouse-dropdown-container')) {
        setIsWarehouseDropdownOpen(false)
        setIsWarehouseDropdownOpen2(false)
      }
    }
    if (isWarehouseDropdownOpen || isWarehouseDropdownOpen2) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isWarehouseDropdownOpen, isWarehouseDropdownOpen2])

  // Refresh function for Orders tab
  const refreshOrdersData = async () => {
    try {
      setRefreshing(true)
      const [ordersData, quotationsData, enquiriesData] = await Promise.all([
        fetchOrders(),
        fetchQuotations(),
        fetchEnquiries()
      ])
      setOrders(ordersData)
      setQuotations(quotationsData)
      setEnquiries(enquiriesData)
    } catch (error) {
      console.error('Error refreshing orders data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Refresh function for Quotations tab
  const refreshQuotationsData = async () => {
    try {
      setRefreshing(true)
      const quotationsData = await fetchQuotations()
      setQuotations(quotationsData)
    } catch (error) {
      console.error('Error refreshing quotations data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Refresh function for Enquiries tab
  const refreshEnquiriesData = async () => {
    try {
      setRefreshing(true)
      const enquiriesData = await fetchEnquiries()
      setEnquiries(enquiriesData)
    } catch (error) {
      console.error('Error refreshing enquiries data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Refresh function for Dashboard
  const refreshDashboardData = async () => {
    try {
      setRefreshing(true)
      const [productsData, servicesData, ordersData, quotationsData, enquiriesData] = await Promise.all([
        fetchProducts(),
        fetchServices(),
        fetchOrders(),
        fetchQuotations(),
        fetchEnquiries()
      ])
      setProducts(productsData)
      setServices(servicesData)
      setOrders(ordersData)
      setQuotations(quotationsData)
      setEnquiries(enquiriesData)
    } catch (error) {
      console.error('Error refreshing dashboard data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Create category
  const createCategory = async (categoryData: any) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })

      if (response.ok) {
        const data = await response.json()
        return data
      }
      return { success: false, error: 'Failed to create category' }
    } catch (error) {
      console.error('Error creating category:', error)
      return { success: false, error: 'Error creating category' }
    }
  }

  // Handle category form submission
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await createCategory(categoryForm)
      if (result.success) {
        setCategories([...categories, result.data])
        setCategoryForm({ name: "", mainUse: "", description: "" })
        setIsCategoryDialogOpen(false)
      } else {
        alert('Error creating category: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating category:', error)
      alert('Error creating category')
    }
  }

  // Delete category
  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCategories(categories.filter((cat: any) => cat._id !== id))
        }
        return data
      }
      return { success: false, error: 'Failed to delete category' }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error deleting category')
    }
  }

  // Edit category
  const handleEditCategory = (category: any) => {
    setCategoryForm({
      name: category.name,
      mainUse: category.mainUse,
      description: category.description || ""
    })
    setIsCategoryDialogOpen(true)
  }

  // Create sub-category
  const createSubCategory = async (subCategoryData: any) => {
    try {
      const response = await fetch('/api/sub-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subCategoryData),
      })

      if (response.ok) {
        const data = await response.json()
        return data
      }
      return { success: false, error: 'Failed to create sub-category' }
    } catch (error) {
      console.error('Error creating sub-category:', error)
      return { success: false, error: 'Error creating sub-category' }
    }
  }

  // Handle sub-category form submission
  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const selectedCategory = categories.find((cat: any) => cat._id === subCategoryForm.mainCategory)
      const subCategoryData = {
        name: subCategoryForm.name,
        mainCategory: selectedCategory?.name || "",
        mainUse: selectedCategory?.mainUse || "",
        description: subCategoryForm.description
      }
      
      const result = await createSubCategory(subCategoryData)
      if (result.success) {
        setSubCategories([...subCategories, result.data])
        setSubCategoryForm({ name: "", mainCategory: "", mainUse: "", description: "" })
        setIsSubCategoryDialogOpen(false)
      } else {
        alert('Error creating sub-category: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating sub-category:', error)
      alert('Error creating sub-category')
    }
  }

  // Delete sub-category
  const deleteSubCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sub-category?')) return
    
    try {
      const response = await fetch(`/api/sub-categories/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSubCategories(subCategories.filter((subCat: any) => subCat._id !== id))
        }
        return data
      }
      return { success: false, error: 'Failed to delete sub-category' }
    } catch (error) {
      console.error('Error deleting sub-category:', error)
      alert('Error deleting sub-category')
    }
  }

  // Edit sub-category
  const handleEditSubCategory = (subCategory: any) => {
    const mainCat = categories.find((cat: any) => cat.name === subCategory.mainCategory)
    setSubCategoryForm({
      name: subCategory.name,
      mainCategory: mainCat?._id || "",
      mainUse: subCategory.mainUse,
      description: subCategory.description || ""
    })
    setIsSubCategoryDialogOpen(true)
  }

  // Create level2 category
  const createLevel2Category = async (level2CategoryData: any) => {
    try {
      const response = await fetch('/api/level2-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(level2CategoryData),
      })

      if (response.ok) {
        const data = await response.json()
        return data
      }
      return { success: false, error: 'Failed to create level2 category' }
    } catch (error) {
      console.error('Error creating level2 category:', error)
      return { success: false, error: 'Error creating level2 category' }
    }
  }

  // Handle level2 category form submission
  const handleLevel2CategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const selectedCategory = categories.find((cat: any) => cat._id === level2CategoryForm.mainCategory)
      const selectedSubCategory = subCategories.find((subCat: any) => subCat._id === level2CategoryForm.subCategory)
      
      const level2CategoryData = {
        name: level2CategoryForm.name,
        mainCategory: selectedCategory?.name || "",
        subCategory: selectedSubCategory?.name || "",
        mainUse: selectedCategory?.mainUse || "",
        description: level2CategoryForm.description
      }
      
      const result = await createLevel2Category(level2CategoryData)
      if (result.success) {
        setLevel2Categories([...level2Categories, result.data])
        setLevel2CategoryForm({ name: "", mainCategory: "", subCategory: "", mainUse: "", description: "" })
        setIsLevel2CategoryDialogOpen(false)
      } else {
        alert('Error creating level2 category: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating level2 category:', error)
      alert('Error creating level2 category')
    }
  }

  // Delete level2 category
  const deleteLevel2Category = async (id: string) => {
    if (!confirm('Are you sure you want to delete this level2 category?')) return
    
    try {
      const response = await fetch(`/api/level2-categories/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setLevel2Categories(level2Categories.filter((level2Cat: any) => level2Cat._id !== id))
        }
        return data
      }
      return { success: false, error: 'Failed to delete level2 category' }
    } catch (error) {
      console.error('Error deleting level2 category:', error)
      alert('Error deleting level2 category')
    }
  }

  // Edit level2 category
  const handleEditLevel2Category = (level2Category: any) => {
    const mainCat = categories.find((cat: any) => cat.name === level2Category.mainCategory)
    const subCat = subCategories.find((sc: any) => sc.name === level2Category.subCategory)
    setLevel2CategoryForm({
      name: level2Category.name,
      mainCategory: mainCat?._id || "",
      subCategory: subCat?._id || "",
      mainUse: level2Category.mainUse,
      description: level2Category.description || ""
    })
    setIsLevel2CategoryDialogOpen(true)
  }

  // Create customer
  const createCustomer = async (customerData: any) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      })

      if (response.ok) {
        const data = await response.json()
        return data
      }
      return { success: false, error: 'Failed to create customer' }
    } catch (error) {
      console.error('Error creating customer:', error)
      return { success: false, error: 'Error creating customer' }
    }
  }

  // Update customer
  const updateCustomer = async (id: string, customerData: any) => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      })

      if (response.ok) {
        const data = await response.json()
        return data
      }
      return { success: false, error: 'Failed to update customer' }
    } catch (error) {
      console.error('Error updating customer:', error)
      return { success: false, error: 'Error updating customer' }
    }
  }

  // Delete customer
  const deleteCustomer = async (id: string) => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        return data
      }
      return { success: false, error: 'Failed to delete customer' }
    } catch (error) {
      console.error('Error deleting customer:', error)
      return { success: false, error: 'Error deleting customer' }
    }
  }

  // This function is now defined later (line ~1072) to handle both create and update

  // Handle Re-top up - Opens Edit Manually dialog for adding stock
  const handleRetopUp = (item: any) => {
    // Load all products for this customer
    const customerInventory = eshopInventory.filter((inv: any) => inv.customerId === item.customerId).map((inv: any) => ({
      ...inv,
      quantityToAdd: 0
    }))
    setCustomerProductsForRetopUp(customerInventory)
    setRetopUpCustomerId(item.customerId)
    setRetopUpCustomerName(item.customerName)
    setRetopUpNotes("") // Reset notes when opening dialog
    setRetopUpPage(1) // Reset pagination
    setIsRetopUpDialogOpen(true)
    setOpenDropdownId(null) // Close dropdown
  }

  // Handle adding product to re-top up list
  const handleAddProductToRetopUp = (product: any) => {
    // Check if product already exists in the list
    const existingProduct = customerProductsForRetopUp.find((p: any) => p.productId === product._id)
    if (existingProduct) {
      alert('Product already added to the list')
      return
    }

    // Add product to the list
    const newProduct = {
      _id: `temp-${Date.now()}`,
      productId: product._id,
      productName: product.name,
      quantity: 0,
      price: product.offerPrice || product.price || 0,
      quantityToAdd: 0,
      invoicedQuantity: 0
    }
    
    setCustomerProductsForRetopUp([...customerProductsForRetopUp, newProduct])
    setIsAddProductDialogOpen(false)
    
    // Navigate to the last page if needed
    const totalPages = Math.ceil((customerProductsForRetopUp.length + 1) / retopUpPerPage)
    setRetopUpPage(totalPages)
  }

  // Handle Re-top up submit
  const handleRetopUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Update all products that have quantityToAdd
      const updates: any[] = []
      const historyProducts: any[] = []
      
      for (const product of customerProductsForRetopUp) {
        if (product.quantityToAdd > 0) {
          const previousQuantity = product.quantity || 0
          const newQuantity = previousQuantity + product.quantityToAdd
          
          let result: any
          
          // Check if product exists in customer inventory (has real _id, not temp)
          if (product._id && !product._id.startsWith('temp-')) {
            // Update existing inventory item
            result = await updateEshopInventory(product._id, {
              quantity: newQuantity,
              notes: `Re-topped up with ${product.quantityToAdd} units. ${product.notes || ""}`
            })
          } else {
            // Create new inventory item for this customer
            const inventoryData = {
              productId: product.productId,
              productName: product.productName,
              customerId: retopUpCustomerId,
              customerName: retopUpCustomerName,
              quantity: product.quantityToAdd,
              price: product.price || 0,
              notes: `Re-topped up with ${product.quantityToAdd} units. ${product.notes || ""}`,
              lastUpdated: new Date().toISOString()
            }
            
            const response = await fetch('/api/eshop-inventory', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(inventoryData),
            })
            result = await response.json()
          }
          
          if (result.success) {
            updates.push(result.data)
            
            // Collect data for history
            historyProducts.push({
              productId: product.productId || product._id,
              productName: product.productName,
              previousQuantity: previousQuantity,
              quantityAdded: product.quantityToAdd,
              newQuantity: newQuantity,
              price: product.price || 0
            })
          }
        }
      }
      
      if (updates.length > 0) {
        // Update the inventory state
        setEshopInventory(eshopInventory.map((item: any) => {
          const updated = updates.find((u: any) => u._id === item._id)
          return updated || item
        }))
        
        // Save retop up history
        try {
          const historyResponse = await fetch('/api/retopup-history', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              customerId: retopUpCustomerId,
              customerName: retopUpCustomerName,
              products: historyProducts,
              notes: retopUpNotes,
              date: new Date()
            }),
          })
          
          const historyResult = await historyResponse.json()
          if (!historyResult.success) {
            console.error('Error saving retop up history:', historyResult.error)
          }
        } catch (historyError) {
          console.error('Error saving retop up history:', historyError)
          // Don't block the main flow if history saving fails
        }
        
        alert(`Successfully re-topped up ${updates.length} product(s)`)
      }
      
      setIsRetopUpDialogOpen(false)
      setCustomerProductsForRetopUp([])
      setRetopUpCustomerId("")
      setRetopUpCustomerName("")
      setRetopUpNotes("")
      setRetopUpPage(1)
    } catch (error) {
      console.error('Error re-topping up:', error)
      alert('Error re-topping up')
    }
  }

  // Handle Edit Inventory Item
  const handleEditInventoryItem = (item: any) => {
    setEditingInventoryItem(item)
    setEditInventoryForm({
      productName: item.productName,
      quantity: item.quantity.toString(),
      price: item.price?.toString() || "0"
    })
    setIsEditInventoryDialogOpen(true)
    setOpenDropdownId(null) // Close dropdown
  }

  // Handle Edit Inventory submit
  const handleEditInventorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await updateEshopInventory(editingInventoryItem._id, {
        productName: editInventoryForm.productName,
        quantity: parseInt(editInventoryForm.quantity),
        price: parseFloat(editInventoryForm.price),
        notes: editingInventoryItem.notes || ""
      })
      
      if (result.success) {
        setEshopInventory(eshopInventory.map((item: any) => 
          item._id === editingInventoryItem._id ? result.data : item
        ))
        setIsEditInventoryDialogOpen(false)
        setEditingInventoryItem(null)
        setEditInventoryForm({ productName: "", quantity: "", price: "" })
        alert('Inventory item updated successfully!')
      } else {
        alert('Error updating inventory: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating inventory:', error)
      alert('Error updating inventory')
    }
  }

  // Handle Record Usage
  const handleRecordUsage = (item: any) => {
    setRecordUsageItem(item)
    setUsedQuantity("")
    setIsRecordUsageDialogOpen(true)
    setOpenDropdownId(null) // Close dropdown
  }

  // Handle Record Usage submit
  const handleRecordUsageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const used = parseInt(usedQuantity)
      const newQuantity = recordUsageItem.quantity - used
      
      if (newQuantity < 0) {
        alert('Used quantity cannot be more than available quantity!')
        return
      }

      const currentDate = new Date().toLocaleDateString()
      const result = await updateEshopInventory(recordUsageItem._id, {
        quantity: newQuantity,
        notes: `${currentDate}: Used ${used} units. Remaining: ${newQuantity} units. ${recordUsageItem.notes || ""}`
      })
      
      if (result.success) {
        setEshopInventory(eshopInventory.map((item: any) => 
          item._id === recordUsageItem._id ? result.data : item
        ))
        setIsRecordUsageDialogOpen(false)
        setRecordUsageItem(null)
        setUsedQuantity("")
      } else {
        alert('Error recording usage: ' + result.error)
      }
    } catch (error) {
      console.error('Error recording usage:', error)
      alert('Error recording usage')
    }
  }

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        return data.success ? data.data : []
      }
      return []
    } catch (error) {
      console.error('Error fetching orders:', error)
      return []
    }
  }

  // Update order status
  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setOrders(orders.map((order: any) => 
            order._id === id ? data.data : order
          ))
        }
        return data
      }
      return { success: false, error: 'Failed to update order status' }
    } catch (error) {
      console.error('Error updating order status:', error)
      return { success: false, error: 'Error updating order status' }
    }
  }

  // Delete order
  const deleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return
    
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setOrders(orders.filter((order: any) => order._id !== id))
        }
        return data
      }
      return { success: false, error: 'Failed to delete order' }
    } catch (error) {
      console.error('Error deleting order:', error)
      return { success: false, error: 'Error deleting order' }
    }
  }

  // Update quotation status
  const updateQuotationStatus = async (id: string, status: string) => {
    try {
      // If status is "accepted", confirm and create order
      if (status === 'accepted') {
        const quotation = quotations.find((q: any) => q._id === id)
        if (!quotation) {
          alert('Quotation not found')
          return { success: false, error: 'Quotation not found' }
        }

        // Confirm with user
        const confirmMessage = `Are you sure you want to accept this quotation and create an order?\n\nQuotation: ${quotation.quotationNo || 'N/A'}\nCustomer: ${quotation.userName || quotation.userEmail}\nTotal Amount: ₹${(quotation.totalAmount || 0).toLocaleString()}`
        
        if (!confirm(confirmMessage)) {
          // User cancelled, don't update status
          return { success: false, error: 'Cancelled by user' }
        }

        // Create order from quotation data
        // Note: orderNo will be generated sequentially by the API
        const orderData = {
          userId: quotation.userId || 'guest',
          userEmail: quotation.userEmail,
          items: (quotation.items || []).map((item: any) => ({
            productId: item.itemId || '',
            productName: item.itemName || '',
            quantity: item.quantity || 1,
            price: item.price || 0
          })),
          totalAmount: quotation.totalAmount || 0,
          status: 'Order Placed',
          shippingAddress: {
            receiverName: quotation.userName || '',
            street: quotation.userAddress?.street || '',
            city: quotation.userAddress?.city || '',
            state: quotation.userAddress?.state || '',
            zipCode: quotation.userAddress?.zipCode || '',
            country: quotation.userAddress?.country || 'India'
          },
          phone: quotation.userPhone || '',
          customerName: quotation.userName || '',
          customerPhone: quotation.userPhone || '',
          customerEmail: quotation.userEmail || '',
          company: quotation.company || '',
          gstNumber: quotation.gstNumber || '',
          notes: `Order created from quotation ${quotation.quotationNo || 'N/A'}. ${quotation.notes || ''}`,
          orderDate: new Date()
          // orderNo will be generated by the API sequentially
        }

        // Create order
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        })

        const orderResult = await orderResponse.json()

        if (!orderResult.success) {
          alert('Error creating order: ' + (orderResult.error || 'Unknown error'))
          return { success: false, error: 'Failed to create order' }
        }

        // Order created successfully, now update quotation status
      const response = await fetch(`/api/quotations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
            // Update quotations list
          setQuotations(quotations.map((quotation: any) => 
            quotation._id === id ? data.data : quotation
          ))
            
            // Add order to orders list and switch to orders tab
            const updatedOrders = await fetchOrders()
            setOrders(updatedOrders)
            setActiveSection('orders')
            setActiveSubSection('all-orders')
            
            // Get the order number from the response
            const createdOrderNo = orderResult.data?.orderNo || 'N/A'
            alert(`Quotation accepted! Order ${createdOrderNo} has been created successfully.`)
        }
        return data
      }
      return { success: false, error: 'Failed to update quotation status' }
      } else {
        // For other statuses, just update normally
        const response = await fetch(`/api/quotations/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setQuotations(quotations.map((quotation: any) => 
              quotation._id === id ? data.data : quotation
            ))
          }
          return data
        }
        return { success: false, error: 'Failed to update quotation status' }
      }
    } catch (error) {
      console.error('Error updating quotation status:', error)
      return { success: false, error: 'Error updating quotation status' }
    }
  }

  // Delete quotation
  const deleteQuotation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quotation?')) return
    
    try {
      const response = await fetch(`/api/quotations/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setQuotations(quotations.filter((quotation: any) => quotation._id !== id))
        }
        return data
      }
      return { success: false, error: 'Failed to delete quotation' }
    } catch (error) {
      console.error('Error deleting quotation:', error)
      return { success: false, error: 'Error deleting quotation' }
    }
  }

  // View enquiry details
  const handleViewEnquiry = (enquiry: any) => {
    setViewingEnquiry(enquiry)
    setIsViewEnquiryDialogOpen(true)
  }

  // Edit enquiry
  const handleEditEnquiry = (enquiry: any) => {
    setEditingEnquiry(enquiry)
    setIsEditEnquiryDialogOpen(true)
  }

  // Update enquiry status
  const updateEnquiryStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setEnquiries(enquiries.map((enquiry: any) => 
            enquiry._id === id ? data.data : enquiry
          ))
        }
        return data
      }
      return { success: false, error: 'Failed to update enquiry status' }
    } catch (error) {
      console.error('Error updating enquiry status:', error)
      return { success: false, error: 'Error updating enquiry status' }
    }
  }

  // Delete enquiry
  const deleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return
    
    try {
      const response = await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setEnquiries(enquiries.filter((enquiry: any) => enquiry._id !== id))
        }
        return data
      }
      return { success: false, error: 'Failed to delete enquiry' }
    } catch (error) {
      console.error('Error deleting enquiry:', error)
      return { success: false, error: 'Error deleting enquiry' }
    }
  }

  // Convert enquiry to quotation
  const handleSendQuotation = async (enquiry: any) => {
    if (!confirm('Are you sure you want to convert this enquiry to a quotation?')) return

    try {
      // Extract name from email if userName is not available
      const userName = enquiry.userName || enquiry.userEmail.split('@')[0] || 'Guest'
      
      // Create quotation from enquiry (quotationNo will be generated by API)
      const quotationData = {
        userId: enquiry.userId || 'guest',
        userEmail: enquiry.userEmail,
        userName: userName,
        userPhone: enquiry.phone || '',
        userAddress: enquiry.userAddress || {},
        items: [{
          itemId: enquiry.itemId || '',
          itemName: enquiry.itemName,
          quantity: 1, // Default to 1, can be edited later
          price: 0 // Default to 0, can be set later
        }],
        totalAmount: 0, // Default to 0, will be calculated when items are priced
        description: enquiry.message,
        company: enquiry.company || '',
        gstNumber: enquiry.gstNumber || '',
        status: enquiry.status || 'pending', // Use enquiry status
        quotationDate: new Date(),
        // Don't set quotationNo - let API generate sequential number
        notes: enquiry.responseNotes || ''
      }

      // Create quotation
      const quotationResponse = await fetch('/api/quotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quotationData),
      })

      const quotationResult = await quotationResponse.json()

      if (quotationResult.success) {
        // Update enquiry status to 'closed'
        await updateEnquiryStatus(enquiry._id, 'closed')
        
        // Remove enquiry from enquiries list (since it's now a quotation)
        setEnquiries(enquiries.filter((e: any) => e._id !== enquiry._id))
        
        // Add quotation to quotations list
        const updatedQuotations = await fetchQuotations()
        setQuotations(updatedQuotations)
        
        // Switch to quotations tab
        setActiveSubSection('received-quotations')
        setIsViewEnquiryDialogOpen(false)
        
        alert('Quotation created successfully!')
      } else {
        alert('Error creating quotation: ' + (quotationResult.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error converting enquiry to quotation:', error)
      alert('Error converting enquiry to quotation')
    }
  }

  const openEshopEditDialog = (item: any) => {
    setEshopEditForm({
      id: item._id,
      productName: item.productName || "",
      quantity: item.quantity || 1,
      price: item.price || 0,
      notes: item.notes || ""
    })
    setIsEshopEditOpen(true)
  }

  const deleteEshopItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inventory item?')) return
    
    try {
      const response = await fetch(`/api/eshop-inventory/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setEshopInventory(eshopInventory.filter((item: any) => item._id !== id))
        }
        return data
      }
      return { success: false, error: 'Failed to delete inventory item' }
    } catch (error) {
      console.error('Error deleting inventory item:', error)
      return { success: false, error: 'Error deleting inventory item' }
    }
  }

  // Handle edit quotation
  const handleEditQuotation = (quotation: any) => {
    setEditingQuotation({ ...quotation })
    setIsEditQuotationDialogOpen(true)
  }

  // Save quotation changes
  const saveQuotationChanges = async () => {
    if (!editingQuotation) return
    
    try {
      const response = await fetch(`/api/quotations/${editingQuotation._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingQuotation),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setQuotations(quotations.map((q: any) => 
            q._id === editingQuotation._id ? data.data : q
          ))
          setIsEditQuotationDialogOpen(false)
          setEditingQuotation(null)
          alert('Quotation updated successfully!')
        }
        return data
      }
      alert('Failed to update quotation')
      return { success: false, error: 'Failed to update quotation' }
    } catch (error) {
      console.error('Error updating quotation:', error)
      alert('Error updating quotation')
      return { success: false, error: 'Error updating quotation' }
    }
  }

  // Handle block/unblock customer
  const handleToggleCustomerStatus = async (customer: any) => {
    const action = customer.status === 'active' ? 'block' : 'unblock'
    const confirmMessage = `Are you sure you want to ${action} ${customer.name}?`
    
    if (confirm(confirmMessage)) {
      try {
        const newStatus = customer.status === 'active' ? 'blocked' : 'active'
        const response = await fetch(`/api/customers/${customer._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...customer,
            status: newStatus,
            isBlocked: newStatus === 'blocked'
          }),
        })
        
        const result = await response.json()
        
        if (result.success) {
          // Update the customer in the state
          setCustomers(customers.map((c: any) => 
            c._id === customer._id 
              ? { ...c, status: newStatus, isBlocked: newStatus === 'blocked' }
              : c
          ))
          alert(`Customer ${action}ed successfully`)
        } else {
          alert(`Error ${action}ing customer: ${result.error}`)
        }
      } catch (error) {
        console.error(`Error ${action}ing customer:`, error)
        alert(`Error ${action}ing customer`)
      }
    }
  }

  // Handle edit customer
  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer)
    setCustomerForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      password: "",
      address: customer.address || "",
      city: customer.city || "",
      state: customer.state || "",
      zipCode: customer.zipCode || "",
      country: customer.country || "India"
    })
    setIsCustomerDialogOpen(true)
  }

  // Handle delete customer
  const handleDeleteCustomer = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await fetch(`/api/customers/${id}`, {
          method: 'DELETE',
        })
        
        const result = await response.json()
        
        if (result.success) {
          setCustomers(customers.filter((customer: any) => customer._id !== id))
          alert('Customer deleted successfully')
        } else {
          alert('Error deleting customer: ' + result.error)
        }
      } catch (error) {
        console.error('Error deleting customer:', error)
        alert('Error deleting customer')
      }
    }
  }

  // Handle customer form submission
  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCustomer) {
        // Update existing customer
        const response = await fetch(`/api/customers/${editingCustomer._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...editingCustomer,
            ...customerForm,
            // Only include password if it's provided
            ...(customerForm.password && { password: customerForm.password })
          }),
        })
        
        const result = await response.json()
        
        if (result.success) {
          setCustomers(customers.map((c: any) => 
            c._id === editingCustomer._id ? result.data : c
          ))
          alert('Customer updated successfully')
        } else {
          alert('Error updating customer: ' + result.error)
        }
      } else {
        // Create new customer
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customerForm),
        })
        
        const result = await response.json()
        
        if (result.success) {
          setCustomers([...customers, result.data])
          alert('Customer created successfully')
        } else {
          alert('Error creating customer: ' + result.error)
        }
      }
      
      // Reset form and close dialog
      setCustomerForm({ name: "", email: "", phone: "", password: "", address: "", city: "", state: "", zipCode: "", country: "India" })
      setIsCustomerDialogOpen(false)
      setEditingCustomer(null)
    } catch (error) {
      console.error('Error saving customer:', error)
      alert('Error saving customer')
    }
  }

  // View complete order
  const handleViewOrder = (order: any) => {
    setViewingOrder(order)
    setIsViewOrderDialogOpen(true)
  }

  // Handle edit order
  const handleEditOrder = (order: any) => {
    setEditingOrder(order)
    setOrderEditForm({
      customerName: order.customerName || "",
      customerPhone: order.customerPhone || "",
      shippingAddress: {
        street: order.shippingAddress?.street || "",
        city: order.shippingAddress?.city || "",
        state: order.shippingAddress?.state || "",
        zipCode: order.shippingAddress?.zipCode || "",
        country: order.shippingAddress?.country || "India"
      },
      totalAmount: order.totalAmount || 0,
      status: order.status || "Order Placed",
      items: order.items || []
    })
    setIsEditOrderDialogOpen(true)
  }

  // Handle order edit form submission
  const handleOrderEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingOrder) return

    try {
      const response = await fetch(`/api/orders/${editingOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderEditForm),
      })

      const result = await response.json()

      if (result.success) {
        // Update the order in the state
        setOrders(orders.map((order: any) => 
          order._id === editingOrder._id ? result.data : order
        ))
        alert('Order updated successfully')
        setIsEditOrderDialogOpen(false)
        setEditingOrder(null)
      } else {
        alert('Error updating order: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error updating order')
    }
  }

  // Handle generate invoice for order
  const handleGenerateInvoice = async (order: any) => {
    try {
      let customerId = null
      
      // Try to find customer from customers collection first
      if (order.customerEmail || order.userEmail) {
        try {
          const customersResponse = await fetch('/api/customers')
          const customersData = await customersResponse.json()
          if (customersData.success && customersData.data) {
            const customer = customersData.data.find((c: any) => 
              c.email === order.customerEmail || 
              c.email === order.userEmail ||
              c.name === order.customerName
            )
            if (customer) {
              customerId = customer._id
            }
          }
        } catch (error) {
          console.error('Error fetching customers:', error)
        }
      }

      // If still no customerId, try to find from eshop-inventory by email or name
      if (!customerId && (order.customerEmail || order.userEmail || order.customerName)) {
        try {
          const inventoryResponse = await fetch('/api/eshop-inventory')
          const inventoryData = await inventoryResponse.json()
          const inventoryArray = inventoryData.data || inventoryData
          const customerInventory = inventoryArray.find((item: any) => 
            (order.customerEmail && item.customerEmail === order.customerEmail) || 
            (order.userEmail && item.customerEmail === order.userEmail) ||
            (order.customerName && item.customerName === order.customerName)
          )
          if (customerInventory) {
            customerId = customerInventory.customerId
          }
        } catch (error) {
          console.error('Error fetching inventory:', error)
        }
      }

      // If still no customerId, use order.userId or order._id as fallback
      if (!customerId) {
        customerId = order.userId || order._id || 'guest'
      }

      // Convert order items to invoice format with hslCode if available
      const invoiceItems = (order.items || []).map((item: any) => ({
        name: item.productName || item.name || 'Product',
        quantity: item.quantity || 1,
        price: item.price || 0,
        hslCode: item.hslCode || ''
      }))

      // Navigate to invoice page with order data including orderId and customerEmail
      const itemsParam = encodeURIComponent(JSON.stringify(invoiceItems))
      const orderIdParam = order._id ? `&orderId=${order._id}` : ''
      const customerEmailParam = order.customerEmail || order.userEmail ? `&customerEmail=${encodeURIComponent(order.customerEmail || order.userEmail)}` : ''
      const orderNoParam = order.orderNo ? `&orderNo=${encodeURIComponent(order.orderNo)}` : ''
      
      router.push(`/dashboard/invoice?customerId=${customerId}&items=${itemsParam}${orderIdParam}${customerEmailParam}${orderNoParam}`)
    } catch (error) {
      console.error('Error generating invoice:', error)
      alert('Error generating invoice. Please try again.')
    }
  }

  // Fetch quotations
  const fetchQuotations = async () => {
    try {
      const response = await fetch('/api/quotations')
      if (response.ok) {
        const data = await response.json()
        return data.success ? data.data : []
      }
      return []
    } catch (error) {
      console.error('Error fetching quotations:', error)
      return []
    }
  }

  // View complete quotation
  const handleViewQuotation = (quotation: any) => {
    setViewingQuotation(quotation)
    setIsViewQuotationDialogOpen(true)
  }

  // Handle requote - navigate to quotation page in edit mode
  const handleRequote = (quotation: any) => {
    router.push(`/dashboard/quotation?id=${quotation._id}&requote=true`)
  }

  // View product details
  const handleViewProductDetails = (item: any) => {
    // Load all products for this customer for view details
    const customerInventory = eshopInventory.filter((inv: any) => inv.customerId === item.customerId)
    setViewingProductDetails({ 
      ...item, 
      allProducts: customerInventory,
      customerName: item.customerName 
    })
    setIsEditMode(false)
    setIsViewProductDetailsDialogOpen(true)
    setOpenDropdownId(null) // Close dropdown
  }

  // Handle delete inventory item
  const handleDeleteInventoryItem = async (item: any) => {
    if (!confirm(`Are you sure you want to delete this inventory item for ${item.customerName}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/eshop-inventory/${item._id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        // Remove from state
        setEshopInventory(eshopInventory.filter((inventory: any) => inventory._id !== item._id))
        alert('Inventory item deleted successfully')
        
        // Close the view details dialog if it's open
        setIsViewProductDetailsDialogOpen(false)
      } else {
        alert('Error deleting inventory item: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting inventory item:', error)
      alert('Error deleting inventory item')
    } finally {
      setOpenDropdownId(null) // Close dropdown
    }
  }

  // Toggle dropdown
  const toggleDropdown = (itemId: string) => {
    setOpenDropdownId(openDropdownId === itemId ? null : itemId)
  }

  // Toggle order dropdown
  const toggleOrderDropdown = (orderId: string) => {
    setOpenOrderDropdownId(openOrderDropdownId === orderId ? null : orderId)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownId(null)
    }
    
    if (openDropdownId) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openDropdownId])

  // Close order dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenOrderDropdownId(null)
    }
    
    if (openOrderDropdownId) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openOrderDropdownId])

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentOrderPage(1)
  }, [orderSearchTerm])

  useEffect(() => {
    setCurrentQuotationPage(1)
  }, [quotationSearchTerm])

  useEffect(() => {
    setCurrentEnquiryPage(1)
  }, [enquirySearchTerm])

  // Handle edit mode toggle
  const handleEditModeToggle = () => {
    setIsEditMode(!isEditMode)
  }

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/eshop-inventory/${viewingProductDetails._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: parseInt(editForm.quantity),
          price: editForm.price,
          notes: editForm.notes,
          lastUpdated: new Date().toISOString()
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Update the viewing product details
        setViewingProductDetails({
          ...viewingProductDetails,
          quantity: parseInt(editForm.quantity),
          price: editForm.price,
          notes: editForm.notes,
          lastUpdated: new Date().toISOString()
        })
        
        // Update the eshop inventory state
        setEshopInventory(eshopInventory.map((item: any) =>
          item._id === viewingProductDetails._id ? result.data : item
        ))
        
        setIsEditMode(false)
        alert('Changes saved successfully')
      } else {
        alert('Error saving changes: ' + result.error)
      }
    } catch (error) {
      console.error('Error saving changes:', error)
      alert('Error saving changes')
    }
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditForm({
      quantity: viewingProductDetails.quantity.toString(),
      price: viewingProductDetails.price || 0,
      notes: viewingProductDetails.notes || ""
    })
    setIsEditMode(false)
  }

  // Handle add new product to customer
  const handleAddProductToCustomer = () => {
    const newProduct = {
      _id: `temp_${Date.now()}`,
      productId: "",
      productName: "",
      customerId: editingCustomerId,
      customerName: customerProducts[0]?.customerName || "",
      quantity: 1,
      price: 0,
      notes: "",
      isNew: true
    }
    setCustomerProducts([...customerProducts, newProduct])
  }

  // Handle remove product from customer
  const handleRemoveProductFromCustomer = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this product?')) {
      return
    }

    // If it's a new product (not saved yet), just remove from state
    if (productId.startsWith('temp_')) {
      setCustomerProducts(customerProducts.filter((p: any) => p._id !== productId))
      return
    }

    // If it's an existing product, delete from database
    try {
      const response = await fetch(`/api/eshop-inventory/${productId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        setCustomerProducts(customerProducts.filter((p: any) => p._id !== productId))
        setEshopInventory(eshopInventory.filter((item: any) => item._id !== productId))
        alert('Product removed successfully')
      } else {
        alert('Error removing product: ' + result.error)
      }
    } catch (error) {
      console.error('Error removing product:', error)
      alert('Error removing product')
    }
  }

  // Handle update customer products
  const handleUpdateCustomerProducts = async () => {
    try {
      // Update existing products
      for (const product of customerProducts.filter((p: any) => !p.isNew)) {
        // Find the original inventory item to get the original quantities
        const originalInventory = eshopInventory.find((inv: any) => inv._id === product._id)
        
        if (isRetopUpMode && originalInventory) {
          // In re-top up mode: add the new quantity to the original quantity
          const newTotalQuantity = originalInventory.quantity + parseInt(product.quantity.toString())
          await fetch(`/api/eshop-inventory/${product._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              quantity: newTotalQuantity,
              price: parseFloat(product.price.toString()),
              notes: product.notes,
              lastUpdated: new Date().toISOString()
            }),
          })
        } else {
          // In edit mode: replace the quantity
          await fetch(`/api/eshop-inventory/${product._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              quantity: parseInt(product.quantity.toString()),
              price: parseFloat(product.price.toString()),
              notes: product.notes,
              lastUpdated: new Date().toISOString()
            }),
          })
        }
      }

      // Create new products
      for (const product of customerProducts.filter((p: any) => p.isNew && p.productId)) {
        await fetch('/api/eshop-inventory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product.productId,
            productName: product.productName,
            customerId: product.customerId,
            customerName: product.customerName,
            quantity: parseInt(product.quantity.toString()),
            price: parseFloat(product.price.toString()),
            notes: product.notes,
            lastUpdated: new Date().toISOString()
          }),
        })
      }

      alert('Customer products updated successfully')
      setIsEshopDialogOpen(false)
      setIsRetopUpMode(false)
      // Refresh the data
      window.location.reload()
    } catch (error) {
      console.error('Error updating customer products:', error)
      alert('Error updating customer products')
    }
  }

  // Handle Excel file upload and parse
  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!['xlsx', 'xls'].includes(fileExtension || '')) {
      alert('Please upload a valid Excel file (.xlsx or .xls)')
      return
    }

    try {
      setUploadingExcel(true)
      
      // Read Excel file
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      
      if (jsonData.length < 2) {
        alert('Excel file must contain at least a header row and one data row')
        setUploadingExcel(false)
        return
      }

      // Get header row (first row)
      const headers = (jsonData[0] as any[]).map((h: any) => String(h).toLowerCase().trim())
      
      // Find column indices
      const getColumnIndex = (possibleNames: string[]) => {
        for (const name of possibleNames) {
          const index = headers.findIndex(h => h.includes(name))
          if (index !== -1) return index
        }
        return -1
      }

      const nameIndex = getColumnIndex(['product name', 'name', 'product'])
      const mainCategoryIndex = getColumnIndex(['main category', 'maincategory', 'category'])
      const subCategoryIndex = getColumnIndex(['sub category', 'subcategory', 'sub'])
      const level2CategoryIndex = getColumnIndex(['level2', 'level 2', 'level2category', 'level 2 category'])
      const mrpIndex = getColumnIndex(['mrp', 'maximum retail price'])
      const offerPriceIndex = getColumnIndex(['offer price', 'offerprice', 'selling price'])
      const gstIndex = getColumnIndex(['gst', 'gst%', 'gst percentage', 'gst in %'])
      const stockIndex = getColumnIndex(['stock', 'quantity', 'stocks quantity', 'qty'])
      const descriptionIndex = getColumnIndex(['description', 'desc'])
      const hslCodeIndex = getColumnIndex(['hsl code', 'hslcode', 'hsl'])
      const imagesIndex = getColumnIndex(['images', 'image', 'image url', 'imageurl'])

      // Validate required columns
      if (nameIndex === -1 || mrpIndex === -1 || offerPriceIndex === -1 || gstIndex === -1 || stockIndex === -1) {
        alert('Excel file must contain the following columns: Product Name, MRP, Offer Price, GST in %, and Stocks Quantity')
        setUploadingExcel(false)
        return
      }

      // Process data rows (skip header row)
      const productsToCreate: any[] = []
      const errors: string[] = []

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as any[]
        
        // Skip empty rows
        if (!row[nameIndex] || String(row[nameIndex]).trim() === '') continue

        try {
          const productName = String(row[nameIndex] || '').trim()
          const mainCategory = mainCategoryIndex !== -1 ? String(row[mainCategoryIndex] || '').trim() : ''
          const subCategory = subCategoryIndex !== -1 ? String(row[subCategoryIndex] || '').trim() : ''
          const level2Category = level2CategoryIndex !== -1 ? String(row[level2CategoryIndex] || '').trim() : ''
          const mrp = parseFloat(String(row[mrpIndex] || '0').replace(/[^0-9.]/g, '')) || 0
          const offerPrice = parseFloat(String(row[offerPriceIndex] || '0').replace(/[^0-9.]/g, '')) || 0
          const gstPercentage = parseFloat(String(row[gstIndex] || '0').replace(/[^0-9.]/g, '')) || 0
          const stock = parseInt(String(row[stockIndex] || '0').replace(/[^0-9]/g, '')) || 0
          const description = descriptionIndex !== -1 ? String(row[descriptionIndex] || '').trim() : ''
          const hslCode = hslCodeIndex !== -1 ? String(row[hslCodeIndex] || '').trim() : ''
          const images = imagesIndex !== -1 ? String(row[imagesIndex] || '').trim() : ''

          // Validate required fields
          if (!productName) {
            errors.push(`Row ${i + 1}: Product name is required`)
            continue
          }
          if (mrp <= 0) {
            errors.push(`Row ${i + 1}: MRP must be greater than 0`)
            continue
          }
          if (offerPrice <= 0) {
            errors.push(`Row ${i + 1}: Offer Price must be greater than 0`)
            continue
          }
          if (gstPercentage < 0 || gstPercentage > 100) {
            errors.push(`Row ${i + 1}: GST percentage must be between 0 and 100`)
            continue
          }

          // Build category string
          let categoryString = mainCategory || ''
          if (subCategory) {
            categoryString += categoryString ? `/${subCategory}` : subCategory
          }
          if (level2Category) {
            categoryString += categoryString ? `/${level2Category}` : level2Category
          }

          // Calculate discount and final price
          const discount = mrp - offerPrice
          const gstAmount = (offerPrice * gstPercentage) / 100
          const finalPrice = offerPrice + gstAmount

          // Parse images (if provided, can be comma-separated)
          // Can be either:
          // 1. Direct URLs (http:// or https://) - used as-is
          // 2. Image names - fetched from Cloudinary using existing credentials
          const imageNames = images ? images.split(',').map((img: string) => img.trim()).filter((img: string) => img) : []
          
          // Store image names for later processing (will fetch Cloudinary URLs before creating products)
          productsToCreate.push({
            name: productName,
            category: categoryString || 'Uncategorized',
            mainCategory: mainCategory,
            subCategory: subCategory,
            level2Category: level2Category,
            mrp: mrp,
            offerPrice: offerPrice,
            gstPercentage: gstPercentage,
            discount: discount,
            finalPrice: finalPrice,
            price: finalPrice, // Keep for backward compatibility
            stock: stock,
            description: description || `${productName} - Quality product`,
            hslCode: hslCode || '',
            imageNames: imageNames, // Store image names temporarily
            images: [], // Will be populated with Cloudinary URLs
            vendor: "Admin"
          })
        } catch (rowError) {
          errors.push(`Row ${i + 1}: Error processing row - ${rowError}`)
        }
      }

      if (productsToCreate.length === 0) {
        alert('No valid products found in Excel file. Please check your data.')
        setUploadingExcel(false)
        return
      }

      // Fetch Cloudinary URLs for all products with image names/URLs
      for (const productData of productsToCreate) {
        if (productData.imageNames && productData.imageNames.length > 0) {
          const imageUrls: string[] = []
          for (const imageValue of productData.imageNames) {
            try {
              // Check if it's already a full URL (starts with http/https)
              if (imageValue.startsWith('http://') || imageValue.startsWith('https://')) {
                // It's a direct URL, use it as-is
                imageUrls.push(imageValue)
              } else {
                // It's an image name, fetch from Cloudinary
                const response = await fetch('/api/cloudinary/fetch-image', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    imageName: imageValue,
                    folder: 'adminza/products' // Default folder for product images
                  })
                })
                
                const imageData = await response.json()
                if (imageData.success && imageData.url) {
                  imageUrls.push(imageData.url)
                } else {
                  // Log warning but don't block product creation
                  console.warn(`${productData.name}: Image "${imageValue}" - ${imageData.error || 'not found'}`)
                  errors.push(`${productData.name}: Image "${imageValue}" - ${imageData.error || 'not found in Cloudinary'}`)
                }
              }
            } catch (error) {
              console.error(`Error processing image ${imageValue}:`, error)
              errors.push(`${productData.name}: Failed to process image "${imageValue}"`)
            }
          }
          // Update product data with image URLs (Cloudinary URLs or direct URLs)
          productData.images = imageUrls
          delete productData.imageNames // Remove temporary field
        }
      }

      // Create products
      let successCount = 0
      let failCount = 0
      const createdProducts: any[] = []

      for (const productData of productsToCreate) {
        try {
          const result = await createProduct(productData)
          if (result.success) {
            successCount++
            createdProducts.push(result.data)
          } else {
            failCount++
            errors.push(`${productData.name}: ${result.error || 'Failed to create'}`)
          }
        } catch (error) {
          failCount++
          errors.push(`${productData.name}: Error creating product`)
        }
      }

      // Refresh products list
      if (successCount > 0) {
        const updatedProducts = await fetchProducts()
        setProducts(updatedProducts)
      }

      // Show results
      let message = `Successfully created ${successCount} product(s).`
      if (failCount > 0) {
        message += ` ${failCount} product(s) failed.`
      }
      if (errors.length > 0 && errors.length <= 10) {
        message += `\n\nErrors:\n${errors.join('\n')}`
      } else if (errors.length > 10) {
        message += `\n\nFirst 10 errors:\n${errors.slice(0, 10).join('\n')}\n...and ${errors.length - 10} more errors.`
      }
      
      alert(message)

      // Reset file input
      if (excelFileInputRef.current) {
        excelFileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error processing Excel file:', error)
      alert('Error processing Excel file: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setUploadingExcel(false)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Build hierarchical category string using "/" format
      let categoryString = productForm.mainCategory
      if (productForm.subCategory) {
        categoryString += `/${productForm.subCategory}`
      }
      if (productForm.level2Category) {
        categoryString += `/${productForm.level2Category}`
      }

      // Calculate discount and final price
      const mrp = parseFloat(productForm.mrp) || 0
      const offerPrice = parseFloat(productForm.offerPrice) || 0
      const gstPercentage = parseFloat(productForm.gstPercentage) || 0
      const discount = mrp - offerPrice
      const gstAmount = (offerPrice * gstPercentage) / 100
      const finalPrice = offerPrice + gstAmount

      const result = await createProduct({
        ...productForm,
        category: categoryString,
        price: finalPrice, // Keep price field for backward compatibility, set to finalPrice
        mrp: mrp,
        offerPrice: offerPrice,
        gstPercentage: gstPercentage,
        discount: discount,
        finalPrice: finalPrice,
        stock: parseInt(productForm.stock),
        vendor: "Admin"
      })
      
      if (result.success) {
        setProducts([...products, result.data])
        setProductForm({ name: "", mainCategory: "", subCategory: "", level2Category: "", price: "", mrp: "", offerPrice: "", gstPercentage: "", stock: "", description: "", hslCode: "", images: [] })
        setMainCategory("")
        setIsProductDialogOpen(false)
      } else {
        alert('Error creating product: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Error creating product')
    }
  }

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Build hierarchical category string using "/" format
      let categoryString = serviceForm.mainCategory
      if (serviceForm.subCategory) {
        categoryString += `/${serviceForm.subCategory}`
      }
      if (serviceForm.level2Category) {
        categoryString += `/${serviceForm.level2Category}`
      }

      const result = await createService({
        ...serviceForm,
        category: categoryString,
        price: parseFloat(serviceForm.price),
        vendor: "Admin",
        images: serviceForm.images || []
      })
      
      if (result.success) {
        setServices([...services, result.data])
        setServiceForm({ name: "", mainCategory: "", subCategory: "", level2Category: "", price: "", duration: "", description: "", location: "", images: [] })
        setMainCategory("")
        setIsServiceDialogOpen(false)
      } else {
        alert('Error creating service: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating service:', error)
      alert('Error creating service')
    }
  }

  const handleEshopSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const inventoryData = {
        productId: eshopForm.productId,
        productName: eshopForm.productName,
        customerId: eshopForm.customerId,
        customerName: eshopForm.customerName,
        quantity: parseInt(eshopForm.quantity),
        price: eshopForm.price,
        notes: eshopForm.notes,
        lastUpdated: new Date().toISOString()
      }

      if (editingEshopItem) {
        // Update existing inventory
        const response = await fetch(`/api/eshop-inventory/${editingEshopItem._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inventoryData),
        })
        const result = await response.json()
        
        if (result.success) {
          setEshopInventory(eshopInventory.map((item: any) => 
            item._id === editingEshopItem._id ? result.data : item
          ))
          alert('Inventory updated successfully')
        } else {
          alert('Error updating inventory: ' + result.error)
        }
      } else {
        // Create new inventory
        const response = await fetch('/api/eshop-inventory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inventoryData),
        })
        const result = await response.json()
        
        if (result.success) {
          setEshopInventory([...eshopInventory, result.data])
          alert('Product inventory added successfully')
        } else {
          alert('Error adding inventory: ' + result.error)
        }
      }
      
      setIsEshopDialogOpen(false)
      setEditingEshopItem(null)
      setEshopForm({ customerId: '', customerName: '', productId: '', productName: '', quantity: '', price: 0, notes: '', deliveryType: 'from_warehouse', supplierName: '' })
      
      // If delivery type is from_warehouse, deduct from warehouse stock
      if (eshopForm.deliveryType === 'from_warehouse') {
        try {
          const warehouseStockResponse = await fetch('/api/warehouse-stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: eshopForm.productId,
              productName: eshopForm.productName,
              availableStock: -parseInt(eshopForm.quantity),
              warehouseName: 'Main Warehouse'
            })
          })
          const wsResult = await warehouseStockResponse.json()
          if (!wsResult.success) {
            console.error('Error updating warehouse stock:', wsResult.error)
          }
        } catch (error) {
          console.error('Error updating warehouse stock:', error)
        }
      }
      
      // Refresh warehouse stock
      const wsData = await fetchWarehouseStock()
      setWarehouseStock(wsData)
    } catch (error) {
      console.error('Error submitting inventory:', error)
      alert('Error submitting inventory')
    }
  }

  // Purchase Order Handlers
  const handlePOSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!poForm.supplierName || poForm.items.length === 0) {
        alert('Please add supplier name and at least one item')
        return
      }
      
      const response = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...poForm,
          expectedDate: poForm.expectedDate ? new Date(poForm.expectedDate) : undefined
        })
      })
      
      const result = await response.json()
      if (result.success) {
        // Note: Warehouse stock is NOT updated here - it will be updated when GRN is created
        // PO is just planning/documentation
        
        setPurchaseOrders([...purchaseOrders, result.data])
        setPOForm({
          supplierName: "",
          items: [],
          deliveryType: "to_warehouse",
          poType: "standard",
          customerId: "",
          customerName: "",
          expectedDate: "",
          notes: ""
        })
        setIsPODialogOpen(false)
        alert(`Purchase order created successfully${poForm.poType === 'reference' ? ' (Reference PO - for audit only)' : ''}`)
      } else {
        alert('Error creating purchase order: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating purchase order:', error)
      alert('Error creating purchase order')
    }
  }

  // Update PO Status Handler
  const handlePOStatusUpdate = async (poId: string, newStatus: string) => {
    try {
      const po = purchaseOrders.find((p: any) => p._id === poId)
      if (!po) return

      const response = await fetch(`/api/purchase-orders/${poId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      const result = await response.json()
      if (result.success) {
        // If status is "reached" and delivery type is direct_to_customer, update customer inventory
        if (newStatus === 'reached' && po.deliveryType === 'direct_to_customer' && po.customerId) {
          try {
            for (const item of po.items) {
              // API now handles existing products automatically - adds to quantity if exists
              const response = await fetch('/api/eshop-inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  productId: item.productId,
                  productName: item.productName,
                  customerId: po.customerId,
                  customerName: po.customerName || '',
                  quantity: item.quantity,
                  price: item.unitPrice,
                  notes: `Direct delivery from ${po.supplierName} - PO ${po.poNumber}`
                })
              })
              const result = await response.json()
              if (!result.success) {
                console.error('Error adding to customer inventory:', result.error)
              }
            }
            // Refresh customer inventory
            const eshopData = await fetchEshopInventory()
            setEshopInventory(eshopData)
            alert('Customer inventory updated successfully')
          } catch (error) {
            console.error('Error updating customer inventory:', error)
            alert('Error updating customer inventory. Please check console.')
          }
        }

        // Refresh purchase orders
        const poData = await fetchPurchaseOrders()
        setPurchaseOrders(poData)
        alert('Purchase order status updated successfully')
      } else {
        alert('Error updating purchase order status: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating purchase order status:', error)
      alert('Error updating purchase order status')
    }
  }

  // Inward Handler
  const handleInwardSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // For Direct Inward, validate items exist
      if (isDirectInward) {
        if (!inwardForm.items || inwardForm.items.length === 0) {
          alert('Please add at least one item for Direct Inward')
          return
        }
        if (!inwardForm.supplierName) {
          alert('Please enter supplier name for Direct Inward')
          return
        }
      } else {
        // For PO-linked inward, validate PO
        if (!inwardForm.poNumber || !selectedPO) {
          alert('Please select a purchase order')
          return
        }
      }

      // Validate items
      for (const item of inwardForm.items) {
        const acceptedQty = item.receivedQuantity - (item.damagedQuantity || 0) - (item.lostQuantity || 0)
        if (acceptedQty < 0) {
          alert(`Invalid quantities for ${item.productName}. Accepted quantity cannot be negative.`)
          return
        }
        if (!isDirectInward && item.receivedQuantity > item.orderedQuantity) {
          alert(`Received quantity for ${item.productName} cannot exceed ordered quantity.`)
          return
        }
      }
      
      const response = await fetch('/api/inward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poNumber: isDirectInward ? null : inwardForm.poNumber,
          inwardType: isDirectInward ? 'DIRECT_INWARD' : 'PO_LINKED',
          supplierName: isDirectInward ? inwardForm.supplierName : (selectedPO?.supplierName || ''),
          receivedDate: inwardForm.receivedDate,
          items: inwardForm.items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            orderedQuantity: item.orderedQuantity || 0,
            receivedQuantity: item.receivedQuantity,
            damagedQuantity: item.damagedQuantity || 0,
            lostQuantity: item.lostQuantity || 0,
            acceptedQuantity: item.receivedQuantity - (item.damagedQuantity || 0) - (item.lostQuantity || 0),
            unitPrice: item.unitPrice || 0
          })),
          notes: inwardForm.notes || ''
        })
      })
      
      const result = await response.json()
      if (result.success) {
        // Refresh data
        const inwardData = await fetchInwardEntries()
        setInwardEntries(inwardData)
        setInwardForm({
          poNumber: "",
          inwardType: "PO_LINKED",
          supplierName: "",
          receivedDate: new Date().toISOString().split('T')[0],
          items: [],
          notes: ""
        })
        setSelectedPO(null)
        setIsDirectInward(false)
        setIsInwardDialogOpen(false)
        setIsInwardTypeDialogOpen(false)
        alert('Goods received successfully! Inward entry created.')
      } else {
        alert('Error creating inward entry: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating inward entry:', error)
      alert('Error creating inward entry')
    }
  }

  // Generate GRN from Inward Handler
  const handleGenerateGRNFromInward = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!selectedInward) {
        alert('No inward entry selected')
        return
      }

      // Validate split allocation if enabled
      if (isSplitStock) {
        if (customerAllocations.length === 0) {
          alert('Please add at least one customer for stock allocation')
          return
        }
        
        // Validate each customer
        for (let i = 0; i < customerAllocations.length; i++) {
          const customerAlloc = customerAllocations[i]
          
          if (!customerAlloc.customerId) {
            alert(`Please select a customer for Customer ${i + 1}`)
            return
          }
          
          if (!customerAlloc.sellingPrice || customerAlloc.sellingPrice <= 0) {
            alert(`Please enter a valid selling price for Customer ${i + 1}`)
            return
          }
        }
        
        // Validate allocations for each item
        for (const item of selectedInward.items) {
          let totalCustomerQty = 0
          
          for (const customerAlloc of customerAllocations) {
            const allocation = customerAlloc.itemAllocations.find(a => a.productId === item.productId)
            const customerQty = allocation?.customerQuantity || 0
            
            if (customerQty < 0) {
              alert(`Customer quantity for ${item.productName} cannot be negative`)
              return
            }
            
            totalCustomerQty += customerQty
          }
          
          if (totalCustomerQty > item.acceptedQuantity) {
            alert(`Total customer allocation for ${item.productName} (${totalCustomerQty}) cannot exceed accepted quantity (${item.acceptedQuantity})`)
            return
          }
        }
        
        // Check if at least one item has customer allocation
        const totalCustomerQty = customerAllocations.reduce((sum, ca) => {
          return sum + ca.itemAllocations.reduce((itemSum, a) => itemSum + (a.customerQuantity || 0), 0)
        }, 0)
        if (totalCustomerQty === 0) {
          alert('Please allocate at least some quantity to customer(s), or uncheck split stock option')
          return
        }
      }

      const response = await fetch(`/api/inward/${selectedInward._id}/generate-grn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          warehouseName: grnForm.warehouseName,
          location: grnForm.location,
          notes: grnForm.notes || '',
          splitToCustomer: isSplitStock,
          customerAllocations: isSplitStock ? customerAllocations.map(ca => ({
            customerId: ca.customerId,
            customerName: ca.customerName,
            sellingPrice: ca.sellingPrice,
            itemAllocations: ca.itemAllocations
          })) : []
        })
      })
      
      const result = await response.json()
      if (result.success) {
        // Refresh data
        const [inwardData, poData, wsData, wasteData, eshopData] = await Promise.all([
          fetchInwardEntries(),
          fetchPurchaseOrders(),
          fetchWarehouseStock(),
          fetchWasteEntries(),
          fetchEshopInventory()
        ])
        setInwardEntries(inwardData)
        setPurchaseOrders(poData)
        setWarehouseStock(wsData)
        setWasteEntries(wasteData)
        setEshopInventory(eshopData)
        setGRNForm({ 
          poNumber: "", 
          receivedQuantity: "", 
          warehouseName: "Main Warehouse", 
          grnType: "GRN_CREATED",
          supplierName: "",
          location: {},
          notes: "",
          items: [] 
        })
        setSelectedInward(null)
        setIsSplitStock(false)
        setCustomerAllocations([])
        setGrnFormPage(1)
        setIsGenerateGRNFromInwardOpen(false)
        const message = isSplitStock 
          ? `GRN generated successfully! Stock has been split between ${customerAllocations.length} customer(s) and warehouse.`
          : 'GRN generated successfully! Goods have been moved to warehouse.'
        alert(message)
      } else {
        alert('Error generating GRN: ' + result.error)
      }
    } catch (error) {
      console.error('Error generating GRN from inward:', error)
      alert('Error generating GRN from inward entry')
    }
  }

  // GRN Handler
  const handleGRNSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // For Direct GRN, validate items exist
      if (isDirectGRN) {
        if (!grnForm.items || grnForm.items.length === 0) {
          alert('Please add at least one item for Direct GRN')
          return
        }
        if (!grnForm.supplierName) {
          alert('Please enter supplier name for Direct GRN')
          return
        }
      } else {
        // For linked GRN, validate PO
        if (!grnForm.poNumber || !selectedPO) {
          alert('Please select a purchase order')
          return
        }
      }

      // Validate items
      for (const item of grnForm.items) {
        const acceptedQty = item.receivedQuantity - (item.damagedQuantity || 0) - (item.lostQuantity || 0)
        if (acceptedQty < 0) {
          alert(`Invalid quantities for ${item.productName}. Accepted quantity cannot be negative.`)
          return
        }
        if (!isDirectGRN && item.receivedQuantity > item.orderedQuantity) {
          alert(`Received quantity for ${item.productName} cannot exceed ordered quantity.`)
          return
        }
      }
      
      const response = await fetch('/api/grn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poNumber: isDirectGRN ? null : grnForm.poNumber,
          grnType: isDirectGRN ? 'DIRECT_GRN' : 'GRN_CREATED',
          supplierName: isDirectGRN ? grnForm.supplierName : (selectedPO?.supplierName || ''),
          warehouseName: grnForm.warehouseName,
          location: grnForm.location,
          items: grnForm.items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            orderedQuantity: item.orderedQuantity || 0,
            receivedQuantity: item.receivedQuantity,
            damagedQuantity: item.damagedQuantity || 0,
            lostQuantity: item.lostQuantity || 0,
            acceptedQuantity: item.receivedQuantity - (item.damagedQuantity || 0) - (item.lostQuantity || 0),
            unitPrice: item.unitPrice || 0
          }))
        })
      })
      
      const result = await response.json()
      if (result.success) {
        // Refresh data
        const [poData, wsData, eshopData, wasteData] = await Promise.all([
          fetchPurchaseOrders(),
          fetchWarehouseStock(),
          fetchEshopInventory(),
          fetchWasteEntries()
        ])
        setPurchaseOrders(poData)
        setWarehouseStock(wsData)
        setEshopInventory(eshopData)
        setWasteEntries(wasteData)
        setGRNForm({ 
          poNumber: "", 
          receivedQuantity: "", 
          warehouseName: "Main Warehouse", 
          grnType: "GRN_CREATED",
          supplierName: "",
          location: {},
          notes: "",
          items: [] 
        })
        setSelectedPO(null)
        setIsDirectGRN(false)
        setIsGRNDialogOpen(false)
        alert('Goods received successfully! Stock has been added to warehouse.')
      } else {
        alert('Error processing GRN: ' + result.error)
      }
    } catch (error) {
      console.error('Error processing GRN:', error)
      alert('Error processing GRN')
    }
  }

  // Waste Entry Handler
  const handleWasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!wasteForm.productId || !wasteForm.quantity) {
        alert('Please select product and enter quantity')
        return
      }
      
      // Check if warehouse has enough stock
      const warehouseItem = warehouseStock.find((ws: any) => ws.productId === wasteForm.productId)
      if (!warehouseItem) {
        alert('Product not found in warehouse stock')
        return
      }
      if (warehouseItem.availableStock < parseInt(wasteForm.quantity)) {
        alert(`Insufficient stock. Available: ${warehouseItem.availableStock}`)
        return
      }
      
      // Get warehouse name from selected stock item
      const warehouseName = warehouseItem?.warehouseName || wasteForm.warehouseName || "Main Warehouse"
      
      const response = await fetch('/api/waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...wasteForm,
          quantity: parseInt(wasteForm.quantity),
          warehouseName
        })
      })
      
      const result = await response.json()
      if (result.success) {
        // Refresh data
        const [wasteData, wsData] = await Promise.all([
          fetchWasteEntries(),
          fetchWarehouseStock()
        ])
        setWasteEntries(wasteData)
        setWarehouseStock(wsData)
        setWasteForm({
          productId: "",
          productName: "",
          quantity: "",
          reason: "damaged",
          description: "",
          warehouseName: "Main Warehouse"
        })
        setIsWasteDialogOpen(false)
        alert('Waste entry recorded successfully')
      } else {
        alert('Error recording waste: ' + result.error)
      }
    } catch (error) {
      console.error('Error recording waste:', error)
      alert('Error recording waste')
    }
  }

  // Convert Sample to Sale Handler
  const handleConvertSampleToSale = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!convertingOutward || !convertForm.unitPrice) {
        alert('Please enter unit price')
        return
      }
      
      const unitPrice = parseFloat(convertForm.unitPrice)
      if (isNaN(unitPrice) || unitPrice <= 0) {
        alert('Unit price must be a positive number')
        return
      }
      
      const response = await fetch(`/api/outwards/${convertingOutward._id}/convert`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitPrice: unitPrice,
          notes: convertForm.notes
        })
      })
      
      const result = await response.json()
      if (result.success) {
        // Refresh data
        const [outwardData, eshopData] = await Promise.all([
          fetchOutwardEntries(),
          fetchEshopInventory()
        ])
        setOutwardEntries(outwardData)
        setEshopInventory(eshopData)
        setConvertForm({ unitPrice: "", notes: "" })
        setConvertingOutward(null)
        setIsConvertSampleDialogOpen(false)
        alert('Sample successfully converted to sale! Product has been added to customer inventory.')
      } else {
        alert('Error converting sample: ' + result.error)
      }
    } catch (error) {
      console.error('Error converting sample:', error)
      alert('Error converting sample to sale')
    }
  }

  // Delete Outward Entry Handler
  const handleDeleteOutward = async (outwardId: string) => {
    if (!confirm('Are you sure you want to delete this outward entry? This will restore the stock back to the warehouse.')) {
      return
    }
    
    try {
      const response = await fetch(`/api/outwards/${outwardId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Refresh data
        const [outwardData, wsData, eshopData] = await Promise.all([
          fetchOutwardEntries(),
          fetchWarehouseStock(),
          fetchEshopInventory()
        ])
        setOutwardEntries(outwardData)
        setWarehouseStock(wsData)
        setEshopInventory(eshopData)
        
        alert('Outward entry deleted successfully. Stock has been restored to warehouse.')
      } else {
        alert(`Error deleting outward entry: ${result.error}`)
      }
    } catch (error) {
      console.error('Error deleting outward entry:', error)
      alert('Error deleting outward entry')
    }
  }

  // Outward Entry Handler - Multiple Products
  const handleOutwardSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Validation
      if (!outwardForm.customerId) {
        alert('Please select a customer')
        return
      }
      
      if (!outwardForm.items || outwardForm.items.length === 0) {
        alert('Please add at least one product')
        return
      }

      // Validate all items
      for (const item of outwardForm.items) {
        if (!item.productId) {
          alert(`Please select a product for item ${outwardForm.items.indexOf(item) + 1}`)
          return
        }
        if (item.quantity <= 0) {
          alert(`Please enter a valid quantity for ${item.productName || 'item ' + (outwardForm.items.indexOf(item) + 1)}`)
          return
        }
        
        // Check stock availability
        const warehouseItem = warehouseStock.find((ws: any) => ws.productId === item.productId && ws.warehouseName === outwardForm.warehouseName)
        if (!warehouseItem) {
          alert(`Product ${item.productName} not found in selected warehouse`)
          return
        }
        if (warehouseItem.availableStock < item.quantity) {
          alert(`Insufficient stock for ${item.productName}. Available: ${warehouseItem.availableStock}, Requested: ${item.quantity}`)
          return
        }
      }
      
      // Submit all products - use same reference number for batch
      const submissions = outwardForm.items.map(async (item) => {
        const response = await fetch('/api/outwards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: item.productId,
            productName: item.productName,
            customerId: outwardForm.customerId,
            customerName: outwardForm.customerName,
            quantity: item.quantity,
            warehouseName: outwardForm.warehouseName,
            unitPrice: item.unitPrice || 0,
            outwardType: item.outwardType,
            referenceNumber: outwardForm.referenceNumber || '',
            notes: outwardForm.notes,
            outwardDate: outwardForm.outwardDate,
            recordedBy: "Admin" // You can get this from auth context if available
          })
        })
        return response.json()
      })
      
      const results = await Promise.all(submissions)
      
      // Check if all succeeded
      const failed = results.filter(r => !r.success)
      if (failed.length > 0) {
        alert(`Error recording ${failed.length} outward entry/entries: ${failed.map(f => f.error).join(', ')}`)
        return
      }
      
      // Refresh data
      const [outwardData, wsData, eshopData] = await Promise.all([
        fetchOutwardEntries(),
        fetchWarehouseStock(),
        fetchEshopInventory()
      ])
      setOutwardEntries(outwardData)
      setWarehouseStock(wsData)
      setEshopInventory(eshopData)
      
      // Reset form
      setOutwardForm({
        customerId: "",
        customerName: "",
        warehouseName: "Main Warehouse",
        referenceNumber: "",
        notes: "",
        outwardDate: new Date().toISOString().split('T')[0],
        items: []
      })
      setOutwardFormPage(1)
      setIsOutwardDialogOpen(false)
      
      alert(`Successfully recorded ${outwardForm.items.length} outward entry/entries! Stock has been deducted from warehouse.`)
    } catch (error) {
      console.error('Error recording outward entry:', error)
      alert('Error recording outward entry')
    }
  }

  const handleMultipleProductsSubmit = async () => {
    try {
      if (!eshopForm.customerId) {
        alert('Please select a customer');
        return;
      }

      const validProducts = multipleProducts.filter(p => p.productId && p.quantity > 0);
      if (validProducts.length === 0) {
        alert('Please add at least one valid product');
        return;
      }

      // Submit each product individually
      const submissions = validProducts.map(async (product) => {
        const inventoryData = {
          productId: product.productId,
          productName: product.productName,
          customerId: eshopForm.customerId,
          customerName: eshopForm.customerName,
          quantity: product.quantity,
          price: product.price,
          notes: product.notes,
          lastUpdated: new Date().toISOString()
        };

        const response = await fetch('/api/eshop-inventory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inventoryData),
        });

        return response.json();
      });

      const results = await Promise.all(submissions);
      const successCount = results.filter(r => r.success).length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        // Refresh the e-shop inventory list
        const updatedInventory = await fetchEshopInventory();
        setEshopInventory(updatedInventory);
        
        // Reset form and close dialog
        setEshopForm({
          productId: "",
          productName: "",
          customerId: "",
          customerName: "",
          quantity: "1",
          price: 0,
          notes: "",
          deliveryType: "from_warehouse",
          supplierName: ""
        });
        setMultipleProducts([{
          productId: "",
          productName: "",
          quantity: 1,
          price: 0,
          notes: ""
        }]);
        setIsEshopDialogOpen(false);
        
        if (failCount === 0) {
          alert(`Successfully added ${successCount} products to inventory!`);
        } else {
          alert(`Added ${successCount} products successfully. ${failCount} failed to add.`);
        }
      } else {
        alert('Failed to add any products to inventory');
      }
    } catch (error) {
      console.error('Error submitting multiple products:', error);
      alert('Error submitting products to inventory');
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const result = await deleteProduct(id)
      if (result.success) {
        setProducts(products.filter((p: any) => p._id !== id))
      } else {
        alert('Error deleting product: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  const handleDeleteService = async (id: string) => {
    try {
      const result = await deleteService(id)
      if (result.success) {
        setServices(services.filter((s: any) => s._id !== id))
      } else {
        alert('Error deleting service: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Error deleting service')
    }
  }

  // Handle View Product
  const handleViewProduct = (product: any) => {
    setViewingProduct(product)
    setIsViewProductDialogOpen(true)
  }

  // Handle Edit Product
  const handleEditProduct = (product: any) => {
    // Parse category string to get mainCategory, subCategory, level2Category
    const categoryParts = product.category ? product.category.split('/') : []
    setEditingProduct(product)
    setProductForm({
      name: product.name || "",
      mainCategory: categoryParts[0] || "",
      subCategory: categoryParts[1] || "",
      level2Category: categoryParts[2] || "",
      price: product.price?.toString() || "",
      mrp: product.mrp?.toString() || "",
      offerPrice: product.offerPrice?.toString() || "",
      gstPercentage: product.gstPercentage?.toString() || "",
      stock: product.stock?.toString() || "",
      description: product.description || "",
      hslCode: product.hslCode || "",
      images: product.images || []
    })
    setIsEditProductDialogOpen(true)
  }

  // Handle Update Product
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    
    try {
      // Build hierarchical category string using "/" format
      let categoryString = productForm.mainCategory
      if (productForm.subCategory) {
        categoryString += `/${productForm.subCategory}`
      }
      if (productForm.level2Category) {
        categoryString += `/${productForm.level2Category}`
      }

      // Calculate discount and final price
      const mrp = parseFloat(productForm.mrp) || 0
      const offerPrice = parseFloat(productForm.offerPrice) || 0
      const gstPercentage = parseFloat(productForm.gstPercentage) || 0
      const discount = mrp - offerPrice
      const gstAmount = (offerPrice * gstPercentage) / 100
      const finalPrice = offerPrice + gstAmount

      const result = await updateProduct(editingProduct._id, {
        ...productForm,
        category: categoryString,
        price: finalPrice,
        mrp: mrp,
        offerPrice: offerPrice,
        gstPercentage: gstPercentage,
        discount: discount,
        finalPrice: finalPrice,
        stock: parseInt(productForm.stock),
        vendor: "Admin"
      })
      
      if (result.success) {
        const updatedProducts = await fetchProducts()
        setProducts(updatedProducts)
        setProductForm({ name: "", mainCategory: "", subCategory: "", level2Category: "", price: "", mrp: "", offerPrice: "", gstPercentage: "", stock: "", description: "", hslCode: "", images: [] })
        setEditingProduct(null)
        setIsEditProductDialogOpen(false)
        alert('Product updated successfully!')
      } else {
        alert('Error updating product: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Error updating product')
    }
  }

  // Handle View Service
  const handleViewService = (service: any) => {
    setViewingService(service)
    setIsViewServiceDialogOpen(true)
  }

  // Handle Edit Service
  const handleEditService = (service: any) => {
    // Parse category string to get mainCategory, subCategory, level2Category
    const categoryParts = service.category ? service.category.split('/') : []
    setEditingService(service)
    setServiceForm({
      name: service.name || "",
      mainCategory: categoryParts[0] || "",
      subCategory: categoryParts[1] || "",
      level2Category: categoryParts[2] || "",
      price: service.price?.toString() || "",
      duration: service.duration || "",
      description: service.description || "",
      location: service.location || "",
      images: service.images || []
    })
    setIsEditServiceDialogOpen(true)
  }

  // Handle Update Service
  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingService) return
    
    try {
      // Build hierarchical category string using "/" format
      let categoryString = serviceForm.mainCategory
      if (serviceForm.subCategory) {
        categoryString += `/${serviceForm.subCategory}`
      }
      if (serviceForm.level2Category) {
        categoryString += `/${serviceForm.level2Category}`
      }

      const result = await updateService(editingService._id, {
        ...serviceForm,
        category: categoryString,
        price: parseFloat(serviceForm.price),
        vendor: "Admin",
        images: serviceForm.images || []
      })
      
      if (result.success) {
        const updatedServices = await fetchServices()
        setServices(updatedServices)
        setServiceForm({ name: "", mainCategory: "", subCategory: "", level2Category: "", price: "", duration: "", description: "", location: "", images: [] })
        setEditingService(null)
        setIsEditServiceDialogOpen(false)
        alert('Service updated successfully!')
      } else {
        alert('Error updating service: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating service:', error)
      alert('Error updating service')
    }
  }

  const handleImageUpload = async (file: File, folder: string = 'batches') => {
    try {
      setUploading(true)
      const result = await uploadFile(file, folder)
      console.log('Upload result:', result)
      if (result.success) {
        return result.url
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
      return null
    } finally {
      setUploading(false)
    }
  }

  // Calculate total revenue from orders
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
  
  const stats = [
    {
      title: "Total Products",
      value: products.length,
      change: "+12% from last month",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Total Services",
      value: services.length,
      change: "+8% from last month",
      icon: Settings,
      color: "text-green-600"
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: "+15% from last month",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Total Orders",
      value: orders.length,
      change: "+23% from last month",
      icon: ShoppingCart,
      color: "text-orange-600"
    }
  ]

  // Open edit dialog with selected item
  const handleEditEshopItem = (item: any) => {
    setEshopEditForm({
      id: item._id,
      productName: item.productName || "",
      quantity: item.quantity || 1,
      price: item.price || 0,
      notes: item.notes || ""
    })
    setIsEshopEditOpen(true)
  }

  // Submit edit update
  const handleEshopEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        productName: eshopEditForm.productName,
        quantity: eshopEditForm.quantity,
        price: eshopEditForm.price,
        notes: eshopEditForm.notes || ""
      }
      const res = await updateEshopInventory(eshopEditForm.id, payload)
      if (!res?.success) throw new Error(res?.error || "Update failed")
      // Reflect in local state
      setEshopInventory((prev: any[]) => prev.map((it: any) => (it._id === eshopEditForm.id ? { ...it, ...payload, lastUpdated: new Date().toISOString() } : it)))
      setIsEshopEditOpen(false)
    } catch (err: any) {
      alert(err?.message || "Error updating inventory item")
    }
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#d1e4f3' }}>
      {/* Sidebar */}
      <div className="w-64 bg-card border-r">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold">Adminza Dashboard</span>
          </div>
        </div>

        <nav className="px-4 space-y-2">
          <Button 
            variant={activeSection === "dashboard" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => {
              setActiveSection("dashboard")
              setIsProductsManagementExpanded(false)
              setIsCustomerManagementExpanded(false)
              setIsOrdersExpanded(false)
              setIsReportsExpanded(false)
            }}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          
          {/* Products Management Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between w-full">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  setIsProductsManagementExpanded(!isProductsManagementExpanded)
                }}
              >
                <Package className="h-4 w-4 mr-2" />
                Products Management
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1"
                onClick={() => setIsProductsManagementExpanded(!isProductsManagementExpanded)}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${isProductsManagementExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            {/* Sub-items - Only show when expanded */}
            {isProductsManagementExpanded && (
              <div className="ml-6 space-y-1">
                <Button 
                  variant={activeSubSection === "categories" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("products-management")
                    setActiveSubSection("categories")
                  }}
                >
                  <Tag className="h-3 w-3 mr-2" />
                  Categories
                </Button>
                <Button 
                  variant={activeSubSection === "sub-categories" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("products-management")
                    setActiveSubSection("sub-categories")
                  }}
                >
                  <Tag className="h-3 w-3 mr-2" />
                  Sub Categories
                </Button>
                <Button 
                  variant={activeSubSection === "level2-categories" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("products-management")
                    setActiveSubSection("level2-categories")
                  }}
                >
                  <Tag className="h-3 w-3 mr-2" />
                  Level2 Sub Categories
                </Button>
                <Button 
                  variant={activeSubSection === "services" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("products-management")
                    setActiveSubSection("services")
                  }}
                >
                  <Settings className="h-3 w-3 mr-2" />
                  Services
                </Button>
                <Button 
                  variant={activeSubSection === "products" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("products-management")
                    setActiveSubSection("products")
                  }}
                >
                  <Package className="h-3 w-3 mr-2" />
                  Products
                </Button>
              </div>
            )}
          </div>
          
          {/* Customer Management Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between w-full">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  setIsCustomerManagementExpanded(!isCustomerManagementExpanded)
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                Customer Management
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1"
                onClick={() => setIsCustomerManagementExpanded(!isCustomerManagementExpanded)}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${isCustomerManagementExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            {/* Sub-items - Only show when expanded */}
            {isCustomerManagementExpanded && (
              <div className="ml-6 space-y-1">
                <Button 
                  variant={activeSubSection === "my-customers" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("customer-management")
                    setActiveSubSection("my-customers")
                  }}
                >
                  <Users className="h-3 w-3 mr-2" />
                  Stock with Customer
                </Button>
                <Button 
                  variant={activeSubSection === "block-unblock-customer" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("customer-management")
                    setActiveSubSection("block-unblock-customer")
                    setBlockCustomerPage(1)
                  }}
                >
                  <Users className="h-3 w-3 mr-2" />
                  Block/Unblock Customer
                </Button>
                <Button 
                  variant={activeSubSection === "edit-customer-details" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("customer-management")
                    setActiveSubSection("edit-customer-details")
                    setEditCustomerPage(1)
                  }}
                >
                  <Edit className="h-3 w-3 mr-2" />
                  Edit Customer Details
                </Button>
                <Button 
                  variant={activeSubSection === "supplier-management" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("customer-management")
                    setActiveSubSection("supplier-management")
                    setSupplierPage(1)
                  }}
                >
                  <Package className="h-3 w-3 mr-2" />
                  Supplier Management
                </Button>
              </div>
            )}
          </div>
          
          {/* Inventory Management Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between w-full">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  setIsInventoryManagementExpanded(!isInventoryManagementExpanded)
                }}
              >
                <Package className="h-4 w-4 mr-2" />
                Inventory Management
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1"
                onClick={() => setIsInventoryManagementExpanded(!isInventoryManagementExpanded)}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${isInventoryManagementExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            {/* Sub-items - Only show when expanded */}
            {isInventoryManagementExpanded && (
              <div className="ml-6 space-y-1">
                <Button 
                  variant={activeSubSection === "purchase-orders" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("inventory-management")
                    setActiveSubSection("purchase-orders")
                  }}
                >
                  <FileText className="h-3 w-3 mr-2" />
                  Purchase Orders
                </Button>
                <Button 
                  variant={activeSubSection === "warehouse-stock" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("inventory-management")
                    setActiveSubSection("warehouse-stock")
                  }}
                >
                  <Package className="h-3 w-3 mr-2" />
                  Warehouse Stock
                </Button>
                <Button 
                  variant={activeSubSection === "inward" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("inventory-management")
                    setActiveSubSection("inward")
                  }}
                >
                  <Package className="h-3 w-3 mr-2" />
                  Inward
                </Button>
                <Button 
                  variant={activeSubSection === "waste-management" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("inventory-management")
                    setActiveSubSection("waste-management")
                  }}
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Waste Management
                </Button>
                <Button 
                  variant={activeSubSection === "outwards" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("inventory-management")
                    setActiveSubSection("outwards")
                  }}
                >
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Outwards
                </Button>
              </div>
            )}
          </div>
          
          {/* Orders Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between w-full">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  setIsOrdersExpanded(!isOrdersExpanded)
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Orders
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1"
                onClick={() => setIsOrdersExpanded(!isOrdersExpanded)}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${isOrdersExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            {/* Sub-items - Only show when expanded */}
            {isOrdersExpanded && (
              <div className="ml-6 space-y-1">
                <Button 
                  variant={activeSubSection === "all-orders" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("orders")
                    setActiveSubSection("all-orders")
                  }}
                >
                  <ShoppingCart className="h-3 w-3 mr-2" />
                  All Orders
                </Button>
                <Button 
                  variant={activeSubSection === "received-quotations" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("orders")
                    setActiveSubSection("received-quotations")
                  }}
                >
                  <FileText className="h-3 w-3 mr-2" />
                  Quotations
                </Button>
                <Button 
                  variant={activeSubSection === "enquiries" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("orders")
                    setActiveSubSection("enquiries")
                  }}
                >
                  <Mail className="h-3 w-3 mr-2" />
                  Enquiries
                </Button>
              </div>
            )}
          </div>

          {/* Reports Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between w-full">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  setIsReportsExpanded(!isReportsExpanded)
                }}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Reports
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1"
                onClick={() => setIsReportsExpanded(!isReportsExpanded)}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${isReportsExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            {/* Sub-items - Only show when expanded */}
            {isReportsExpanded && (
              <div className="ml-6 space-y-1">
                <Button 
                  variant={activeSubSection === "invoice-reports" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("reports")
                    setActiveSubSection("invoice-reports")
                  }}
                >
                  <FileText className="h-3 w-3 mr-2" />
                  Invoice Reports
                </Button>
                <Button 
                  variant={activeSubSection === "supplier-reports" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("reports")
                    setActiveSubSection("supplier-reports")
                  }}
                >
                  <Package className="h-3 w-3 mr-2" />
                  Supplier Reports
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        {activeSection !== "customer-management" && (
          <header className="bg-card border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Manage your products and services</p>
              </div>
              <div className="flex items-center space-x-4">
                {activeSection === "dashboard" && (
                  <Button
                    onClick={refreshDashboardData}
                    disabled={refreshing}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium text-sm">A</span>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Dashboard Content */}
        <main className="p-6 space-y-6" style={{ backgroundColor: '#d1e4f3', minHeight: '100%' }}>
          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                  const IconComponent = stat.icon
                  return (
                    <Card key={stat.title}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                          </div>
                          <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              
              {/* Additional Insights Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order, index) => (
                        <div key={order._id} className="flex items-center space-x-4">
                          <div className={`w-2 h-2 rounded-full ${
                            index === 0 ? 'bg-green-500' : 
                            index === 1 ? 'bg-blue-500' : 'bg-orange-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">New order #{order.orderNo}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {orders.length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground">No recent orders</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Top Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categories.slice(0, 3).map((category, index) => {
                        const productCount = products.filter(p => p.category === category.name).length
                        const serviceCount = services.filter(s => s.category === category.name).length
                        const totalItems = productCount + serviceCount
                        const totalAllItems = products.length + services.length
                        const percentage = totalAllItems > 0 ? Math.round((totalItems / totalAllItems) * 100) : 0
                        
                        return (
                          <div key={category._id} className="flex items-center justify-between">
                            <span className="text-sm">{category.name}</span>
                            <span className="text-sm font-medium">{percentage}%</span>
                          </div>
                        )
                      })}
                      {categories.length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground">No categories available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

         
          {/* Products Management Section */}
          {activeSection === "products-management" && (
            <div className="space-y-6">
              {/* Services Tab */}
              {activeSubSection === "services" && (
                <Card>
                  <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Services</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Service
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="p-0" style={{ width: '90vw', maxWidth: '1400px', height: '90vh', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-white">
                                <DialogTitle className="text-2xl font-bold flex items-center gap-2">Add New Service</DialogTitle>
                              </DialogHeader>
                              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                                <form onSubmit={handleServiceSubmit} className="h-full">
                                  <div className="grid grid-cols-10 gap-4">
                                    {/* Left Side - Basic Information */}
                                    <div className="col-span-4 space-y-4">
                                      <div>
                                        <Label htmlFor="service-name">Service Name</Label>
                                        <Input
                                          id="service-name"
                                          placeholder="Enter service name"
                                          value={serviceForm.name}
                                          onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                                          required
                                          className="mt-1"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="service-main-category">Main Category</Label>
                                        <Select value={serviceForm.mainCategory} onValueChange={(value) => {
                                          setServiceForm({
                                            ...serviceForm, 
                                            mainCategory: value,
                                            subCategory: "",
                                            level2Category: ""
                                          })
                                        }}>
                                          <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select main category" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {serviceCategories.map((category) => (
                                              <SelectItem key={category} value={category}>{category}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      {serviceForm.mainCategory && getSubCategoriesForMainCategory(serviceForm.mainCategory).length > 0 && (
                                        <div>
                                          <Label htmlFor="service-sub-category">Sub Category</Label>
                                          <Select value={serviceForm.subCategory} onValueChange={(value) => {
                                            setServiceForm({
                                              ...serviceForm, 
                                              subCategory: value,
                                              level2Category: ""
                                            })
                                          }}>
                                            <SelectTrigger className="mt-1">
                                              <SelectValue placeholder="Select sub category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {getSubCategoriesForMainCategory(serviceForm.mainCategory).map((subCategory) => (
                                                <SelectItem key={subCategory} value={subCategory}>{subCategory}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                      
                                      {serviceForm.mainCategory && serviceForm.subCategory && getLevel2CategoriesForSubCategory(serviceForm.mainCategory, serviceForm.subCategory).length > 0 && (
                                        <div>
                                          <Label htmlFor="service-level2-category">Level 2 Sub Category</Label>
                                          <Select value={serviceForm.level2Category} onValueChange={(value) => {
                                            setServiceForm({...serviceForm, level2Category: value})
                                          }}>
                                            <SelectTrigger className="mt-1">
                                              <SelectValue placeholder="Select level 2 sub category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {getLevel2CategoriesForSubCategory(serviceForm.mainCategory, serviceForm.subCategory).map((level2Category) => (
                                                <SelectItem key={level2Category} value={level2Category}>{level2Category}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                      <div>
                                        <Label htmlFor="service-location">Location</Label>
                                        <Input
                                          id="service-location"
                                          placeholder="Enter service location"
                                          value={serviceForm.location}
                                          onChange={(e) => setServiceForm({...serviceForm, location: e.target.value})}
                                          required
                                          className="mt-1"
                                        />
                                      </div>
                                    </div>

                                    {/* Right Side - Pricing & Details */}
                                    <div className="col-span-6 space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label htmlFor="service-price">Price (₹)</Label>
                                          <Input
                                            id="service-price"
                                            type="number"
                                            placeholder="0"
                                            value={serviceForm.price}
                                            onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                                            required
                                            className="mt-1"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="service-duration">Duration</Label>
                                          <Input
                                            id="service-duration"
                                            placeholder="e.g., 2 hours, 1 day"
                                            value={serviceForm.duration}
                                            onChange={(e) => setServiceForm({...serviceForm, duration: e.target.value})}
                                            required
                                            className="mt-1"
                                          />
                                        </div>
                                      </div>
                                      
                                      {/* Image Upload Section */}
                                      <div>
                                        <Label htmlFor="service-images">Images</Label>
                                        <div className="mb-2 mt-1">
                                          <Button 
                                            type="button" 
                                            variant="outline" 
                                            className="w-full"
                                            onClick={() => document.getElementById('service-file-upload')?.click()}
                                          >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {uploading ? "Uploading..." : "Upload Image"}
                                          </Button>
                                          <Input
                                            id="service-file-upload"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={async (e) => {
                                              const files = e.target.files
                                              if (files) {
                                                const urls = []
                                                for (let i = 0; i < files.length; i++) {
                                                  const url = await handleImageUpload(files[i], 'services')
                                                  if (url) urls.push(url)
                                                }
                                                setServiceForm({...serviceForm, images: [...serviceForm.images, ...urls]})
                                              }
                                            }}
                                          />
                                        </div>
                                        {serviceForm.images.length > 0 && (
                                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 max-h-[150px] overflow-y-auto">
                                            <div className="space-y-2">
                                              {serviceForm.images.map((image, index) => {
                                                const fileName = image.split('/').pop() || `Image ${index + 1}`
                                                return (
                                                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2">
                                                    <span className="text-sm text-gray-700 truncate flex-1">{fileName}</span>
                                                    <Button
                                                      type="button"
                                                      variant="destructive"
                                                      size="sm"
                                                      className="ml-2 h-6 w-6 rounded-full p-0"
                                                      onClick={() => setServiceForm({...serviceForm, images: serviceForm.images.filter((_, i) => i !== index)})}
                                                    >
                                                      <X className="h-3 w-3" />
                                                    </Button>
                                                  </div>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      <div>
                                        <Label htmlFor="service-description">Description</Label>
                                        <Textarea
                                          id="service-description"
                                          placeholder="Enter service description"
                                          value={serviceForm.description}
                                          onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                                          required
                                          rows={4}
                                          className="resize-none mt-1"
                                          style={{ maxHeight: '120px', overflowY: 'auto' }}
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {serviceForm.description.length}/5000 characters
                                        </p>
                                      </div>
                                    </div>
                                    {/* Footer */}
                                    <div className="col-span-10 flex justify-end space-x-2 pt-4 border-t mt-4">
                                      <Button type="button" variant="outline" onClick={() => {
                                        setIsServiceDialogOpen(false)
                                        setServiceForm({ name: "", mainCategory: "", subCategory: "", level2Category: "", price: "", duration: "", description: "", location: "", images: [] })
                                      }}>
                                        Cancel
                                      </Button>
                                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Add Service
                                      </Button>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* View Service Dialog */}
                          <Dialog open={isViewServiceDialogOpen} onOpenChange={(open) => {
                            setIsViewServiceDialogOpen(open)
                            if (!open) {
                              setViewServicePage(1)
                            }
                          }}>
                            <DialogContent className="p-0" style={{ width: '90vw', maxWidth: '1400px', height: '90vh', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <DialogHeader className="flex-shrink-0 px-6 pt-4 pb-3 border-b bg-white">
                                <DialogTitle className="text-xl font-bold flex items-center gap-2">View Service</DialogTitle>
                              </DialogHeader>
                              <div className="flex-1 p-4 bg-gray-50/50" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: 'calc(90vh - 120px)' }}>
                                {viewingService && (
                                  <>
                                    {viewServicePage === 1 ? (
                                      <div className="grid grid-cols-10 gap-3" style={{ flex: '0 0 auto' }}>
                                        {/* Left Side - Basic Information */}
                                        <div className="col-span-4 space-y-3">
                                          <div className="bg-white p-4 rounded-lg border">
                                            <h3 className="text-base font-semibold mb-2">Basic Information</h3>
                                            <div className="space-y-3">
                                              <div>
                                                <Label className="text-sm font-medium text-gray-600">Service Name</Label>
                                                <p className="text-sm mt-1">{viewingService.name}</p>
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium text-gray-600">Category</Label>
                                                <p className="text-sm mt-1">{viewingService.category}</p>
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium text-gray-600">Location</Label>
                                                <p className="text-sm mt-1">{viewingService.location || 'N/A'}</p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {/* Right Side - Pricing Information */}
                                        <div className="col-span-6 space-y-3">
                                          <div className="bg-white p-4 rounded-lg border">
                                            <h3 className="text-base font-semibold mb-2">Pricing Information</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <Label className="text-sm font-medium text-gray-600">Price</Label>
                                                <p className="text-sm mt-1">₹{viewingService.price?.toLocaleString() || 0}</p>
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium text-gray-600">Duration</Label>
                                                <p className="text-sm mt-1">{viewingService.duration || 'N/A'}</p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-10 gap-3" style={{ flex: '0 0 auto', overflow: 'hidden', maxHeight: 'calc(90vh - 200px)' }}>
                                        {/* Left Side - Images */}
                                        <div className="col-span-4" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                          {viewingService.images && viewingService.images.length > 0 ? (
                                            <div className="bg-white p-4 rounded-lg border">
                                              <h3 className="text-base font-semibold mb-2">Images</h3>
                                              <div className="mt-8">
                                                {viewingService.images.map((img: string, idx: number) => (
                                                  <div key={idx} className="flex justify-center">
                                                    <img 
                                                      src={img} 
                                                      alt={`${viewingService.name} ${idx + 1}`} 
                                                      className="w-full max-w-xs h-auto object-contain rounded border border-gray-200" 
                                                      style={{ maxHeight: '300px' }}
                                                    />
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="bg-white p-4 rounded-lg border">
                                              <h3 className="text-base font-semibold mb-2">Images</h3>
                                              <p className="text-sm text-muted-foreground">No images available</p>
                                            </div>
                                          )}
                                        </div>
                                        {/* Right Side - Description */}
                                        <div className="col-span-6" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
                                          <div className="bg-white p-4 rounded-lg border" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', maxHeight: '100%', height: 'fit-content' }}>
                                            <h3 className="text-base font-semibold mb-2" style={{ flexShrink: 0, marginBottom: '8px' }}>Description</h3>
                                            <div className="border border-gray-300 rounded-md bg-gray-50" style={{ height: '220px', maxHeight: '220px', minHeight: '220px', overflow: 'hidden', flexShrink: 0, boxSizing: 'border-box', width: '100%', position: 'relative' }}>
                                              <div className="service-description-scroll" style={{ height: '100%', width: '100%', overflowY: 'auto', overflowX: 'hidden', padding: '12px', boxSizing: 'border-box', WebkitOverflowScrolling: 'touch' }}>
                                                <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ margin: 0, padding: 0, display: 'block', width: '100%', maxWidth: '100%', wordBreak: 'break-word', overflowWrap: 'break-word', boxSizing: 'border-box' }}>
                                                  {viewingService.description || 'No description available'}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {/* Pagination Controls */}
                                    <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setViewServicePage(1)}
                                        disabled={viewServicePage === 1}
                                      >
                                        <ArrowLeft className="h-4 w-4 mr-1" />
                                        Page 1
                                      </Button>
                                      <div className="text-sm text-muted-foreground">
                                        Page {viewServicePage} of 2
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setViewServicePage(2)}
                                        disabled={viewServicePage === 2}
                                      >
                                        Page 2
                                        <ArrowRight className="h-4 w-4 ml-1" />
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Edit Service Dialog */}
                          <Dialog open={isEditServiceDialogOpen} onOpenChange={(open) => {
                            setIsEditServiceDialogOpen(open)
                            if (!open) {
                              setEditServicePage(1)
                            }
                          }}>
                            <DialogContent className="p-0" style={{ width: '90vw', maxWidth: '1400px', height: '90vh', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <DialogHeader className="flex-shrink-0 px-6 pt-4 pb-3 border-b bg-white">
                                <DialogTitle className="text-xl font-bold flex items-center gap-2">Edit Service</DialogTitle>
                              </DialogHeader>
                              <div className="flex-1 p-4 bg-gray-50/50" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: 'calc(90vh - 120px)' }}>
                                <form onSubmit={handleUpdateService} className="h-full" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
                                  <>
                                    {editServicePage === 1 ? (
                                      <div className="grid grid-cols-10 gap-3" style={{ flex: '0 0 auto' }}>
                                        {/* Left Side - Basic Information */}
                                        <div className="col-span-4 space-y-3">
                                          <div className="bg-white p-4 rounded-lg border">
                                            <h3 className="text-base font-semibold mb-2">Basic Information</h3>
                                            <div className="space-y-3">
                                      <div>
                                        <Label htmlFor="edit-service-name">Service Name</Label>
                                        <Input
                                          id="edit-service-name"
                                          placeholder="Enter service name"
                                          value={serviceForm.name}
                                          onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                                          required
                                          className="mt-1"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="edit-service-main-category">Main Category</Label>
                                        <Select value={serviceForm.mainCategory} onValueChange={(value) => {
                                          setServiceForm({
                                            ...serviceForm, 
                                            mainCategory: value,
                                            subCategory: "",
                                            level2Category: ""
                                          })
                                        }}>
                                          <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select main category" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {serviceCategories.map((category) => (
                                              <SelectItem key={category} value={category}>{category}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      {serviceForm.mainCategory && getSubCategoriesForMainCategory(serviceForm.mainCategory).length > 0 && (
                                        <div>
                                          <Label htmlFor="edit-service-sub-category">Sub Category</Label>
                                          <Select value={serviceForm.subCategory} onValueChange={(value) => {
                                            setServiceForm({
                                              ...serviceForm, 
                                              subCategory: value,
                                              level2Category: ""
                                            })
                                          }}>
                                            <SelectTrigger className="mt-1">
                                              <SelectValue placeholder="Select sub category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {getSubCategoriesForMainCategory(serviceForm.mainCategory).map((subCategory) => (
                                                <SelectItem key={subCategory} value={subCategory}>{subCategory}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                      
                                      {serviceForm.mainCategory && serviceForm.subCategory && getLevel2CategoriesForSubCategory(serviceForm.mainCategory, serviceForm.subCategory).length > 0 && (
                                        <div>
                                          <Label htmlFor="edit-service-level2-category">Level 2 Sub Category</Label>
                                          <Select value={serviceForm.level2Category} onValueChange={(value) => {
                                            setServiceForm({...serviceForm, level2Category: value})
                                          }}>
                                            <SelectTrigger className="mt-1">
                                              <SelectValue placeholder="Select level 2 sub category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {getLevel2CategoriesForSubCategory(serviceForm.mainCategory, serviceForm.subCategory).map((level2Category) => (
                                                <SelectItem key={level2Category} value={level2Category}>{level2Category}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                              <div>
                                                <Label htmlFor="edit-service-location">Location</Label>
                                                <Input
                                                  id="edit-service-location"
                                                  placeholder="Enter service location"
                                                  value={serviceForm.location}
                                                  onChange={(e) => setServiceForm({...serviceForm, location: e.target.value})}
                                                  required
                                                  className="mt-1"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Right Side - Pricing Information */}
                                        <div className="col-span-6 space-y-3">
                                          <div className="bg-white p-4 rounded-lg border">
                                            <h3 className="text-base font-semibold mb-2">Pricing Information</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <Label htmlFor="edit-service-price">Price (₹)</Label>
                                                <Input
                                                  id="edit-service-price"
                                                  type="number"
                                                  placeholder="0"
                                                  value={serviceForm.price}
                                                  onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                                                  required
                                                  className="mt-1"
                                                />
                                              </div>
                                              <div>
                                                <Label htmlFor="edit-service-duration">Duration</Label>
                                                <Input
                                                  id="edit-service-duration"
                                                  placeholder="e.g., 2 hours, 1 day"
                                                  value={serviceForm.duration}
                                                  onChange={(e) => setServiceForm({...serviceForm, duration: e.target.value})}
                                                  required
                                                  className="mt-1"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-10 gap-3" style={{ flex: '0 0 auto', overflow: 'hidden', maxHeight: 'calc(90vh - 200px)' }}>
                                        {/* Left Side - Images */}
                                        <div className="col-span-4" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                          <div className="bg-white p-4 rounded-lg border">
                                            <h3 className="text-base font-semibold mb-2">Images</h3>
                                            <div className="mb-2 mt-8">
                                              <Button 
                                                type="button" 
                                                variant="outline" 
                                                className="w-full"
                                                onClick={() => document.getElementById('edit-service-file-upload')?.click()}
                                              >
                                                <Upload className="h-4 w-4 mr-2" />
                                                {uploading ? "Uploading..." : "Upload Image"}
                                              </Button>
                                              <Input
                                                id="edit-service-file-upload"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={async (e) => {
                                                  const files = Array.from(e.target.files || [])
                                                  if (files.length > 0) {
                                                    setUploading(true)
                                                    try {
                                                      const uploadPromises = files.map(file => handleImageUpload(file, 'services'))
                                                      const uploadedUrls = await Promise.all(uploadPromises)
                                                      setServiceForm({...serviceForm, images: [...serviceForm.images, ...uploadedUrls]})
                                                    } catch (error) {
                                                      console.error('Error uploading images:', error)
                                                    } finally {
                                                      setUploading(false)
                                                    }
                                                  }
                                                }}
                                              />
                                            </div>
                                            {serviceForm.images.length > 0 ? (
                                              <div className="space-y-3">
                                                {serviceForm.images.map((img: string, idx: number) => (
                                                  <div key={idx} className="flex justify-center relative">
                                                    <img 
                                                      src={img} 
                                                      alt={`Service ${idx + 1}`} 
                                                      className="w-full max-w-xs h-auto object-contain rounded border border-gray-200" 
                                                      style={{ maxHeight: '300px' }}
                                                    />
                                                    <Button
                                                      type="button"
                                                      variant="destructive"
                                                      size="sm"
                                                      className="absolute top-1 right-1"
                                                      onClick={() => {
                                                        setServiceForm({...serviceForm, images: serviceForm.images.filter((_, i) => i !== idx)})
                                                      }}
                                                    >
                                                      <X className="h-3 w-3" />
                                                    </Button>
                                                  </div>
                                                ))}
                                              </div>
                                            ) : (
                                              <p className="text-sm text-muted-foreground mt-4">No images available</p>
                                            )}
                                          </div>
                                        </div>
                                        {/* Right Side - Description */}
                                        <div className="col-span-6" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
                                          <div className="bg-white p-4 rounded-lg border" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', maxHeight: '100%', height: 'fit-content' }}>
                                            <h3 className="text-base font-semibold mb-2" style={{ flexShrink: 0, marginBottom: '8px' }}>Description</h3>
                                            <div className="border border-gray-300 rounded-md bg-gray-50" style={{ height: '220px', maxHeight: '220px', minHeight: '220px', overflow: 'hidden', flexShrink: 0, boxSizing: 'border-box', width: '100%', position: 'relative' }}>
                                              <div className="service-description-scroll" style={{ height: '100%', width: '100%', overflowY: 'auto', overflowX: 'hidden', padding: '12px', boxSizing: 'border-box', WebkitOverflowScrolling: 'touch' }}>
                                                <Textarea
                                                  id="edit-service-description"
                                                  placeholder="Enter service description"
                                                  value={serviceForm.description}
                                                  onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                                                  required
                                                  className="resize-none border-0 bg-transparent p-0 text-sm whitespace-pre-wrap leading-relaxed"
                                                  style={{ width: '100%', maxWidth: '100%', minHeight: 'auto', height: 'auto', margin: 0, padding: 0, wordBreak: 'break-word', overflowWrap: 'break-word', display: 'block', boxSizing: 'border-box' }}
                                                />
                                              </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1" style={{ flexShrink: 0, marginTop: '8px' }}>
                                              {serviceForm.description.length}/5000 characters
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {/* Pagination Controls */}
                                    <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        onClick={() => setEditServicePage(1)}
                                        disabled={editServicePage === 1}
                                      >
                                        <ArrowLeft className="h-4 w-4 mr-1" />
                                        Page 1
                                      </Button>
                                      <div className="text-sm text-muted-foreground">
                                        Page {editServicePage} of 2
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        onClick={() => setEditServicePage(2)}
                                        disabled={editServicePage === 2}
                                      >
                                        Page 2
                                        <ArrowRight className="h-4 w-4 ml-1" />
                                      </Button>
                                    </div>
                                    {/* Footer */}
                                    <div className="flex justify-end space-x-2 pt-3 border-t mt-3">
                                      <Button type="button" variant="outline" onClick={() => {
                                        setIsEditServiceDialogOpen(false)
                                        setEditingService(null)
                                        setEditServicePage(1)
                                        setServiceForm({ name: "", mainCategory: "", subCategory: "", level2Category: "", price: "", duration: "", description: "", location: "", images: [] })
                                      }}>
                                        Cancel
                                      </Button>
                                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Update Service
                                      </Button>
                                    </div>
                                  </>
                                </form>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              placeholder="Search services..."
                              className="pl-10 w-64"
                            />
                          </div>
                          <Select>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {serviceCategories.map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-visible">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Orders</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center py-8">
                              Loading services...
                            </TableCell>
                          </TableRow>
                        ) : (
                          (() => {
                            const startIndex = (servicesPage - 1) * servicesPerPage
                            const endIndex = startIndex + servicesPerPage
                            const paginatedServices = services.slice(startIndex, endIndex)
                            const totalPages = Math.ceil(services.length / servicesPerPage)
                            
                            return (
                              <>
                                {paginatedServices.map((service: any) => (
                                  <TableRow key={service._id}>
                                    <TableCell>
                                      <div>
                                        <div className="font-medium">{service.name}</div>
                                        <div className="text-sm text-muted-foreground">{service.vendor}</div>
                                      </div>
                                    </TableCell>
                                    <TableCell>{service.category}</TableCell>
                                    <TableCell>₹{service.price.toLocaleString()}</TableCell>
                                    <TableCell>{service.duration}</TableCell>
                                    <TableCell>{service.location}</TableCell>
                                    <TableCell>{service.orders}</TableCell>
                                    <TableCell>
                                      <div className="flex items-center">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                        {service.rating}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={service.status === "Active" ? "default" : "destructive"}>
                                        {service.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleViewService(service)}>
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleEditService(service)}>
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteService(service._id)}>
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                                {totalPages > 1 && (
                                  <TableRow>
                                    <TableCell colSpan={9} className="py-4">
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                          Showing {startIndex + 1} to {Math.min(endIndex, services.length)} of {services.length} entries
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setServicesPage(prev => Math.max(1, prev - 1))}
                                            disabled={servicesPage === 1}
                                          >
                                            <ArrowLeft className="h-4 w-4 mr-1" />
                                            Previous
                                          </Button>
                                          <div className="text-sm text-muted-foreground">
                                            Page {servicesPage} of {totalPages}
                                          </div>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setServicesPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={servicesPage === totalPages}
                                          >
                                            Next
                                            <ArrowRight className="h-4 w-4 ml-1" />
                                          </Button>
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </>
                            )
                          })()
                        )}
                      </TableBody>
                    </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Products Tab */}
              {activeSubSection === "products" && (
                <Card>
                  <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Products</CardTitle>
                        <div className="flex items-center space-x-2">
                          <input
                            ref={excelFileInputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            className="hidden"
                            onChange={handleExcelUpload}
                            disabled={uploadingExcel}
                          />
                          <Button
                            variant="outline"
                            onClick={() => excelFileInputRef.current?.click()}
                            disabled={uploadingExcel}
                            className="border-green-600 text-green-600 hover:bg-green-50"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingExcel ? 'Uploading...' : 'Upload Excel'}
                          </Button>
                          <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Product
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="p-0" style={{ width: '90vw', maxWidth: '1400px', height: '90vh', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-white">
                                <DialogTitle className="text-2xl font-bold flex items-center gap-2">Add New Product</DialogTitle>
                              </DialogHeader>
                              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                                <form onSubmit={handleProductSubmit} className="h-full">
                                  <div className="grid grid-cols-10 gap-4">
                                    {/* Left Side - Basic Information */}
                                    <div className="col-span-4 space-y-4">
                                      <div>
                                        <Label htmlFor="product-name">Product Name</Label>
                                        <Input
                                          id="product-name"
                                          placeholder="Enter product name"
                                          value={productForm.name}
                                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                                          required
                                          className="mt-1"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="product-main-category">Main Category</Label>
                                        <Select value={productForm.mainCategory} onValueChange={(value) => {
                                          setProductForm({
                                            ...productForm, 
                                            mainCategory: value,
                                            subCategory: "",
                                            level2Category: ""
                                          })
                                        }}>
                                          <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select main category" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {productCategories.map((category) => (
                                              <SelectItem key={category} value={category}>{category}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      {productForm.mainCategory && getSubCategoriesForMainCategory(productForm.mainCategory).length > 0 && (
                                        <div>
                                          <Label htmlFor="product-sub-category">Sub Category</Label>
                                          <Select value={productForm.subCategory} onValueChange={(value) => {
                                            setProductForm({
                                              ...productForm, 
                                              subCategory: value,
                                              level2Category: ""
                                            })
                                          }}>
                                            <SelectTrigger className="mt-1">
                                              <SelectValue placeholder="Select sub category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {getSubCategoriesForMainCategory(productForm.mainCategory).map((subCategory) => (
                                                <SelectItem key={subCategory} value={subCategory}>{subCategory}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                      
                                      {productForm.mainCategory && productForm.subCategory && getLevel2CategoriesForSubCategory(productForm.mainCategory, productForm.subCategory).length > 0 && (
                                        <div>
                                          <Label htmlFor="product-level2-category">Level 2 Sub Category</Label>
                                          <Select value={productForm.level2Category} onValueChange={(value) => {
                                            setProductForm({...productForm, level2Category: value})
                                          }}>
                                            <SelectTrigger className="mt-1">
                                              <SelectValue placeholder="Select level 2 sub category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {getLevel2CategoriesForSubCategory(productForm.mainCategory, productForm.subCategory).map((level2Category) => (
                                                <SelectItem key={level2Category} value={level2Category}>{level2Category}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                      <div>
                                        <Label htmlFor="product-stock">Stock Quantity</Label>
                                        <Input
                                          id="product-stock"
                                          type="number"
                                          placeholder="0"
                                          value={productForm.stock}
                                          onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                                          required
                                          className="mt-1"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="product-hsl-code">HSL Code</Label>
                                        <Input
                                          id="product-hsl-code"
                                          placeholder="Enter HSL Code"
                                          value={productForm.hslCode}
                                          onChange={(e) => setProductForm({...productForm, hslCode: e.target.value})}
                                          className="mt-1"
                                        />
                                      </div>
                                    </div>

                                    {/* Right Side - Pricing & Details */}
                                    <div className="col-span-6 space-y-4">
                                      <div className="grid grid-cols-3 gap-4">
                                        <div>
                                          <Label htmlFor="product-mrp">MRP (₹)</Label>
                                          <Input
                                            id="product-mrp"
                                            type="number"
                                            placeholder="0"
                                            min="0"
                                            step="0.01"
                                            value={productForm.mrp}
                                            onChange={(e) => {
                                              const mrp = parseFloat(e.target.value) || 0
                                              const offerPrice = parseFloat(productForm.offerPrice) || 0
                                              const discount = mrp - offerPrice
                                              setProductForm({...productForm, mrp: e.target.value})
                                            }}
                                            required
                                            className="mt-1"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="product-offer-price">Offer Price (₹)</Label>
                                          <Input
                                            id="product-offer-price"
                                            type="number"
                                            placeholder="0"
                                            min="0"
                                            step="0.01"
                                            value={productForm.offerPrice}
                                            onChange={(e) => {
                                              const offerPrice = parseFloat(e.target.value) || 0
                                              const mrp = parseFloat(productForm.mrp) || 0
                                              const discount = mrp - offerPrice
                                              setProductForm({...productForm, offerPrice: e.target.value})
                                            }}
                                            required
                                            className="mt-1"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="product-gst">GST (%)</Label>
                                          <Input
                                            id="product-gst"
                                            type="number"
                                            placeholder="0"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={productForm.gstPercentage}
                                            onChange={(e) => setProductForm({...productForm, gstPercentage: e.target.value})}
                                            required
                                            className="mt-1"
                                          />
                                        </div>
                                      </div>
                                      {/* Calculated Values Display */}
                                      {(productForm.mrp || productForm.offerPrice || productForm.gstPercentage) && (
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                          <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                              <span className="text-muted-foreground">Discount: </span>
                                              <span className="font-semibold text-green-600">
                                                ₹{((parseFloat(productForm.mrp) || 0) - (parseFloat(productForm.offerPrice) || 0)).toFixed(2)}
                                              </span>
                                            </div>
                                            <div>
                                              <span className="text-muted-foreground">Final Price (Offer + GST): </span>
                                              <span className="font-semibold text-blue-600">
                                                ₹{(() => {
                                                  const offerPrice = parseFloat(productForm.offerPrice) || 0
                                                  const gstPercentage = parseFloat(productForm.gstPercentage) || 0
                                                  const gstAmount = (offerPrice * gstPercentage) / 100
                                                  return (offerPrice + gstAmount).toFixed(2)
                                                })()}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      <div>
                                        <Label htmlFor="product-description">Description</Label>
                                        <Textarea
                                          id="product-description"
                                          placeholder="Enter product description"
                                          value={productForm.description}
                                          onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                                          required
                                          rows={4}
                                          className="resize-none mt-1"
                                          style={{ maxHeight: '120px', overflowY: 'auto' }}
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {productForm.description.length}/5000 characters
                                        </p>
                                      </div>
                                      <div>
                                        <Label htmlFor="product-images">Images</Label>
                                        <div className="mb-2 mt-1">
                                          <Button 
                                            type="button" 
                                            variant="outline" 
                                            className="w-full"
                                            onClick={() => document.getElementById('file-upload')?.click()}
                                          >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {uploading ? "Uploading..." : "Upload Image"}
                                          </Button>
                                          <Input
                                            id="file-upload"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={async (e) => {
                                              const files = e.target.files
                                              if (files) {
                                                const urls = []
                                                for (let i = 0; i < files.length; i++) {
                                                  const url = await handleImageUpload(files[i], 'products')
                                                  if (url) urls.push(url)
                                                }
                                                setProductForm({...productForm, images: [...productForm.images, ...urls]})
                                              }
                                            }}
                                          />
                                        </div>
                                        {productForm.images.length > 0 && (
                                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 max-h-[150px] overflow-y-auto">
                                            <div className="space-y-2">
                                              {productForm.images.map((image, index) => {
                                                const fileName = image.split('/').pop() || `Image ${index + 1}`
                                                return (
                                                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2">
                                                    <span className="text-sm text-gray-700 truncate flex-1">{fileName}</span>
                                                    <Button
                                                      type="button"
                                                      variant="destructive"
                                                      size="sm"
                                                      className="ml-2 h-6 w-6 rounded-full p-0"
                                                      onClick={() => setProductForm({...productForm, images: productForm.images.filter((_, i) => i !== index)})}
                                                    >
                                                      <X className="h-3 w-3" />
                                                    </Button>
                                                  </div>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {/* Footer */}
                                  <div className="col-span-10 flex justify-end space-x-2 pt-4 border-t mt-4">
                                    <Button type="button" variant="outline" onClick={() => {
                                      setIsProductDialogOpen(false)
                                      setProductForm({ name: "", mainCategory: "", subCategory: "", level2Category: "", price: "", mrp: "", offerPrice: "", gstPercentage: "", stock: "", description: "", hslCode: "", images: [] })
                                    }}>
                                      Cancel
                                    </Button>
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                      Add Product
                                    </Button>
                                  </div>
                                </form>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {/* View Product Dialog */}
                          <Dialog open={isViewProductDialogOpen} onOpenChange={(open) => {
                            setIsViewProductDialogOpen(open)
                            if (!open) {
                              setViewProductPage(1)
                            }
                          }}>
                            <DialogContent className="p-0" style={{ width: '90vw', maxWidth: '1400px', height: '90vh', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-white">
                                <DialogTitle className="text-2xl font-bold flex items-center gap-2">View Product</DialogTitle>
                              </DialogHeader>
                              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                                {viewingProduct && (
                                  <>
                                    {viewProductPage === 1 ? (
                                      <div className="grid grid-cols-10 gap-4">
                                        {/* Left Side - Basic Information */}
                                        <div className="col-span-4 space-y-4">
                                          <div className="bg-white p-4 rounded-lg border">
                                            <h3 className="text-base font-semibold mb-3">Basic Information</h3>
                                            <div className="space-y-3">
                                              <div>
                                                <Label className="text-sm font-medium text-gray-600">Product Name</Label>
                                                <p className="text-sm mt-1">{viewingProduct.name}</p>
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium text-gray-600">Category</Label>
                                                <p className="text-sm mt-1">{viewingProduct.category}</p>
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium text-gray-600">Stock Quantity</Label>
                                                <p className="text-sm mt-1">{viewingProduct.stock}</p>
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium text-gray-600">HSL Code</Label>
                                                <p className="text-sm mt-1">{viewingProduct.hslCode || 'N/A'}</p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {/* Right Side - Pricing & Details */}
                                        <div className="col-span-6 space-y-4">
                                          <div className="bg-white p-4 rounded-lg border">
                                            <h3 className="text-base font-semibold mb-3">Pricing Information</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <Label className="text-sm font-medium text-gray-600">MRP</Label>
                                                <p className="text-sm mt-1">₹{(viewingProduct.mrp || viewingProduct.price || 0).toLocaleString()}</p>
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium text-gray-600">Offer Price</Label>
                                                <p className="text-sm mt-1">₹{(viewingProduct.offerPrice || viewingProduct.price || 0).toLocaleString()}</p>
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium text-gray-600">GST (%)</Label>
                                                <p className="text-sm mt-1">{viewingProduct.gstPercentage || 0}%</p>
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium text-gray-600">Final Price</Label>
                                                <p className="text-sm mt-1">₹{(viewingProduct.finalPrice || viewingProduct.price || 0).toLocaleString()}</p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-10 gap-4">
                                        {/* Left Side - Images */}
                                        <div className="col-span-4 space-y-4">
                                          {viewingProduct.images && viewingProduct.images.length > 0 ? (
                                            <div className="bg-white p-4 rounded-lg border">
                                              <h3 className="text-base font-semibold mb-3">Images</h3>
                                              <div className="space-y-3 mt-8">
                                                {viewingProduct.images.map((img: string, idx: number) => (
                                                  <div key={idx} className="flex justify-center">
                                                    <img 
                                                      src={img} 
                                                      alt={`${viewingProduct.name} ${idx + 1}`} 
                                                      className="w-full max-w-xs h-auto object-contain rounded border border-gray-200" 
                                                      style={{ maxHeight: '300px' }}
                                                    />
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="bg-white p-4 rounded-lg border">
                                              <h3 className="text-base font-semibold mb-3">Images</h3>
                                              <p className="text-sm text-muted-foreground">No images available</p>
                                            </div>
                                          )}
                                        </div>
                                        {/* Right Side - Description */}
                                        <div className="col-span-6 space-y-4">
                                          <div className="bg-white p-4 rounded-lg border">
                                            <h3 className="text-base font-semibold mb-3">Description</h3>
                                            <div className="border border-gray-300 rounded-md p-3 bg-gray-50" style={{ height: '96px', overflowY: 'auto' }}>
                                              <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ lineHeight: '1.5' }}>
                                                {viewingProduct.description || 'No description'}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {/* Pagination Controls */}
                                    <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setViewProductPage(1)}
                                        disabled={viewProductPage === 1}
                                      >
                                        <ArrowLeft className="h-4 w-4 mr-1" />
                                        Page 1
                                      </Button>
                                      <div className="text-sm text-muted-foreground">
                                        Page {viewProductPage} of 2
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setViewProductPage(2)}
                                        disabled={viewProductPage === 2}
                                      >
                                        Page 2
                                        <ArrowRight className="h-4 w-4 ml-1" />
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Edit Product Dialog */}
                          <Dialog open={isEditProductDialogOpen} onOpenChange={(open) => {
                            setIsEditProductDialogOpen(open)
                            if (!open) {
                              setEditProductPage(1)
                            }
                          }}>
                            <DialogContent className="p-0" style={{ width: '90vw', maxWidth: '1400px', height: '90vh', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <DialogHeader className="flex-shrink-0 px-6 pt-4 pb-3 border-b bg-white">
                                <DialogTitle className="text-xl font-bold flex items-center gap-2">Edit Product</DialogTitle>
                              </DialogHeader>
                              <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
                                <form onSubmit={handleUpdateProduct} className="h-full">
                                  <>
                                    {editProductPage === 1 ? (
                                      <div className="grid grid-cols-10 gap-3">
                                        {/* Left Side - Basic Information */}
                                        <div className="col-span-4 space-y-3">
                                          <div className="bg-white p-4 rounded-lg border">
                                            <h3 className="text-base font-semibold mb-2">Basic Information</h3>
                                            <div className="space-y-3">
                                              <div>
                                                <Label htmlFor="edit-product-name">Product Name</Label>
                                                <Input
                                                  id="edit-product-name"
                                                  placeholder="Enter product name"
                                                  value={productForm.name}
                                                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                                                  required
                                                  className="mt-1"
                                                />
                                              </div>
                                              <div>
                                                <Label htmlFor="edit-product-main-category">Main Category</Label>
                                                <Select value={productForm.mainCategory} onValueChange={(value) => {
                                                  setProductForm({
                                                    ...productForm, 
                                                    mainCategory: value,
                                                    subCategory: "",
                                                    level2Category: ""
                                                  })
                                                }}>
                                                  <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select main category" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    {productCategories.map((category) => (
                                                      <SelectItem key={category} value={category}>{category}</SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              
                                              {productForm.mainCategory && getSubCategoriesForMainCategory(productForm.mainCategory).length > 0 && (
                                                <div>
                                                  <Label htmlFor="edit-product-sub-category">Sub Category</Label>
                                                  <Select value={productForm.subCategory} onValueChange={(value) => {
                                                    setProductForm({
                                                      ...productForm, 
                                                      subCategory: value,
                                                      level2Category: ""
                                                    })
                                                  }}>
                                                    <SelectTrigger className="mt-1">
                                                      <SelectValue placeholder="Select sub category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      {getSubCategoriesForMainCategory(productForm.mainCategory).map((subCategory) => (
                                                        <SelectItem key={subCategory} value={subCategory}>{subCategory}</SelectItem>
                                                      ))}
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              )}
                                              
                                              {productForm.mainCategory && productForm.subCategory && getLevel2CategoriesForSubCategory(productForm.mainCategory, productForm.subCategory).length > 0 && (
                                                <div>
                                                  <Label htmlFor="edit-product-level2-category">Level 2 Sub Category</Label>
                                                  <Select value={productForm.level2Category} onValueChange={(value) => {
                                                    setProductForm({...productForm, level2Category: value})
                                                  }}>
                                                    <SelectTrigger className="mt-1">
                                                      <SelectValue placeholder="Select level 2 sub category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      {getLevel2CategoriesForSubCategory(productForm.mainCategory, productForm.subCategory).map((level2Category) => (
                                                        <SelectItem key={level2Category} value={level2Category}>{level2Category}</SelectItem>
                                                      ))}
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              )}
                                              <div>
                                                <Label htmlFor="edit-product-stock">Stock Quantity</Label>
                                                <Input
                                                  id="edit-product-stock"
                                                  type="number"
                                                  placeholder="0"
                                                  value={productForm.stock}
                                                  onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                                                  required
                                                  className="mt-1"
                                                />
                                              </div>
                                              <div>
                                                <Label htmlFor="edit-product-hsl-code">HSL Code</Label>
                                                <Input
                                                  id="edit-product-hsl-code"
                                                  placeholder="Enter HSL Code"
                                                  value={productForm.hslCode}
                                                  onChange={(e) => setProductForm({...productForm, hslCode: e.target.value})}
                                                  className="mt-1"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Right Side - Pricing Information */}
                                        <div className="col-span-6 space-y-3">
                                          <div className="bg-white p-4 rounded-lg border">
                                            <h3 className="text-base font-semibold mb-2">Pricing Information</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <Label htmlFor="edit-product-mrp">MRP (₹)</Label>
                                                <Input
                                                  id="edit-product-mrp"
                                                  type="number"
                                                  placeholder="0"
                                                  value={productForm.mrp}
                                                  onChange={(e) => setProductForm({...productForm, mrp: e.target.value})}
                                                  required
                                                  className="mt-1"
                                                />
                                              </div>
                                              <div>
                                                <Label htmlFor="edit-product-offer-price">Offer Price (₹)</Label>
                                                <Input
                                                  id="edit-product-offer-price"
                                                  type="number"
                                                  placeholder="0"
                                                  value={productForm.offerPrice}
                                                  onChange={(e) => setProductForm({...productForm, offerPrice: e.target.value})}
                                                  required
                                                  className="mt-1"
                                                />
                                              </div>
                                              <div>
                                                <Label htmlFor="edit-product-gst">GST (%)</Label>
                                                <Input
                                                  id="edit-product-gst"
                                                  type="number"
                                                  placeholder="0"
                                                  value={productForm.gstPercentage}
                                                  onChange={(e) => setProductForm({...productForm, gstPercentage: e.target.value})}
                                                  required
                                                  className="mt-1"
                                                />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium text-gray-600">Final Price</Label>
                                                <p className="text-sm mt-1">
                                                  ₹{(() => {
                                                    const offerPrice = parseFloat(productForm.offerPrice) || 0
                                                    const gstPercentage = parseFloat(productForm.gstPercentage) || 0
                                                    const gstAmount = (offerPrice * gstPercentage) / 100
                                                    return (offerPrice + gstAmount).toFixed(2)
                                                  })()}
                                                </p>
                                              </div>
                                            </div>
                                            {/* Calculated Values Display */}
                                            {(productForm.mrp || productForm.offerPrice || productForm.gstPercentage) && (
                                              <div className="bg-gray-50 p-4 rounded-lg space-y-2 mt-4">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                  <div>
                                                    <span className="text-muted-foreground">Discount: </span>
                                                    <span className="font-semibold text-green-600">
                                                      ₹{((parseFloat(productForm.mrp) || 0) - (parseFloat(productForm.offerPrice) || 0)).toFixed(2)}
                                                    </span>
                                                  </div>
                                                  <div>
                                                    <span className="text-muted-foreground">Final Price (Offer + GST): </span>
                                                    <span className="font-semibold text-blue-600">
                                                      ₹{(() => {
                                                        const offerPrice = parseFloat(productForm.offerPrice) || 0
                                                        const gstPercentage = parseFloat(productForm.gstPercentage) || 0
                                                        const gstAmount = (offerPrice * gstPercentage) / 100
                                                        return (offerPrice + gstAmount).toFixed(2)
                                                      })()}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-10 gap-4">
                                        {/* Left Side - Images */}
                                        <div className="col-span-4 space-y-4">
                                          <div className="bg-white p-4 rounded-lg border">
                                            <h3 className="text-base font-semibold mb-3">Images</h3>
                                            <div className="mb-2 mt-8">
                                              <Button 
                                                type="button" 
                                                variant="outline" 
                                                className="w-full"
                                                onClick={() => document.getElementById('edit-product-file-upload')?.click()}
                                              >
                                                <Upload className="h-4 w-4 mr-2" />
                                                {uploading ? "Uploading..." : "Upload Image"}
                                              </Button>
                                              <Input
                                                id="edit-product-file-upload"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={async (e) => {
                                                  const files = Array.from(e.target.files || [])
                                                  if (files.length > 0) {
                                                    setUploading(true)
                                                    try {
                                                      const uploadPromises = files.map(file => handleImageUpload(file, 'products'))
                                                      const uploadedUrls = await Promise.all(uploadPromises)
                                                      setProductForm({...productForm, images: [...productForm.images, ...uploadedUrls]})
                                                    } catch (error) {
                                                      console.error('Error uploading images:', error)
                                                    } finally {
                                                      setUploading(false)
                                                    }
                                                  }
                                                }}
                                              />
                                            </div>
                                            {productForm.images.length > 0 ? (
                                              <div className="space-y-3">
                                                {productForm.images.map((img: string, idx: number) => (
                                                  <div key={idx} className="flex justify-center relative">
                                                    <img 
                                                      src={img} 
                                                      alt={`Product ${idx + 1}`} 
                                                      className="w-full max-w-xs h-auto object-contain rounded border border-gray-200" 
                                                      style={{ maxHeight: '300px' }}
                                                    />
                                                    <Button
                                                      type="button"
                                                      variant="destructive"
                                                      size="sm"
                                                      className="absolute top-1 right-1"
                                                      onClick={() => {
                                                        setProductForm({...productForm, images: productForm.images.filter((_, i) => i !== idx)})
                                                      }}
                                                    >
                                                      <X className="h-3 w-3" />
                                                    </Button>
                                                  </div>
                                                ))}
                                              </div>
                                            ) : (
                                              <p className="text-sm text-muted-foreground mt-4">No images available</p>
                                            )}
                                          </div>
                                        </div>
                                        {/* Right Side - Description */}
                                        <div className="col-span-6 space-y-4">
                                          <div className="bg-white p-4 rounded-lg border">
                                            <h3 className="text-base font-semibold mb-3">Description</h3>
                                            <div className="border border-gray-300 rounded-md p-3 bg-gray-50" style={{ height: '96px', overflowY: 'auto' }}>
                                              <Textarea
                                                id="edit-product-description"
                                                placeholder="Enter product description"
                                                value={productForm.description}
                                                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                                                required
                                                className="resize-none border-0 bg-transparent p-0 text-sm whitespace-pre-wrap leading-relaxed"
                                                style={{ lineHeight: '1.5', minHeight: '96px', height: 'auto' }}
                                              />
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                              {productForm.description.length}/5000 characters
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {/* Pagination Controls */}
                                    <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        onClick={() => setEditProductPage(1)}
                                        disabled={editProductPage === 1}
                                      >
                                        <ArrowLeft className="h-4 w-4 mr-1" />
                                        Page 1
                                      </Button>
                                      <div className="text-sm text-muted-foreground">
                                        Page {editProductPage} of 2
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        onClick={() => setEditProductPage(2)}
                                        disabled={editProductPage === 2}
                                      >
                                        Page 2
                                        <ArrowRight className="h-4 w-4 ml-1" />
                                      </Button>
                                    </div>
                                    {/* Footer */}
                                    <div className="flex justify-end space-x-2 pt-3 border-t mt-3">
                                      <Button type="button" variant="outline" onClick={() => {
                                        setIsEditProductDialogOpen(false)
                                        setEditingProduct(null)
                                        setEditProductPage(1)
                                        setProductForm({ name: "", mainCategory: "", subCategory: "", level2Category: "", price: "", mrp: "", offerPrice: "", gstPercentage: "", stock: "", description: "", hslCode: "", images: [] })
                                      }}>
                                        Cancel
                                      </Button>
                                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Update Product
                                      </Button>
                                    </div>
                                  </>
                                </form>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              placeholder="Search products..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 w-64"
                            />
                          </div>
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {productCategories.map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-visible">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>MRP</TableHead>
                          <TableHead>Offer Price</TableHead>
                          <TableHead>Discount</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Orders</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center py-8">
                              Loading products...
                            </TableCell>
                          </TableRow>
                        ) : (
                          (() => {
                            const filteredProducts = products.filter((product: any) => 
                              product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                              (selectedCategory === "all" || product.category === selectedCategory)
                            )
                            const startIndex = (productsPage - 1) * productsPerPage
                            const endIndex = startIndex + productsPerPage
                            const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
                            const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
                            
                            return (
                              <>
                                {paginatedProducts.map((product: any) => (
                                  <TableRow key={product._id}>
                                    <TableCell>
                                      <div>
                                        <div className="font-medium">{product.name}</div>
                                        <div className="text-sm text-muted-foreground">{product.vendor}</div>
                                      </div>
                                    </TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>
                                      <div className="text-sm">₹{(product.mrp || product.price || 0).toLocaleString()}</div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="text-sm font-medium">₹{(product.offerPrice || product.price || 0).toLocaleString()}</div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="text-sm font-semibold text-green-600">
                                        ₹{((product.mrp || product.price || 0) - (product.offerPrice || product.price || 0)).toLocaleString()}
                                      </div>
                                    </TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>{product.orders}</TableCell>
                                    <TableCell>
                                      <Badge variant={product.status === "Active" ? "default" : "destructive"}>
                                        {product.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleViewProduct(product)}>
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product._id)}>
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                                {totalPages > 1 && (
                                  <TableRow>
                                    <TableCell colSpan={9} className="py-4">
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                          Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} entries
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setProductsPage(prev => Math.max(1, prev - 1))}
                                            disabled={productsPage === 1}
                                          >
                                            <ArrowLeft className="h-4 w-4 mr-1" />
                                            Previous
                                          </Button>
                                          <div className="text-sm text-muted-foreground">
                                            Page {productsPage} of {totalPages}
                                          </div>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setProductsPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={productsPage === totalPages}
                                          >
                                            Next
                                            <ArrowRight className="h-4 w-4 ml-1" />
                                          </Button>
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </>
                            )
                          })()
                        )}
                      </TableBody>
                    </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* All Items Tab */}
              {activeSubSection === "all-items" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>All Items</CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder="Search products and services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                          />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {productCategories.map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                            {serviceCategories.map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-visible">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              Loading items...
                            </TableCell>
                          </TableRow>
                        ) : (
                          (() => {
                            // Combine and filter products and services
                            const filteredProducts = products
                              .filter((product: any) => 
                                product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                (selectedCategory === "all" || product.category === selectedCategory)
                              )
                              .map((product: any) => ({ ...product, type: 'product' }))
                            
                            const filteredServices = services
                              .filter((service: any) => 
                                service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                (selectedCategory === "all" || service.category === selectedCategory)
                              )
                              .map((service: any) => ({ ...service, type: 'service' }))
                            
                            const allItems = [...filteredProducts, ...filteredServices]
                            const startIndex = (allItemsPage - 1) * allItemsPerPage
                            const endIndex = startIndex + allItemsPerPage
                            const paginatedItems = allItems.slice(startIndex, endIndex)
                            const totalPages = Math.ceil(allItems.length / allItemsPerPage)
                            
                            return (
                              <>
                                {paginatedItems.map((item: any) => (
                                  <TableRow key={`${item.type}-${item._id}`}>
                                    <TableCell>
                                      <div>
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-sm text-muted-foreground">{item.vendor}</div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {item.type === 'product' ? (
                                        <Badge variant="outline">Product</Badge>
                                      ) : (
                                        <Badge variant="secondary">Service</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>₹{item.price.toLocaleString()}</TableCell>
                                    <TableCell>
                                      {item.type === 'product' ? (
                                        <div className="text-sm">
                                          <div>Stock: {item.stock}</div>
                                          <div>Orders: {item.orders}</div>
                                        </div>
                                      ) : (
                                        <div className="text-sm">
                                          <div>Duration: {item.duration}</div>
                                          <div>Location: {item.location}</div>
                                          <div>Orders: {item.orders}</div>
                                        </div>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={item.status === "Active" ? "default" : "destructive"}>
                                        {item.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm">
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          onClick={() => item.type === 'product' ? handleDeleteProduct(item._id) : handleDeleteService(item._id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                                {totalPages > 1 && (
                                  <TableRow>
                                    <TableCell colSpan={7} className="py-4">
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                          Showing {startIndex + 1} to {Math.min(endIndex, allItems.length)} of {allItems.length} entries
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setAllItemsPage(prev => Math.max(1, prev - 1))}
                                            disabled={allItemsPage === 1}
                                          >
                                            <ArrowLeft className="h-4 w-4 mr-1" />
                                            Previous
                                          </Button>
                                          <div className="text-sm text-muted-foreground">
                                            Page {allItemsPage} of {totalPages}
                                          </div>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setAllItemsPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={allItemsPage === totalPages}
                                          >
                                            Next
                                            <ArrowRight className="h-4 w-4 ml-1" />
                                          </Button>
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </>
                            )
                          })()
                        )}
                      </TableBody>
                    </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Categories, Sub Categories, Level2 Categories - Placeholder */}
              {(activeSubSection === "categories" || activeSubSection === "sub-categories" || activeSubSection === "level2-categories") && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {activeSubSection === "categories" && "Categories"}
                        {activeSubSection === "sub-categories" && "Sub Categories"}
                        {activeSubSection === "level2-categories" && "Level2 Sub Categories"}
                      </CardTitle>
                      {activeSubSection === "categories" && (
                        <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Category
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Add New Category</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCategorySubmit} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="category-name">Category Name</Label>
                                <Input
                                  id="category-name"
                                  placeholder="e.g., Office Furniture"
                                  value={categoryForm.name}
                                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="main-use">Main Use</Label>
                                <Select value={categoryForm.mainUse} onValueChange={(value) => setCategoryForm({ ...categoryForm, mainUse: value })}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select main use" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="product">Product</SelectItem>
                                    <SelectItem value="service">Service</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                  id="description"
                                  placeholder="Brief description of this category..."
                                  value={categoryForm.description}
                                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                  Add Category
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )}
                      {activeSubSection === "sub-categories" && (
                        <Dialog open={isSubCategoryDialogOpen} onOpenChange={setIsSubCategoryDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Sub Category
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Add New Sub Category</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubCategorySubmit} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="sub-category-name">Sub Category Name</Label>
                                <Input
                                  id="sub-category-name"
                                  placeholder="e.g., Office Chairs"
                                  value={subCategoryForm.name}
                                  onChange={(e) => setSubCategoryForm({ ...subCategoryForm, name: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="main-category-select">Main Category</Label>
                                <Select value={subCategoryForm.mainCategory} onValueChange={(value) => {
                                  const selectedCategory = categories.find((cat: any) => cat._id === value)
                                  setSubCategoryForm({ 
                                    ...subCategoryForm, 
                                    mainCategory: selectedCategory?._id || "",
                                    mainUse: selectedCategory?.mainUse || ""
                                  })
                                }}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select main category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map((category: any) => (
                                      <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="main-use-display">Main Use</Label>
                                <div className="p-2 bg-muted rounded-md">
                                  <Badge variant={subCategoryForm.mainUse === "product" ? "default" : "secondary"}>
                                    {subCategoryForm.mainUse === "product" ? "Product" : subCategoryForm.mainUse === "service" ? "Service" : "Select main category first"}
                                  </Badge>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="sub-description">Description (Optional)</Label>
                                <Textarea
                                  id="sub-description"
                                  placeholder="Brief description of this sub-category..."
                                  value={subCategoryForm.description}
                                  onChange={(e) => setSubCategoryForm({ ...subCategoryForm, description: e.target.value })}
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsSubCategoryDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit" disabled={!subCategoryForm.mainCategory} className="bg-blue-600 hover:bg-blue-700 text-white">
                                  Add Sub Category
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )}
                      {activeSubSection === "level2-categories" && (
                        <Dialog open={isLevel2CategoryDialogOpen} onOpenChange={setIsLevel2CategoryDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Level2 Category
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Add New Level2 Category</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleLevel2CategorySubmit} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="level2-category-name">Level2 Category Name</Label>
                                <Input
                                  id="level2-category-name"
                                  placeholder="e.g., Office Chairs"
                                  value={level2CategoryForm.name}
                                  onChange={(e) => setLevel2CategoryForm({ ...level2CategoryForm, name: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="level2-main-category-select">Main Category</Label>
                                <Select value={level2CategoryForm.mainCategory} onValueChange={(value) => {
                                  const selectedCategory = categories.find((cat: any) => cat._id === value)
                                  setLevel2CategoryForm({ 
                                    ...level2CategoryForm, 
                                    mainCategory: selectedCategory?._id || "",
                                    subCategory: "",
                                    mainUse: selectedCategory?.mainUse || ""
                                  })
                                }}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select main category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map((category: any) => (
                                      <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="level2-sub-category-select">Sub Category</Label>
                                <Select 
                                  value={level2CategoryForm.subCategory} 
                                  onValueChange={(value) => setLevel2CategoryForm({ ...level2CategoryForm, subCategory: value })}
                                  disabled={!level2CategoryForm.mainCategory}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select sub category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {subCategories
                                      .filter((subCat: any) => subCat.mainCategory === categories.find((cat: any) => cat._id === level2CategoryForm.mainCategory)?.name)
                                      .map((subCategory: any) => (
                                        <SelectItem key={subCategory._id} value={subCategory._id}>{subCategory.name}</SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="level2-main-use-display">Main Use</Label>
                                <div className="p-2 bg-muted rounded-md">
                                  <Badge variant={level2CategoryForm.mainUse === "product" ? "default" : "secondary"}>
                                    {level2CategoryForm.mainUse === "product" ? "Product" : level2CategoryForm.mainUse === "service" ? "Service" : "Select main category first"}
                                  </Badge>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="level2-description">Description (Optional)</Label>
                                <Textarea
                                  id="level2-description"
                                  placeholder="Brief description of this level2 category..."
                                  value={level2CategoryForm.description}
                                  onChange={(e) => setLevel2CategoryForm({ ...level2CategoryForm, description: e.target.value })}
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsLevel2CategoryDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit" disabled={!level2CategoryForm.mainCategory || !level2CategoryForm.subCategory} className="bg-blue-600 hover:bg-blue-700 text-white">
                                  Add Level2 Category
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {activeSubSection === "categories" ? (
                      <div className="overflow-visible">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category Name</TableHead>
                            <TableHead>Main Use</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-8">
                                Loading categories...
                              </TableCell>
                            </TableRow>
                          ) : categories.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-8">
                                <div className="text-muted-foreground">
                                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                  <p>No categories found</p>
                                  <p className="text-sm">Add your first category to get started</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            (() => {
                              const startIndex = (categoriesPage - 1) * categoriesPerPage
                              const endIndex = startIndex + categoriesPerPage
                              const paginatedCategories = categories.slice(startIndex, endIndex)
                              const totalPages = Math.ceil(categories.length / categoriesPerPage)
                              
                              return (
                                <>
                                  {paginatedCategories.map((category: any) => (
                                    <TableRow key={category._id}>
                                      <TableCell>
                                        <div className="font-medium">{category.name}</div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant={category.mainUse === "product" ? "default" : "secondary"}>
                                          {category.mainUse === "product" ? "Product" : "Service"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <div className="text-sm text-muted-foreground">
                                          {new Date(category.createdAt).toLocaleDateString()}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex space-x-2">
                                          <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="sm" onClick={() => deleteCategory(category._id)}>
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  {totalPages > 1 && (
                                    <TableRow>
                                      <TableCell colSpan={4} className="py-4">
                                        <div className="flex items-center justify-between">
                                          <div className="text-sm text-muted-foreground">
                                            Showing {startIndex + 1} to {Math.min(endIndex, categories.length)} of {categories.length} entries
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => setCategoriesPage(prev => Math.max(1, prev - 1))}
                                              disabled={categoriesPage === 1}
                                            >
                                              <ArrowLeft className="h-4 w-4 mr-1" />
                                              Previous
                                            </Button>
                                            <div className="text-sm text-muted-foreground">
                                              Page {categoriesPage} of {totalPages}
                                            </div>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => setCategoriesPage(prev => Math.min(totalPages, prev + 1))}
                                              disabled={categoriesPage === totalPages}
                                            >
                                              Next
                                              <ArrowRight className="h-4 w-4 ml-1" />
                                            </Button>
                                          </div>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </>
                              )
                            })()
                          )}
                        </TableBody>
                      </Table>
                      </div>
                    ) : activeSubSection === "sub-categories" ? (
                      <div className="overflow-visible">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sub Category Name</TableHead>
                            <TableHead>Main Category</TableHead>
                            <TableHead>Use</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8">
                                Loading sub-categories...
                              </TableCell>
                            </TableRow>
                          ) : subCategories.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8">
                                <div className="text-muted-foreground">
                                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                  <p>No sub-categories found</p>
                                  <p className="text-sm">Add your first sub-category to get started</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            (() => {
                              const startIndex = (subCategoriesPage - 1) * subCategoriesPerPage
                              const endIndex = startIndex + subCategoriesPerPage
                              const paginatedSubCategories = subCategories.slice(startIndex, endIndex)
                              const totalPages = Math.ceil(subCategories.length / subCategoriesPerPage)
                              
                              return (
                                <>
                                  {paginatedSubCategories.map((subCategory: any) => (
                                    <TableRow key={subCategory._id}>
                                      <TableCell>
                                        <div className="font-medium">{subCategory.name}</div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="font-medium">{subCategory.mainCategory}</div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant={subCategory.mainUse === "product" ? "default" : "secondary"}>
                                          {subCategory.mainUse === "product" ? "Product" : "Service"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <div className="text-sm text-muted-foreground">
                                          {new Date(subCategory.createdAt).toLocaleDateString()}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex space-x-2">
                                          <Button variant="ghost" size="sm" onClick={() => handleEditSubCategory(subCategory)}>
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="sm" onClick={() => deleteSubCategory(subCategory._id)}>
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  {totalPages > 1 && (
                                    <TableRow>
                                      <TableCell colSpan={5} className="py-4">
                                        <div className="flex items-center justify-between">
                                          <div className="text-sm text-muted-foreground">
                                            Showing {startIndex + 1} to {Math.min(endIndex, subCategories.length)} of {subCategories.length} entries
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => setSubCategoriesPage(prev => Math.max(1, prev - 1))}
                                              disabled={subCategoriesPage === 1}
                                            >
                                              <ArrowLeft className="h-4 w-4 mr-1" />
                                              Previous
                                            </Button>
                                            <div className="text-sm text-muted-foreground">
                                              Page {subCategoriesPage} of {totalPages}
                                            </div>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => setSubCategoriesPage(prev => Math.min(totalPages, prev + 1))}
                                              disabled={subCategoriesPage === totalPages}
                                            >
                                              Next
                                              <ArrowRight className="h-4 w-4 ml-1" />
                                            </Button>
                                          </div>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </>
                              )
                            })()
                          )}
                        </TableBody>
                      </Table>
                      </div>
                    ) : activeSubSection === "level2-categories" ? (
                      <div className="overflow-visible">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Level2 Category Name</TableHead>
                            <TableHead>Main Category</TableHead>
                            <TableHead>Sub Category</TableHead>
                            <TableHead>Use</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
                                Loading level2 categories...
                              </TableCell>
                            </TableRow>
                          ) : level2Categories.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
                                <div className="text-muted-foreground">
                                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                  <p>No level2 categories found</p>
                                  <p className="text-sm">Add your first level2 category to get started</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            (() => {
                              const startIndex = (level2CategoriesPage - 1) * level2CategoriesPerPage
                              const endIndex = startIndex + level2CategoriesPerPage
                              const paginatedLevel2Categories = level2Categories.slice(startIndex, endIndex)
                              const totalPages = Math.ceil(level2Categories.length / level2CategoriesPerPage)
                              
                              return (
                                <>
                                  {paginatedLevel2Categories.map((level2Category: any) => (
                                    <TableRow key={level2Category._id}>
                                      <TableCell>
                                        <div className="font-medium">{level2Category.name}</div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="font-medium">{level2Category.mainCategory}</div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="font-medium">{level2Category.subCategory}</div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant={level2Category.mainUse === "product" ? "default" : "secondary"}>
                                          {level2Category.mainUse === "product" ? "Product" : "Service"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <div className="text-sm text-muted-foreground">
                                          {new Date(level2Category.createdAt).toLocaleDateString()}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex space-x-2">
                                          <Button variant="ghost" size="sm" onClick={() => handleEditLevel2Category(level2Category)}>
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="sm" onClick={() => deleteLevel2Category(level2Category._id)}>
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  {totalPages > 1 && (
                                    <TableRow>
                                      <TableCell colSpan={6} className="py-4">
                                        <div className="flex items-center justify-between">
                                          <div className="text-sm text-muted-foreground">
                                            Showing {startIndex + 1} to {Math.min(endIndex, level2Categories.length)} of {level2Categories.length} entries
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => setLevel2CategoriesPage(prev => Math.max(1, prev - 1))}
                                              disabled={level2CategoriesPage === 1}
                                            >
                                              <ArrowLeft className="h-4 w-4 mr-1" />
                                              Previous
                                            </Button>
                                            <div className="text-sm text-muted-foreground">
                                              Page {level2CategoriesPage} of {totalPages}
                                            </div>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => setLevel2CategoriesPage(prev => Math.min(totalPages, prev + 1))}
                                              disabled={level2CategoriesPage === totalPages}
                                            >
                                              Next
                                              <ArrowRight className="h-4 w-4 ml-1" />
                                            </Button>
                                          </div>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </>
                              )
                            })()
                          )}
                        </TableBody>
                      </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Coming soon...</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/*my customer Section */}
          {activeSection === "customer-management" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Customer Management</h2>
                <p className="text-muted-foreground">Manage your customers and their access</p>
              </div>

              {/* My Customers Tab - Shows E-Shop Inventory */}
              {activeSubSection === "my-customers" && (
                <div className="space-y-4 overflow-visible">
                  {!selectedCustomerId ? (
                    <>
                      {/* Customer List View with Pagination */}
                      <div className="flex items-center justify-between space-x-2">
                        <div className="relative flex-1 max-w-md">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder="Search customers..."
                            value={customerSearchTerm}
                            onChange={(e) => {
                              setCustomerSearchTerm(e.target.value)
                              setCurrentCustomerPage(1)
                            }}
                            className="pl-10"
                          />
                        </div>
                    {/* Edit Inventory Dialog */}
                    <Dialog open={isEshopEditOpen} onOpenChange={setIsEshopEditOpen}>
                      <DialogContent className="max-w-lg w-[90vw]">
                        <DialogHeader>
                          <DialogTitle>Edit Inventory Item</DialogTitle>
                          <DialogDescription>Update product/service name, quantity and price for this customer</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEshopEditSubmit} className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium">Product/Service Name</Label>
                            <Input
                              value={eshopEditForm.productName}
                              onChange={(e) => setEshopEditForm({ ...eshopEditForm, productName: e.target.value })}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Qty</Label>
                              <Input
                                type="number"
                                min={1}
                                value={eshopEditForm.quantity}
                                onChange={(e) => setEshopEditForm({ ...eshopEditForm, quantity: parseInt(e.target.value) || 1 })}
                                required
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Price (₹)</Label>
                              <Input
                                type="number"
                                min={0}
                                step={0.01}
                                value={eshopEditForm.price}
                                onChange={(e) => setEshopEditForm({ ...eshopEditForm, price: parseFloat(e.target.value) || 0 })}
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Notes</Label>
                            <Textarea value={eshopEditForm.notes} onChange={(e) => setEshopEditForm({ ...eshopEditForm, notes: e.target.value })} />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsEshopEditOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={isEshopDialogOpen} onOpenChange={setIsEshopDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => {
                            setEshopForm({
                              productId: "",
                              productName: "",
                              customerId: "",
                              customerName: "",
                              quantity: "1",
                              price: 0,
                              notes: "",
                              deliveryType: "from_warehouse",
                              supplierName: ""
                            });
                            setMultipleProducts([{
                              productId: "",
                              productName: "",
                              quantity: 1,
                              price: 0,
                              notes: ""
                            }]);
                            setIsEshopDialogOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product Inventory
                        </Button>
                      </DialogTrigger>
                      <DialogContent 
                        className="max-w-6xl w-[95vw] add-inventory-modal p-6"
                        style={{ 
                          width: '95vw', 
                          maxWidth: '1400px', 
                          height: '600px',
                          minWidth: '1200px',
                          overflow: 'hidden'
                        }}
                      >
                        <DialogHeader className="mb-4">
                          <DialogTitle>Add Product Inventory</DialogTitle>
                          <DialogDescription>
                            Assign products to existing customers with quantities
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-inner" style={{ height: '350px', overflow: 'hidden' }}>
                          <div className="h-full overflow-y-auto inventory-dialog-scroll p-4" style={{ maxHeight: '350px' }}>
                            <div className="grid grid-cols-12 gap-6">
                            {/* Left Side - Customer Selection */}
                            <div className="col-span-4 space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="customer-select" className="text-base font-medium">Select Customer</Label>
                                <Select
                                  value={eshopForm.customerId}
                                  onValueChange={(value) => {
                                    const selectedCustomer = customers.find((c: any) => c._id === value);
                                    setEshopForm({
                                      ...eshopForm,
                                      customerId: value,
                                      customerName: selectedCustomer?.name || ""
                                    });
                                  }}
                                >
                                  <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Choose a customer" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {customers.map((customer: any) => (
                                      <SelectItem key={customer._id} value={customer._id}>
                                        {customer.name} ({customer.email})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Customer Info Display */}
                              {eshopForm.customerId && (
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                  <h4 className="font-medium text-blue-900 mb-2">Selected Customer</h4>
                                  <p className="text-sm text-blue-700">{eshopForm.customerName}</p>
                                  <p className="text-xs text-blue-600 mt-1">
                                    Products will be assigned to this customer
                                  </p>
                                </div>
                              )}

                              {/* Delivery Type Selection */}
                              <div className="space-y-2">
                                <Label className="text-base font-medium">Delivery Type</Label>
                                <Select
                                  value={eshopForm.deliveryType}
                                  onValueChange={(value: any) => setEshopForm({...eshopForm, deliveryType: value})}
                                >
                                  <SelectTrigger className="h-12">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="from_warehouse">From Warehouse</SelectItem>
                                    <SelectItem value="direct_from_supplier">Direct from Supplier</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                  {eshopForm.deliveryType === 'from_warehouse' 
                                    ? 'Stock will be deducted from warehouse inventory'
                                    : 'Stock will be added directly to customer (no warehouse deduction)'}
                                </p>
                              </div>

                              {/* Supplier Name (for direct delivery) */}
                              {eshopForm.deliveryType === 'direct_from_supplier' && (
                                <div className="space-y-2">
                                  <Label className="text-base font-medium">Supplier Name (Optional)</Label>
                                  <Input
                                    value={eshopForm.supplierName}
                                    onChange={(e) => setEshopForm({...eshopForm, supplierName: e.target.value})}
                                    placeholder="Enter supplier name"
                                  />
                                </div>
                              )}

                              {/* Summary */}
                              {multipleProducts.length > 0 && (
                                <div className="p-4 bg-gray-50 rounded-lg border">
                                  <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                                  <div className="space-y-1 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                      <span>Total Products:</span>
                                      <span className="font-medium">{multipleProducts.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Total Quantity:</span>
                                      <span className="font-medium">
                                        {multipleProducts.reduce((sum, p) => sum + (p.quantity || 0), 0)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Total Value:</span>
                                      <span className="font-medium">
                                        ₹{multipleProducts.reduce((sum, p) => sum + ((p.price || 0) * (p.quantity || 0)), 0).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right Side - Products Section */}
                            <div className="col-span-8 space-y-4">
                              <div className="flex items-center justify-between mb-3">
                                <Label className="text-base font-medium">Products</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setMultipleProducts([...multipleProducts, {
                                      productId: "",
                                      productName: "",
                                      quantity: 1,
                                      price: 0,
                                      notes: ""
                                    }]);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Product
                                </Button>
                              </div>

                              {/* Column Headers */}
                              <div className="grid grid-cols-12 gap-3 items-center px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                                <div className="col-span-5">Product</div>
                                <div className="col-span-2">Qty</div>
                                <div className="col-span-2">Price (₹)</div>
                                <div className="col-span-2">Total</div>
                                <div className="col-span-1">Action</div>
                              </div>

                              {/* Scrollable Products List Container */}
                              <div className="overflow-y-scroll inventory-dialog-scroll border border-red-500" style={{ maxHeight: '180px', minHeight: '180px', backgroundColor: '#fef2f2' }}>
                                <div className="space-y-3 p-2">
                                {multipleProducts.map((product, index) => (
                                  <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 border rounded-lg bg-gray-50">
                                    {/* Product Selection */}
                                    <div className="col-span-5">
                                      <Select
                                        value={product.productId}
                                        onValueChange={(value) => {
                                          const selectedProduct = products.find((p: any) => p._id === value);
                                          const updatedProducts = [...multipleProducts];
                                          updatedProducts[index] = {
                                            ...updatedProducts[index],
                                            productId: value,
                                            productName: selectedProduct?.name || "",
                                            price: selectedProduct?.price || 0
                                          };
                                          setMultipleProducts(updatedProducts);
                                        }}
                                      >
                                        <SelectTrigger className="h-9">
                                          <SelectValue placeholder="Choose product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {products.map((prod: any) => (
                                            <SelectItem key={prod._id} value={prod._id}>
                                              {prod.name} - ₹{prod.price}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-span-2">
                                      <Input
                                        type="number"
                                        value={product.quantity}
                                        onChange={(e) => {
                                          const updatedProducts = [...multipleProducts];
                                          updatedProducts[index].quantity = parseInt(e.target.value) || 1;
                                          setMultipleProducts(updatedProducts);
                                        }}
                                        min="1"
                                        placeholder="Qty"
                                        className="h-9"
                                      />
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-2">
                                      <Input
                                        type="number"
                                        value={product.price}
                                        onChange={(e) => {
                                          const updatedProducts = [...multipleProducts];
                                          updatedProducts[index].price = parseFloat(e.target.value) || 0;
                                          setMultipleProducts(updatedProducts);
                                        }}
                                        min="0"
                                        step="0.01"
                                        placeholder="Price"
                                        className="h-9"
                                      />
                                    </div>

                                    {/* Total */}
                                    <div className="col-span-2">
                                      <div className="h-9 px-3 py-2 bg-white border rounded-md flex items-center">
                                        <span className="text-sm font-medium">
                                          ₹{((product.price || 0) * (product.quantity || 0)).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Delete Button */}
                                    <div className="col-span-1">
                                      {multipleProducts.length > 1 && (
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setMultipleProducts(multipleProducts.filter((_, i) => i !== index));
                                          }}
                                          className="h-9 w-9 p-0"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                                </div>
                              </div>
                            </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons - Outside scrollable area */}
                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsEshopDialogOpen(false);
                              setEshopForm({
                                productId: "",
                                productName: "",
                                customerId: "",
                                customerName: "",
                                quantity: "1",
                                price: 0,
                                notes: "",
                                deliveryType: "from_warehouse",
                                supplierName: ""
                              });
                              setMultipleProducts([{
                                productId: "",
                                productName: "",
                                quantity: 1,
                                price: 0,
                                notes: ""
                              }]);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleMultipleProductsSubmit}
                            disabled={!eshopForm.customerId || multipleProducts.some(p => !p.productId || !p.quantity)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Add Products to Inventory
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {loading ? (
                    <Card>
                      <CardContent className="py-8">
                        <div className="text-center text-muted-foreground">
                          Loading customers...
                        </div>
                      </CardContent>
                    </Card>
                  ) : eshopInventory.length === 0 ? (
                    <Card>
                      <CardContent className="py-8">
                        <div className="text-center text-muted-foreground">
                          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No customer inventory found</p>
                          <p className="text-sm">Products given to customers will appear here</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (() => {
                    // Group inventory by customer
                    const customersMap = eshopInventory
                      .filter((item: any) => 
                        item.customerName.toLowerCase().includes(customerSearchTerm.toLowerCase())
                      )
                      .reduce((acc: any, item: any) => {
                        if (!acc[item.customerId]) {
                          acc[item.customerId] = {
                            customerName: item.customerName,
                            customerId: item.customerId,
                            products: [],
                            lastUpdated: item.lastUpdated
                          }
                        }
                        acc[item.customerId].products.push(item)
                        // Update lastUpdated to the most recent product update
                        if (new Date(item.lastUpdated) > new Date(acc[item.customerId].lastUpdated)) {
                          acc[item.customerId].lastUpdated = item.lastUpdated
                        }
                        return acc
                      }, {})

                    const customersList = Object.entries(customersMap).map(([customerId, customerData]: [string, any]) => ({
                      customerId,
                      ...customerData
                    }))

                    // Pagination logic
                    const totalCustomers = customersList.length
                    const totalPages = Math.ceil(totalCustomers / customersPerPage)
                    const startIndex = (currentCustomerPage - 1) * customersPerPage
                    const endIndex = startIndex + customersPerPage
                    const currentCustomers = customersList.slice(startIndex, endIndex)

                    return (
                      <>
                        <Card className="shadow-lg border-0 overflow-hidden">
                          <CardContent className="p-0">
                            <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="transition-all duration-200" style={{ backgroundColor: '#1e2961' }}>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      Customer Name
                                    </div>
                                  </TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      Contact Details
                                    </div>
                                  </TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>
                                    <div className="flex items-center gap-2">
                                      <Package className="h-4 w-4" />
                                      Products
                                    </div>
                                  </TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      Last Updated
                                    </div>
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                                <TableBody>
                                  {currentCustomers.length === 0 ? (
                                    <TableRow>
                                      <TableCell colSpan={4} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-3">
                                          <div className="p-4 bg-gray-100 rounded-full">
                                            <User className="h-8 w-8 text-gray-400" />
                                          </div>
                                          <p className="text-lg font-medium text-gray-600">No customers found</p>
                                          <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    currentCustomers.map((customerData: any, index: number) => {
                                      const customer = customers.find((c: any) => c._id === customerData.customerId)
                                      return (
                                        <TableRow 
                                          key={customerData.customerId}
                                          className="bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer border-b border-gray-200 group"
                                          onClick={() => setSelectedCustomerId(customerData.customerId)}
                                        >
                                          <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                              <div className="p-2 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg">
                                                <User className="h-5 w-5 text-indigo-600" />
                                              </div>
                                              <div>
                                                <div className="font-bold text-gray-900">
                                                  {customerData.customerName}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                  Customer ID: {customerData.customerId.slice(-8)}
                                                </div>
                                              </div>
                                            </div>
                                          </TableCell>
                                          
                                          <TableCell className="py-4">
                                            <div className="space-y-1.5">
                                              {customer?.email && (
                                                <div className="flex items-center gap-2">
                                                  <Mail className="h-3.5 w-3.5 text-blue-600" />
                                                  <span className="text-sm text-gray-700">{customer.email}</span>
                                                </div>
                                              )}
                                              {customer?.phone && (
                                                <div className="flex items-center gap-2">
                                                  <Phone className="h-3.5 w-3.5 text-green-600" />
                                                  <span className="text-sm text-gray-700">{customer.phone}</span>
                                                </div>
                                              )}
                                              {customer?.city && (
                                                <div className="flex items-center gap-2">
                                                  <MapPin className="h-3.5 w-3.5 text-purple-600" />
                                                  <span className="text-sm text-gray-700">
                                                    {customer.city}{customer.state ? `, ${customer.state}` : ''}
                                                  </span>
                                                </div>
                                              )}
                                              {!customer?.email && !customer?.phone && !customer?.city && (
                                                <span className="text-sm text-gray-400 italic">No details available</span>
                                              )}
                                            </div>
                                          </TableCell>
                                          
                                          <TableCell className="py-4">
                                            <Badge 
                                              variant="default" 
                                              className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-3 py-1.5 text-sm font-medium"
                                            >
                                              <Package className="h-3.5 w-3.5 mr-1.5" />
                                              {customerData.products.length} {customerData.products.length === 1 ? 'Product' : 'Products'}
                                            </Badge>
                                          </TableCell>
                                          
                                          <TableCell className="py-4">
                                            <div className="flex items-center justify-between gap-3">
                                              <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-indigo-600" />
                                                <span className="text-sm text-gray-700">
                                                  {new Date(customerData.lastUpdated).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                  })}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-1 text-indigo-600">
                                                <span className="text-xs font-medium">View Details</span>
                                                <ArrowRight className="h-3.5 w-3.5" />
                                              </div>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      )
                                    })
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <Card className="shadow-md border-0 bg-gradient-to-r from-gray-50 to-blue-50">
                            <CardContent className="py-4">
                              <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                  <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <span className="text-sm font-medium text-gray-700">
                                      Showing <span className="font-bold text-indigo-600">{startIndex + 1}</span> to <span className="font-bold text-indigo-600">{Math.min(endIndex, totalCustomers)}</span> of <span className="font-bold text-indigo-600">{totalCustomers}</span> customers
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentCustomerPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentCustomerPage === 1}
                                    className="border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                                  >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Previous
                                  </Button>
                                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                      <Button
                                        key={page}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setCurrentCustomerPage(page)}
                                        className={`min-w-[40px] h-9 transition-all duration-200 ${
                                          currentCustomerPage === page 
                                            ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md hover:from-indigo-700 hover:to-blue-700 font-bold scale-105" 
                                            : "hover:bg-indigo-50 hover:text-indigo-700 text-gray-700"
                                        }`}
                                      >
                                        {page}
                                      </Button>
                                    ))}
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentCustomerPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentCustomerPage === totalPages}
                                    className="border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                                  >
                                    Next
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    )
                  })()}
                </>
              ) : (
                <>
                  {/* Detailed Customer View */}
                  {(() => {
                    const customerData = Object.entries(
                      eshopInventory
                        .filter((item: any) => item.customerId === selectedCustomerId)
                        .reduce((acc: any, item: any) => {
                          if (!acc[item.customerId]) {
                            acc[item.customerId] = {
                              customerName: item.customerName,
                              customerId: item.customerId,
                              products: []
                            }
                          }
                          acc[item.customerId].products.push(item)
                          return acc
                        }, {})
                    )[0]?.[1] as any

                    if (!customerData) return null

                    return (
                      <>
                        <div className="flex items-center gap-4 mb-4">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedCustomerId(null)}
                            className="flex items-center gap-2"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Customers
                          </Button>
                        </div>

                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                  <User className="h-5 w-5 text-indigo-500" />
                                  {customerData.customerName}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {customerData.products.length} product{customerData.products.length !== 1 ? 's' : ''} in stock
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    const firstProduct = customerData.products[0];
                                    handleRetopUp(firstProduct);
                                  }}
                                  className="text-blue-600 border-blue-600 hover:bg-blue-100 hover:text-blue-700"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Re-top up
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    const items = customerData.products.map((item: any) => ({
                                      name: item.productName,
                                      quantity: item.quantity,
                                      price: item.price || 0
                                    }));
                                    const queryParams = new URLSearchParams({
                                      customerId: selectedCustomerId || '',
                                      items: JSON.stringify(items)
                                    });
                                    window.open(`/dashboard/invoice?${queryParams.toString()}`, '_blank');
                                  }}
                                  className="text-blue-600 border-blue-600 hover:bg-blue-100 hover:text-blue-700"
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Generate Invoice
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="overflow-visible">
                            <div className="overflow-visible">
                              <Table>
                              <TableHeader>
                                <TableRow className="transition-all duration-200" style={{ backgroundColor: '#1e2961' }}>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Product Name</TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Available Stock</TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Invoiced Qty</TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Last Updated</TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Notes</TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {(() => {
                                  const currentPage = customerProductsPage[customerData.customerId] || 1
                                  const startIndex = (currentPage - 1) * customerProductsPerPage
                                  const endIndex = startIndex + customerProductsPerPage
                                  const paginatedProducts = customerData.products.slice(startIndex, endIndex)
                                  const totalPages = Math.ceil(customerData.products.length / customerProductsPerPage)
                                  
                                  return (
                                    <>
                                      {paginatedProducts.map((item: any) => {
                                        const invoicedQty = item.invoicedQuantity || 0;
                                        const remainingQty = item.quantity - invoicedQty;
                                        return (
                                          <TableRow 
                                            key={item._id}
                                            className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer border-b border-gray-100 group"
                                          >
                                            <TableCell className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors py-4">
                                              <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-blue-500" />
                                                {item.productName}
                                              </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                              <Badge variant={remainingQty < 10 ? "destructive" : "default"} className={remainingQty >= 10 ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 transition-colors" : ""}>
                                                {remainingQty >= 10 && <CheckCircle className="h-3 w-3 mr-1" />}
                                                {remainingQty} units
                                              </Badge>
                                            </TableCell>
                                            <TableCell className="py-4">
                                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors">
                                                <FileText className="h-3 w-3 mr-1" />
                                                {invoicedQty} units
                                              </Badge>
                                            </TableCell>
                                          <TableCell className="text-slate-700 group-hover:text-slate-900 transition-colors py-4">
                                            <div className="flex items-center gap-2 text-sm">
                                              <Calendar className="h-4 w-4 text-indigo-500" />
                                              {new Date(item.lastUpdated).toLocaleDateString()}
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-slate-600 group-hover:text-slate-800 transition-colors py-4">
                                            <div className="text-sm max-w-xs truncate">
                                              {item.notes || "-"}
                                            </div>
                                          </TableCell>
                                          <TableCell className="relative">
                                            <div className="relative">
                                              <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  toggleDropdown(item._id)
                                                }}
                                              >
                                                <MoreVertical className="h-4 w-4" />
                                              </Button>
                                              
                                              {openDropdownId === item._id && (
                                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]">
                                                  <div className="py-1">
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleViewProductDetails(item)
                                                      }}
                                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                    >
                                                      <Eye className="h-4 w-4 mr-2" />
                                                      View
                                                    </button>
                                                    <button
                                                      onClick={() => handleDeleteInventoryItem(item)}
                                                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                                                    >
                                                      <Trash2 className="h-4 w-4 mr-2" />
                                                      Delete
                                                    </button>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                        );
                                      })}
                                      {totalPages > 1 && (
                                        <TableRow>
                                          <TableCell colSpan={6} className="py-4">
                                            <div className="flex items-center justify-between">
                                              <div className="text-sm text-muted-foreground">
                                                Showing {startIndex + 1} to {Math.min(endIndex, customerData.products.length)} of {customerData.products.length} entries
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => {
                                                    setCustomerProductsPage({
                                                      ...customerProductsPage,
                                                      [customerData.customerId]: Math.max(1, currentPage - 1)
                                                    })
                                                  }}
                                                  disabled={currentPage === 1}
                                                >
                                                  <ArrowLeft className="h-4 w-4 mr-1" />
                                                  Previous
                                                </Button>
                                                <div className="text-sm text-muted-foreground">
                                                  Page {currentPage} of {totalPages}
                                                </div>
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => {
                                                    setCustomerProductsPage({
                                                      ...customerProductsPage,
                                                      [customerData.customerId]: Math.min(totalPages, currentPage + 1)
                                                    })
                                                  }}
                                                  disabled={currentPage === totalPages}
                                                >
                                                  Next
                                                  <ArrowRight className="h-4 w-4 ml-1" />
                                                </Button>
                                              </div>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </>
                                  )
                                })()}
                              </TableBody>
                            </Table>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )
                  })()}
                </>
              )}
                </div>
              )}

              {/* View Product Details Dialog */}
              <Dialog open={isViewProductDetailsDialogOpen} onOpenChange={setIsViewProductDetailsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Product Details - {viewingProductDetails?.productName}</DialogTitle>
                    <DialogDescription>
                      View detailed information about this inventory item for {viewingProductDetails?.customerName}
                    </DialogDescription>
                  </DialogHeader>
                  {viewingProductDetails && (
                    <div className="space-y-6">
                      {/* Product Information */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Product Name</Label>
                          <p className="text-sm font-medium mt-1">{viewingProductDetails.productName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Customer Name</Label>
                          <p className="text-sm font-medium mt-1">{viewingProductDetails.customerName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Available Stock</Label>
                          <p className="text-sm mt-1">
                            <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                              {(viewingProductDetails.quantity || 0) - (viewingProductDetails.invoicedQuantity || 0)} units
                            </Badge>
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Total Quantity</Label>
                          <p className="text-sm mt-1">
                            <Badge variant="outline">
                              {viewingProductDetails.quantity || 0} units
                            </Badge>
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Invoiced Quantity</Label>
                          <p className="text-sm mt-1">
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {viewingProductDetails.invoicedQuantity || 0} units
                            </Badge>
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Price</Label>
                          <p className="text-sm font-medium mt-1">₹{viewingProductDetails.price?.toLocaleString() || '0'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                          <p className="text-sm mt-1">
                            {viewingProductDetails.lastUpdated 
                              ? new Date(viewingProductDetails.lastUpdated).toLocaleString()
                              : new Date(viewingProductDetails.createdAt || Date.now()).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Notes */}
                      {viewingProductDetails.notes && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
                          <p className="text-sm mt-1 p-3 bg-muted rounded-md">{viewingProductDetails.notes}</p>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button onClick={() => setIsViewProductDetailsDialogOpen(false)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Edit Customer Details Tab */}
              {activeSubSection === "edit-customer-details" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Edit Customer Details</CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder="Search customers..."
                            value={customerSearchTerm}
                            onChange={(e) => setCustomerSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="transition-all duration-200" style={{ backgroundColor: '#1e2961' }}>
                          <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Customer Name</TableHead>
                          <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Email</TableHead>
                          <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Phone</TableHead>
                          <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Address</TableHead>
                          <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Joined Date</TableHead>
                          <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Last Login</TableHead>
                          <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Status</TableHead>
                          <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8">
                              Loading customers...
                            </TableCell>
                          </TableRow>
                        ) : customers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8">
                              <div className="text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No customers found</p>
                                <p className="text-sm">Customers will appear here once they register</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (() => {
                          const filteredCustomers = customers
                            .filter((customer: any) => 
                              customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                              customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                              customer.phone.includes(customerSearchTerm)
                            )
                            .sort((a: any, b: any) => {
                              const dateA = new Date(a.createdAt || a.lastLogin || 0).getTime()
                              const dateB = new Date(b.createdAt || b.lastLogin || 0).getTime()
                              return dateB - dateA // Latest first
                            })
                          const totalPages = Math.ceil(filteredCustomers.length / editCustomerPerPage)
                          const startIndex = (editCustomerPage - 1) * editCustomerPerPage
                          const endIndex = startIndex + editCustomerPerPage
                          const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex)
                          
                          return (
                            <>
                              {paginatedCustomers.map((customer: any, index: number) => (
                                <TableRow 
                                  key={customer._id}
                                  className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer border-b border-gray-100 group"
                                  style={{ animationDelay: `${index * 50}ms` }}
                                >
                                  <TableCell className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors py-4">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-indigo-500" />
                                      {customer.name}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-slate-700 group-hover:text-slate-900 transition-colors py-4">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Mail className="h-4 w-4 text-blue-500" />
                                      {customer.email}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-slate-700 group-hover:text-slate-900 transition-colors py-4">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Phone className="h-4 w-4 text-green-500" />
                                      {customer.phone}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-slate-600 group-hover:text-slate-800 transition-colors py-4">
                                    <div className="flex items-center gap-2 text-sm max-w-xs truncate">
                                      <MapPin className="h-4 w-4 text-orange-500" />
                                      {customer.address ? `${customer.address}, ${customer.city || ''}` : '-'}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-slate-700 group-hover:text-slate-900 transition-colors py-4">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Calendar className="h-4 w-4 text-indigo-500" />
                                      {new Date(customer.createdAt).toLocaleDateString()}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-slate-700 group-hover:text-slate-900 transition-colors py-4">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Clock className="h-4 w-4 text-purple-500" />
                                      {customer.lastLogin ? new Date(customer.lastLogin).toLocaleString() : 'Never'}
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <Badge 
                                      variant={customer.isBlocked ? "destructive" : "default"}
                                      className={!customer.isBlocked ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 transition-colors" : ""}
                                    >
                                      {!customer.isBlocked && <CheckCircle className="h-3 w-3 mr-1" />}
                                      {customer.isBlocked ? "Blocked" : "Active"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                                          <Edit className="h-4 w-4 mr-2" />
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteCustomer(customer._id)} className="text-red-600">
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {totalPages > 1 && (
                                <TableRow>
                                  <TableCell colSpan={8} className="py-4">
                                    <div className="flex items-center justify-between">
                                      <div className="text-sm text-muted-foreground">
                                        Showing {startIndex + 1} to {Math.min(endIndex, filteredCustomers.length)} of {filteredCustomers.length} entries
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setEditCustomerPage(Math.max(1, editCustomerPage - 1))}
                                          disabled={editCustomerPage === 1}
                                        >
                                          Previous
                                        </Button>
                                        <div className="text-sm text-muted-foreground">
                                          Page {editCustomerPage} of {totalPages}
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setEditCustomerPage(Math.min(totalPages, editCustomerPage + 1))}
                                          disabled={editCustomerPage === totalPages}
                                        >
                                          Next
                                        </Button>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          )
                        })()}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Supplier Management Tab */}
              {activeSubSection === "supplier-management" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Supplier Management</CardTitle>
                      <Button 
                        onClick={() => {
                          setSupplierForm({
                            name: "",
                            contact: "",
                            email: "",
                            phone: "",
                            address: "",
                            city: "",
                            state: "",
                            pincode: "",
                            gstNumber: "",
                            notes: "",
                            isActive: true
                          })
                          setEditingSupplier(null)
                          setIsSupplierDialogOpen(true)
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Supplier
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="transition-all duration-200" style={{ backgroundColor: '#1e2961' }}>
                          <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Supplier Name</TableHead>
                          <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Contact</TableHead>
                          <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Email</TableHead>
                          <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Phone</TableHead>
                          <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>City</TableHead>
                          <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>GST Number</TableHead>
                          <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Status</TableHead>
                          <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {suppliers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8">
                              <div className="text-muted-foreground">
                                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No suppliers found</p>
                                <p className="text-sm">Add your first supplier to get started</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (() => {
                          const sortedSuppliers = [...suppliers].sort((a: any, b: any) => {
                            const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime()
                            const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime()
                            return dateB - dateA // Latest first
                          })
                          const totalPages = Math.ceil(sortedSuppliers.length / supplierPerPage)
                          const startIndex = (supplierPage - 1) * supplierPerPage
                          const endIndex = startIndex + supplierPerPage
                          const paginatedSuppliers = sortedSuppliers.slice(startIndex, endIndex)
                          
                          return (
                            <>
                              {paginatedSuppliers.map((supplier: any, index: number) => (
                                <TableRow 
                                  key={supplier._id}
                                  className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer border-b border-gray-100 group"
                                  style={{ animationDelay: `${index * 50}ms` }}
                                >
                                  <TableCell className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors py-4">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-indigo-500" />
                                      {supplier.name}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-slate-700 group-hover:text-slate-900 transition-colors py-4">
                                    <div className="flex items-center gap-2">
                                      <UserCircle className="h-4 w-4 text-blue-500" />
                                      {supplier.contact || '-'}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-slate-700 group-hover:text-slate-900 transition-colors py-4">
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4 text-blue-500" />
                                      {supplier.email || '-'}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-slate-700 group-hover:text-slate-900 transition-colors py-4">
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-green-500" />
                                      {supplier.phone || '-'}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-slate-600 group-hover:text-slate-800 transition-colors py-4">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-orange-500" />
                                      {supplier.city || '-'}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-slate-700 group-hover:text-slate-900 transition-colors py-4">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-purple-500" />
                                      {supplier.gstNumber || '-'}
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <Badge 
                                      variant={supplier.isActive ? "default" : "secondary"}
                                      className={supplier.isActive ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 transition-colors" : "bg-gray-100 text-gray-700 border-gray-200"}
                                    >
                                      {supplier.isActive && <CheckCircle className="h-3 w-3 mr-1" />}
                                      {supplier.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => {
                                          setEditingSupplier(supplier)
                                          setSupplierForm({
                                            name: supplier.name,
                                            contact: supplier.contact || "",
                                            email: supplier.email || "",
                                            phone: supplier.phone || "",
                                            address: supplier.address || "",
                                            city: supplier.city || "",
                                            state: supplier.state || "",
                                            pincode: supplier.pincode || "",
                                            gstNumber: supplier.gstNumber || "",
                                            notes: supplier.notes || "",
                                            isActive: supplier.isActive !== undefined ? supplier.isActive : true
                                          })
                                          setIsSupplierDialogOpen(true)
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={async () => {
                                          if (confirm(`Are you sure you want to delete ${supplier.name}?`)) {
                                            try {
                                              const response = await fetch(`/api/suppliers/${supplier._id}`, {
                                                method: 'DELETE'
                                              })
                                              const result = await response.json()
                                              if (result.success) {
                                                setSuppliers(suppliers.filter((s: any) => s._id !== supplier._id))
                                                alert('Supplier deleted successfully')
                                              } else {
                                                alert('Error deleting supplier: ' + result.error)
                                              }
                                            } catch (error) {
                                              console.error('Error deleting supplier:', error)
                                              alert('Error deleting supplier')
                                            }
                                          }
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                                {totalPages > 1 && (
                                  <TableRow>
                                    <TableCell colSpan={8} className="py-4">
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                          Showing {startIndex + 1} to {Math.min(endIndex, sortedSuppliers.length)} of {sortedSuppliers.length} entries
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSupplierPage(Math.max(1, supplierPage - 1))}
                                            disabled={supplierPage === 1}
                                          >
                                            Previous
                                          </Button>
                                          <div className="text-sm text-muted-foreground">
                                            Page {supplierPage} of {totalPages}
                                          </div>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSupplierPage(Math.min(totalPages, supplierPage + 1))}
                                            disabled={supplierPage === totalPages}
                                          >
                                            Next
                                          </Button>
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </>
                            )
                          })()}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Edit Customer Dialog */}
              <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingCustomer ? "Edit Customer" : "Add Customer"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCustomerSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customer-name">Name</Label>
                        <Input
                          id="customer-name"
                          placeholder="Enter customer name"
                          value={customerForm.name}
                          onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer-email">Email</Label>
                        <Input
                          id="customer-email"
                          type="email"
                          placeholder="Enter email"
                          value={customerForm.email}
                          onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customer-phone">Phone</Label>
                        <Input
                          id="customer-phone"
                          placeholder="Enter phone number"
                          value={customerForm.phone}
                          onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer-password">Password {editingCustomer && "(Leave blank to keep current)"}</Label>
                        <Input
                          id="customer-password"
                          type="password"
                          placeholder="Enter password"
                          value={customerForm.password}
                          onChange={(e) => setCustomerForm({...customerForm, password: e.target.value})}
                          required={!editingCustomer}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="customer-address">Address</Label>
                      <Input
                        id="customer-address"
                        placeholder="Enter address"
                        value={customerForm.address}
                        onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customer-city">City</Label>
                        <Input
                          id="customer-city"
                          placeholder="Enter city"
                          value={customerForm.city}
                          onChange={(e) => setCustomerForm({...customerForm, city: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer-state">State</Label>
                        <Input
                          id="customer-state"
                          placeholder="Enter state"
                          value={customerForm.state}
                          onChange={(e) => setCustomerForm({...customerForm, state: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customer-zipcode">Zip Code</Label>
                        <Input
                          id="customer-zipcode"
                          placeholder="Enter zip code"
                          value={customerForm.zipCode}
                          onChange={(e) => setCustomerForm({...customerForm, zipCode: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer-country">Country</Label>
                        <Input
                          id="customer-country"
                          placeholder="Enter country"
                          value={customerForm.country}
                          onChange={(e) => setCustomerForm({...customerForm, country: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => {
                        setIsCustomerDialogOpen(false)
                        setEditingCustomer(null)
                        setCustomerForm({ name: "", email: "", phone: "", password: "", address: "", city: "", state: "", zipCode: "", country: "India" })
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                        {editingCustomer ? "Update Customer" : "Add Customer"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Block/Unblock Customer Tab */}
              {activeSubSection === "block-unblock-customer" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Block/Unblock Customer</CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder="Search customers..."
                            value={customerSearchTerm}
                            onChange={(e) => setCustomerSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User Name</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              Loading customers...
                            </TableCell>
                          </TableRow>
                        ) : customers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              <div className="text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No customers found</p>
                                <p className="text-sm">Customers will appear here once they register</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (() => {
                          const filteredCustomers = customers
                            .filter((customer: any) => 
                              customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                              customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                              customer.phone.includes(customerSearchTerm) ||
                              customer.username?.toLowerCase().includes(customerSearchTerm.toLowerCase())
                            )
                            .sort((a: any, b: any) => {
                              const dateA = new Date(a.createdAt || a.lastLogin || 0).getTime()
                              const dateB = new Date(b.createdAt || b.lastLogin || 0).getTime()
                              return dateB - dateA // Latest first
                            })
                          const totalPages = Math.ceil(filteredCustomers.length / blockCustomerPerPage)
                          const startIndex = (blockCustomerPage - 1) * blockCustomerPerPage
                          const endIndex = startIndex + blockCustomerPerPage
                          const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex)
                          
                          return (
                            <>
                              {paginatedCustomers.map((customer: any) => (
                                <TableRow key={customer._id}>
                                  <TableCell>
                                    <div className="font-medium">{customer.name}</div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm">{customer.email}</div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm">{customer.phone}</div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm font-mono">{customer.username}</div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant={customer.status === 'blocked' ? "destructive" : "default"}>
                                      {customer.status === 'blocked' ? "Blocked" : "Active"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm text-muted-foreground">
                                      {customer.lastLogin ? new Date(customer.lastLogin).toLocaleString() : 'Never'}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant={customer.status === 'blocked' ? "default" : "destructive"}
                                      size="sm"
                                      onClick={() => handleToggleCustomerStatus(customer)}
                                    >
                                      {customer.status === 'blocked' ? 'Unblock' : 'Block'}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {totalPages > 1 && (
                                <TableRow>
                                  <TableCell colSpan={7} className="py-4">
                                    <div className="flex items-center justify-between">
                                      <div className="text-sm text-muted-foreground">
                                        Showing {startIndex + 1} to {Math.min(endIndex, filteredCustomers.length)} of {filteredCustomers.length} entries
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setBlockCustomerPage(Math.max(1, blockCustomerPage - 1))}
                                          disabled={blockCustomerPage === 1}
                                        >
                                          Previous
                                        </Button>
                                        <div className="text-sm text-muted-foreground">
                                          Page {blockCustomerPage} of {totalPages}
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setBlockCustomerPage(Math.min(totalPages, blockCustomerPage + 1))}
                                          disabled={blockCustomerPage === totalPages}
                                        >
                                          Next
                                        </Button>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          )
                        })()}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Inventory Management Section */}
          {activeSection === "inventory-management" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
                <p className="text-muted-foreground">Manage purchase orders, warehouse stock, and waste entries</p>
              </div>

              {/* Purchase Orders Tab */}
              {activeSubSection === "purchase-orders" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Purchase Orders</CardTitle>
                      <Button 
                        onClick={() => {
                          setPOForm({
                            supplierName: "",
                            items: [{ productId: "", productName: "", quantity: 1, unitPrice: 0 }],
                            deliveryType: "to_warehouse",
                            poType: "standard",
                            customerId: "",
                            customerName: "",
                            expectedDate: "",
                            notes: ""
                          })
                          setIsPODialogOpen(true)
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Purchase Order
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                      <Table>
                        <TableHeader>
                          <TableRow className="transition-all duration-200" style={{ backgroundColor: '#1e2961' }}>
                            <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>PO Number</TableHead>
                            <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Supplier</TableHead>
                            <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Items</TableHead>
                            <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Delivery Type</TableHead>
                            <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Status</TableHead>
                            <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Date</TableHead>
                            <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            <TableRow className="bg-white hover:bg-blue-50/30 transition-all duration-200">
                              <TableCell colSpan={7} className="text-center py-8">
                                <div className="flex items-center justify-center gap-2">
                                  <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                                  <span className="text-gray-600">Loading...</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : purchaseOrders.length === 0 ? (
                            <TableRow className="bg-white hover:bg-blue-50/30 transition-all duration-200">
                              <TableCell colSpan={7} className="text-center py-12">
                                <div className="flex flex-col items-center text-muted-foreground">
                                  <FileText className="h-16 w-16 mb-4 opacity-30 text-blue-400" />
                                  <p className="text-lg font-medium">No purchase orders found</p>
                                  <p className="text-sm mt-1">Create your first purchase order to get started</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (() => {
                            // Sort purchase orders by date (newest first)
                            const sortedPOs = [...purchaseOrders].sort((a: any, b: any) => {
                              const dateA = new Date(a.createdAt || a.date || 0).getTime()
                              const dateB = new Date(b.createdAt || b.date || 0).getTime()
                              return dateB - dateA // Newest first
                            })
                            
                            const totalPages = Math.ceil(sortedPOs.length / poPerPage)
                            const startIndex = (currentPOPage - 1) * poPerPage
                            const endIndex = startIndex + poPerPage
                            const currentPOs = sortedPOs.slice(startIndex, endIndex)
                            
                            return (
                              <>
                                {currentPOs.map((po: any, index: number) => {
                                  return (
                              <TableRow 
                                key={po._id}
                                className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer border-b border-gray-100 group"
                                onClick={() => {
                                  setViewingPO(po)
                                  setIsViewPODialogOpen(true)
                                }}
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <TableCell className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors py-4">
                                  <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-blue-500" />
                                    {po.poNumber}
                                  </div>
                                </TableCell>
                                <TableCell className="text-slate-700 group-hover:text-slate-900 transition-colors py-4">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-indigo-500" />
                                    {po.supplierName}
                                  </div>
                                </TableCell>
                                <TableCell className="py-4">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors">
                                      <ShoppingCart className="h-3 w-3 mr-1" />
                                      {po.items.length} item{po.items.length !== 1 ? 's' : ''}
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4">
                                  <Badge 
                                    variant={po.deliveryType === 'to_warehouse' ? 'default' : 'secondary'}
                                    className={
                                      po.deliveryType === 'to_warehouse' 
                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-sm' 
                                        : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300 shadow-sm'
                                    }
                                  >
                                    {po.deliveryType === 'to_warehouse' ? (
                                      <>
                                        <MapPin className="h-3 w-3 mr-1" />
                                        To Warehouse
                                      </>
                                    ) : (
                                      <>
                                        <User className="h-3 w-3 mr-1" />
                                        Direct to Customer
                                      </>
                                    )}
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-4">
                                  {po.deliveryType === 'direct_to_customer' ? (
                                    <Select
                                      value={po.status}
                                      onValueChange={(value) => handlePOStatusUpdate(po._id, value)}
                                    >
                                      <SelectTrigger className="w-36 h-9 border-2 hover:border-blue-400 transition-colors">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">
                                          <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                            Pending
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="reached">
                                          <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            Reached
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                          <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                            Cancelled
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <div className="flex flex-col gap-1">
                                      <Badge 
                                        variant={
                                          po.status === 'PO_CLOSED' || po.status === 'received' 
                                            ? 'default' 
                                            : po.status === 'PO_REFERENCE'
                                            ? 'outline'
                                            : po.status === 'cancelled' 
                                            ? 'destructive' 
                                            : 'secondary'
                                        }
                                        className={
                                          po.status === 'PO_CLOSED' || po.status === 'received'
                                            ? 'bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm' 
                                            : po.status === 'PO_PARTIALLY_RECEIVED'
                                            ? 'bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-sm'
                                            : po.status === 'PO_REFERENCE'
                                            ? 'bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300 shadow-sm'
                                            : po.status === 'cancelled'
                                            ? 'bg-red-500 hover:bg-red-600 text-white border-0 shadow-sm'
                                            : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300 shadow-sm'
                                        }
                                      >
                                        {po.status === 'PO_CLOSED' || po.status === 'received' ? <div className="h-2 w-2 rounded-full bg-white mr-1.5"></div> : null}
                                        {po.status === 'PO_PARTIALLY_RECEIVED' ? <div className="h-2 w-2 rounded-full bg-white mr-1.5"></div> : null}
                                        {po.status === 'PO_CREATED' || po.status === 'pending' ? <div className="h-2 w-2 rounded-full bg-yellow-600 mr-1.5"></div> : null}
                                        {po.status === 'PO_REFERENCE' ? <FileText className="h-3 w-3 mr-1" /> : null}
                                        {po.status === 'PO_CREATED' ? 'Created' : 
                                         po.status === 'PO_PARTIALLY_RECEIVED' ? 'Partially Received' :
                                         po.status === 'PO_CLOSED' ? 'Closed' :
                                         po.status === 'PO_REFERENCE' ? 'Reference' :
                                         po.status}
                                      </Badge>
                                      {(po.status === 'PO_PARTIALLY_RECEIVED' || po.status === 'PO_CREATED') && po.receivedQuantity !== undefined && po.pendingQuantity !== undefined && (
                                        <div className="text-xs text-muted-foreground">
                                          {po.receivedQuantity || 0}/{po.receivedQuantity + po.pendingQuantity} received
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="py-4">
                                  <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                    <Calendar className="h-4 w-4 text-blue-500" />
                                    {new Date(po.createdAt).toLocaleDateString()}
                                  </div>
                                </TableCell>
                                <TableCell className="py-4">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setViewingPO(po)
                                        setIsViewPODialogOpen(true)
                                      }}
                                      className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        // TODO: Implement edit functionality
                                        alert('Edit functionality coming soon')
                                      }}
                                      className="hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        if (confirm(`Are you sure you want to delete PO ${po.poNumber}?`)) {
                                          // TODO: Implement delete functionality
                                          alert('Delete functionality coming soon')
                                        }
                                      }}
                                      className="hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                                  )
                                })}
                              {sortedPOs.length > poPerPage && (
                                <TableRow>
                                  <TableCell colSpan={7} className="py-4">
                                    <div className="flex items-center justify-between">
                                      <div className="text-sm text-muted-foreground">
                                        Showing {startIndex + 1}-{Math.min(endIndex, sortedPOs.length)} of {sortedPOs.length} purchase orders
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setCurrentPOPage(prev => Math.max(1, prev - 1))}
                                          disabled={currentPOPage === 1}
                                        >
                                          Previous
                                        </Button>
                                        <div className="flex items-center gap-1">
                                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button
                                              key={page}
                                              variant={currentPOPage === page ? "default" : "outline"}
                                              size="sm"
                                              onClick={() => setCurrentPOPage(page)}
                                              className="min-w-[40px]"
                                            >
                                              {page}
                                            </Button>
                                          ))}
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setCurrentPOPage(prev => Math.min(totalPages, prev + 1))}
                                          disabled={currentPOPage === totalPages}
                                        >
                                          Next
                                        </Button>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          )
                        })()}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Warehouse Stock Tab */}
              {activeSubSection === "warehouse-stock" && (
            <div className="space-y-6">
                  {/* Current Warehouse Stock Section - Table 1 (Moved to Top) */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
              <div>
                          <CardTitle>Current Warehouse Stock</CardTitle>
                          <CardDescription>Accepted and received stock in warehouse. This shows actual physical stock available.</CardDescription>
              </div>
                        <Button
                          onClick={() => {
                            setIsGRNTypeDialogOpen(true)
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create GRN
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        // Sort by latest first (by lastReceivedDate or createdAt)
                        const sortedStock = [...warehouseStock].sort((a: any, b: any) => {
                          const dateA = a.lastReceivedDate ? new Date(a.lastReceivedDate).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0)
                          const dateB = b.lastReceivedDate ? new Date(b.lastReceivedDate).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0)
                          return dateB - dateA // Descending order (newest first)
                        })
                        
                        // Pagination
                        const totalPages = Math.ceil(sortedStock.length / warehouseStockPerPage)
                        const startIndex = (currentWarehouseStockPage - 1) * warehouseStockPerPage
                        const endIndex = startIndex + warehouseStockPerPage
                        const paginatedStock = sortedStock.slice(startIndex, endIndex)
                        
                        return (
                          <>
                            <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                              <Table>
                                <TableHeader>
                                  <TableRow className="transition-all duration-200" style={{ backgroundColor: '#1e2961' }}>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Product Name</TableHead>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Website Stock</TableHead>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Warehouse Stock</TableHead>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Difference</TableHead>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Last Supplier</TableHead>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Total Received</TableHead>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Last Received</TableHead>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {loading ? (
                                    <TableRow className="bg-white hover:bg-blue-50/30 transition-all duration-200">
                                      <TableCell colSpan={8} className="text-center py-8">
                                        <div className="flex items-center justify-center gap-2">
                                          <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                                          <span className="text-gray-600">Loading...</span>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ) : sortedStock.length === 0 ? (
                                    <TableRow className="bg-white hover:bg-blue-50/30 transition-all duration-200">
                                      <TableCell colSpan={8} className="text-center py-12">
                                        <div className="flex flex-col items-center text-muted-foreground">
                                          <Package className="h-16 w-16 mb-4 opacity-30 text-blue-400" />
                                          <p className="text-lg font-medium">No warehouse stock found</p>
                                          <p className="text-sm mt-1">Stock will appear here once goods are received</p>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    paginatedStock.map((stock: any, index: number) => {
                                      const difference = (stock.adminStock || 0) - stock.availableStock
                                      return (
                                        <TableRow 
                                          key={stock._id}
                                          className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer border-b border-gray-100 group"
                                        >
                                          <TableCell className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors py-4">
                                            <div className="flex items-center gap-2">
                                              <Package className="h-4 w-4 text-blue-500" />
                                              {stock.productName}
                                            </div>
                                          </TableCell>
                                          <TableCell className="py-4">
                                            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 transition-colors">
                                              {stock.adminStock || 0}
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="py-4">
                                            <Badge 
                                              variant={stock.availableStock < 10 ? "destructive" : "default"}
                                              className={
                                                stock.availableStock < 10
                                                  ? 'bg-red-500 hover:bg-red-600 text-white border-0 shadow-sm'
                                                  : 'bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm'
                                              }
                                            >
                                              {stock.availableStock < 10 && <div className="h-2 w-2 rounded-full bg-white mr-1.5"></div>}
                                              {stock.availableStock >= 10 && <div className="h-2 w-2 rounded-full bg-white mr-1.5"></div>}
                                              {stock.availableStock}
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="py-4">
                                            <Badge 
                                              variant={difference !== 0 ? "secondary" : "outline"}
                                              className={
                                                difference > 0
                                                  ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300 shadow-sm'
                                                  : difference < 0
                                                  ? 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300 shadow-sm'
                                                  : 'bg-gray-50 text-gray-600 border-gray-200'
                                              }
                                            >
                                              {difference > 0 ? `+${difference}` : difference}
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                                              <User className="h-4 w-4 text-indigo-500" />
                                              {stock.lastSupplier || '-'}
                                            </div>
                                          </TableCell>
                                          <TableCell className="py-4">
                                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors">
                                              {stock.totalReceivedFromSupplier || 0}
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                              <Calendar className="h-4 w-4 text-blue-500" />
                                              {stock.lastReceivedDate ? new Date(stock.lastReceivedDate).toLocaleDateString() : '-'}
                                            </div>
                                          </TableCell>
                                          <TableCell className="py-4">
                                            <div className="flex items-center gap-2">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  setViewingStock(stock)
                                                  setIsViewStockDialogOpen(true)
                                                }}
                                                className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                                              >
                                                <Eye className="h-4 w-4" />
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  if (confirm(`Are you sure you want to delete stock entry for ${stock.productName}?`)) {
                                                    // TODO: Implement delete functionality
                                                    alert('Delete functionality coming soon')
                                                  }
                                                }}
                                                className="hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      )
                                    })
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                            
                            {/* Pagination Controls */}
                            {sortedStock.length > 0 && totalPages > 1 && (
                              <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-600">
                                  Showing {startIndex + 1} to {Math.min(endIndex, sortedStock.length)} of {sortedStock.length} products
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentWarehouseStockPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentWarehouseStockPage === 1}
                                  >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Previous
                                  </Button>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                      <Button
                                        key={page}
                                        variant={currentWarehouseStockPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentWarehouseStockPage(page)}
                                        className={currentWarehouseStockPage === page ? "bg-blue-600 text-white" : ""}
                                      >
                                        {page}
                                      </Button>
                                    ))}
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentWarehouseStockPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentWarehouseStockPage === totalPages}
                                  >
                                    Next
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Inward Tab */}
              {activeSubSection === "inward" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Goods Inward</CardTitle>
                        <div className="flex items-center gap-2">
                          <Button 
                            onClick={() => {
                              setIsInwardTypeDialogOpen(true)
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Receive Goods
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                        <Table>
                          <TableHeader>
                            <TableRow className="transition-all duration-200" style={{ backgroundColor: '#1e2961' }}>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Inward Number</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>PO Number</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Supplier</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Products</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Received Qty</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Damaged</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Lost</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Status</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Received Date</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {loading ? (
                              <TableRow className="bg-white hover:bg-blue-50/30 transition-all duration-200">
                                <TableCell colSpan={10} className="text-center py-8">
                                  <div className="flex items-center justify-center gap-2">
                                    <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                                    <span className="text-gray-600">Loading...</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : inwardEntries.length === 0 ? (
                              <TableRow className="bg-white hover:bg-blue-50/30 transition-all duration-200">
                                <TableCell colSpan={10} className="text-center py-12">
                                  <div className="flex flex-col items-center text-muted-foreground">
                                    <Package className="h-16 w-16 mb-4 opacity-30 text-green-400" />
                                    <p className="text-lg font-medium">No inward entries found</p>
                                    <p className="text-sm mt-1">Receive goods to create inward entries</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              inwardEntries.map((inward: any, index: number) => {
                                const totalReceived = inward.items.reduce((sum: number, item: any) => sum + item.receivedQuantity, 0)
                                const totalDamaged = inward.items.reduce((sum: number, item: any) => sum + item.damagedQuantity, 0)
                                const totalLost = inward.items.reduce((sum: number, item: any) => sum + item.lostQuantity, 0)
                                return (
                                  <TableRow 
                                    key={inward._id}
                                    className="bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 cursor-pointer border-b border-gray-100 group"
                                  >
                                    <TableCell className="font-semibold text-slate-900 group-hover:text-green-700 transition-colors py-4">
                                      <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-green-500" />
                                        {inward.inwardNumber}
                                      </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                      {inward.poNumber ? (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                          {inward.poNumber}
                                        </Badge>
                                      ) : (
                                        <span className="text-gray-400 text-sm">Direct Inward</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-slate-700 group-hover:text-slate-900 transition-colors py-4">
                                      <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-indigo-500" />
                                        {inward.supplierName}
                                      </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                      <div className="space-y-1">
                                        {inward.items.slice(0, 2).map((item: any, idx: number) => (
                                          <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 mr-1 mb-1">
                                            {item.productName} - {item.receivedQuantity}
                                          </Badge>
                                        ))}
                                        {inward.items.length > 2 && (
                                          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                                            +{inward.items.length - 2} more
                                          </Badge>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        {totalReceived} units
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="py-4">
                                      {totalDamaged > 0 ? (
                                        <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600 text-white border-0">
                                          {totalDamaged} units
                                        </Badge>
                                      ) : (
                                        <span className="text-gray-400 text-sm">-</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="py-4">
                                      {totalLost > 0 ? (
                                        <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600 text-white border-0">
                                          {totalLost} units
                                        </Badge>
                                      ) : (
                                        <span className="text-gray-400 text-sm">-</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="py-4">
                                      <Badge 
                                        variant="outline"
                                        className={
                                          inward.status === 'PENDING_GRN'
                                            ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300'
                                            : 'bg-green-100 hover:bg-green-200 text-green-800 border-green-300'
                                        }
                                      >
                                        {inward.status === 'PENDING_GRN' ? 'Pending GRN' : 'GRN Created'}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="py-4">
                                      <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                        <Calendar className="h-4 w-4 text-blue-500" />
                                        {new Date(inward.receivedDate).toLocaleDateString()}
                                      </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                      <div className="flex items-center gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setViewingInward(inward)
                                            setIsViewInwardDialogOpen(true)
                                          }}
                                          className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setEditingInward(inward)
                                            setEditInwardForm({
                                              supplierName: inward.supplierName || "",
                                              receivedDate: inward.receivedDate ? new Date(inward.receivedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                                              notes: inward.notes || "",
                                              items: inward.items.map((item: any) => ({
                                                productId: item.productId || "",
                                                productName: item.productName || "",
                                                orderedQuantity: item.orderedQuantity || 0,
                                                receivedQuantity: item.receivedQuantity || 0,
                                                damagedQuantity: item.damagedQuantity || 0,
                                                lostQuantity: item.lostQuantity || 0,
                                                acceptedQuantity: item.acceptedQuantity || 0,
                                                unitPrice: item.unitPrice || 0
                                              }))
                                            })
                                            setIsEditInwardDialogOpen(true)
                                          }}
                                          className="hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            if (confirm(`Are you sure you want to delete inward entry ${inward.inwardNumber}?`)) {
                                              // TODO: Implement delete functionality
                                              alert('Delete functionality coming soon')
                                            }
                                          }}
                                          className="hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )
                              })
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Waste Management Tab */}
              {activeSubSection === "waste-management" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Waste Management</CardTitle>
                      <Button 
                        onClick={() => {
                          setWasteForm({
                            productId: "",
                            productName: "",
                            quantity: "",
                            reason: "damaged",
                            description: "",
                            warehouseName: "Main Warehouse"
                          })
                          setIsWasteDialogOpen(true)
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Record Waste
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const sortedWasteEntries = [...wasteEntries].sort((a: any, b: any) => {
                        const dateA = new Date(a.date || a.createdAt).getTime()
                        const dateB = new Date(b.date || b.createdAt).getTime()
                        return dateB - dateA
                      })
                      
                      const totalPages = Math.ceil(sortedWasteEntries.length / wastePerPage)
                      const startIndex = (currentWastePage - 1) * wastePerPage
                      const endIndex = startIndex + wastePerPage
                      const paginatedWasteEntries = sortedWasteEntries.slice(startIndex, endIndex)
                      
                      return (
                        <>
                          <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                            <Table>
                              <TableHeader>
                                <TableRow className="transition-all duration-200" style={{ backgroundColor: '#1e2961' }}>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Product Name</TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Quantity</TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Reason</TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Description</TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Date</TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {loading ? (
                                  <TableRow className="bg-white hover:bg-blue-50/30 transition-all duration-200">
                                    <TableCell colSpan={6} className="text-center py-8">
                                      <div className="flex items-center justify-center gap-2">
                                        <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                                        <span className="text-gray-600">Loading...</span>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ) : sortedWasteEntries.length === 0 ? (
                                  <TableRow className="bg-white hover:bg-blue-50/30 transition-all duration-200">
                                    <TableCell colSpan={6} className="text-center py-12">
                                      <div className="flex flex-col items-center text-muted-foreground">
                                        <Trash2 className="h-16 w-16 mb-4 opacity-30 text-red-400" />
                                        <p className="text-lg font-medium">No waste entries found</p>
                                        <p className="text-sm mt-1">Record waste entries to track damaged or lost products</p>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  paginatedWasteEntries.map((waste: any, index: number) => (
                                    <TableRow 
                                      key={waste._id}
                                      className="bg-white hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200 cursor-pointer border-b border-gray-100 group"
                                    >
                                      <TableCell className="font-semibold text-slate-900 group-hover:text-red-700 transition-colors py-4">
                                        <div className="flex items-center gap-2">
                                          <Package className="h-4 w-4 text-red-500" />
                                          {waste.productName}
                                        </div>
                                      </TableCell>
                                      <TableCell className="py-4">
                                        <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 text-white border-0 shadow-sm">
                                          <div className="h-2 w-2 rounded-full bg-white mr-1.5"></div>
                                          {waste.quantity} units
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="py-4">
                                        <Badge 
                                          variant="outline"
                                          className={
                                            waste.reason === 'damaged'
                                              ? 'bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300 shadow-sm'
                                              : waste.reason === 'expired'
                                              ? 'bg-red-100 hover:bg-red-200 text-red-800 border-red-300 shadow-sm'
                                              : waste.reason === 'lost'
                                              ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300 shadow-sm'
                                              : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300 shadow-sm'
                                          }
                                        >
                                          {waste.reason === 'damaged' && <div className="h-2 w-2 rounded-full bg-orange-600 mr-1.5"></div>}
                                          {waste.reason === 'expired' && <div className="h-2 w-2 rounded-full bg-red-600 mr-1.5"></div>}
                                          {waste.reason === 'lost' && <div className="h-2 w-2 rounded-full bg-yellow-600 mr-1.5"></div>}
                                          {waste.reason === 'other' && <div className="h-2 w-2 rounded-full bg-gray-600 mr-1.5"></div>}
                                          {waste.reason.charAt(0).toUpperCase() + waste.reason.slice(1)}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="py-4">
                                        <div className="text-sm text-slate-600 group-hover:text-slate-900 max-w-xs truncate transition-colors">
                                          {waste.description || '-'}
                                        </div>
                                      </TableCell>
                                      <TableCell className="py-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                          <Calendar className="h-4 w-4 text-blue-500" />
                                          {new Date(waste.date || waste.createdAt).toLocaleDateString()}
                                        </div>
                                      </TableCell>
                                      <TableCell className="py-4">
                                        <div className="flex items-center gap-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              // Add view/edit functionality if needed
                                            }}
                                            className="hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                                          >
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </div>
                          
                          {sortedWasteEntries.length > 0 && totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                              <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to {Math.min(endIndex, sortedWasteEntries.length)} of {sortedWasteEntries.length} entries
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setCurrentWastePage(prev => Math.max(1, prev - 1))}
                                  disabled={currentWastePage === 1}
                                >
                                  <ArrowLeft className="h-4 w-4 mr-1" />
                                  Previous
                                </Button>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                      key={page}
                                      variant={currentWastePage === page ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setCurrentWastePage(page)}
                                      className={currentWastePage === page ? "bg-red-600 text-white" : ""}
                                    >
                                      {page}
                                    </Button>
                                  ))}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setCurrentWastePage(prev => Math.min(totalPages, prev + 1))}
                                  disabled={currentWastePage === totalPages}
                                >
                                  Next
                                  <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </>
                      )
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Outwards Tab */}
              {activeSubSection === "outwards" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Outwards Management</CardTitle>
                          <CardDescription>Track offline product handouts directly from warehouse to customers</CardDescription>
                        </div>
                        <Button 
                          onClick={() => {
                            setOutwardForm({
                              customerId: "",
                              customerName: "",
                              warehouseName: "Main Warehouse",
                              referenceNumber: "",
                              notes: "",
                              outwardDate: new Date().toISOString().split('T')[0],
                              items: []
                            })
                            setOutwardFormPage(1)
                            setIsOutwardDialogOpen(true)
                          }}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Outward Entry
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const sortedOutwards = [...outwardEntries].sort((a: any, b: any) => {
                          const dateA = new Date(a.outwardDate || a.createdAt).getTime()
                          const dateB = new Date(b.outwardDate || b.createdAt).getTime()
                          return dateB - dateA
                        })
                        
                        const totalPages = Math.ceil(sortedOutwards.length / outwardPerPage)
                        const startIndex = (currentOutwardPage - 1) * outwardPerPage
                        const endIndex = startIndex + outwardPerPage
                        const paginatedOutwards = sortedOutwards.slice(startIndex, endIndex)
                        
                        return (
                          <>
                            <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                              <Table>
                                <TableHeader>
                                  <TableRow className="transition-all duration-200" style={{ backgroundColor: '#1e2961' }}>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Date</TableHead>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Customer</TableHead>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Product</TableHead>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Quantity</TableHead>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Type</TableHead>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Reference</TableHead>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Warehouse</TableHead>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Amount</TableHead>
                                    <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {loading ? (
                                    <TableRow className="bg-white hover:bg-blue-50/30 transition-all duration-200">
                                      <TableCell colSpan={9} className="text-center py-8">
                                        <div className="flex items-center justify-center gap-2">
                                          <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                                          <span className="text-gray-600">Loading...</span>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ) : sortedOutwards.length === 0 ? (
                                    <TableRow className="bg-white hover:bg-blue-50/30 transition-all duration-200">
                                      <TableCell colSpan={9} className="text-center py-12">
                                        <div className="flex flex-col items-center text-muted-foreground">
                                          <ArrowRight className="h-16 w-16 mb-4 opacity-30 text-orange-400" />
                                          <p className="text-lg font-medium">No outward entries found</p>
                                          <p className="text-sm mt-1">Record offline product handouts to track stock movements</p>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    paginatedOutwards.map((outward: any, index: number) => (
                                      <TableRow 
                                        key={outward._id}
                                        className="bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all duration-200 cursor-pointer border-b border-gray-100 group"
                                      >
                                        <TableCell className="py-4">
                                          <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                            <Calendar className="h-4 w-4 text-orange-500" />
                                            {new Date(outward.outwardDate || outward.createdAt).toLocaleDateString()}
                                          </div>
                                        </TableCell>
                                        <TableCell className="font-semibold text-slate-900 group-hover:text-orange-700 transition-colors py-4">
                                          <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-orange-500" />
                                            {outward.customerName}
                                          </div>
                                        </TableCell>
                                        <TableCell className="font-semibold text-slate-900 group-hover:text-orange-700 transition-colors py-4">
                                          <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-orange-500" />
                                            {outward.productName}
                                          </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                            {outward.quantity} units
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                          <Badge 
                                            variant="outline"
                                            className={
                                              outward.outwardType === 'offline_direct'
                                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                                : outward.outwardType === 'sample'
                                                ? 'bg-purple-100 text-purple-800 border-purple-300'
                                                : 'bg-green-100 text-green-800 border-green-300'
                                            }
                                          >
                                            {outward.outwardType === 'offline_direct' ? 'Direct' : outward.outwardType === 'sample' ? 'Sample' : 'Return/Replacement'}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                          <div className="text-sm text-slate-600 group-hover:text-slate-900 max-w-xs truncate transition-colors">
                                            {outward.referenceNumber || '-'}
                                          </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                            {outward.warehouseName}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                          {outward.totalAmount > 0 ? (
                                            <span className="font-semibold text-green-600">₹{outward.totalAmount.toLocaleString()}</span>
                                          ) : (
                                            <span className="text-gray-400">-</span>
                                          )}
                                        </TableCell>
                                        <TableCell className="py-4">
                                          <div className="flex items-center gap-2">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={async (e) => {
                                                e.stopPropagation()
                                                setViewingOutward(outward)
                                                // Fetch related outwards if referenceNumber exists
                                                if (outward.referenceNumber) {
                                                  const related = await fetchRelatedOutwards(
                                                    outward.referenceNumber,
                                                    outward.customerId,
                                                    new Date(outward.outwardDate || outward.createdAt)
                                                  )
                                                  setRelatedOutwards(related)
                                                } else {
                                                  setRelatedOutwards([])
                                                }
                                                setViewOutwardDialogPage(1)
                                                setIsViewOutwardDialogOpen(true)
                                              }}
                                              className="hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                                            >
                                              <Eye className="h-4 w-4" />
                                            </Button>
                                            {outward.outwardType === 'sample' && !outward.convertedToSale && (
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  setConvertingOutward(outward)
                                                  setConvertForm({
                                                    unitPrice: "",
                                                    notes: ""
                                                  })
                                                  setIsConvertSampleDialogOpen(true)
                                                }}
                                                className="hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                                                title="Convert sample to sale"
                                              >
                                                <ShoppingCart className="h-4 w-4" />
                                              </Button>
                                            )}
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteOutward(outward._id)
                                              }}
                                              className="hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                                              title="Delete outward entry"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                            
                            {sortedOutwards.length > 0 && totalPages > 1 && (
                              <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-600">
                                  Showing {startIndex + 1} to {Math.min(endIndex, sortedOutwards.length)} of {sortedOutwards.length} entries
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentOutwardPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentOutwardPage === 1}
                                  >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Previous
                                  </Button>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                      <Button
                                        key={page}
                                        variant={currentOutwardPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentOutwardPage(page)}
                                        className={currentOutwardPage === page ? "bg-orange-600 text-white" : ""}
                                      >
                                        {page}
                                      </Button>
                                    ))}
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentOutwardPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentOutwardPage === totalPages}
                                  >
                                    Next
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Orders Section */}
          {activeSection === "orders" && (
            <div className="space-y-6 -mt-8">
              {/* All Orders Tab */}
              {activeSubSection === "all-orders" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <CardTitle className="text-3xl font-bold tracking-tight mb-1">Orders Management</CardTitle>
                      <p className="text-muted-foreground text-sm">View and manage all customer orders</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={refreshOrdersData}
                        disabled={refreshing}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search orders..."
                          value={orderSearchTerm}
                          onChange={(e) => setOrderSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-visible">
                  <Table>
                    <TableHeader>
                      <TableRow className="transition-all duration-200" style={{ backgroundColor: '#1e2961' }}>
                        <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Order No</TableHead>
                        <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Customer Name</TableHead>
                        <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Address</TableHead>
                        <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Total Price</TableHead>
                        <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Date & Time</TableHead>
                        <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Status</TableHead>
                        <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            Loading orders...
                          </TableCell>
                        </TableRow>
                      ) : orders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="text-muted-foreground">
                              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>No orders found</p>
                              <p className="text-sm">Orders will appear here once customers place them</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (() => {
                        const filteredOrders = orders.filter((order: any) => {
                          const searchTerm = orderSearchTerm.toLowerCase()
                          const customerName = (order.customerName || 
                                               order.shippingAddress?.receiverName || 
                                               order.userEmail?.split('@')[0] || 
                                               '').toLowerCase()
                          return (
                            (order.orderNo || '').toLowerCase().includes(searchTerm) ||
                            customerName.includes(searchTerm) ||
                            (order.userEmail || '').toLowerCase().includes(searchTerm) ||
                            (order.customerPhone || order.phone || '').includes(searchTerm)
                          )
                        })
                        
                        const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
                        const startIndex = (currentOrderPage - 1) * ordersPerPage
                        const endIndex = startIndex + ordersPerPage
                        const currentOrders = filteredOrders.slice(startIndex, endIndex)
                        
                        return (
                          <>
                            {currentOrders.map((order: any, index: number) => (
                            <TableRow 
                              key={order._id}
                              className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer border-b border-gray-100 group"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <TableCell className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors py-4">
                                <div className="flex items-center gap-2">
                                  <ShoppingCart className="h-4 w-4 text-blue-500" />
                                  #{order.orderNo}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center gap-2 font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                                  <User className="h-4 w-4 text-indigo-500" />
                                  {order.customerName || 
                                   order.shippingAddress?.receiverName || 
                                   order.userEmail?.split('@')[0] || 
                                   'Unknown Customer'}
                                </div>
                                <div className="text-sm text-slate-600 mt-1">
                                  {order.customerPhone || order.phone || order.userEmail || ''}
                                </div>
                              </TableCell>
                              <TableCell className="text-slate-600 group-hover:text-slate-800 transition-colors py-4">
                                <div className="flex items-center gap-2 text-sm min-w-[200px] max-w-md">
                                  <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                  <span className="break-words">
                                  {order.shippingAddress?.street || order.shippingAddress?.city 
                                    ? `${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}`
                                    : '-'
                                  }
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="font-semibold text-slate-900 group-hover:text-green-700 transition-colors py-4">
                                <div>
                                  ₹{order.totalAmount.toLocaleString()}
                                </div>
                              </TableCell>
                              <TableCell className="text-slate-700 group-hover:text-slate-900 transition-colors py-4">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-4 w-4 text-indigo-500" />
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {new Date(order.createdAt).toLocaleTimeString()}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center space-x-2">
                                  <Badge 
                                    variant={order.status === "Confirmed" ? "default" : "secondary"}
                                    className={order.status === "Confirmed" ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 transition-colors" : ""}
                                  >
                                    {order.status === "Confirmed" && <CheckCircle className="h-3 w-3 mr-1" />}
                                  {order.status}
                                </Badge>
                                  <Select
                                    value={order.status}
                                    onValueChange={(value) => updateOrderStatus(order._id, value)}
                                  >
                                    <SelectTrigger className="w-auto h-auto p-0 border-0 bg-transparent hover:bg-transparent shadow-none [&>span]:hidden [&>svg:not(.custom-chevron)]:hidden focus:ring-0 focus:ring-offset-0">
                                      <ChevronDown className="h-4 w-4 text-gray-600 cursor-pointer hover:text-gray-800 custom-chevron" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Order Placed">Order Placed</SelectItem>
                                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                                      <SelectItem value="Processing">Processing</SelectItem>
                                      <SelectItem value="Shipped">Shipped</SelectItem>
                                      <SelectItem value="Delivered">Delivered</SelectItem>
                                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                    <Button 
                                    variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                              handleViewOrder(order)
                                    }}
                                    title="View order details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                              handleGenerateInvoice(order)
                                    }}
                                    title="Generate Invoice"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                              handleEditOrder(order)
                                    }}
                                    title="Edit order"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                              deleteOrder(order._id)
                                            }}
                                    title="Delete order"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                          >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                        </div>
                              </TableCell>
                            </TableRow>
                            ))}
                            {filteredOrders.length > ordersPerPage && (
                              <TableRow>
                                <TableCell colSpan={7} className="py-4">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                      Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
                                      </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentOrderPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentOrderPage === 1}
                                      >
                                        Previous
                                      </Button>
                                      <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                          <Button
                                            key={page}
                                            variant={currentOrderPage === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentOrderPage(page)}
                                            className="min-w-[40px]"
                                          >
                                            {page}
                                          </Button>
                                        ))}
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentOrderPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentOrderPage === totalPages}
                                      >
                                        Next
                                      </Button>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                      )}
                          </>
                        )
                      })()}
                    </TableBody>
                  </Table>
                  </div>
                </CardContent>
              </Card>
              )}

              {/* View Complete Order Dialog - Shared between tabs */}
              <Dialog open={isViewOrderDialogOpen} onOpenChange={setIsViewOrderDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Order Details - #{viewingOrder?.orderNo}</DialogTitle>
                  </DialogHeader>
                  {viewingOrder && (
                    <div className="space-y-6">
                      {/* Customer Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Customer Name</Label>
                          <p className="text-sm font-medium mt-1">{viewingOrder.customerName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Order Date</Label>
                          <p className="text-sm mt-1">{new Date(viewingOrder.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                          <p className="text-sm mt-1">{viewingOrder.customerEmail}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                          <p className="text-sm mt-1">{viewingOrder.customerPhone}</p>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Shipping Address</Label>
                        <p className="text-sm mt-1">
                          {viewingOrder.shippingAddress?.street && `${viewingOrder.shippingAddress.street}, `}
                          {viewingOrder.shippingAddress?.city && `${viewingOrder.shippingAddress.city}, `}
                          {viewingOrder.shippingAddress?.state && `${viewingOrder.shippingAddress.state} - `}
                          {viewingOrder.shippingAddress?.zipCode && `${viewingOrder.shippingAddress.zipCode}, `}
                          {viewingOrder.shippingAddress?.country || 'India'}
                        </p>
                      </div>

                      {/* Order Items */}
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground mb-3 block">Order Items</Label>
                        <Table>
                          <TableHeader>
                            <TableRow className="transition-all duration-200" style={{ backgroundColor: '#1e2961' }}>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Product Name</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Quantity</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Price</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {viewingOrder.items?.map((item: any, index: number) => {
                              const itemTotal = item.total || (item.price || 0) * (item.quantity || 0)
                              return (
                              <TableRow 
                                key={index}
                                className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b border-gray-100"
                              >
                                <TableCell className="font-semibold text-slate-900 py-4">
                                  <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-blue-500" />
                                    {item.productName}
                                  </div>
                                </TableCell>
                                <TableCell className="py-4">{item.quantity}</TableCell>
                                  <TableCell className="text-slate-700 py-4">₹{(item.price || 0).toLocaleString()}</TableCell>
                                  <TableCell className="font-semibold text-slate-900 py-4">₹{itemTotal.toLocaleString()}</TableCell>
                              </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Order Summary */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-sm font-medium">Total Amount</Label>
                          <p className="text-lg font-bold">₹{viewingOrder.totalAmount.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium">Order Status</Label>
                          <Badge variant={viewingOrder.status === "Confirmed" ? "default" : "secondary"}>
                            {viewingOrder.status}
                          </Badge>
                        </div>
                      </div>

                      {viewingOrder.notes && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
                          <p className="text-sm mt-1">{viewingOrder.notes}</p>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button onClick={() => setIsViewOrderDialogOpen(false)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Edit Order Dialog */}
              <Dialog open={isEditOrderDialogOpen} onOpenChange={setIsEditOrderDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Order - #{editingOrder?.orderNo}</DialogTitle>
                  </DialogHeader>
                  {editingOrder && (
                    <form onSubmit={handleOrderEditSubmit} className="space-y-6">
                      {/* Customer Information */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customerName">Customer Name</Label>
                          <Input
                            id="customerName"
                            value={orderEditForm.customerName}
                            onChange={(e) => setOrderEditForm({...orderEditForm, customerName: e.target.value})}
                            placeholder="Enter customer name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="customerPhone">Customer Phone</Label>
                          <Input
                            id="customerPhone"
                            value={orderEditForm.customerPhone}
                            onChange={(e) => setOrderEditForm({...orderEditForm, customerPhone: e.target.value})}
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Shipping Address</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="street">Street Address</Label>
                            <Input
                              id="street"
                              value={orderEditForm.shippingAddress.street}
                              onChange={(e) => setOrderEditForm({
                                ...orderEditForm, 
                                shippingAddress: {...orderEditForm.shippingAddress, street: e.target.value}
                              })}
                              placeholder="Enter street address"
                            />
                          </div>
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={orderEditForm.shippingAddress.city}
                              onChange={(e) => setOrderEditForm({
                                ...orderEditForm, 
                                shippingAddress: {...orderEditForm.shippingAddress, city: e.target.value}
                              })}
                              placeholder="Enter city"
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={orderEditForm.shippingAddress.state}
                              onChange={(e) => setOrderEditForm({
                                ...orderEditForm, 
                                shippingAddress: {...orderEditForm.shippingAddress, state: e.target.value}
                              })}
                              placeholder="Enter state"
                            />
                          </div>
                          <div>
                            <Label htmlFor="zipCode">Zip Code</Label>
                            <Input
                              id="zipCode"
                              value={orderEditForm.shippingAddress.zipCode}
                              onChange={(e) => setOrderEditForm({
                                ...orderEditForm, 
                                shippingAddress: {...orderEditForm.shippingAddress, zipCode: e.target.value}
                              })}
                              placeholder="Enter zip code"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="totalAmount">Total Amount</Label>
                          <Input
                            id="totalAmount"
                            type="number"
                            value={orderEditForm.totalAmount}
                            onChange={(e) => setOrderEditForm({...orderEditForm, totalAmount: parseFloat(e.target.value) || 0})}
                            placeholder="Enter total amount"
                          />
                        </div>
                        <div>
                          <Label htmlFor="status">Order Status</Label>
                          <Select
                            value={orderEditForm.status}
                            onValueChange={(value) => setOrderEditForm({...orderEditForm, status: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Order Placed">Order Placed</SelectItem>
                              <SelectItem value="Confirmed">Confirmed</SelectItem>
                              <SelectItem value="Processing">Processing</SelectItem>
                              <SelectItem value="Shipped">Shipped</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Order Items</Label>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product Name</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orderEditForm.items?.map((item: any, index: number) => {
                              const itemTotal = item.total || (item.price || 0) * (item.quantity || 0)
                              return (
                              <TableRow key={index}>
                                <TableCell>
                                  <div className="font-medium">{item.productName}</div>
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                  <TableCell>₹{(item.price || 0).toLocaleString()}</TableCell>
                                  <TableCell>₹{itemTotal.toLocaleString()}</TableCell>
                              </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsEditOrderDialogOpen(false)
                            setEditingOrder(null)
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          Update Order
                        </Button>
                      </div>
                    </form>
                  )}
                </DialogContent>
              </Dialog>

              {/* Received Quotations Tab */}
              {activeSubSection === "received-quotations" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Received Quotations</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={refreshQuotationsData}
                          disabled={refreshing}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder="Search quotations..."
                            value={quotationSearchTerm}
                            onChange={(e) => setQuotationSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-visible">
                    <Table>
                      <TableHeader>
                        <TableRow className="transition-all duration-200" style={{ backgroundColor: '#1e2961' }}>
                          <TableHead className="font-bold py-4 text-center" style={{ color: '#ffffff' }}>User Name</TableHead>
                          <TableHead className="font-bold py-4 text-center" style={{ color: '#ffffff' }}>Company</TableHead>
                          <TableHead className="font-bold py-4 text-center" style={{ color: '#ffffff' }}>Phone</TableHead>
                          <TableHead className="font-bold py-4 text-center" style={{ color: '#ffffff' }}>Items</TableHead>
                          <TableHead className="font-bold py-4 text-center" style={{ color: '#ffffff' }}>Date</TableHead>
                          <TableHead className="font-bold py-4 text-center" style={{ color: '#ffffff' }}>Status</TableHead>
                          <TableHead className="font-bold py-4 text-center" style={{ color: '#ffffff' }}>User Response</TableHead>
                          <TableHead className="font-bold py-4 text-center" style={{ color: '#ffffff' }}>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8">
                              Loading quotations...
                            </TableCell>
                          </TableRow>
                        ) : quotations.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8">
                              <div className="text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No quotations found</p>
                                <p className="text-sm">Quotation requests from customers will appear here</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (() => {
                          const filteredQuotations = quotations.filter((quotation: any) => 
                              (quotation.userName?.toLowerCase() || '').includes(quotationSearchTerm.toLowerCase()) ||
                              (quotation.userEmail?.toLowerCase() || '').includes(quotationSearchTerm.toLowerCase())
                            )
                          
                          const totalPages = Math.ceil(filteredQuotations.length / quotationsPerPage)
                          const startIndex = (currentQuotationPage - 1) * quotationsPerPage
                          const endIndex = startIndex + quotationsPerPage
                          const currentQuotations = filteredQuotations.slice(startIndex, endIndex)
                          
                          return (
                            <>
                              {currentQuotations.map((quotation: any, index: number) => (
                              <TableRow 
                                key={quotation._id}
                                className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer border-b border-gray-100 group"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <TableCell className="py-4 text-center">
                                  <div className="flex items-center justify-center gap-2 font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                                    <User className="h-4 w-4 text-indigo-500" />
                                    {quotation.userName || 'Guest'}
                                  </div>
                                  <div className="text-sm text-slate-600 mt-1">{quotation.userEmail}</div>
                                </TableCell>
                                <TableCell className="text-slate-700 group-hover:text-slate-900 transition-colors py-4 text-center">
                                  <div className="flex items-center justify-center gap-2 text-sm">
                                    <Building className="h-4 w-4 text-blue-500" />
                                    {quotation.company || '-'}
                                  </div>
                                </TableCell>
                                <TableCell className="text-slate-700 group-hover:text-slate-900 transition-colors py-4 text-center">
                                  <div className="flex items-center justify-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-green-500" />
                                    {quotation.userPhone || '-'}
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                  <div className="flex items-center justify-center gap-2 text-sm">
                                    <Package className="h-4 w-4 text-blue-500" />
                                    {quotation.items?.length || 0} items
                                  </div>
                                </TableCell>
                                <TableCell className="text-slate-700 group-hover:text-slate-900 transition-colors py-4 text-center">
                                  <div className="flex items-center justify-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-indigo-500" />
                                    {new Date(quotation.quotationDate).toLocaleDateString()}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {new Date(quotation.quotationDate).toLocaleTimeString()}
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                  <div className="flex items-center justify-center space-x-2">
                                    <Badge 
                                      variant={quotation.status === "pending" ? "secondary" : "default"}
                                      className={quotation.status !== "pending" ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 transition-colors" : ""}
                                    >
                                      {quotation.status !== "pending" && <CheckCircle className="h-3 w-3 mr-1" />}
                                      {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                                    </Badge>
                                    <Select
                                      value={quotation.status}
                                      onValueChange={(value) => updateQuotationStatus(quotation._id, value)}
                                    >
                                      <SelectTrigger className="w-auto h-auto p-0 border-0 bg-transparent hover:bg-transparent shadow-none [&>span]:hidden [&>svg:not(.custom-chevron)]:hidden focus:ring-0 focus:ring-offset-0">
                                        <ChevronDown className="h-4 w-4 text-gray-600 cursor-pointer hover:text-gray-800 custom-chevron" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="reviewing">Reviewing</SelectItem>
                                        <SelectItem value="quoted">Quoted</SelectItem>
                                        <SelectItem value="accepted">Accepted</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                        <SelectItem value="sent re-quote">Sent Re-Quote</SelectItem>
                                        <SelectItem value="requested re-quote">Requested Re-Quote</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  {quotation.userResponse ? (
                                    <div className="flex items-center justify-center space-x-2">
                                      {quotation.userResponse === 're-quote' ? (
                                        <Badge
                                          variant="outline"
                                          className="cursor-pointer hover:bg-blue-50 text-blue-600 border-blue-600"
                                          onClick={() => {
                                            setViewingQuotation(quotation)
                                            setIsRequoteMessageDialogOpen(true)
                                          }}
                                        >
                                          Re-Quote
                                        </Badge>
                                      ) : (
                                        <Badge
                                          variant={quotation.userResponse === 'accepted' ? 'default' : 'destructive'}
                                        >
                                          {quotation.userResponse === 'accepted' ? 'Accepted' : 'Rejected'}
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex items-center justify-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleViewQuotation(quotation)}
                                      title="View quotation details"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => router.push(`/dashboard/quotation?id=${quotation._id}`)}
                                      title="View Quotation"
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRequote(quotation)}
                                      title="Requote"
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteQuotation(quotation._id)}
                                      title="Delete quotation"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                              ))}
                              {filteredQuotations.length > quotationsPerPage && (
                                <TableRow>
                                  <TableCell colSpan={8} className="py-4">
                                    <div className="flex items-center justify-between">
                                      <div className="text-sm text-muted-foreground">
                                        Showing {startIndex + 1}-{Math.min(endIndex, filteredQuotations.length)} of {filteredQuotations.length} quotations
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setCurrentQuotationPage(prev => Math.max(1, prev - 1))}
                                          disabled={currentQuotationPage === 1}
                                        >
                                          Previous
                                        </Button>
                                        <div className="flex items-center gap-1">
                                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button
                                              key={page}
                                              variant={currentQuotationPage === page ? "default" : "outline"}
                                              size="sm"
                                              onClick={() => setCurrentQuotationPage(page)}
                                              className="min-w-[40px]"
                                            >
                                              {page}
                                            </Button>
                                          ))}
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setCurrentQuotationPage(prev => Math.min(totalPages, prev + 1))}
                                          disabled={currentQuotationPage === totalPages}
                                        >
                                          Next
                                        </Button>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          )
                        })()}
                      </TableBody>
                    </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* View Complete Quotation Dialog */}
              <Dialog open={isViewQuotationDialogOpen} onOpenChange={setIsViewQuotationDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Quotation Details</DialogTitle>
                  </DialogHeader>
                  {viewingQuotation && (
                    <div className="space-y-6">
                      {/* Customer Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Customer Name</Label>
                          <p className="text-sm font-medium mt-1">{viewingQuotation.userName || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Quotation Date</Label>
                          <p className="text-sm mt-1">{new Date(viewingQuotation.quotationDate).toLocaleString()}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                          <p className="text-sm mt-1">{viewingQuotation.userEmail}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                          <p className="text-sm mt-1">{viewingQuotation.userPhone || 'N/A'}</p>
                        </div>
                        {viewingQuotation.company && (
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Company Name</Label>
                            <p className="text-sm mt-1">{viewingQuotation.company}</p>
                          </div>
                        )}
                        {viewingQuotation.gstNumber && (
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">GST Number</Label>
                            <p className="text-sm mt-1">{viewingQuotation.gstNumber}</p>
                          </div>
                        )}
                      </div>

                      {/* Customer Address */}
                      {viewingQuotation.userAddress && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                          <p className="text-sm mt-1">
                            {viewingQuotation.userAddress?.street && `${viewingQuotation.userAddress.street}, `}
                            {viewingQuotation.userAddress?.city && `${viewingQuotation.userAddress.city}, `}
                            {viewingQuotation.userAddress?.state && `${viewingQuotation.userAddress.state} - `}
                            {viewingQuotation.userAddress?.zipCode && `${viewingQuotation.userAddress.zipCode}, `}
                            {viewingQuotation.userAddress?.country || 'India'}
                          </p>
                        </div>
                      )}

                      {/* Quotation Items */}
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground mb-3 block">Requested Items</Label>
                        <Table>
                          <TableHeader>
                            <TableRow className="transition-all duration-200" style={{ backgroundColor: '#1e2961' }}>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Item Name</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Quantity</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Price</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Subtotal</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {viewingQuotation.items?.map((item: any, index: number) => (
                              <TableRow 
                                key={index}
                                className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b border-gray-100"
                              >
                                <TableCell className="font-semibold text-slate-900 py-4">
                                  <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-blue-500" />
                                    {item.itemName}
                                  </div>
                                </TableCell>
                                <TableCell className="py-4">{item.quantity}</TableCell>
                                <TableCell className="text-slate-700 py-4">₹{item.price?.toLocaleString() || '0'}</TableCell>
                                <TableCell className="font-semibold text-slate-900 py-4">₹{((item.price || 0) * (item.quantity || 0)).toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Description/Notes */}
                      {viewingQuotation.description && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Special Requirements/Notes</Label>
                          <p className="text-sm mt-1 p-3 bg-muted rounded-md">{viewingQuotation.description}</p>
                        </div>
                      )}

                      {/* Quotation Summary */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-sm font-medium">Total Amount</Label>
                          <p className="text-lg font-bold">
                            ₹{viewingQuotation.totalAmount?.toLocaleString() || '0'}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium">Status</Label>
                          <Badge variant={viewingQuotation.status === "pending" ? "secondary" : "default"}>
                            {viewingQuotation.status.charAt(0).toUpperCase() + viewingQuotation.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={() => setIsViewQuotationDialogOpen(false)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Re-Quote Message Dialog */}
              <Dialog open={isRequoteMessageDialogOpen} onOpenChange={setIsRequoteMessageDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Re-Quote Request Message</DialogTitle>
                    <DialogDescription>
                      Message from customer requesting changes to the quotation
                    </DialogDescription>
                  </DialogHeader>
                  {viewingQuotation && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Customer Message</Label>
                        <div className="mt-2 p-4 bg-muted rounded-md">
                          <p className="text-sm whitespace-pre-wrap">
                            {viewingQuotation.requoteMessage || 'No message provided'}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={() => setIsRequoteMessageDialogOpen(false)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Edit Quotation Dialog */}
              <Dialog open={isEditQuotationDialogOpen} onOpenChange={setIsEditQuotationDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Quotation</DialogTitle>
                  </DialogHeader>
                  {editingQuotation && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">User Name</Label>
                          <Input
                            value={editingQuotation.userName || ''}
                            onChange={(e) => setEditingQuotation({ ...editingQuotation, userName: e.target.value })}
                            placeholder="User name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                          <Input
                            value={editingQuotation.userEmail}
                            disabled
                            className="mt-1 bg-gray-100"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                          <Input
                            value={editingQuotation.userPhone || ''}
                            onChange={(e) => setEditingQuotation({ ...editingQuotation, userPhone: e.target.value })}
                            placeholder="Phone number"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                          <Input
                            value={editingQuotation.company || ''}
                            onChange={(e) => setEditingQuotation({ ...editingQuotation, company: e.target.value })}
                            placeholder="Company name"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">GST Number</Label>
                        <Input
                          value={editingQuotation.gstNumber || ''}
                          onChange={(e) => setEditingQuotation({ ...editingQuotation, gstNumber: e.target.value })}
                          placeholder="GST number"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Total Amount</Label>
                        <Input
                          type="number"
                          value={editingQuotation.totalAmount || ''}
                          onChange={(e) => setEditingQuotation({ ...editingQuotation, totalAmount: parseFloat(e.target.value) })}
                          placeholder="Total amount"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Description/Notes</Label>
                        <Textarea
                          value={editingQuotation.description || ''}
                          onChange={(e) => setEditingQuotation({ ...editingQuotation, description: e.target.value })}
                          placeholder="Special requirements or notes"
                          rows={4}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                        <Select
                          value={editingQuotation.status || 'pending'}
                          onValueChange={(value) => setEditingQuotation({ ...editingQuotation, status: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="reviewing">Reviewing</SelectItem>
                            <SelectItem value="quoted">Quoted</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-end space-x-3 pt-6">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditQuotationDialogOpen(false)
                            setEditingQuotation(null)
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={saveQuotationChanges}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* View Product Details Dialog - Viewport Centered Modal */}
              {isViewProductDetailsDialogOpen && viewingProductDetails && (() => {
                const modalContent = (
                  <div 
                    ref={viewProductModalRef}
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
                    onClick={() => setIsViewProductDetailsDialogOpen(false)}
                  >
                    {/* MODAL CARD */}
                    <div 
                      className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                      style={{
                        position: 'relative',
                        zIndex: 10000
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* HEADER */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6 rounded-t-2xl relative">
                        <button
                          onClick={() => setIsViewProductDetailsDialogOpen(false)}
                          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-200 transition-colors p-1"
                        >
                          <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <div className="pr-8 sm:pr-0">
                          <div className="flex items-center justify-between">
                            <h2 className="text-xl sm:text-2xl font-bold">
                              {isEditMode ? 'Edit Product Details' : 'View All Product'} - {viewingProductDetails?.productName}
                            </h2>
                            <div className="flex space-x-2">
                              {!isEditMode && (
                                <Button onClick={handleEditModeToggle} variant="outline" size="sm" className="bg-white/20 hover:bg-white/30 border-white text-white">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                              )}
                              {isEditMode && (
                                <>
                                  <Button onClick={handleSaveChanges} size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Save
                                  </Button>
                                  <Button onClick={handleCancelEdit} variant="outline" size="sm" className="bg-white/20 hover:bg-white/30 border-white text-white">
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CONTENT AREA */}
                      <div className="p-4 sm:p-6">
                        <div className="space-y-6">
                      {/* Product Information */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Customer Name</Label>
                          <p className="text-sm font-medium mt-1">{viewingProductDetails.customerName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Product Name</Label>
                          <p className="text-sm font-medium mt-1">{viewingProductDetails.productName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Current Stock</Label>
                          <p className="text-sm font-medium mt-1">{viewingProductDetails.quantity} units</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                          <p className="text-sm mt-1">{new Date(viewingProductDetails.lastUpdated).toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Product Details Table */}
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground mb-3 block">Product Details</Label>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product Name</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Discount</TableHead>
                              <TableHead>Qty</TableHead>
                              <TableHead>Remove</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {viewingProductDetails.allProducts?.map((product: any, index: number) => (
                              <TableRow key={product._id}>
                                <TableCell>
                                  <div className="font-medium">{product.productName}</div>
                                </TableCell>
                                <TableCell>
                                  {isEditMode ? (
                                    <Input
                                      type="number"
                                      value={product.price}
                                      onChange={(e) => {
                                        const updatedProducts = [...viewingProductDetails.allProducts]
                                        updatedProducts[index].price = parseFloat(e.target.value) || 0
                                        setViewingProductDetails({
                                          ...viewingProductDetails,
                                          allProducts: updatedProducts
                                        })
                                      }}
                                      className="w-24"
                                      min="0"
                                      step="0.01"
                                    />
                                  ) : (
                                    <div className="font-medium">₹{product.price?.toLocaleString() || 0}</div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium text-green-600">
                                    ₹{((product.price || 0) * 0.33).toFixed(1)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Input 
                                    value={product.quantity}
                                    onChange={isEditMode ? (e) => {
                                      const updatedProducts = [...viewingProductDetails.allProducts]
                                      updatedProducts[index].quantity = parseInt(e.target.value) || 1
                                      setViewingProductDetails({
                                        ...viewingProductDetails,
                                        allProducts: updatedProducts
                                      })
                                    } : undefined}
                                    className="w-20 text-center border-blue-300"
                                    readOnly={!isEditMode}
                                    type="number"
                                    min="0"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400"
                                    onClick={() => handleDeleteInventoryItem(product)}
                                  >
                                    Remove
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Summary Section */}
                      <div className="border-t pt-4">
                        {(() => {
                          const allProducts = viewingProductDetails.allProducts || []
                          const subTotalPrice = allProducts.reduce((sum: number, p: any) => sum + (p.price * p.quantity), 0)
                          const subTotalDiscount = allProducts.reduce((sum: number, p: any) => sum + (p.price * p.quantity * 0.33), 0)
                          const taxAmount = allProducts.reduce((sum: number, p: any) => sum + (p.price * p.quantity * 0.25), 0)
                          const grandTotalPrice = subTotalPrice - subTotalDiscount + taxAmount
                          const grandTotalDiscount = subTotalDiscount
                          const totalQuantity = allProducts.reduce((sum: number, p: any) => sum + p.quantity, 0)
                          
                          return (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Sub Total:</span>
                                <div className="flex space-x-8">
                                  <span className="text-sm font-medium">₹{subTotalPrice.toLocaleString()}</span>
                                  <span className="text-sm font-medium text-green-600">₹{subTotalDiscount.toFixed(1)}</span>
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
                      </div>

                      {/* Notes Section */}
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
                        {isEditMode ? (
                          <Textarea
                            value={editForm.notes}
                            onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                            placeholder="Add notes about this inventory..."
                            className="mt-1"
                            rows={3}
                          />
                        ) : (
                          <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                            {viewingProductDetails.notes || "No notes available"}
                          </p>
                        )}
                      </div>

                          <div className="flex justify-between pt-4 border-t">
                            <Button 
                              onClick={() => handleDeleteInventoryItem(viewingProductDetails)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Item
                            </Button>
                            <Button onClick={() => setIsViewProductDetailsDialogOpen(false)}>
                              Close
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )

                if (typeof window !== 'undefined' && document.body) {
                  return createPortal(modalContent, document.body)
                }
                return null
              })()}

              {/* Re-top Up Dialog - Separate Component */}
              <RetopUpModal
                isOpen={isEshopDialogOpen && !!editingCustomerId}
                onClose={() => {
                  setIsEshopDialogOpen(false)
                  setIsRetopUpMode(false)
                  setCustomerProducts([])
                  setEditingCustomerId(null)
                }}
                customer={editingCustomer}
                products={products}
                customerProducts={customerProducts}
                setCustomerProducts={setCustomerProducts}
                isRetopUpMode={isRetopUpMode}
                eshopInventory={eshopInventory}
                onUpdate={handleUpdateCustomerProducts}
              />
            </div>
          )}

          {/* Enquiries Tab */}
          {activeSubSection === "enquiries" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Enquiries</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={refreshEnquiriesData}
                      disabled={refreshing}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search enquiries..."
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-visible">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Email</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Item Type</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading enquiries...
                        </TableCell>
                      </TableRow>
                    ) : enquiries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-muted-foreground">
                            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No enquiries found</p>
                            <p className="text-sm">Customer enquiries will appear here</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      enquiries.map((enquiry: any) => (
                        <TableRow key={enquiry._id}>
                          <TableCell>
                            <div className="text-sm">{enquiry.userEmail}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{enquiry.itemName}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {enquiry.itemType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm max-w-xs truncate overflow-hidden" title={enquiry.message}>
                              {enquiry.message.split(' ').slice(0, 3).join(' ')}
                              {enquiry.message.split(' ').length > 3 && '...'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(enquiry.enquiryDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge variant={enquiry.status === 'responded' ? 'default' : 'secondary'}>
                                {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                              </Badge>
                              <Select
                                value={enquiry.status}
                                onValueChange={(value) => updateEnquiryStatus(enquiry._id, value)}
                              >
                                <SelectTrigger className="w-32 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="responded">Responded</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewEnquiry(enquiry)}
                                title="View enquiry details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSendQuotation(enquiry)}
                                title="Send Quotation"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditEnquiry(enquiry)}
                                title="Edit enquiry"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteEnquiry(enquiry._id)}
                                title="Delete enquiry"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* View Enquiry Dialog */}
          <Dialog open={isViewEnquiryDialogOpen} onOpenChange={setIsViewEnquiryDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Enquiry Details</DialogTitle>
              </DialogHeader>
              {viewingEnquiry && (
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">User Email</Label>
                      <p className="text-sm font-medium mt-1">{viewingEnquiry.userEmail}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                      <p className="text-sm mt-1">{viewingEnquiry.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Enquiry Date</Label>
                      <p className="text-sm mt-1">{new Date(viewingEnquiry.enquiryDate).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <Badge variant={viewingEnquiry.status === 'responded' ? 'default' : 'secondary'} className="mt-1">
                        {viewingEnquiry.status.charAt(0).toUpperCase() + viewingEnquiry.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Item Name</Label>
                      <p className="text-sm font-medium mt-1">{viewingEnquiry.itemName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Item Type</Label>
                      <Badge variant="outline" className="mt-1 capitalize">
                        {viewingEnquiry.itemType}
                      </Badge>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Message</Label>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{viewingEnquiry.message}</p>
                  </div>

                  {/* Preferred Contact Method */}
                  {viewingEnquiry.preferredContactMethod && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Preferred Contact Method</Label>
                      <p className="text-sm mt-1 capitalize">{viewingEnquiry.preferredContactMethod}</p>
                    </div>
                  )}

                  {/* Response Notes */}
                  {viewingEnquiry.responseNotes && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Response Notes</Label>
                      <p className="text-sm mt-1 whitespace-pre-wrap">{viewingEnquiry.responseNotes}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button 
                      onClick={() => handleSendQuotation(viewingEnquiry)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Send Quotation
                    </Button>
                    <Button onClick={() => setIsViewEnquiryDialogOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Enquiry Dialog */}
          <Dialog open={isEditEnquiryDialogOpen} onOpenChange={setIsEditEnquiryDialogOpen}>
            <DialogContent 
              className="max-w-6xl max-h-[90vh] overflow-y-auto edit-enquiry-modal"
              style={{ width: '90vw', maxWidth: '1200px' }}
            >
              <DialogHeader>
                <DialogTitle>Edit Enquiry</DialogTitle>
              </DialogHeader>
              {editingEnquiry && (
                <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>User Email</Label>
                      <Input
                        value={editingEnquiry.userEmail}
                        onChange={(e) => setEditingEnquiry({ ...editingEnquiry, userEmail: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={editingEnquiry.phone || ''}
                        onChange={(e) => setEditingEnquiry({ ...editingEnquiry, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Item Name</Label>
                      <Input
                        value={editingEnquiry.itemName}
                        onChange={(e) => setEditingEnquiry({ ...editingEnquiry, itemName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Item Type</Label>
                      <Select
                        value={editingEnquiry.itemType}
                        onValueChange={(value) => setEditingEnquiry({ ...editingEnquiry, itemType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Message</Label>
                    <Textarea
                      value={editingEnquiry.message}
                      onChange={(e) => setEditingEnquiry({ ...editingEnquiry, message: e.target.value })}
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  <div>
                    <Label>Status</Label>
                    <Select
                      value={editingEnquiry.status}
                      onValueChange={(value) => setEditingEnquiry({ ...editingEnquiry, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Response Notes</Label>
                    <Textarea
                      value={editingEnquiry.responseNotes || ''}
                      onChange={(e) => setEditingEnquiry({ ...editingEnquiry, responseNotes: e.target.value })}
                      rows={2}
                      placeholder="Add your response notes here..."
                      className="resize-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditEnquiryDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                      onClick={async () => {
                        const result = await updateEnquiryStatus(editingEnquiry._id, editingEnquiry.status)
                        if (result.success) {
                          // Update the full enquiry data
                          const response = await fetch(`/api/enquiries/${editingEnquiry._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(editingEnquiry)
                          })
                          if (response.ok) {
                            const data = await response.json()
                            if (data.success) {
                              setEnquiries(enquiries.map((e: any) => 
                                e._id === editingEnquiry._id ? data.data : e
                              ))
                            }
                          }
                          setIsEditEnquiryDialogOpen(false)
                        }
                      }}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Re-top Up Dialog - Modern Full-Page Overlay */}
          {isRetopUpDialogOpen && (
            <>
              {/* Translucent Black Overlay - Full Document Height */}
              <div 
                data-overlay="retopup-view"
                className="fixed bg-black/60 backdrop-blur-sm z-[9998]"
                style={{ 
                  top: 0,
                  left: 0,
                  right: 0,
                  width: '100%',
                  position: 'fixed',
                  minHeight: '100vh'
                }}
                onClick={() => {
                  setIsRetopUpDialogOpen(false)
                  setRetopUpNotes("")
                  setRetopUpPage(1)
                }}
              />
              
              {/* Content Container - Modern Centered */}
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                {/* Content Card - Modern Design */}
                <div className="relative z-10 w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-200 pointer-events-auto max-h-[95vh] overflow-hidden flex flex-col">
                  {/* Modern Header with Gradient */}
                  <div className="sticky top-0 z-20 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 flex items-center justify-between shadow-lg">
                    <div className="text-white">
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Re-top Up Stock - {retopUpCustomerName}
                      </h2>
                      <p className="text-xs text-purple-100 mt-0.5">
                        Add additional stock quantities to existing customer products. Enter the quantity to add for each product.
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsRetopUpDialogOpen(false)
                        setRetopUpNotes("")
                        setRetopUpPage(1)
                      }}
                      className="h-8 w-8 p-0 hover:bg-white/20 text-white hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Content - Scrollable */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
                    <form onSubmit={handleRetopUpSubmit} className="space-y-3">
                      {/* Products Table */}
                      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between p-2 border-b border-gray-200">
                          <h3 className="font-semibold text-gray-700 text-sm">Products</h3>
                          <Button
                            type="button"
                            onClick={() => {
                              setIsAddProductDialogOpen(true)
                              setAddProductDialogPage(1)
                            }}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                            size="sm"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Product
                          </Button>
                        </div>
                <Table>
                  <TableHeader>
                            <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                              <TableHead className="font-semibold text-gray-700 py-2 text-xs">Product Name</TableHead>
                              <TableHead className="font-semibold text-gray-700 py-2 text-xs">Current Stock</TableHead>
                              <TableHead className="font-semibold text-gray-700 py-2 text-xs">Unit Price</TableHead>
                              <TableHead className="font-semibold text-gray-700 py-2 text-xs">Quantity to Add</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                            {customerProductsForRetopUp.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                  <div className="flex flex-col items-center text-muted-foreground">
                                    <Package className="h-12 w-12 mb-3 opacity-30 text-purple-400" />
                                    <p className="text-base font-medium">No products available</p>
                                    <p className="text-xs mt-1">Click "Add Product" to add products to this re-top up</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              (() => {
                                const startIndex = (retopUpPage - 1) * retopUpPerPage
                                const endIndex = startIndex + retopUpPerPage
                                const paginatedProducts = customerProductsForRetopUp.slice(startIndex, endIndex)
                                const totalPages = Math.ceil(customerProductsForRetopUp.length / retopUpPerPage)
                                
                                return (
                                  <>
                                    {paginatedProducts.map((product, pageIndex) => {
                                      const actualIndex = startIndex + pageIndex
                                      return (
                                        <TableRow 
                                          key={product._id || `product-${actualIndex}`}
                                          className="hover:bg-purple-50/50 transition-colors"
                                        >
                                          <TableCell className="font-medium text-gray-900 py-2 text-sm">
                                            <div className="flex items-center gap-1.5">
                                              <Package className="h-3 w-3 text-purple-500" />
                                              {product.productName}
                                            </div>
                                          </TableCell>
                                          <TableCell className="py-2">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                              {product.quantity - (product.invoicedQuantity || 0)} units
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="py-2">
                                            <span className="font-semibold text-gray-700 text-sm">
                                              ₹{product.price?.toLocaleString('en-IN') || '0'}
                                            </span>
                                          </TableCell>
                                          <TableCell className="py-2">
                                            <Input
                                              type="number"
                                              placeholder="0"
                                              value={product.quantityToAdd || ""}
                                              onChange={(e) => {
                                                const updated = [...customerProductsForRetopUp]
                                                updated[actualIndex].quantityToAdd = parseInt(e.target.value) || 0
                                                setCustomerProductsForRetopUp(updated)
                                              }}
                                              min="0"
                                              className="w-28 h-8 text-sm border-2 focus:border-purple-500 focus:ring-purple-500"
                                            />
                                          </TableCell>
                                        </TableRow>
                                      )
                                    })}
                                    {totalPages > 1 && (
                                      <TableRow>
                                        <TableCell colSpan={4} className="py-2">
                                          <div className="flex items-center justify-between">
                                            <div className="text-xs text-muted-foreground">
                                              Showing {startIndex + 1} to {Math.min(endIndex, customerProductsForRetopUp.length)} of {customerProductsForRetopUp.length} entries
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setRetopUpPage(prev => Math.max(1, prev - 1))}
                                                disabled={retopUpPage === 1}
                                                className="h-7 text-xs px-2"
                                              >
                                                <ArrowLeft className="h-3 w-3 mr-1" />
                                                Previous
                                              </Button>
                                              <div className="text-xs text-muted-foreground">
                                                Page {retopUpPage} of {totalPages}
                                              </div>
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setRetopUpPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={retopUpPage === totalPages}
                                                className="h-7 text-xs px-2"
                                              >
                                                Next
                                                <ArrowRight className="h-3 w-3 ml-1" />
                                              </Button>
                                            </div>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </>
                                )
                              })()
                            )}
                  </TableBody>
                </Table>
                      </div>

                {/* Notes Field */}
                      <div className="space-y-1.5">
                        <Label htmlFor="retopup-notes" className="text-xs font-semibold text-gray-700">
                          Notes
                        </Label>
                        <Textarea
                          id="retopup-notes"
                          placeholder="Add any notes or comments about this re-top up transaction..."
                          value={retopUpNotes}
                          onChange={(e) => setRetopUpNotes(e.target.value)}
                          rows={2}
                          className="text-sm border-2 focus:border-purple-500 focus:ring-purple-500 resize-none"
                        />
                      </div>

                      {/* Summary Card */}
                      {customerProductsForRetopUp.some((p: any) => p.quantityToAdd > 0) && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 p-3">
                          <h3 className="font-semibold text-gray-800 mb-1.5 flex items-center gap-1.5 text-xs">
                            <TrendingUp className="h-3 w-3 text-purple-600" />
                            Update Summary
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-600">Total Items to Update</p>
                              <p className="text-lg font-bold text-purple-600">
                                {customerProductsForRetopUp.filter((p: any) => p.quantityToAdd > 0).length}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Total Quantity to Add</p>
                              <p className="text-lg font-bold text-purple-600">
                                {customerProductsForRetopUp.reduce((sum: number, p: any) => sum + (p.quantityToAdd || 0), 0)} units
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex justify-end gap-2 pt-1">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                    setIsRetopUpDialogOpen(false)
                    setRetopUpNotes("")
                    setRetopUpPage(1)
                          }}
                          className="px-4 py-1.5 h-8 text-sm border-2 hover:bg-gray-50"
                        >
                    Cancel
                  </Button>
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-1.5 h-8 text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                          disabled={!customerProductsForRetopUp.some((p: any) => p.quantityToAdd > 0)}
                        >
                          <Package className="h-3 w-3 mr-1.5" />
                    Update Stock
                  </Button>
                </div>
              </form>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Add Product Dialog for Re-top Up */}
          {isAddProductDialogOpen && (
            <>
              {/* Overlay for Add Product Dialog */}
              <div 
                className="fixed bg-black/60 backdrop-blur-sm z-[10000]"
                style={{ 
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  position: 'fixed'
                }}
                onClick={() => {
                  setIsAddProductDialogOpen(false)
                  setAddProductDialogPage(1)
                }}
              />
              {/* Dialog Content */}
              <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none">
                <div className="relative z-10 w-full max-w-3xl bg-white rounded-lg shadow-2xl border border-gray-200 pointer-events-auto max-h-[80vh] overflow-hidden flex flex-col">
                  <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
                    <h2 className="text-xl font-bold">Add Product to Re-top Up</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select a product to add to the re-top up list
                    </p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                      {products.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No products available</p>
                        </div>
                      ) : (
                        (() => {
                          const startIndex = (addProductDialogPage - 1) * addProductDialogPerPage
                          const endIndex = startIndex + addProductDialogPerPage
                          const paginatedProducts = products.slice(startIndex, endIndex)
                          const totalPages = Math.ceil(products.length / addProductDialogPerPage)
                          
                          return (
                            <>
                              <div className="space-y-2">
                                {paginatedProducts.map((product: any) => {
                                  const isAlreadyAdded = customerProductsForRetopUp.some((p: any) => p.productId === product._id)
                                  return (
                                    <div
                                      key={product._id}
                                      className={`flex items-center justify-between p-4 border rounded-lg ${
                                        isAlreadyAdded 
                                          ? 'bg-gray-50 border-gray-200 opacity-60' 
                                          : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer'
                                      } transition-colors`}
                                      onClick={() => !isAlreadyAdded && handleAddProductToRetopUp(product)}
                                    >
                                      <div className="flex items-center gap-3">
                                        <Package className="h-5 w-5 text-purple-500" />
                                        <div>
                                          <div className="font-medium text-gray-900">{product.name}</div>
                                          <div className="text-sm text-gray-500">
                                            {product.category} • ₹{(product.offerPrice || product.price || 0).toLocaleString('en-IN')}
                                          </div>
                                        </div>
                                      </div>
                                      {isAlreadyAdded ? (
                                        <Badge variant="outline" className="bg-gray-100 text-gray-600">
                                          Already Added
                                        </Badge>
                                      ) : (
                                        <Button
                                          type="button"
                                          size="sm"
                                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleAddProductToRetopUp(product)
                                          }}
                                        >
                                          <Plus className="h-4 w-4 mr-1" />
                                          Add
                                        </Button>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                              {totalPages > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t">
                                  <div className="text-sm text-muted-foreground">
                                    Showing {startIndex + 1} to {Math.min(endIndex, products.length)} of {products.length} entries
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setAddProductDialogPage(prev => Math.max(1, prev - 1))}
                                      disabled={addProductDialogPage === 1}
                                    >
                                      <ArrowLeft className="h-4 w-4 mr-1" />
                                      Previous
                                    </Button>
                                    <div className="text-sm text-muted-foreground">
                                      Page {addProductDialogPage} of {totalPages}
                                    </div>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setAddProductDialogPage(prev => Math.min(totalPages, prev + 1))}
                                      disabled={addProductDialogPage === totalPages}
                                    >
                                      Next
                                      <ArrowRight className="h-4 w-4 ml-1" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </>
                          )
                        })()
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex justify-end gap-2 p-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddProductDialogOpen(false)
                        setAddProductDialogPage(1)
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Edit Inventory Dialog */}
          <Dialog open={isEditInventoryDialogOpen} onOpenChange={setIsEditInventoryDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Inventory Item</DialogTitle>
                <DialogDescription>
                  Update product details, quantity, and price
                </DialogDescription>
              </DialogHeader>
              {editingInventoryItem && (
                <form onSubmit={handleEditInventorySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="edit-product-name">Product Name</Label>
                    <Input
                      id="edit-product-name"
                      placeholder="Enter product name"
                      value={editInventoryForm.productName}
                      onChange={(e) => setEditInventoryForm({...editInventoryForm, productName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-quantity">Quantity</Label>
                    <Input
                      id="edit-quantity"
                      type="number"
                      placeholder="Enter quantity"
                      value={editInventoryForm.quantity}
                      onChange={(e) => setEditInventoryForm({...editInventoryForm, quantity: e.target.value})}
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-price">Price (₹)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      placeholder="Enter price"
                      value={editInventoryForm.price}
                      onChange={(e) => setEditInventoryForm({...editInventoryForm, price: e.target.value})}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditInventoryDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Save Changes
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>

          {/* Reports Section */}
          {activeSection === "reports" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Invoice Reports</h2>
                <p className="text-muted-foreground">View analytics and generate reports for invoices</p>
              </div>

              {/* Invoice Reports Tab */}
              {activeSubSection === "invoice-reports" && (
                <InvoiceReportsSection
                  invoices={invoices}
                  startDate={invoiceStartDate}
                  endDate={invoiceEndDate}
                  selectedCustomer={selectedCustomer}
                  onStartDateChange={setInvoiceStartDate}
                  onEndDateChange={setInvoiceEndDate}
                  onCustomerChange={setSelectedCustomer}
                  generatingReport={generatingReport}
                  onGenerateReport={setGeneratingReport}
                />
              )}

              {/* Supplier Reports Tab */}
              {activeSubSection === "supplier-reports" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Supplier Reports</CardTitle>
                    <CardDescription>
                      Track products received from suppliers, including damaged/lost entries with timestamps.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table className="min-w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status / Reason</TableHead>
                            <TableHead>Date & Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(() => {
                            const rows = [
                              // Purchase order items
                              ...purchaseOrders.flatMap((po: any) =>
                                (po.items || []).map((item: any) => ({
                                  supplierName: po.supplierName || 'Unknown',
                                  productName: item.productName,
                                  qty: item.quantity,
                                  type: 'Purchase',
                                  status: po.status || 'pending',
                                  reason: po.deliveryType === 'direct_to_customer' ? 'Direct to customer' : 'To warehouse',
                                  date: po.createdAt || po.updatedAt || new Date().toISOString(),
                                  isDamage: false
                                }))
                              ),
                              // Waste entries (damaged/lost)
                              ...wasteEntries.map((we: any) => ({
                                supplierName: we.supplierName || 'Unknown',
                                productName: we.productName,
                                qty: -Math.abs(we.quantity || 0),
                                type: 'Waste',
                                status: we.reason || 'waste',
                                reason: we.description || we.reason || 'Waste entry',
                                date: we.date || we.createdAt || new Date().toISOString(),
                                isDamage: true
                              }))
                            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

                            if (rows.length === 0) {
                              return (
                                <TableRow>
                                  <TableCell colSpan={6} className="text-center py-8">
                                    <div className="text-muted-foreground">
                                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                      <p>No supplier entries found</p>
                                      <p className="text-sm">Purchase orders and waste entries will appear here.</p>
            </div>
                                  </TableCell>
                                </TableRow>
                              )
                            }

                            return rows.map((row, idx) => (
                              <TableRow key={`${row.supplierName}-${row.productName}-${idx}`}>
                                <TableCell className="font-medium">{row.supplierName}</TableCell>
                                <TableCell>{row.productName}</TableCell>
                                <TableCell>
                                  <Badge variant={row.qty < 0 ? "destructive" : "default"}>
                                    {row.qty}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={row.type === 'Waste' ? "destructive" : "secondary"}>
                                    {row.type}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {row.status}{row.reason ? ` - ${row.reason}` : ''}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {new Date(row.date).toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))
                          })()}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Purchase Order Dialog */}
          <Dialog open={isPODialogOpen} onOpenChange={setIsPODialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Purchase Order</DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePOSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>PO Type *</Label>
                    <Select
                      value={poForm.poType}
                      onValueChange={(value: any) => setPOForm({...poForm, poType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard PO</SelectItem>
                        <SelectItem value="reference">Reference PO (Record Only)</SelectItem>
                      </SelectContent>
                    </Select>
                    {poForm.poType === 'reference' && (
                      <p className="text-xs text-muted-foreground mt-1">For audit/document matching only</p>
                    )}
                  </div>
                  <div>
                    <Label>Supplier Name *</Label>
                    <Select
                      value={poForm.supplierName}
                      onValueChange={(value) => setPOForm({...poForm, supplierName: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.filter((s: any) => s.isActive).map((supplier: any) => (
                          <SelectItem key={supplier._id} value={supplier.name}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Delivery Type *</Label>
                    <Select
                      value={poForm.deliveryType}
                      onValueChange={(value: any) => setPOForm({...poForm, deliveryType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="to_warehouse">To Warehouse</SelectItem>
                        <SelectItem value="direct_to_customer">Direct to Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {poForm.deliveryType === 'direct_to_customer' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Customer</Label>
                      <Select
                        value={poForm.customerId}
                        onValueChange={(value) => {
                          const customer = customers.find((c: any) => c._id === value)
                          setPOForm({...poForm, customerId: value, customerName: customer?.name || ''})
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer: any) => (
                            <SelectItem key={customer._id} value={customer._id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Expected Date</Label>
                    <Input
                      type="date"
                      value={poForm.expectedDate}
                      onChange={(e) => setPOForm({...poForm, expectedDate: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Items *</Label>
                  <div className="space-y-2 border p-4 rounded-lg">
                    {poForm.items.map((item: any, index: number) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-5">
                          <Select
                            value={item.productId}
                            onValueChange={(value) => {
                              const product = products.find((p: any) => p._id === value)
                              const newItems = [...poForm.items]
                              newItems[index] = {
                                ...newItems[index],
                                productId: value,
                                productName: product?.name || '',
                                unitPrice: product?.price || 0
                              }
                              setPOForm({...poForm, items: newItems})
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product: any) => (
                                <SelectItem key={product._id} value={product._id}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...poForm.items]
                              newItems[index].quantity = parseInt(e.target.value) || 1
                              setPOForm({...poForm, items: newItems})
                            }}
                            min="1"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            placeholder="Unit Price"
                            value={item.unitPrice}
                            onChange={(e) => {
                              const newItems = [...poForm.items]
                              newItems[index].unitPrice = parseFloat(e.target.value) || 0
                              setPOForm({...poForm, items: newItems})
                            }}
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-span-2">
                          <div className="px-3 py-2 bg-muted rounded-md text-sm">
                            ₹{(item.quantity * item.unitPrice).toLocaleString()}
                          </div>
                        </div>
                        <div className="col-span-1">
                          {poForm.items.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPOForm({...poForm, items: poForm.items.filter((_, i) => i !== index)})
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPOForm({...poForm, items: [...poForm.items, { productId: "", productName: "", quantity: 1, unitPrice: 0 }]})
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Total Amount</Label>
                  <div className="px-3 py-2 bg-muted rounded-md font-bold">
                    ₹{poForm.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={poForm.notes}
                    onChange={(e) => setPOForm({...poForm, notes: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsPODialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Create PO
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* GRN Type Selection Dialog - Now shows Inward Entries */}
          <Dialog open={isGRNTypeDialogOpen} onOpenChange={setIsGRNTypeDialogOpen}>
            <DialogContent 
              className="max-h-[80vh] overflow-y-auto"
              style={{
                width: '90vw',
                maxWidth: '1200px'
              }}
            >
              <DialogHeader>
                <DialogTitle>Create GRN from Inward Entry</DialogTitle>
                <DialogDescription>
                  Select an inward entry to generate GRN. Only accepted goods from inward entries will be added to warehouse stock.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-600 mr-2" />
                    <span className="text-gray-600">Loading inward entries...</span>
                  </div>
                ) : inwardEntries.filter((inward: any) => inward.status === 'PENDING_GRN').length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-30 text-gray-400" />
                    <p className="text-lg font-medium text-gray-600">No pending inward entries</p>
                    <p className="text-sm text-gray-500 mt-1">Create an inward entry first to generate GRN</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setIsGRNTypeDialogOpen(false)
                        setActiveSection("inventory-management")
                        setActiveSubSection("inward")
                        setIsInventoryManagementExpanded(true)
                      }}
                    >
                      Go to Inward Tab
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Select Inward Entry:</Label>
                    <div className="border rounded-lg overflow-x-auto w-full">
                      <Table className="min-w-full w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Inward Number</TableHead>
                            <TableHead>PO Number</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead>Accepted Qty</TableHead>
                            <TableHead>Received Date</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inwardEntries
                            .filter((inward: any) => inward.status === 'PENDING_GRN')
                            .map((inward: any) => {
                              const totalAccepted = inward.items.reduce((sum: number, item: any) => sum + item.acceptedQuantity, 0)
                              return (
                                <TableRow key={inward._id} className="hover:bg-blue-50">
                                  <TableCell className="font-medium">{inward.inwardNumber}</TableCell>
                                  <TableCell>
                                    {inward.poNumber ? (
                                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        {inward.poNumber}
                                      </Badge>
                                    ) : (
                                      <span className="text-gray-400 text-sm">Direct Inward</span>
                                    )}
                                  </TableCell>
                                  <TableCell>{inward.supplierName}</TableCell>
                                  <TableCell>
                                    <div className="space-y-1">
                                      {inward.items.slice(0, 2).map((item: any, idx: number) => (
                                        <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 mr-1 mb-1 text-xs">
                                          {item.productName} ({item.acceptedQuantity})
                                        </Badge>
                                      ))}
                                      {inward.items.length > 2 && (
                                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                                          +{inward.items.length - 2} more
                                        </Badge>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="default" className="bg-green-600">
                                      {totalAccepted} units
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm text-gray-600">
                                      {new Date(inward.receivedDate).toLocaleDateString()}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => {
                                        setSelectedInward(inward)
                                        setIsGRNTypeDialogOpen(false)
                                        setIsGenerateGRNFromInwardOpen(true)
                                      }}
                                    >
                                      Generate GRN
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* GRN Full-Page Overlay */}
          {isGRNDialogOpen && (
            <>
              {/* Translucent Black Overlay - Full Document Height */}
              <div 
                data-overlay="grn-view"
                className="fixed bg-black/60 backdrop-blur-sm z-[9998]"
                style={{ 
                  top: 0,
                  left: 0,
                  right: 0,
                  width: '100%',
                  position: 'fixed',
                  minHeight: '100vh'
                }}
                onClick={() => {
                  setIsGRNDialogOpen(false)
                  setGRNForm({ 
                    poNumber: "", 
                    receivedQuantity: "", 
                    warehouseName: "Main Warehouse", 
                    grnType: "GRN_CREATED",
                    supplierName: "",
                    location: {},
                    notes: "",
                    items: [] 
                  })
                  setSelectedPO(null)
                  setIsDirectGRN(false)
                }}
              />
              
              {/* Content Container - Modern Centered */}
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                {/* Content Card - Modern Design */}
                <div className="relative z-10 w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-gray-200 pointer-events-auto max-h-[95vh] overflow-hidden flex flex-col">
                  {/* Modern Header with Gradient */}
                  <div className="sticky top-0 z-20 bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex items-center justify-between shadow-lg">
                    <div className="text-white">
                      <h2 className="text-2xl font-bold mb-1">
                        {isDirectGRN ? 'Create Direct GRN' : selectedPO ? `Receive Goods (GRN) - ${grnForm.poNumber}` : 'Create GRN - Select PO'}
                      </h2>
                      <p className="text-sm text-blue-100">
                        {isDirectGRN 
                          ? 'Create GRN without Purchase Order. Enter items manually.'
                          : selectedPO 
                          ? 'Accept goods from supplier. Optionally record damaged or lost items.'
                          : 'Select a Purchase Order to link this GRN to.'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsGRNDialogOpen(false)
                        setGRNForm({ 
                          poNumber: "", 
                          receivedQuantity: "", 
                          warehouseName: "Main Warehouse", 
                          grnType: "GRN_CREATED",
                          supplierName: "",
                          location: {},
                          notes: "",
                          items: [] 
                        })
                        setSelectedPO(null)
                        setIsDirectGRN(false)
                      }}
                      className="h-9 w-9 p-0 hover:bg-white/20 text-white hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* Content - Scrollable */}
                  <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                    <form onSubmit={handleGRNSubmit} className="space-y-6">
                  {!isDirectGRN && !selectedPO && (
                    <div>
                      <Label>Select Purchase Order *</Label>
                      <Select
                        value={grnForm.poNumber}
                        onValueChange={(value) => {
                          const po = purchaseOrders.find((p: any) => p.poNumber === value)
                          if (po) {
                            setSelectedPO(po)
                            const totalQuantity = po.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
                            setGRNForm({
                              poNumber: po.poNumber,
                              receivedQuantity: totalQuantity.toString(),
                              warehouseName: "Main Warehouse",
                              grnType: "GRN_CREATED",
                              supplierName: po.supplierName || "",
                              location: {},
                              notes: "",
                              items: po.items.map((item: any) => ({
                                productId: item.productId,
                                productName: item.productName,
                                orderedQuantity: item.quantity,
                                receivedQuantity: item.quantity,
                                damagedQuantity: 0,
                                lostQuantity: 0,
                                unitPrice: item.unitPrice || 0
                              }))
                            })
                          }
                        }}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Purchase Order" />
                        </SelectTrigger>
                        <SelectContent>
                          {purchaseOrders
                            .filter((po: any) => po.status !== 'PO_CLOSED' || po.poType === 'reference')
                            .map((po: any) => (
                              <SelectItem key={po._id} value={po.poNumber}>
                                {po.poNumber} - {po.supplierName} ({po.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} items)
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {!isDirectGRN && selectedPO && (
                    <div>
                      <Label>PO Number</Label>
                      <Input
                        value={grnForm.poNumber}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  )}
                  {isDirectGRN && (
                    <div>
                      <Label>Supplier Name *</Label>
                      <Input
                        value={grnForm.supplierName}
                        onChange={(e) => setGRNForm({...grnForm, supplierName: e.target.value})}
                        placeholder="Enter supplier name"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <Label>Warehouse Name *</Label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative warehouse-dropdown-container">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsWarehouseDropdownOpen2(!isWarehouseDropdownOpen2)}
                          className="w-full justify-between"
                        >
                          {grnForm.warehouseName || "Select warehouse"}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                        {isWarehouseDropdownOpen2 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                            <div className="p-1">
                              {warehouses.map((warehouse) => (
                                <div
                                  key={warehouse}
                                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer group"
                                  onClick={() => {
                                    setGRNForm({...grnForm, warehouseName: warehouse})
                                    setIsWarehouseDropdownOpen2(false)
                                  }}
                                >
                                  <span className={grnForm.warehouseName === warehouse ? "font-semibold" : ""}>
                                    {warehouse}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (warehouses.length > 1) {
                                        const updatedWarehouses = warehouses.filter(w => w !== warehouse)
                                        setWarehouses(updatedWarehouses)
                                        if (grnForm.warehouseName === warehouse) {
                                          setGRNForm({...grnForm, warehouseName: updatedWarehouses[0] || ""})
                                        }
                                      } else {
                                        alert("At least one warehouse must exist")
                                      }
                                    }}
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                              {isAddingWarehouse ? (
                                <div className="flex gap-1 px-3 py-2 border-t mt-1">
                                  <Input
                                    value={newWarehouseName}
                                    onChange={(e) => setNewWarehouseName(e.target.value)}
                                    placeholder="Enter warehouse name"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && newWarehouseName.trim()) {
                                        setWarehouses([...warehouses, newWarehouseName.trim()])
                                        setGRNForm({...grnForm, warehouseName: newWarehouseName.trim()})
                                        setNewWarehouseName("")
                                        setIsAddingWarehouse(false)
                                      }
                                      if (e.key === 'Escape') {
                                        setIsAddingWarehouse(false)
                                        setNewWarehouseName("")
                                      }
                                    }}
                                    autoFocus
                                    className="h-8 text-sm"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      if (newWarehouseName.trim()) {
                                        setWarehouses([...warehouses, newWarehouseName.trim()])
                                        setGRNForm({...grnForm, warehouseName: newWarehouseName.trim()})
                                        setNewWarehouseName("")
                                        setIsAddingWarehouse(false)
                                      }
                                    }}
                                    className="h-8 px-2"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setIsAddingWarehouse(false)
                                      setNewWarehouseName("")
                                    }}
                                    className="h-8 px-2"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div
                                  className="px-3 py-2 border-t mt-1 cursor-pointer hover:bg-gray-100 rounded-md flex items-center gap-2 text-sm text-blue-600"
                                  onClick={() => setIsAddingWarehouse(true)}
                                >
                                  <Plus className="h-4 w-4" />
                                  <span>Add Warehouse</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items Table with Damaged/Lost Fields */}
                  {(selectedPO || isDirectGRN) && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                      <Label>Items - Record Received, Damaged, and Lost Quantities</Label>
                      {isDirectGRN && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setGRNForm({
                              ...grnForm,
                              items: [...grnForm.items, {
                                productId: "",
                                productName: "",
                                orderedQuantity: 0,
                                receivedQuantity: 0,
                                damagedQuantity: 0,
                                lostQuantity: 0,
                                unitPrice: 0
                              }]
                            })
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      )}
                    </div>
                    <div className="border rounded-lg overflow-x-auto">
                      <Table className="min-w-full">
                        <TableHeader>
                          <TableRow>
                            {isDirectGRN && <TableHead className="min-w-[200px]">Product</TableHead>}
                            {!isDirectGRN && <TableHead className="min-w-[200px]">Product Name</TableHead>}
                            {!isDirectGRN && <TableHead className="min-w-[120px]">Ordered Qty</TableHead>}
                            <TableHead className="min-w-[140px]">Received Qty</TableHead>
                            <TableHead className="min-w-[140px]">Damaged Qty</TableHead>
                            <TableHead className="min-w-[140px]">Lost Qty</TableHead>
                            <TableHead className="min-w-[140px]">Unit Cost (₹)</TableHead>
                            <TableHead className="min-w-[140px]">Accepted Qty</TableHead>
                            {isDirectGRN && <TableHead className="min-w-[100px]">Actions</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {grnForm.items.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={isDirectGRN ? 6 : 6} className="text-center py-8">
                                {isDirectGRN ? 'Click "Add Item" to add products' : 'No items'}
                              </TableCell>
                            </TableRow>
                          ) : (
                            grnForm.items.map((item, index) => {
                              const acceptedQty = item.receivedQuantity - (item.damagedQuantity || 0) - (item.lostQuantity || 0)
                              return (
                                <TableRow key={index}>
                                  {isDirectGRN ? (
                                    <TableCell className="min-w-[200px]">
                                      <Select
                                        value={item.productId}
                                        onValueChange={(value) => {
                                          const product = products.find((p: any) => p._id === value)
                                          const newItems = [...grnForm.items]
                                          newItems[index] = {
                                            ...newItems[index],
                                            productId: value,
                                            productName: product?.name || '',
                                            unitPrice: product?.price || newItems[index].unitPrice || 0
                                          }
                                          setGRNForm({...grnForm, items: newItems})
                                        }}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {products.map((p: any) => (
                                            <SelectItem key={p._id} value={p._id}>
                                              {p.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                  ) : (
                                    <>
                                      <TableCell className="font-medium">{item.productName}</TableCell>
                                      <TableCell>
                                        <Badge variant="outline">{item.orderedQuantity}</Badge>
                                      </TableCell>
                                    </>
                                  )}
                                  <TableCell className="min-w-[140px]">
                                    <Input
                                      type="number"
                                      min="0"
                                      max={!isDirectGRN ? item.orderedQuantity : undefined}
                                      value={item.receivedQuantity}
                                      onChange={(e) => {
                                        const newItems = [...grnForm.items]
                                        newItems[index].receivedQuantity = parseInt(e.target.value) || 0
                                        setGRNForm({...grnForm, items: newItems})
                                      }}
                                      className="w-full min-w-[100px]"
                                    />
                                  </TableCell>
                                  <TableCell className="min-w-[140px]">
                                    <Input
                                      type="number"
                                      min="0"
                                      max={item.receivedQuantity}
                                      value={item.damagedQuantity || 0}
                                      onChange={(e) => {
                                        const newItems = [...grnForm.items]
                                        newItems[index].damagedQuantity = parseInt(e.target.value) || 0
                                        setGRNForm({...grnForm, items: newItems})
                                      }}
                                      className="w-full min-w-[100px]"
                                      placeholder="0"
                                    />
                                  </TableCell>
                                  <TableCell className="min-w-[140px]">
                                    <Input
                                      type="number"
                                      min="0"
                                      max={item.receivedQuantity}
                                      value={item.lostQuantity || 0}
                                      onChange={(e) => {
                                        const newItems = [...grnForm.items]
                                        newItems[index].lostQuantity = parseInt(e.target.value) || 0
                                        setGRNForm({...grnForm, items: newItems})
                                      }}
                                      className="w-full min-w-[100px]"
                                      placeholder="0"
                                    />
                                  </TableCell>
                                  <TableCell className="min-w-[140px]">
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={item.unitPrice || 0}
                                      onChange={(e) => {
                                        const newItems = [...grnForm.items]
                                        newItems[index].unitPrice = parseFloat(e.target.value) || 0
                                        setGRNForm({...grnForm, items: newItems})
                                      }}
                                      className="w-full min-w-[100px]"
                                      placeholder="0.00"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant={acceptedQty > 0 ? "default" : "destructive"}>
                                      {acceptedQty}
                                    </Badge>
                                    {acceptedQty < 0 && (
                                      <p className="text-xs text-red-600 mt-1">Invalid</p>
                                    )}
                                  </TableCell>
                                  {isDirectGRN && (
                                    <TableCell>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const newItems = grnForm.items.filter((_, i) => i !== index)
                                          setGRNForm({...grnForm, items: newItems})
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </TableCell>
                                  )}
                                </TableRow>
                              )
                            })
                          )}
                        </TableBody>
                      </Table>
                    </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Accepted Qty = Received Qty - Damaged Qty - Lost Qty
                      </p>
                    </div>
                  )}

                      {/* Modern Footer */}
                      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-4 flex justify-end gap-3 shadow-lg">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsGRNDialogOpen(false)
                            setGRNForm({ 
                              poNumber: "", 
                              receivedQuantity: "", 
                              warehouseName: "Main Warehouse", 
                              grnType: "GRN_CREATED",
                              supplierName: "",
                              location: {},
                              notes: "",
                              items: [] 
                            })
                            setSelectedPO(null)
                            setIsDirectGRN(false)
                          }}
                          className="px-6 border-2 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 shadow-lg hover:shadow-xl transition-all duration-200"
                          disabled={
                            (!isDirectGRN && !selectedPO) ||
                            grnForm.items.length === 0 || 
                            grnForm.items.some((item: any) => {
                              const accepted = item.receivedQuantity - (item.damagedQuantity || 0) - (item.lostQuantity || 0)
                              return accepted < 0 || (isDirectGRN && !item.productId)
                            })
                          }
                        >
                          {isDirectGRN ? 'Create GRN' : selectedPO ? 'Accept & Receive Goods' : 'Select PO First'}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* View Purchase Order Full-Page Overlay */}
          {isViewPODialogOpen && viewingPO && (
            <>
              {/* Translucent Black Overlay - Full Document Height */}
              <div 
                data-overlay="po-view"
                className="fixed bg-black/60 backdrop-blur-sm z-[9998]"
                style={{ 
                  top: 0,
                  left: 0,
                  right: 0,
                  width: '100%',
                  position: 'fixed',
                  minHeight: '100vh'
                }}
                onClick={() => {
                  setIsViewPODialogOpen(false)
                  setViewingPO(null)
                  // Redirect back to Purchase Orders tab
                  setActiveSection("inventory-management")
                  setActiveSubSection("purchase-orders")
                  setIsInventoryManagementExpanded(true)
                }}
              />
              
              {/* Content Container */}
              <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-8 pb-8 overflow-y-auto pointer-events-none">
                {/* Content Card - Centered */}
                <div className="relative z-10 w-full max-w-5xl mx-4 bg-card rounded-lg shadow-2xl border pointer-events-auto">
                {/* Header with Close Button */}
                <div className="sticky top-0 z-20 bg-card border-b px-6 py-4 rounded-t-lg flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Purchase Order Details - {viewingPO.poNumber}</h2>
                    <p className="text-sm text-muted-foreground mt-1">View complete purchase order information</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsViewPODialogOpen(false)
                      setViewingPO(null)
                      // Redirect back to Purchase Orders tab
                      setActiveSection("inventory-management")
                      setActiveSubSection("purchase-orders")
                      setIsInventoryManagementExpanded(true)
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
                  {/* PO Header Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">PO Number</Label>
                      <p className="text-sm font-medium mt-1">{viewingPO.poNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <div className="mt-1">
                        <Badge variant={viewingPO.status === 'received' ? 'default' : viewingPO.status === 'cancelled' ? 'destructive' : 'secondary'}>
                          {viewingPO.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Supplier Name</Label>
                      <p className="text-sm mt-1">{viewingPO.supplierName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Delivery Type</Label>
                      <div className="mt-1">
                        <Badge variant={viewingPO.deliveryType === 'to_warehouse' ? 'default' : 'secondary'}>
                          {viewingPO.deliveryType === 'to_warehouse' ? 'To Warehouse' : 'Direct to Customer'}
                        </Badge>
                      </div>
                    </div>
                    {viewingPO.deliveryType === 'direct_to_customer' && (
                      <>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Customer Name</Label>
                          <p className="text-sm mt-1">{viewingPO.customerName || '-'}</p>
                        </div>
                      </>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Expected Date</Label>
                      <p className="text-sm mt-1">
                        {viewingPO.expectedDate ? new Date(viewingPO.expectedDate).toLocaleDateString() : '-'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Created Date</Label>
                      <p className="text-sm mt-1">{new Date(viewingPO.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Total Amount</Label>
                      <p className="text-sm font-medium mt-1">₹{viewingPO.totalAmount?.toLocaleString() || '0'}</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2 block">Items</Label>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product Name</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewingPO.items.map((item: any, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{item.productName}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>₹{item.unitPrice?.toLocaleString() || '0'}</TableCell>
                            <TableCell className="font-medium">
                              ₹{((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Notes */}
                  {viewingPO.notes && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
                      <p className="text-sm mt-1 p-3 bg-muted rounded-md">{viewingPO.notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsViewPODialogOpen(false)
                        setViewingPO(null)
                        // Redirect back to Purchase Orders tab
                        setActiveSection("inventory-management")
                        setActiveSubSection("purchase-orders")
                        setIsInventoryManagementExpanded(true)
                      }}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Purchase Orders
                    </Button>
                    {viewingPO.status === 'pending' && viewingPO.deliveryType === 'to_warehouse' && (
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                          setIsViewPODialogOpen(false)
                          setViewingPO(null)
                          // Navigate to Warehouse Stock tab to accept
                          setActiveSection("inventory-management")
                          setActiveSubSection("warehouse-stock")
                          setIsInventoryManagementExpanded(true)
                        }}
                      >
                        Go to Warehouse Stock to Accept
                      </Button>
                    )}
                  </div>
                </div>
                </div>
              </div>
            </>
          )}

          {/* Supplier Dialog */}
          <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
                <DialogDescription>Manage supplier information</DialogDescription>
              </DialogHeader>
              <form onSubmit={async (e) => {
                e.preventDefault()
                try {
                  const url = editingSupplier ? `/api/suppliers/${editingSupplier._id}` : '/api/suppliers'
                  const method = editingSupplier ? 'PUT' : 'POST'
                  
                  const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(supplierForm)
                  })
                  
                  const result = await response.json()
                  if (result.success) {
                    if (editingSupplier) {
                      setSuppliers(suppliers.map((s: any) => s._id === editingSupplier._id ? result.data : s))
                      alert('Supplier updated successfully')
                    } else {
                      setSuppliers([...suppliers, result.data])
                      alert('Supplier added successfully')
                    }
                    setIsSupplierDialogOpen(false)
                    setEditingSupplier(null)
                    setSupplierForm({
                      name: "",
                      contact: "",
                      email: "",
                      phone: "",
                      address: "",
                      city: "",
                      state: "",
                      pincode: "",
                      gstNumber: "",
                      notes: "",
                      isActive: true
                    })
                  } else {
                    alert('Error: ' + result.error)
                  }
                } catch (error) {
                  console.error('Error saving supplier:', error)
                  alert('Error saving supplier')
                }
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Supplier Name *</Label>
                    <Input
                      value={supplierForm.name}
                      onChange={(e) => setSupplierForm({...supplierForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Contact Person</Label>
                    <Input
                      value={supplierForm.contact}
                      onChange={(e) => setSupplierForm({...supplierForm, contact: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={supplierForm.email}
                      onChange={(e) => setSupplierForm({...supplierForm, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={supplierForm.phone}
                      onChange={(e) => setSupplierForm({...supplierForm, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={supplierForm.address}
                    onChange={(e) => setSupplierForm({...supplierForm, address: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input
                      value={supplierForm.city}
                      onChange={(e) => setSupplierForm({...supplierForm, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input
                      value={supplierForm.state}
                      onChange={(e) => setSupplierForm({...supplierForm, state: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input
                      value={supplierForm.pincode}
                      onChange={(e) => setSupplierForm({...supplierForm, pincode: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>GST Number</Label>
                    <Input
                      value={supplierForm.gstNumber}
                      onChange={(e) => setSupplierForm({...supplierForm, gstNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={supplierForm.isActive ? "active" : "inactive"}
                      onValueChange={(value) => setSupplierForm({...supplierForm, isActive: value === "active"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={supplierForm.notes}
                    onChange={(e) => setSupplierForm({...supplierForm, notes: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsSupplierDialogOpen(false)
                    setEditingSupplier(null)
                    setSupplierForm({
                      name: "",
                      contact: "",
                      email: "",
                      phone: "",
                      address: "",
                      city: "",
                      state: "",
                      pincode: "",
                      gstNumber: "",
                      notes: "",
                      isActive: true
                    })
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    {editingSupplier ? "Update Supplier" : "Add Supplier"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Waste Entry Full-Page Overlay */}
          {isWasteDialogOpen && (
            <>
              {/* Translucent Black Overlay - Full Document Height */}
              <div 
                data-overlay="waste-view"
                className="fixed bg-black/60 backdrop-blur-sm z-[9998]"
                style={{ 
                  top: 0,
                  left: 0,
                  right: 0,
                  width: '100%',
                  position: 'fixed',
                  minHeight: '100vh'
                }}
                onClick={() => {
                  setIsWasteDialogOpen(false)
                  setWasteForm({
                    productId: "",
                    productName: "",
                    quantity: "",
                    reason: "damaged" as "damaged" | "expired" | "lost" | "other",
                    description: "",
                    warehouseName: "Main Warehouse"
                  })
                }}
              />
              
              {/* Content Container */}
              <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-8 pb-8 overflow-y-auto pointer-events-none">
                {/* Content Card - Centered */}
                <div className="relative z-10 w-full max-w-2xl mx-4 bg-card rounded-lg shadow-2xl border pointer-events-auto">
                  {/* Header with Close Button */}
                  <div className="sticky top-0 z-20 bg-card border-b px-6 py-4 rounded-t-lg flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Record Waste Entry</h2>
                      <p className="text-sm text-muted-foreground mt-1">Select product from warehouse stock</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsWasteDialogOpen(false)
                        setWasteForm({
                          productId: "",
                          productName: "",
                          quantity: "",
                          reason: "damaged" as "damaged" | "expired" | "lost" | "other",
                          description: "",
                          warehouseName: "Main Warehouse"
                        })
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <form onSubmit={handleWasteSubmit} className="space-y-4">
                <div>
                  <Label>Product from Warehouse Stock *</Label>
                  <Select
                    value={wasteForm.productId}
                    onValueChange={(value) => {
                      const stockItem = warehouseStock.find((ws: any) => ws.productId === value)
                      if (stockItem) {
                        setWasteForm({
                          ...wasteForm, 
                          productId: value, 
                          productName: stockItem.productName,
                          quantity: stockItem.availableStock > 0 ? "1" : ""
                        })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product from warehouse" />
                    </SelectTrigger>
                    <SelectContent className="!z-[10000]">
                      {warehouseStock
                        .filter((ws: any) => ws.availableStock > 0)
                        .map((stock: any) => (
                          <SelectItem key={stock.productId} value={stock.productId}>
                            {stock.productName} (Available: {stock.availableStock})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {wasteForm.productId && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Available stock: {warehouseStock.find((ws: any) => ws.productId === wasteForm.productId)?.availableStock || 0}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      value={wasteForm.quantity}
                      onChange={(e) => setWasteForm({...wasteForm, quantity: e.target.value})}
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <Label>Reason *</Label>
                    <Select
                      value={wasteForm.reason}
                      onValueChange={(value: any) => setWasteForm({...wasteForm, reason: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="!z-[10000]">
                        <SelectItem value="damaged">Damaged</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={wasteForm.description}
                    onChange={(e) => setWasteForm({...wasteForm, description: e.target.value})}
                  />
                </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => {
                          setIsWasteDialogOpen(false)
                          setWasteForm({
                            productId: "",
                            productName: "",
                            quantity: "",
                            reason: "damaged" as "damaged" | "expired" | "lost" | "other",
                            description: "",
                            warehouseName: "Main Warehouse"
                          })
                        }}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                          Record Waste
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Record Outward Entry Dialog */}
          <Dialog 
            open={isOutwardDialogOpen} 
            onOpenChange={(open) => {
              setIsOutwardDialogOpen(open)
              if (!open) {
                setOutwardForm({
                  customerId: "",
                  customerName: "",
                  warehouseName: "Main Warehouse",
                  referenceNumber: "",
                  notes: "",
                  outwardDate: new Date().toISOString().split('T')[0],
                  items: []
                })
                setOutwardFormPage(1)
                setExpandedProductIndex(null)
              }
            }}
          >
            <DialogContent 
              className="p-0"
              style={{
                width: '90vw',
                maxWidth: '1400px',
                height: '90vh',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* Fixed Header */}
              <div className="px-6 pt-4 pb-3 border-b bg-white" style={{ flexShrink: 0 }}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <ArrowRight className="h-6 w-6 text-orange-600" />
                    Record Outward Entry
                  </DialogTitle>
                  <DialogDescription>
                    Track offline product handouts from warehouse to customers. Add multiple products with different outward types.
                  </DialogDescription>
                </DialogHeader>
              </div>
              
              {/* Scrollable Content - Internal Modal Scrollbar */}
              <div 
                className="px-6 py-3 bg-white grn-dialog-scroll"
                style={{
                  height: 'calc(90vh - 200px)',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <form onSubmit={handleOutwardSubmit} className="space-y-6" id="outward-form">
                  {/* Page 1: Customer & Products Grid */}
                  {outwardFormPage === 1 && (
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left Column - Customer & Warehouse Info */}
                      <div className="space-y-4">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <p className="text-sm font-semibold text-orange-900">Outward Entry Details</p>
                          <p className="text-xs text-orange-700 mt-1">Customer: {outwardForm.customerName || 'Not selected'}</p>
                          <p className="text-xs text-orange-700">Warehouse: {outwardForm.warehouseName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Customer *</Label>
                            <Select
                              value={outwardForm.customerId}
                              onValueChange={(value) => {
                                const customer = customers.find((c: any) => c._id === value)
                                if (customer) {
                                  setOutwardForm({
                                    ...outwardForm,
                                    customerId: value,
                                    customerName: customer.name
                                  })
                                }
                              }}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select customer" />
                              </SelectTrigger>
                              <SelectContent>
                                {customers.map((customer: any) => (
                                  <SelectItem key={customer._id} value={customer._id}>
                                    {customer.name} {customer.email ? `(${customer.email})` : ''}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Warehouse *</Label>
                            <Select
                              value={outwardForm.warehouseName}
                              onValueChange={(value) => {
                                setOutwardForm({
                                  ...outwardForm,
                                  warehouseName: value
                                })
                              }}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {warehouses.map((wh: string) => (
                                  <SelectItem key={wh} value={wh}>{wh}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label>Outward Date *</Label>
                          <Input
                            type="date"
                            value={outwardForm.outwardDate}
                            onChange={(e) => setOutwardForm({...outwardForm, outwardDate: e.target.value})}
                            required
                          />
                        </div>

                        <div>
                          <Label>Reference Number - Optional</Label>
                          <Input
                            value={outwardForm.referenceNumber}
                            onChange={(e) => setOutwardForm({...outwardForm, referenceNumber: e.target.value})}
                            placeholder="Challan/Invoice No."
                          />
                        </div>

                        <div>
                          <Label>Notes - Optional</Label>
                          <Textarea
                            value={outwardForm.notes}
                            onChange={(e) => setOutwardForm({...outwardForm, notes: e.target.value})}
                            rows={4}
                            placeholder="Additional notes..."
                            className="resize-none"
                          />
                        </div>
                      </div>

                      {/* Right Column - Products Grid (Similar to Customer Grid in GRN) */}
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-4">
                            <Label className="text-sm font-semibold">Products</Label>
                            <Select
                              onValueChange={(value) => {
                                const stock = warehouseStock.find((ws: any) => ws.productId === value && ws.warehouseName === outwardForm.warehouseName)
                                if (stock) {
                                  const newItem = {
                                    productId: value,
                                    productName: stock.productName,
                                    quantity: 0,
                                    unitPrice: stock.price || 0,
                                    outwardType: "offline_direct" as const,
                                    totalAmount: 0
                                  }
                                  setOutwardForm({
                                    ...outwardForm,
                                    items: [...(outwardForm.items || []), newItem]
                                  })
                                  setExpandedProductIndex((outwardForm.items || []).length)
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Add Product" />
                              </SelectTrigger>
                              <SelectContent>
                                {warehouseStock
                                  .filter((ws: any) => ws.warehouseName === outwardForm.warehouseName && ws.availableStock > 0)
                                  .map((stock: any) => (
                                    <SelectItem key={stock.productId} value={stock.productId}>
                                      {stock.productName} (Available: {stock.availableStock})
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {expandedProductIndex !== null && expandedProductIndex < 10 && outwardForm.items && outwardForm.items[expandedProductIndex] ? (
                            /* Show Expanded Form - Hide Grid */
                            <div className="border rounded-lg p-4 bg-white space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-sm">Product {expandedProductIndex + 1}</h4>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newItems = (outwardForm.items || []).filter((_, idx) => idx !== expandedProductIndex)
                                      setOutwardForm({...outwardForm, items: newItems})
                                      setExpandedProductIndex(null)
                                    }}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setExpandedProductIndex(null)}
                                    className="text-gray-600 hover:text-gray-700"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div>
                                <Label>Select Product *</Label>
                                <Select
                                  value={outwardForm.items[expandedProductIndex].productId}
                                  onValueChange={(value) => {
                                    const stock = warehouseStock.find((ws: any) => ws.productId === value && ws.warehouseName === outwardForm.warehouseName)
                                    const newItems = [...(outwardForm.items || [])]
                                    newItems[expandedProductIndex] = {
                                      ...newItems[expandedProductIndex],
                                      productId: value,
                                      productName: stock?.productName || '',
                                      unitPrice: stock?.price || newItems[expandedProductIndex].unitPrice || 0
                                    }
                                    setOutwardForm({...outwardForm, items: newItems})
                                  }}
                                  required
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select product" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {warehouseStock
                                      .filter((ws: any) => ws.warehouseName === outwardForm.warehouseName && ws.availableStock > 0)
                                      .map((stock: any) => (
                                        <SelectItem key={stock.productId} value={stock.productId}>
                                          {stock.productName} (Available: {stock.availableStock})
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label>Quantity *</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  max={warehouseStock.find((ws: any) => ws.productId === outwardForm.items[expandedProductIndex].productId && ws.warehouseName === outwardForm.warehouseName)?.availableStock || 0}
                                  value={outwardForm.items[expandedProductIndex].quantity || ""}
                                  onChange={(e) => {
                                    const newItems = [...(outwardForm.items || [])]
                                    const qty = parseInt(e.target.value) || 0
                                    newItems[expandedProductIndex] = {
                                      ...newItems[expandedProductIndex],
                                      quantity: qty,
                                      totalAmount: qty * newItems[expandedProductIndex].unitPrice
                                    }
                                    setOutwardForm({...outwardForm, items: newItems})
                                  }}
                                  placeholder="0"
                                  required
                                />
                              </div>
                              
                              <div>
                                <Label>Outward Type *</Label>
                                <Select
                                  value={outwardForm.items[expandedProductIndex].outwardType}
                                  onValueChange={(value: any) => {
                                    const newItems = [...(outwardForm.items || [])]
                                    newItems[expandedProductIndex] = {
                                      ...newItems[expandedProductIndex],
                                      outwardType: value
                                    }
                                    setOutwardForm({...outwardForm, items: newItems})
                                  }}
                                  required
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="offline_direct">Direct Offline</SelectItem>
                                    <SelectItem value="sample">Sample</SelectItem>
                                    <SelectItem value="return_replacement">Return/Replacement</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label>Unit Price (₹) - Optional</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={outwardForm.items[expandedProductIndex].unitPrice || ""}
                                  onChange={(e) => {
                                    const newItems = [...(outwardForm.items || [])]
                                    const price = parseFloat(e.target.value) || 0
                                    newItems[expandedProductIndex] = {
                                      ...newItems[expandedProductIndex],
                                      unitPrice: price,
                                      totalAmount: newItems[expandedProductIndex].quantity * price
                                    }
                                    setOutwardForm({...outwardForm, items: newItems})
                                  }}
                                  placeholder="0.00"
                                />
                              </div>
                              
                              {outwardForm.items[expandedProductIndex].quantity > 0 && outwardForm.items[expandedProductIndex].unitPrice > 0 && (
                                <div className="bg-green-50 border border-green-200 rounded p-2">
                                  <p className="text-xs text-green-800">
                                    Total: ₹{(outwardForm.items[expandedProductIndex].quantity * outwardForm.items[expandedProductIndex].unitPrice).toLocaleString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            /* Show Grid - Hide Expanded Form */
                            <>
                              {/* Product Grid (3 columns) - Show first 10 products */}
                              {(outwardForm.items || []).slice(0, 10).length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                  {(outwardForm.items || []).slice(0, 10).map((item, productIndex) => (
                                    <Button
                                      key={productIndex}
                                      type="button"
                                      variant="outline"
                                      onClick={() => setExpandedProductIndex(productIndex)}
                                      className="w-full h-20 flex flex-col items-center justify-center gap-1 border-2 border-dashed hover:border-solid hover:border-orange-500 transition-all"
                                    >
                                      <Package className="h-5 w-5 text-gray-400" />
                                      <span className="text-xs font-medium">
                                        {item.productName || `Product ${productIndex + 1}`}
                                      </span>
                                      {item.quantity > 0 && (
                                        <span className="text-xs text-gray-500">
                                          {item.quantity} units
                                        </span>
                                      )}
                                    </Button>
                                  ))}
                                </div>
                              )}
                              
                              <p className="text-xs text-muted-foreground">
                                Click on a product button to configure details. Each product can have different outward type (Direct, Sample, Return/Replacement).
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Page 2: Additional Products (10th onwards) */}
                  {outwardFormPage === 2 && (outwardForm.items || []).length > 10 && (
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <h3 className="font-semibold mb-4">Additional Products</h3>
                        
                        {expandedProductIndex !== null && expandedProductIndex >= 10 && outwardForm.items && outwardForm.items[expandedProductIndex] ? (
                          /* Show Expanded Form - Hide Grid */
                          <div className="border rounded-lg p-4 bg-white space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm">Product {expandedProductIndex + 1}</h4>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newItems = (outwardForm.items || []).filter((_, idx) => idx !== expandedProductIndex)
                                    setOutwardForm({...outwardForm, items: newItems})
                                    setExpandedProductIndex(null)
                                  }}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setExpandedProductIndex(null)}
                                  className="text-gray-600 hover:text-gray-700"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <Label>Select Product *</Label>
                              <Select
                                value={outwardForm.items[expandedProductIndex].productId}
                                onValueChange={(value) => {
                                  const stock = warehouseStock.find((ws: any) => ws.productId === value && ws.warehouseName === outwardForm.warehouseName)
                                  const newItems = [...(outwardForm.items || [])]
                                  newItems[expandedProductIndex] = {
                                    ...newItems[expandedProductIndex],
                                    productId: value,
                                    productName: stock?.productName || '',
                                    unitPrice: stock?.price || newItems[expandedProductIndex].unitPrice || 0
                                  }
                                  setOutwardForm({...outwardForm, items: newItems})
                                }}
                                required
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent>
                                  {warehouseStock
                                    .filter((ws: any) => ws.warehouseName === outwardForm.warehouseName && ws.availableStock > 0)
                                    .map((stock: any) => (
                                      <SelectItem key={stock.productId} value={stock.productId}>
                                        {stock.productName} (Available: {stock.availableStock})
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label>Quantity *</Label>
                              <Input
                                type="number"
                                min="1"
                                max={warehouseStock.find((ws: any) => ws.productId === outwardForm.items[expandedProductIndex].productId && ws.warehouseName === outwardForm.warehouseName)?.availableStock || 0}
                                value={outwardForm.items[expandedProductIndex].quantity || ""}
                                onChange={(e) => {
                                  const newItems = [...(outwardForm.items || [])]
                                  const qty = parseInt(e.target.value) || 0
                                  newItems[expandedProductIndex] = {
                                    ...newItems[expandedProductIndex],
                                    quantity: qty,
                                    totalAmount: qty * newItems[expandedProductIndex].unitPrice
                                  }
                                  setOutwardForm({...outwardForm, items: newItems})
                                }}
                                placeholder="0"
                                required
                              />
                            </div>
                            
                            <div>
                              <Label>Outward Type *</Label>
                              <Select
                                value={outwardForm.items[expandedProductIndex].outwardType}
                                onValueChange={(value: any) => {
                                  const newItems = [...(outwardForm.items || [])]
                                  newItems[expandedProductIndex] = {
                                    ...newItems[expandedProductIndex],
                                    outwardType: value
                                  }
                                  setOutwardForm({...outwardForm, items: newItems})
                                }}
                                required
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="offline_direct">Direct Offline</SelectItem>
                                  <SelectItem value="sample">Sample</SelectItem>
                                  <SelectItem value="return_replacement">Return/Replacement</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label>Unit Price (₹) - Optional</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={outwardForm.items[expandedProductIndex].unitPrice || ""}
                                onChange={(e) => {
                                  const newItems = [...(outwardForm.items || [])]
                                  const price = parseFloat(e.target.value) || 0
                                  newItems[expandedProductIndex] = {
                                    ...newItems[expandedProductIndex],
                                    unitPrice: price,
                                    totalAmount: newItems[expandedProductIndex].quantity * price
                                  }
                                  setOutwardForm({...outwardForm, items: newItems})
                                }}
                                placeholder="0.00"
                              />
                            </div>
                            
                            {outwardForm.items[expandedProductIndex].quantity > 0 && outwardForm.items[expandedProductIndex].unitPrice > 0 && (
                              <div className="bg-green-50 border border-green-200 rounded p-2">
                                <p className="text-xs text-green-800">
                                  Total: ₹{(outwardForm.items[expandedProductIndex].quantity * outwardForm.items[expandedProductIndex].unitPrice).toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Show Grid - Hide Expanded Form */
                          <>
                            {/* Add Product Dropdown Button */}
                            <div className="flex justify-end mb-4">
                              <Select
                                onValueChange={(value) => {
                                  const stock = warehouseStock.find((ws: any) => ws.productId === value && ws.warehouseName === outwardForm.warehouseName)
                                  if (stock) {
                                    const newItem = {
                                      productId: value,
                                      productName: stock.productName,
                                      quantity: 0,
                                      unitPrice: stock.price || 0,
                                      outwardType: "offline_direct" as const,
                                      totalAmount: 0
                                    }
                                    setOutwardForm({
                                      ...outwardForm,
                                      items: [...(outwardForm.items || []), newItem]
                                    })
                                    setExpandedProductIndex((outwardForm.items || []).length)
                                  }
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Add Product" />
                                </SelectTrigger>
                                <SelectContent>
                                  {warehouseStock
                                    .filter((ws: any) => ws.warehouseName === outwardForm.warehouseName && ws.availableStock > 0)
                                    .map((stock: any) => (
                                      <SelectItem key={stock.productId} value={stock.productId}>
                                        {stock.productName} (Available: {stock.availableStock})
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Product Grid (3 columns) - Show products from index 10 onwards */}
                            {(outwardForm.items || []).slice(10).length > 0 && (
                              <div className="grid grid-cols-3 gap-3">
                                {(outwardForm.items || []).slice(10).map((item, productIndex) => {
                                  const actualIndex = productIndex + 10
                                  return (
                                    <Button
                                      key={actualIndex}
                                      type="button"
                                      variant="outline"
                                      onClick={() => setExpandedProductIndex(actualIndex)}
                                      className="w-full h-20 flex flex-col items-center justify-center gap-1 border-2 border-dashed hover:border-solid hover:border-orange-500 transition-all"
                                    >
                                      <Package className="h-5 w-5 text-gray-400" />
                                      <span className="text-xs font-medium">
                                        {item.productName || `Product ${actualIndex + 1}`}
                                      </span>
                                      {item.quantity > 0 && (
                                        <span className="text-xs text-gray-500">
                                          {item.quantity} units
                                        </span>
                                      )}
                                    </Button>
                                  )
                                })}
                              </div>
                            )}
                            
                            {(outwardForm.items || []).slice(10).length === 0 && (
                              <p className="text-xs text-muted-foreground text-center py-4">
                                No additional products. Add products from Page 1.
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Page 2 or 3: Summary Table */}
                  {((outwardFormPage === 2 && (outwardForm.items || []).length <= 10) || (outwardFormPage === 3 && (outwardForm.items || []).length > 10)) && (outwardForm.items || []).length > 0 && (
                    <div className="space-y-6">
                      <div>
                        <Label>Products Summary - Outward Entry Details</Label>
                        <div className="border rounded-lg overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Outward Type</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead>Total Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(outwardForm.items || []).map((item, idx: number) => (
                                <TableRow key={idx}>
                                  <TableCell className="font-medium">{item.productName || 'Not selected'}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{item.quantity} units</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge 
                                      variant="outline"
                                      className={
                                        item.outwardType === 'offline_direct'
                                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                                          : item.outwardType === 'sample'
                                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                                          : 'bg-green-100 text-green-800 border-green-300'
                                      }
                                    >
                                      {item.outwardType === 'offline_direct' ? 'Direct' : item.outwardType === 'sample' ? 'Sample' : 'Return'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>₹{item.unitPrice.toLocaleString()}</TableCell>
                                  <TableCell className="font-semibold text-green-600">₹{item.totalAmount.toLocaleString()}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-2">
                          <p className="text-xs text-orange-800">
                            <strong>Summary:</strong> Total Products = {(outwardForm.items || []).length} products.
                            {' '}Total Quantity = {(outwardForm.items || []).reduce((sum, item) => sum + item.quantity, 0)} units.
                            {' '}Total Amount = ₹{(outwardForm.items || []).reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString()}.
                            {' '}Stock will be deducted from warehouse: {outwardForm.warehouseName}.
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label>Notes (Optional)</Label>
                        <Textarea
                          value={outwardForm.notes}
                          onChange={(e) => setOutwardForm({...outwardForm, notes: e.target.value})}
                          placeholder="Add any additional notes..."
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                </form>
              </div>

              {/* Footer with Pagination */}
              <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t bg-white">
                <div className="flex items-center gap-2">
                  {outwardFormPage > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOutwardFormPage(prev => prev - 1)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  <div className="flex items-center gap-1 px-3">
                    <span className="text-sm text-gray-600">
                      {(() => {
                        const totalPages = (outwardForm.items || []).length > 10 ? 3 : 2
                        return `Page ${outwardFormPage} of ${totalPages}`
                      })()}
                    </span>
                  </div>
                  {(() => {
                    const totalPages = (outwardForm.items || []).length > 10 ? 3 : 2
                    return outwardFormPage < totalPages
                  })() && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOutwardFormPage(prev => prev + 1)}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsOutwardDialogOpen(false)
                      setOutwardForm({
                        customerId: "",
                        customerName: "",
                        warehouseName: "Main Warehouse",
                        referenceNumber: "",
                        notes: "",
                        outwardDate: new Date().toISOString().split('T')[0],
                        items: []
                      })
                      setOutwardFormPage(1)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    form="outward-form"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    disabled={
                      !outwardForm.customerId ||
                      !outwardForm.items ||
                      outwardForm.items.length === 0 ||
                      outwardForm.items.some((item: any) => !item.productId || item.quantity <= 0)
                    }
                  >
                    Record Outward Entry
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Convert Sample to Sale Dialog */}
          {isConvertSampleDialogOpen && convertingOutward && (
            <>
              {/* Overlay */}
              <div
                data-overlay="convert-sample-view"
                className="fixed bg-black/60 backdrop-blur-sm z-[9998]"
                style={{
                  top: 0, left: 0, right: 0, width: '100%', position: 'fixed', minHeight: '100vh'
                }}
                onClick={() => {
                  setIsConvertSampleDialogOpen(false)
                  setConvertingOutward(null)
                  setConvertForm({ unitPrice: "", notes: "" })
                }}
              />

              {/* Content Container */}
              <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-8 pb-8 overflow-y-auto pointer-events-none">
                {/* Content Card */}
                <div className="relative z-10 w-full max-w-lg mx-4 bg-card rounded-lg shadow-2xl border pointer-events-auto">
                  {/* Header */}
                  <div className="sticky top-0 z-20 bg-card border-b px-6 py-4 rounded-t-lg flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Convert Sample to Sale</h2>
                      <p className="text-sm text-muted-foreground mt-1">Convert sample product to a sale and add to customer inventory</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsConvertSampleDialogOpen(false)
                        setConvertingOutward(null)
                        setConvertForm({ unitPrice: "", notes: "" })
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Form Content */}
                  <div className="p-6">
                    {/* Sample Info Display */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold text-purple-900 mb-2">Sample Details</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-purple-700">Customer:</span>
                          <span className="font-medium text-purple-900">{convertingOutward.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-700">Product:</span>
                          <span className="font-medium text-purple-900">{convertingOutward.productName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-700">Quantity:</span>
                          <span className="font-medium text-purple-900">{convertingOutward.quantity} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-700">Date Given:</span>
                          <span className="font-medium text-purple-900">
                            {new Date(convertingOutward.outwardDate || convertingOutward.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleConvertSampleToSale} className="space-y-4">
                      {/* Unit Price */}
                      <div>
                        <Label>Unit Price (₹) *</Label>
                        <Input
                          type="number"
                          value={convertForm.unitPrice}
                          onChange={(e) => setConvertForm({...convertForm, unitPrice: e.target.value})}
                          required
                          min="0"
                          step="0.01"
                          placeholder="Enter price per unit"
                        />
                        {convertForm.unitPrice && convertingOutward.quantity && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Total Amount: ₹{(parseFloat(convertForm.unitPrice) * convertingOutward.quantity).toLocaleString()}
                          </p>
                        )}
                      </div>

                      {/* Notes */}
                      <div>
                        <Label>Notes (Optional)</Label>
                        <Textarea
                          value={convertForm.notes}
                          onChange={(e) => setConvertForm({...convertForm, notes: e.target.value})}
                          placeholder="Add any notes about this conversion..."
                          rows={3}
                        />
                      </div>

                      {/* Info Message */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                          <strong>Note:</strong> This will convert the sample entry to a sale, update the outward type to "Direct Offline", 
                          and add the product to the customer's inventory ({convertingOutward.customerName}).
                        </p>
                      </div>

                      {/* Footer Buttons */}
                      <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsConvertSampleDialogOpen(false)
                            setConvertingOutward(null)
                            setConvertForm({ unitPrice: "", notes: "" })
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={!convertForm.unitPrice || parseFloat(convertForm.unitPrice) <= 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Convert to Sale
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* View Outward Entry Details Dialog */}
          <Dialog open={isViewOutwardDialogOpen} onOpenChange={(open) => {
            setIsViewOutwardDialogOpen(open)
            if (!open) {
              setViewingOutward(null)
              setRelatedOutwards([])
              setViewOutwardDialogPage(1)
            }
          }}>
            <DialogContent 
              className="p-0"
              style={{ 
                width: '90vw',
                maxWidth: '1400px',
                height: '90vh',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-white">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <ArrowRight className="h-6 w-6 text-orange-600" />
                  Outward Entry Details
                </DialogTitle>
                <DialogDescription>
                  Complete information about this outward entry
                </DialogDescription>
              </DialogHeader>
              
              {/* Scrollable Content - Internal Modal Scrollbar */}
              <div 
                className="px-6 py-4 bg-white grn-dialog-scroll"
                style={{ 
                  height: 'calc(90vh - 180px)',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {viewingOutward && (
                  <>
                    {/* Page 1 - Basic Information */}
                    {viewOutwardDialogPage === 1 && (
                      <div className="space-y-6">
                        {/* Top Section - Two Columns */}
                        <div className="grid grid-cols-2 gap-6">
                          {/* Left Column - Customer & Product Info */}
                          <div>
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                          <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <User className="h-4 w-4 text-orange-600" />
                            Customer Information
                          </h3>
                          <div className="space-y-2">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Customer Name</Label>
                              <p className="text-sm font-semibold text-gray-900 mt-0.5">{viewingOutward.customerName}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Customer ID</Label>
                              <p className="text-sm text-gray-700 mt-0.5 font-mono text-xs">{viewingOutward.customerId || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                          {/* Right Column - Product Info */}
                          <div>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                          <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-600" />
                            Product Information
                          </h3>
                          <div className="space-y-2">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Product Name</Label>
                              <p className="text-sm font-semibold text-gray-900 mt-0.5">{viewingOutward.productName}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Product ID</Label>
                              <p className="text-sm text-gray-700 mt-0.5 font-mono text-xs">{viewingOutward.productId || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                        {/* Middle Section - Transaction Details */}
                        <div className="grid grid-cols-2 gap-6">
                          {/* Left Column - Transaction Info */}
                          <div>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                          <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-green-600" />
                            Transaction Details
                          </h3>
                          <div className="space-y-2">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Outward Date</Label>
                              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                                {new Date(viewingOutward.outwardDate || viewingOutward.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Quantity</Label>
                              <p className="text-2xl font-bold text-green-700 mt-1">{viewingOutward.quantity}</p>
                              <p className="text-xs text-gray-500 mt-1">units</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Outward Type</Label>
                              <div className="mt-1">
                                <Badge 
                                  variant="outline"
                                  className={
                                    viewingOutward.outwardType === 'offline_direct'
                                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                                      : viewingOutward.outwardType === 'sample'
                                      ? 'bg-purple-100 text-purple-800 border-purple-300'
                                      : 'bg-green-100 text-green-800 border-green-300'
                                  }
                                >
                                  {viewingOutward.outwardType === 'offline_direct' ? 'Direct Offline' : viewingOutward.outwardType === 'sample' ? 'Sample' : 'Return/Replacement'}
                                </Badge>
                                {viewingOutward.convertedToSale && (
                                  <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300">
                                    Converted to Sale
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {viewingOutward.convertedAt && (
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Converted At</Label>
                                <p className="text-sm text-gray-700 mt-0.5">
                                  {new Date(viewingOutward.convertedAt).toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                          {/* Right Column - Warehouse & Financial Info */}
                          <div>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                          <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-purple-600" />
                            Warehouse & Financial
                          </h3>
                          <div className="space-y-2">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Warehouse</Label>
                              <p className="text-sm font-semibold text-gray-900 mt-0.5">{viewingOutward.warehouseName || 'Main Warehouse'}</p>
                            </div>
                            {viewingOutward.unitPrice > 0 && (
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Unit Price</Label>
                                <p className="text-lg font-bold text-purple-700 mt-1">₹{viewingOutward.unitPrice.toLocaleString()}</p>
                              </div>
                            )}
                            {viewingOutward.totalAmount > 0 && (
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Total Amount</Label>
                                <p className="text-2xl font-bold text-green-700 mt-1">₹{viewingOutward.totalAmount.toLocaleString()}</p>
                              </div>
                            )}
                            {viewingOutward.referenceNumber && (
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Reference Number</Label>
                                <p className="text-sm text-gray-700 mt-0.5 font-mono">{viewingOutward.referenceNumber}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                        {/* Multiple Products Indicator */}
                        {relatedOutwards.length > 1 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-blue-800">
                              <Package className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="text-sm font-semibold">
                                  This batch contains {relatedOutwards.length} products
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                  Go to Page 2 to view all products in this batch
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Page 2 - Shows All Products if multiple, or Additional Info if single */}
                    {viewOutwardDialogPage === 2 && (
                      <>
                        {/* If multiple products, show all products list */}
                        {relatedOutwards.length > 1 ? (
                          <div className="space-y-6">
                            <div>
                              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200 mb-4">
                                <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                  <Package className="h-4 w-4 text-orange-600" />
                                  Batch Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Reference Number</Label>
                                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{viewingOutward.referenceNumber}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Total Products</Label>
                                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{relatedOutwards.length} products</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Total Quantity</Label>
                                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                                      {relatedOutwards.reduce((sum, item) => sum + (item.quantity || 0), 0)} units
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Total Amount</Label>
                                    <p className="text-sm font-semibold text-green-700 mt-0.5">
                                      ₹{relatedOutwards.reduce((sum, item) => sum + (item.totalAmount || 0), 0).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Products Table */}
                            <div>
                              <div className="bg-white rounded-lg border border-gray-200">
                                <div className="p-3 border-b bg-gray-50">
                                  <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                    <Package className="h-4 w-4 text-blue-600" />
                                    All Products in This Batch
                                  </h3>
                                </div>
                                <div className="p-3">
                                  <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                      <TableHeader>
                                        <TableRow style={{ backgroundColor: '#1e2961' }}>
                                          <TableHead style={{ color: '#ffffff' }}>Product Name</TableHead>
                                          <TableHead style={{ color: '#ffffff' }}>Product ID</TableHead>
                                          <TableHead style={{ color: '#ffffff' }}>Quantity</TableHead>
                                          <TableHead style={{ color: '#ffffff' }}>Unit Price</TableHead>
                                          <TableHead style={{ color: '#ffffff' }}>Total Amount</TableHead>
                                          <TableHead style={{ color: '#ffffff' }}>Warehouse</TableHead>
                                          <TableHead style={{ color: '#ffffff' }}>Type</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {relatedOutwards.map((item: any, index: number) => (
                                          <TableRow 
                                            key={item._id || index}
                                            className={item._id === viewingOutward._id ? 'bg-orange-50' : ''}
                                          >
                                            <TableCell className="font-semibold">
                                              <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-orange-500" />
                                                {item.productName}
                                                {item._id === viewingOutward._id && (
                                                  <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 text-xs">
                                                    Current
                                                  </Badge>
                                                )}
                                              </div>
                                            </TableCell>
                                            <TableCell>
                                              <p className="text-sm text-gray-600 font-mono text-xs">{item.productId}</p>
                                            </TableCell>
                                            <TableCell>
                                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                {item.quantity} units
                                              </Badge>
                                            </TableCell>
                                            <TableCell>
                                              {item.unitPrice > 0 ? (
                                                <span className="text-sm font-semibold text-gray-700">₹{item.unitPrice.toLocaleString()}</span>
                                              ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              {item.totalAmount > 0 ? (
                                                <span className="font-semibold text-green-600">₹{item.totalAmount.toLocaleString()}</span>
                                              ) : (
                                                <span className="text-gray-400">-</span>
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                                {item.warehouseName || 'Main Warehouse'}
                                              </Badge>
                                            </TableCell>
                                            <TableCell>
                                              <Badge 
                                                variant="outline"
                                                className={
                                                  item.outwardType === 'offline_direct'
                                                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                                                    : item.outwardType === 'sample'
                                                    ? 'bg-purple-100 text-purple-800 border-purple-300'
                                                    : 'bg-green-100 text-green-800 border-green-300'
                                                }
                                              >
                                                {item.outwardType === 'offline_direct' ? 'Direct' : item.outwardType === 'sample' ? 'Sample' : 'Return/Replacement'}
                                              </Badge>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* If single product, show Additional Information on Page 2 */
                          <div className="space-y-6">
                            {/* Additional Information Section */}
                            <div>
                              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
                                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-600" />
                                  Additional Information
                                </h3>
                                <div className="space-y-3">
                                  {viewingOutward.notes ? (
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">Notes</Label>
                                      <div className="mt-1 p-3 bg-white rounded border border-gray-200">
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewingOutward.notes}</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">Notes</Label>
                                      <p className="text-sm text-gray-500 mt-1 italic">No notes available</p>
                                    </div>
                                  )}
                                  {viewingOutward.referenceNumber && (
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">Reference Number</Label>
                                      <p className="text-sm text-gray-700 mt-0.5 font-mono bg-white p-2 rounded border border-gray-200">
                                        {viewingOutward.referenceNumber}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Audit Trail Section */}
                            <div>
                              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
                                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-indigo-600" />
                                  Audit Trail
                                </h3>
                                <div className="space-y-3">
                                  {viewingOutward.recordedBy && (
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">Recorded By</Label>
                                      <p className="text-sm text-gray-700 mt-0.5 flex items-center gap-2">
                                        <UserCircle className="h-4 w-4 text-indigo-500" />
                                        {viewingOutward.recordedBy}
                                      </p>
                                    </div>
                                  )}
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Entry Created</Label>
                                    <p className="text-sm text-gray-700 mt-0.5 flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-indigo-500" />
                                      {new Date(viewingOutward.createdAt).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                  {viewingOutward.updatedAt && viewingOutward.updatedAt !== viewingOutward.createdAt && (
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                                      <p className="text-sm text-gray-700 mt-0.5 flex items-center gap-2">
                                        <RefreshCw className="h-4 w-4 text-indigo-500" />
                                        {new Date(viewingOutward.updatedAt).toLocaleString('en-US', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </p>
                                    </div>
                                  )}
                                  {viewingOutward.convertedAt && (
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">Converted to Sale</Label>
                                      <p className="text-sm text-gray-700 mt-0.5 flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        {new Date(viewingOutward.convertedAt).toLocaleString('en-US', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Conversion History (if converted) */}
                            {viewingOutward.convertedToSale && (
                              <div>
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                                  <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <ShoppingCart className="h-4 w-4 text-green-600" />
                                    Conversion Information
                                  </h3>
                                  <div className="space-y-2">
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">Original Type</Label>
                                      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 mt-1">
                                        Sample
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">Current Type</Label>
                                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 mt-1">
                                        Direct Offline
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">Status</Label>
                                      <p className="text-sm text-green-700 font-semibold mt-1">
                                        ✓ Successfully converted and added to customer inventory
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {/* Page 3 - Additional Information & History (only when multiple products) */}
                    {viewOutwardDialogPage === 3 && relatedOutwards.length > 1 && (
                      <div className="space-y-6">
                        {/* Additional Information Section */}
                        <div>
                          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
                            <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-600" />
                              Additional Information
                            </h3>
                            <div className="space-y-3">
                              {viewingOutward.notes ? (
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Notes</Label>
                                  <div className="mt-1 p-3 bg-white rounded border border-gray-200">
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewingOutward.notes}</p>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Notes</Label>
                                  <p className="text-sm text-gray-500 mt-1 italic">No notes available</p>
                                </div>
                              )}
                              {viewingOutward.referenceNumber && (
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Reference Number</Label>
                                  <p className="text-sm text-gray-700 mt-0.5 font-mono bg-white p-2 rounded border border-gray-200">
                                    {viewingOutward.referenceNumber}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Audit Trail Section */}
                        <div>
                          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
                            <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <Clock className="h-4 w-4 text-indigo-600" />
                              Audit Trail
                            </h3>
                            <div className="space-y-3">
                              {viewingOutward.recordedBy && (
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Recorded By</Label>
                                  <p className="text-sm text-gray-700 mt-0.5 flex items-center gap-2">
                                    <UserCircle className="h-4 w-4 text-indigo-500" />
                                    {viewingOutward.recordedBy}
                                  </p>
                                </div>
                              )}
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Entry Created</Label>
                                <p className="text-sm text-gray-700 mt-0.5 flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-indigo-500" />
                                  {new Date(viewingOutward.createdAt).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              {viewingOutward.updatedAt && viewingOutward.updatedAt !== viewingOutward.createdAt && (
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                                  <p className="text-sm text-gray-700 mt-0.5 flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4 text-indigo-500" />
                                    {new Date(viewingOutward.updatedAt).toLocaleString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              )}
                              {viewingOutward.convertedAt && (
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Converted to Sale</Label>
                                  <p className="text-sm text-gray-700 mt-0.5 flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    {new Date(viewingOutward.convertedAt).toLocaleString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Conversion History (if converted) */}
                        {viewingOutward.convertedToSale && (
                          <div>
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4 text-green-600" />
                                Conversion Information
                              </h3>
                              <div className="space-y-2">
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Original Type</Label>
                                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 mt-1">
                                    Sample
                                  </Badge>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Current Type</Label>
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 mt-1">
                                    Direct Offline
                                  </Badge>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                                  <p className="text-sm text-green-700 font-semibold mt-1">
                                    ✓ Successfully converted and added to customer inventory
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer with Pagination */}
              <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t bg-white">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewOutwardDialogPage(prev => Math.max(1, prev - 1))}
                    disabled={viewOutwardDialogPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1 px-3">
                    <span className="text-sm text-gray-600">
                      Page {viewOutwardDialogPage} of {relatedOutwards.length > 1 ? 3 : 2}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewOutwardDialogPage(prev => {
                      const maxPage = relatedOutwards.length > 1 ? 3 : 2
                      return Math.min(maxPage, prev + 1)
                    })}
                    disabled={viewOutwardDialogPage === (relatedOutwards.length > 1 ? 3 : 2)}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsViewOutwardDialogOpen(false)
                    setViewingOutward(null)
                    setRelatedOutwards([])
                    setViewOutwardDialogPage(1)
                  }}
                  className="px-6"
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* View Warehouse Stock Details Dialog */}
          <Dialog open={isViewStockDialogOpen} onOpenChange={(open) => {
            setIsViewStockDialogOpen(open)
            if (!open) {
              setViewStockDialogPage(1)
            }
          }}>
            <DialogContent 
              className="p-0"
              style={{ 
                width: '90vw',
                maxWidth: '1400px',
                height: '90vh',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-white">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Package className="h-6 w-6 text-blue-600" />
                  Product Details - {viewingStock?.productName}
                </DialogTitle>
                <DialogDescription>
                  Complete information about this warehouse stock entry
                </DialogDescription>
              </DialogHeader>
              
              {/* Scrollable Content - Internal Modal Scrollbar */}
              <div 
                className="px-6 py-4 bg-white grn-dialog-scroll"
                style={{ 
                  height: 'calc(90vh - 180px)',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {viewingStock && (
                  <>
                    {/* Page 1 */}
                    {viewStockDialogPage === 1 && (
                      <div className="space-y-4">
                        {/* Top Section - Two Columns */}
                        <div className="grid grid-cols-2 gap-6">
                          {/* Left Column - Basic Information */}
                          <div>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <Package className="h-4 w-4 text-blue-600" />
                                Basic Information
                              </h3>
                              <div className="space-y-2">
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Product Name</Label>
                                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{viewingStock.productName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Product ID</Label>
                                  <p className="text-sm text-gray-700 mt-0.5 font-mono text-xs">{viewingStock.productId || 'N/A'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Warehouse Name</Label>
                                    <p className="text-sm text-gray-700 mt-0.5">{viewingStock.warehouseName || 'Main Warehouse'}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                                    <div className="mt-0.5">
                                      <Badge 
                                        variant={viewingStock.status === 'IN_WAREHOUSE' ? 'default' : 'secondary'}
                                        className="text-xs"
                                      >
                                        {viewingStock.status || 'IN_WAREHOUSE'}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column - Stock Quantities */}
                          <div>
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                Stock Quantities
                              </h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Available Stock</Label>
                                  <p className="text-2xl font-bold text-green-700 mt-1">{viewingStock.availableStock || 0}</p>
                                  <p className="text-xs text-gray-500 mt-1">units</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Website Stock</Label>
                                  <p className="text-2xl font-bold text-blue-700 mt-1">{viewingStock.adminStock || 0}</p>
                                  <p className="text-xs text-gray-500 mt-1">units</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Total Received</Label>
                                  <p className="text-2xl font-bold text-purple-700 mt-1">{viewingStock.totalReceivedFromSupplier || 0}</p>
                                  <p className="text-xs text-gray-500 mt-1">from supplier</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Difference</Label>
                                  <p className={`text-2xl font-bold mt-1 ${
                                    ((viewingStock.adminStock || 0) - viewingStock.availableStock) > 0 
                                      ? 'text-yellow-700' 
                                      : ((viewingStock.adminStock || 0) - viewingStock.availableStock) < 0
                                      ? 'text-blue-700'
                                      : 'text-gray-700'
                                  }`}>
                                    {(viewingStock.adminStock || 0) - viewingStock.availableStock}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">units</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Section - Recent Receipts */}
                        <div className="bg-white rounded-lg border border-gray-200">
                          <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              Recent Receipts
                            </h3>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                setIsViewStockDialogOpen(false)
                                setIsGRNTypeDialogOpen(true)
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Create GRN
                            </Button>
                          </div>
                          <div className="p-3">
                            <div className="border rounded-lg overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow style={{ backgroundColor: '#1e2961' }}>
                                    <TableHead style={{ color: '#ffffff' }}>Total Received</TableHead>
                                    <TableHead style={{ color: '#ffffff' }}>Last Received</TableHead>
                                    <TableHead style={{ color: '#ffffff' }}>Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {(() => {
                                    // Fetch GRNs for this product - for now showing sample data
                                    // TODO: Fetch actual GRN data for this product
                                    const sampleReceipts = [
                                      { totalReceived: viewingStock.totalReceivedFromSupplier || 0, lastReceived: viewingStock.lastReceivedDate, grnNumber: viewingStock.grnBatchId }
                                    ].filter(r => r.totalReceived > 0)
                                    
                                    if (sampleReceipts.length === 0) {
                                      return (
                                        <TableRow>
                                          <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                            No receipts found
                                          </TableCell>
                                        </TableRow>
                                      )
                                    }
                                    
                                    return sampleReceipts.map((receipt, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell>
                                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                            {receipt.totalReceived}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 text-blue-500" />
                                            {receipt.lastReceived 
                                              ? new Date(receipt.lastReceived).toLocaleDateString('en-US', {
                                                  year: 'numeric',
                                                  month: 'numeric',
                                                  day: 'numeric'
                                                })
                                              : 'N/A'}
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => {
                                                // TODO: Implement view GRN details
                                                alert('View GRN details')
                                              }}
                                              className="hover:bg-blue-50 hover:text-blue-600"
                                            >
                                              <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => {
                                                // TODO: Implement edit GRN
                                                alert('Edit GRN')
                                              }}
                                              className="hover:bg-green-50 hover:text-green-600"
                                            >
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => {
                                                // TODO: Implement delete GRN
                                                if (confirm('Are you sure you want to delete this receipt?')) {
                                                  alert('Delete GRN')
                                                }
                                              }}
                                              className="hover:bg-red-50 hover:text-red-600"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  })()}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Page 2 */}
                    {viewStockDialogPage === 2 && (
                      <div className="space-y-4">
                        {/* Top Section - Two Columns */}
                        <div className="grid grid-cols-2 gap-6">
                          {/* Left Column - GRN Batch Information */}
                          <div>
                            {viewingStock.grnBatchId ? (
                              <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg p-4 border border-cyan-200">
                                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-cyan-600" />
                                  GRN Batch Information
                                </h3>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">GRN Batch ID</Label>
                                  <p className="text-sm text-gray-700 mt-0.5 font-mono text-xs">{viewingStock.grnBatchId}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg p-4 border border-cyan-200">
                                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-cyan-600" />
                                  GRN Batch Information
                                </h3>
                                <p className="text-sm text-gray-500">No GRN Batch ID available</p>
                              </div>
                            )}
                          </div>

                          {/* Right Column - Supplier Information */}
                          <div>
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <User className="h-4 w-4 text-purple-600" />
                                Supplier Information
                              </h3>
                              <div className="space-y-2">
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Last Supplier</Label>
                                  <p className="text-sm text-gray-700 mt-0.5 flex items-center gap-2">
                                    <User className="h-3 w-3 text-indigo-500" />
                                    {viewingStock.lastSupplier || 'Not specified'}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Date of Arrival</Label>
                                  <p className="text-sm text-gray-700 mt-0.5 flex items-center gap-2">
                                    <Calendar className="h-3 w-3 text-blue-500" />
                                    {viewingStock.lastReceivedDate 
                                      ? new Date(viewingStock.lastReceivedDate).toLocaleDateString('en-US', { 
                                          year: 'numeric', 
                                          month: 'long', 
                                          day: 'numeric' 
                                        })
                                      : 'Not available'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Section - Timestamps */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            Timestamps
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Created At</Label>
                              <p className="text-sm text-gray-700 mt-0.5">
                                {viewingStock.createdAt 
                                  ? new Date(viewingStock.createdAt).toLocaleString('en-US', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  : 'Not available'}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                              <p className="text-sm text-gray-700 mt-0.5">
                                {viewingStock.updatedAt 
                                  ? new Date(viewingStock.updatedAt).toLocaleString('en-US', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  : 'Not available'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer with Pagination */}
              <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t bg-white">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewStockDialogPage(1)}
                    disabled={viewStockDialogPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1 px-3">
                    <span className="text-sm text-gray-600">Page {viewStockDialogPage} of 2</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewStockDialogPage(2)}
                    disabled={viewStockDialogPage === 2}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewStockDialogOpen(false)}
                  className="px-6"
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Inward Type Selection Dialog */}
          <Dialog open={isInwardTypeDialogOpen} onOpenChange={setIsInwardTypeDialogOpen}>
            <DialogContent 
              className="p-0"
              style={{ 
                width: '90vw',
                maxWidth: '1400px',
                height: '90vh',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-white">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Package className="h-6 w-6 text-blue-600" />
                  Receive Goods - Select Inward Type
                </DialogTitle>
                <DialogDescription>
                  Choose how you want to receive goods
                </DialogDescription>
              </DialogHeader>
              
              {/* Scrollable Content - Internal Modal Scrollbar */}
              <div 
                className="px-6 py-4 bg-white grn-dialog-scroll"
                style={{ 
                  height: 'calc(90vh - 180px)',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <div className="space-y-4">
                  <Button
                    className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      setIsDirectInward(false)
                      setIsInwardTypeDialogOpen(false)
                      setIsInwardDialogOpen(true)
                      setInwardFormPage(1)
                    }}
                  >
                    <FileText className="h-6 w-6" />
                    <span>Link to Purchase Order</span>
                  </Button>
                  <Button
                    className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      setIsDirectInward(true)
                      setInwardForm({
                        poNumber: "",
                        inwardType: "DIRECT_INWARD",
                        supplierName: "",
                        receivedDate: new Date().toISOString().split('T')[0],
                        items: [{
                          productId: "",
                          productName: "",
                          orderedQuantity: 0,
                          receivedQuantity: 0,
                          damagedQuantity: 0,
                          lostQuantity: 0,
                          acceptedQuantity: 0,
                          unitPrice: 0
                        }],
                        notes: ""
                      })
                      setIsInwardTypeDialogOpen(false)
                      setIsInwardDialogOpen(true)
                      setInwardFormPage(1)
                    }}
                  >
                    <Package className="h-6 w-6" />
                    <span>Direct Inward (No PO)</span>
                  </Button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 flex items-center justify-end px-6 py-4 border-t bg-white">
                <Button 
                  variant="outline" 
                  onClick={() => setIsInwardTypeDialogOpen(false)}
                  className="px-6"
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Inward Entry Dialog */}
          <Dialog open={isInwardDialogOpen} onOpenChange={setIsInwardDialogOpen}>
            <DialogContent 
              className="p-0"
              style={{ 
                width: '90vw',
                maxWidth: '1400px',
                height: '90vh',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-white">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Package className="h-6 w-6 text-blue-600" />
                  Receive Goods - Create Inward Entry
                </DialogTitle>
                <DialogDescription>
                  {isDirectInward ? 'Record goods received directly from supplier. Stock will be added to warehouse only after generating GRN.' : 'Record goods received from purchase order. Stock will be added to warehouse only after generating GRN.'}
                </DialogDescription>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This form only records the receipt of goods. Stock will NOT be added to warehouse until you generate a GRN from this inward entry. Only accepted goods (Received - Damaged - Lost) will be added to warehouse.
                  </p>
                </div>
              </DialogHeader>
              
              {/* Scrollable Content - Internal Modal Scrollbar */}
              <div 
                className="px-6 py-4 bg-white grn-dialog-scroll"
                style={{ 
                  height: 'calc(90vh - 180px)',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <form onSubmit={handleInwardSubmit} className="space-y-6" id="inward-form">
                {!isDirectInward ? (
                  <div className="grid grid-cols-10 gap-4">
                    {/* Left Side - 40% (4 columns) */}
                    <div className="col-span-4 space-y-4">
                      <div>
                        <Label>Select Purchase Order</Label>
                        <Select
                          value={inwardForm.poNumber}
                          onValueChange={(value) => {
                            const po = purchaseOrders.find((p: any) => p.poNumber === value)
                            setSelectedPO(po)
                            setInwardForm({
                              ...inwardForm,
                              poNumber: value,
                              items: po?.items.map((item: any) => ({
                                productId: item.productId,
                                productName: item.productName,
                                orderedQuantity: item.quantity,
                                receivedQuantity: 0,
                                damagedQuantity: 0,
                                lostQuantity: 0,
                                acceptedQuantity: 0,
                                unitPrice: item.unitPrice || 0
                              })) || []
                            })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select PO" />
                          </SelectTrigger>
                          <SelectContent>
                            {purchaseOrders
                              .filter((po: any) => po.deliveryType === 'to_warehouse' && (po.status === 'pending' || po.status === 'PO_PARTIALLY_RECEIVED'))
                              .map((po: any) => (
                                <SelectItem key={po._id} value={po.poNumber}>
                                  {po.poNumber} - {po.supplierName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Received Date</Label>
                        <Input
                          type="date"
                          value={inwardForm.receivedDate}
                          onChange={(e) => setInwardForm({...inwardForm, receivedDate: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label>Notes (Optional)</Label>
                        <Textarea
                          value={inwardForm.notes}
                          onChange={(e) => setInwardForm({...inwardForm, notes: e.target.value})}
                          placeholder="Add any additional notes..."
                          rows={6}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Note: Accepted Qty = Received Qty - Damaged Qty - Lost Qty. Only Accepted Quantity will be added to warehouse stock when GRN is generated.
                        </p>
                      </div>
                    </div>

                    {/* Right Side - 60% (6 columns) */}
                    <div className="col-span-6">
                      {/* Items Table for PO Linked */}
                      {selectedPO && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <Label>Items - Record Received, Damaged, and Lost Quantities</Label>
                              <p className="text-xs text-muted-foreground mt-1">
                                Record what was received. Only Accepted Quantity will be added to warehouse when GRN is generated.
                              </p>
                            </div>
                          </div>
                          <div className="border rounded-lg overflow-x-auto">
                            <Table className="w-full table-fixed">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[25%] text-xs">Product</TableHead>
                                  <TableHead className="w-[12%] text-xs">Ordered</TableHead>
                                  <TableHead className="w-[12%] text-xs">Received</TableHead>
                                  <TableHead className="w-[12%] text-xs">Damaged</TableHead>
                                  <TableHead className="w-[12%] text-xs">Lost</TableHead>
                                  <TableHead className="w-[12%] text-xs">Unit Cost</TableHead>
                                  <TableHead className="w-[12%] text-xs">Accepted</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {inwardForm.items.map((item, index) => {
                                  const acceptedQty = item.receivedQuantity - (item.damagedQuantity || 0) - (item.lostQuantity || 0)
                                  return (
                                    <TableRow key={index}>
                                      <TableCell className="w-[25%]">
                                        <p className="text-sm font-medium">{item.productName}</p>
                                      </TableCell>
                                      <TableCell className="w-[12%]">
                                        <Badge variant="outline">{item.orderedQuantity}</Badge>
                                      </TableCell>
                                      <TableCell className="w-[12%]">
                                        <Input
                                          type="number"
                                          min="0"
                                          value={item.receivedQuantity}
                                          onChange={(e) => {
                                            const newItems = [...inwardForm.items]
                                            newItems[index].receivedQuantity = parseInt(e.target.value) || 0
                                            newItems[index].acceptedQuantity = newItems[index].receivedQuantity - (newItems[index].damagedQuantity || 0) - (newItems[index].lostQuantity || 0)
                                            setInwardForm({...inwardForm, items: newItems})
                                          }}
                                          className="w-full"
                                        />
                                      </TableCell>
                                      <TableCell className="w-[12%]">
                                        <Input
                                          type="number"
                                          min="0"
                                          max={item.receivedQuantity}
                                          value={item.damagedQuantity || 0}
                                          onChange={(e) => {
                                            const newItems = [...inwardForm.items]
                                            newItems[index].damagedQuantity = parseInt(e.target.value) || 0
                                            newItems[index].acceptedQuantity = newItems[index].receivedQuantity - newItems[index].damagedQuantity - (newItems[index].lostQuantity || 0)
                                            setInwardForm({...inwardForm, items: newItems})
                                          }}
                                          className="w-full"
                                          placeholder="0"
                                        />
                                      </TableCell>
                                      <TableCell className="w-[12%]">
                                        <Input
                                          type="number"
                                          min="0"
                                          max={item.receivedQuantity}
                                          value={item.lostQuantity || 0}
                                          onChange={(e) => {
                                            const newItems = [...inwardForm.items]
                                            newItems[index].lostQuantity = parseInt(e.target.value) || 0
                                            newItems[index].acceptedQuantity = newItems[index].receivedQuantity - (newItems[index].damagedQuantity || 0) - newItems[index].lostQuantity
                                            setInwardForm({...inwardForm, items: newItems})
                                          }}
                                          className="w-full"
                                          placeholder="0"
                                        />
                                      </TableCell>
                                      <TableCell className="w-[12%]">
                                        <Input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          value={item.unitPrice || 0}
                                          onChange={(e) => {
                                            const newItems = [...inwardForm.items]
                                            newItems[index].unitPrice = parseFloat(e.target.value) || 0
                                            setInwardForm({...inwardForm, items: newItems})
                                          }}
                                          className="w-full"
                                          placeholder="0.00"
                                        />
                                      </TableCell>
                                      <TableCell className="w-[12%]">
                                        <Badge variant={acceptedQty > 0 ? "default" : "destructive"} className="text-xs">
                                          {acceptedQty}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  )
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Direct Inward Form */
                  <div className="grid grid-cols-10 gap-4">
                    {/* Left Side - 40% (4 columns) */}
                    <div className="col-span-4 space-y-4">
                      <div>
                        <Label>Supplier Name *</Label>
                        <Input
                          value={inwardForm.supplierName}
                          onChange={(e) => setInwardForm({...inwardForm, supplierName: e.target.value})}
                          placeholder="Enter supplier name"
                          required
                        />
                      </div>
                      <div>
                        <Label>Received Date</Label>
                        <Input
                          type="date"
                          value={inwardForm.receivedDate}
                          onChange={(e) => setInwardForm({...inwardForm, receivedDate: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label>Notes (Optional)</Label>
                        <Textarea
                          value={inwardForm.notes}
                          onChange={(e) => setInwardForm({...inwardForm, notes: e.target.value})}
                          placeholder="Add any additional notes..."
                          rows={6}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Note: Accepted Qty = Received Qty - Damaged Qty - Lost Qty. Only Accepted Quantity will be added to warehouse stock when GRN is generated.
                        </p>
                      </div>
                    </div>

                    {/* Right Side - 60% (6 columns) */}
                    <div className="col-span-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <Label>Items - Record Received, Damaged, and Lost Quantities</Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Record what was received. Only Accepted Quantity will be added to warehouse when GRN is generated.
                            </p>
                          </div>
                          {inwardFormPage === 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setInwardForm({
                                  ...inwardForm,
                                  items: [...inwardForm.items, {
                                    productId: "",
                                    productName: "",
                                    orderedQuantity: 0,
                                    receivedQuantity: 0,
                                    damagedQuantity: 0,
                                    lostQuantity: 0,
                                    acceptedQuantity: 0,
                                    unitPrice: 0
                                  }]
                                })
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Item
                            </Button>
                          )}
                        </div>
                        <div className="border rounded-lg overflow-x-auto">
                          <Table className="w-full table-fixed">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[25%] text-xs">Product</TableHead>
                                <TableHead className="w-[12%] text-xs">Received</TableHead>
                                <TableHead className="w-[12%] text-xs">Damaged</TableHead>
                                <TableHead className="w-[12%] text-xs">Lost</TableHead>
                                <TableHead className="w-[12%] text-xs">Unit Cost</TableHead>
                                <TableHead className="w-[12%] text-xs">Accepted</TableHead>
                                <TableHead className="w-[15%] text-xs">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {inwardForm.items.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={7} className="text-center py-8">
                                    Click "Add Item" to add products
                                  </TableCell>
                                </TableRow>
                              ) : (
                                (() => {
                                  const itemsPerPage = 4
                                  const startIndex = (inwardFormPage - 1) * itemsPerPage
                                  const endIndex = startIndex + itemsPerPage
                                  const paginatedItems = inwardForm.items.slice(startIndex, endIndex)
                                  
                                  return paginatedItems.map((item, relativeIndex) => {
                                    const index = startIndex + relativeIndex
                                  const acceptedQty = item.receivedQuantity - (item.damagedQuantity || 0) - (item.lostQuantity || 0)
                                  return (
                                    <TableRow key={index}>
                                      <TableCell className="w-[25%]">
                                        <Select
                                          value={item.productId}
                                          onValueChange={(value) => {
                                            const product = products.find((p: any) => p._id === value)
                                            const newItems = [...inwardForm.items]
                                            newItems[index] = {
                                              ...newItems[index],
                                              productId: value,
                                              productName: product?.name || '',
                                              unitPrice: product?.price || newItems[index].unitPrice || 0
                                            }
                                            setInwardForm({...inwardForm, items: newItems})
                                          }}
                                        >
                                          <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select product" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {products.map((p: any) => (
                                              <SelectItem key={p._id} value={p._id}>
                                                {p.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </TableCell>
                                      <TableCell className="w-[12%]">
                                        <Input
                                          type="number"
                                          min="0"
                                          value={item.receivedQuantity}
                                          onChange={(e) => {
                                            const newItems = [...inwardForm.items]
                                            newItems[index].receivedQuantity = parseInt(e.target.value) || 0
                                            newItems[index].acceptedQuantity = newItems[index].receivedQuantity - (newItems[index].damagedQuantity || 0) - (newItems[index].lostQuantity || 0)
                                            setInwardForm({...inwardForm, items: newItems})
                                          }}
                                          className="w-full"
                                        />
                                      </TableCell>
                                      <TableCell className="w-[12%]">
                                        <Input
                                          type="number"
                                          min="0"
                                          max={item.receivedQuantity}
                                          value={item.damagedQuantity || 0}
                                          onChange={(e) => {
                                            const newItems = [...inwardForm.items]
                                            newItems[index].damagedQuantity = parseInt(e.target.value) || 0
                                            newItems[index].acceptedQuantity = newItems[index].receivedQuantity - newItems[index].damagedQuantity - (newItems[index].lostQuantity || 0)
                                            setInwardForm({...inwardForm, items: newItems})
                                          }}
                                          className="w-full"
                                          placeholder="0"
                                        />
                                      </TableCell>
                                      <TableCell className="w-[12%]">
                                        <Input
                                          type="number"
                                          min="0"
                                          max={item.receivedQuantity}
                                          value={item.lostQuantity || 0}
                                          onChange={(e) => {
                                            const newItems = [...inwardForm.items]
                                            newItems[index].lostQuantity = parseInt(e.target.value) || 0
                                            newItems[index].acceptedQuantity = newItems[index].receivedQuantity - (newItems[index].damagedQuantity || 0) - newItems[index].lostQuantity
                                            setInwardForm({...inwardForm, items: newItems})
                                          }}
                                          className="w-full"
                                          placeholder="0"
                                        />
                                      </TableCell>
                                      <TableCell className="w-[12%]">
                                        <Input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          value={item.unitPrice || 0}
                                          onChange={(e) => {
                                            const newItems = [...inwardForm.items]
                                            newItems[index].unitPrice = parseFloat(e.target.value) || 0
                                            setInwardForm({...inwardForm, items: newItems})
                                          }}
                                          className="w-full"
                                          placeholder="0.00"
                                        />
                                      </TableCell>
                                      <TableCell className="w-[12%]">
                                        <Badge variant={acceptedQty > 0 ? "default" : "destructive"} className="text-xs">
                                          {acceptedQty}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="w-[15%]">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => {
                                            const newItems = inwardForm.items.filter((_, i) => i !== index)
                                            setInwardForm({...inwardForm, items: newItems})
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  )
                                  })
                                })()
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
              </div>
              
              {/* Footer */}
              <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t bg-white">
                <div className="flex items-center gap-2">
                  {isDirectInward && inwardForm.items.length > 4 && (
                    <>
                      {inwardFormPage > 1 && (
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setInwardFormPage(prev => prev - 1)}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                      )}
                      <div className="flex items-center gap-1 px-3">
                        <span className="text-sm text-gray-600">
                          Page {inwardFormPage} of {Math.ceil(inwardForm.items.length / 4)}
                        </span>
                      </div>
                      {inwardFormPage < Math.ceil(inwardForm.items.length / 4) && (
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setInwardFormPage(prev => prev + 1)}
                        >
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsInwardDialogOpen(false)
                      setInwardForm({
                        poNumber: "",
                        inwardType: "PO_LINKED",
                        supplierName: "",
                        receivedDate: new Date().toISOString().split('T')[0],
                        items: [],
                        notes: ""
                      })
                      setSelectedPO(null)
                      setIsDirectInward(false)
                      setInwardFormPage(1)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    form="inward-form"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={
                      (!isDirectInward && !selectedPO) ||
                      inwardForm.items.length === 0 || 
                      inwardForm.items.some((item: any) => {
                        const accepted = item.receivedQuantity - (item.damagedQuantity || 0) - (item.lostQuantity || 0)
                        return accepted < 0 || (isDirectInward && !item.productId)
                      })
                    }
                  >
                    Create Inward Entry
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* View Inward Entry Dialog */}
          <Dialog open={isViewInwardDialogOpen} onOpenChange={setIsViewInwardDialogOpen}>
            <DialogContent 
              className="p-0"
              style={{ 
                width: '90vw',
                maxWidth: '1400px',
                height: '90vh',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-white">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Package className="h-6 w-6 text-blue-600" />
                  Inward Entry Details - {viewingInward?.inwardNumber}
                </DialogTitle>
                <DialogDescription>
                  View complete inward entry information
                </DialogDescription>
              </DialogHeader>
              
              {/* Scrollable Content - Internal Modal Scrollbar */}
              <div 
                className="px-6 py-4 bg-white grn-dialog-scroll"
                style={{ 
                  height: 'calc(90vh - 180px)',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {viewingInward && (
                  <div className="grid grid-cols-10 gap-4">
                    {/* Left Side - 40% (4 columns) */}
                    <div className="col-span-4 space-y-4">
                      <div>
                        <Label className="text-sm font-semibold">Inward Number</Label>
                        <p className="text-sm">{viewingInward.inwardNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">PO Number</Label>
                        <p className="text-sm">{viewingInward.poNumber || 'Direct Inward'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Supplier</Label>
                        <p className="text-sm">{viewingInward.supplierName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Status</Label>
                        <Badge 
                          variant="outline"
                          className={
                            viewingInward.status === 'PENDING_GRN'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                              : 'bg-green-100 text-green-800 border-green-300'
                          }
                        >
                          {viewingInward.status === 'PENDING_GRN' ? 'Pending GRN' : 'GRN Created'}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Received Date</Label>
                        <p className="text-sm">{new Date(viewingInward.receivedDate).toLocaleDateString()}</p>
                      </div>
                      {viewingInward.grnLinks && viewingInward.grnLinks.length > 0 && (
                        <div>
                          <Label className="text-sm font-semibold">GRN Numbers</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {viewingInward.grnLinks.map((grn: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {grn}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {viewingInward.notes && (
                        <div>
                          <Label className="text-sm font-semibold">Notes</Label>
                          <p className="text-sm text-muted-foreground">{viewingInward.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Right Side - 60% (6 columns) */}
                    <div className="col-span-6">
                      <div>
                        <Label className="text-sm font-semibold mb-2 block">Items</Label>
                        <div className="border rounded-lg overflow-x-auto">
                          <Table className="w-full table-fixed">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[25%] text-xs">Product</TableHead>
                                <TableHead className="w-[12%] text-xs">Ordered</TableHead>
                                <TableHead className="w-[12%] text-xs">Received</TableHead>
                                <TableHead className="w-[12%] text-xs">Damaged</TableHead>
                                <TableHead className="w-[12%] text-xs">Lost</TableHead>
                                <TableHead className="w-[12%] text-xs">Accepted</TableHead>
                                <TableHead className="w-[15%] text-xs">Unit Price</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {viewingInward.items.map((item: any, idx: number) => (
                                <TableRow key={idx}>
                                  <TableCell className="w-[25%] text-sm">{item.productName}</TableCell>
                                  <TableCell className="w-[12%]">
                                    <Badge variant="outline" className="text-xs">{item.orderedQuantity}</Badge>
                                  </TableCell>
                                  <TableCell className="w-[12%] text-sm">{item.receivedQuantity}</TableCell>
                                  <TableCell className="w-[12%] text-sm">{item.damagedQuantity || 0}</TableCell>
                                  <TableCell className="w-[12%] text-sm">{item.lostQuantity || 0}</TableCell>
                                  <TableCell className="w-[12%]">
                                    <Badge variant={item.acceptedQuantity > 0 ? "default" : "destructive"} className="text-xs">
                                      {item.acceptedQuantity}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="w-[15%] text-sm">₹{item.unitPrice || 0}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 flex items-center justify-end px-6 py-4 border-t bg-white">
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewInwardDialogOpen(false)}
                  className="px-6"
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Inward Entry Dialog */}
          <Dialog open={isEditInwardDialogOpen} onOpenChange={setIsEditInwardDialogOpen}>
            <DialogContent 
              className="p-0"
              style={{ 
                width: '90vw',
                maxWidth: '1400px',
                height: '90vh',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-white">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Edit className="h-6 w-6 text-blue-600" />
                  Edit Inward Entry - {editingInward?.inwardNumber}
                </DialogTitle>
                <DialogDescription>
                  Edit inward entry information. Only PENDING_GRN entries can be edited.
                </DialogDescription>
              </DialogHeader>
              
              {/* Scrollable Content - Internal Modal Scrollbar */}
              <div 
                className="px-6 py-4 bg-white grn-dialog-scroll"
                style={{ 
                  height: 'calc(90vh - 180px)',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {editingInward && editingInward.status === 'PENDING_GRN' && (
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    try {
                      const response = await fetch('/api/inward', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          id: editingInward._id,
                          supplierName: editInwardForm.supplierName,
                          receivedDate: editInwardForm.receivedDate,
                          notes: editInwardForm.notes,
                          items: editInwardForm.items.map(item => ({
                            ...item,
                            acceptedQuantity: item.receivedQuantity - (item.damagedQuantity || 0) - (item.lostQuantity || 0)
                          }))
                        }),
                      })
                      const result = await response.json()
                      if (result.success) {
                        alert('Inward entry updated successfully')
                        setIsEditInwardDialogOpen(false)
                        setEditingInward(null)
                        loadData()
                      } else {
                        alert('Error updating inward entry: ' + result.error)
                      }
                    } catch (error) {
                      console.error('Error updating inward entry:', error)
                      alert('Error updating inward entry')
                    }
                  }} className="grid grid-cols-10 gap-4" id="edit-inward-form">
                    {/* Left Side - 40% (4 columns) */}
                    <div className="col-span-4 space-y-4">
                      <div>
                        <Label className="text-sm font-semibold">Inward Number</Label>
                        <p className="text-sm">{editingInward.inwardNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">PO Number</Label>
                        <p className="text-sm">{editingInward.poNumber || 'Direct Inward'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Supplier *</Label>
                        <Input
                          value={editInwardForm.supplierName}
                          onChange={(e) => setEditInwardForm({...editInwardForm, supplierName: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Status</Label>
                        <Badge 
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 border-yellow-300"
                        >
                          Pending GRN
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Received Date *</Label>
                        <Input
                          type="date"
                          value={editInwardForm.receivedDate}
                          onChange={(e) => setEditInwardForm({...editInwardForm, receivedDate: e.target.value})}
                          required
                        />
                      </div>
                      {editingInward.grnLinks && editingInward.grnLinks.length > 0 && (
                        <div>
                          <Label className="text-sm font-semibold">GRN Numbers</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {editingInward.grnLinks.map((grn: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {grn}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm font-semibold">Notes</Label>
                        <Textarea
                          value={editInwardForm.notes}
                          onChange={(e) => setEditInwardForm({...editInwardForm, notes: e.target.value})}
                          placeholder="Add any additional notes..."
                          rows={6}
                          className="resize-none"
                        />
                      </div>
                    </div>

                    {/* Right Side - 60% (6 columns) */}
                    <div className="col-span-6">
                      <div>
                        <Label className="text-sm font-semibold mb-2 block">Items</Label>
                        <div className="border rounded-lg overflow-x-auto">
                          <Table className="w-full table-fixed">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[25%] text-xs">Product</TableHead>
                                <TableHead className="w-[12%] text-xs">Ordered</TableHead>
                                <TableHead className="w-[12%] text-xs">Received</TableHead>
                                <TableHead className="w-[12%] text-xs">Damaged</TableHead>
                                <TableHead className="w-[12%] text-xs">Lost</TableHead>
                                <TableHead className="w-[12%] text-xs">Accepted</TableHead>
                                <TableHead className="w-[15%] text-xs">Unit Price</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {editInwardForm.items.map((item: any, idx: number) => {
                                const acceptedQty = item.receivedQuantity - (item.damagedQuantity || 0) - (item.lostQuantity || 0)
                                return (
                                  <TableRow key={idx}>
                                    <TableCell className="w-[25%] font-medium text-sm">{item.productName}</TableCell>
                                    <TableCell className="w-[12%]">
                                      <Badge variant="outline" className="text-xs">{item.orderedQuantity}</Badge>
                                    </TableCell>
                                    <TableCell className="w-[12%]">
                                      <Input
                                        type="number"
                                        min="0"
                                        max={item.orderedQuantity}
                                        value={item.receivedQuantity}
                                        onChange={(e) => {
                                          const newItems = [...editInwardForm.items]
                                          newItems[idx].receivedQuantity = parseInt(e.target.value) || 0
                                          newItems[idx].acceptedQuantity = newItems[idx].receivedQuantity - (newItems[idx].damagedQuantity || 0) - (newItems[idx].lostQuantity || 0)
                                          setEditInwardForm({...editInwardForm, items: newItems})
                                        }}
                                        className="w-full"
                                      />
                                    </TableCell>
                                    <TableCell className="w-[12%]">
                                      <Input
                                        type="number"
                                        min="0"
                                        max={item.receivedQuantity}
                                        value={item.damagedQuantity || 0}
                                        onChange={(e) => {
                                          const newItems = [...editInwardForm.items]
                                          newItems[idx].damagedQuantity = parseInt(e.target.value) || 0
                                          newItems[idx].acceptedQuantity = newItems[idx].receivedQuantity - newItems[idx].damagedQuantity - (newItems[idx].lostQuantity || 0)
                                          setEditInwardForm({...editInwardForm, items: newItems})
                                        }}
                                        className="w-full"
                                        placeholder="0"
                                      />
                                    </TableCell>
                                    <TableCell className="w-[12%]">
                                      <Input
                                        type="number"
                                        min="0"
                                        max={item.receivedQuantity}
                                        value={item.lostQuantity || 0}
                                        onChange={(e) => {
                                          const newItems = [...editInwardForm.items]
                                          newItems[idx].lostQuantity = parseInt(e.target.value) || 0
                                          newItems[idx].acceptedQuantity = newItems[idx].receivedQuantity - (newItems[idx].damagedQuantity || 0) - newItems[idx].lostQuantity
                                          setEditInwardForm({...editInwardForm, items: newItems})
                                        }}
                                        className="w-full"
                                        placeholder="0"
                                      />
                                    </TableCell>
                                    <TableCell className="w-[12%]">
                                      <Badge variant={acceptedQty > 0 ? "default" : "destructive"} className="text-xs">
                                        {acceptedQty}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="w-[15%]">
                                      <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.unitPrice || 0}
                                        onChange={(e) => {
                                          const newItems = [...editInwardForm.items]
                                          newItems[idx].unitPrice = parseFloat(e.target.value) || 0
                                          setEditInwardForm({...editInwardForm, items: newItems})
                                        }}
                                        className="w-full"
                                      />
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
                {editingInward && editingInward.status !== 'PENDING_GRN' && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">This inward entry cannot be edited because GRN has already been created.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 flex items-center justify-end px-6 py-4 border-t bg-white">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditInwardDialogOpen(false)
                    setEditingInward(null)
                  }}
                  className="mr-2"
                >
                  Cancel
                </Button>
                {editingInward && editingInward.status === 'PENDING_GRN' && (
                  <Button 
                    type="submit"
                    form="edit-inward-form"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Generate GRN from Inward Dialog */}
          <Dialog 
            open={isGenerateGRNFromInwardOpen} 
            onOpenChange={(open) => {
              setIsGenerateGRNFromInwardOpen(open)
              if (!open) {
                // Reset split stock state when dialog closes
                setIsSplitStock(false)
                setCustomerAllocations([])
                setGrnFormPage(1)
              }
            }}
          >
            <DialogContent 
              className="p-0"
              style={{
                width: '90vw',
                maxWidth: '1400px',
                height: '90vh',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* Fixed Header */}
              <div className="px-6 pt-4 pb-3 border-b bg-white" style={{ flexShrink: 0 }}>
                <DialogHeader>
                  <DialogTitle>Generate GRN from Inward Entry</DialogTitle>
                  <DialogDescription>
                    Generate GRN to move accepted goods from inward entry to warehouse storage. Only accepted quantities (Received - Damaged - Lost) will be added to warehouse stock.
                  </DialogDescription>
                </DialogHeader>
              </div>
              
              {/* Scrollable Content - Internal Modal Scrollbar */}
              {selectedInward && (
                <div 
                  className="px-6 py-3 bg-white grn-dialog-scroll"
                  style={{
                    height: 'calc(90vh - 200px)',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  <form onSubmit={handleGenerateGRNFromInward} className="space-y-6" id="grn-form">
                  {/* Page 1: Form Details */}
                  {grnFormPage === 1 && (
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left Column - Inward Entry Details */}
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm font-semibold text-blue-900">Inward Entry: {selectedInward.inwardNumber}</p>
                          <p className="text-xs text-blue-700">Supplier: {selectedInward.supplierName}</p>
                          {selectedInward.poNumber && (
                            <p className="text-xs text-blue-700">PO Number: {selectedInward.poNumber}</p>
                          )}
                        </div>

                        <div>
                          <Label>Warehouse Name *</Label>
                          <div className="flex gap-2">
                            <div className="flex-1 relative warehouse-dropdown-container">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsWarehouseDropdownOpen(!isWarehouseDropdownOpen)}
                                className="w-full justify-between"
                              >
                                {grnForm.warehouseName || "Select warehouse"}
                                <ChevronDown className="h-4 w-4 ml-2" />
                              </Button>
                              {isWarehouseDropdownOpen && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                                  <div className="p-1">
                                    {warehouses.map((warehouse) => (
                                      <div
                                        key={warehouse}
                                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer group"
                                        onClick={() => {
                                          setGRNForm({...grnForm, warehouseName: warehouse})
                                          setIsWarehouseDropdownOpen(false)
                                        }}
                                      >
                                        <span className={grnForm.warehouseName === warehouse ? "font-semibold" : ""}>
                                          {warehouse}
                                        </span>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            if (warehouses.length > 1) {
                                              const updatedWarehouses = warehouses.filter(w => w !== warehouse)
                                              setWarehouses(updatedWarehouses)
                                              if (grnForm.warehouseName === warehouse) {
                                                setGRNForm({...grnForm, warehouseName: updatedWarehouses[0] || ""})
                                              }
                                            } else {
                                              alert("At least one warehouse must exist")
                                            }
                                          }}
                                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                    {isAddingWarehouse ? (
                                      <div className="flex gap-1 px-3 py-2 border-t mt-1">
                                        <Input
                                          value={newWarehouseName}
                                          onChange={(e) => setNewWarehouseName(e.target.value)}
                                          placeholder="Enter warehouse name"
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter' && newWarehouseName.trim()) {
                                              setWarehouses([...warehouses, newWarehouseName.trim()])
                                              setGRNForm({...grnForm, warehouseName: newWarehouseName.trim()})
                                              setNewWarehouseName("")
                                              setIsAddingWarehouse(false)
                                            }
                                            if (e.key === 'Escape') {
                                              setIsAddingWarehouse(false)
                                              setNewWarehouseName("")
                                            }
                                          }}
                                          autoFocus
                                          className="h-8 text-sm"
                                        />
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            if (newWarehouseName.trim()) {
                                              setWarehouses([...warehouses, newWarehouseName.trim()])
                                              setGRNForm({...grnForm, warehouseName: newWarehouseName.trim()})
                                              setNewWarehouseName("")
                                              setIsAddingWarehouse(false)
                                            }
                                          }}
                                          className="h-8 px-2"
                                        >
                                          <Plus className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setIsAddingWarehouse(false)
                                            setNewWarehouseName("")
                                          }}
                                          className="h-8 px-2"
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <div
                                        className="px-3 py-2 border-t mt-1 cursor-pointer hover:bg-gray-100 rounded-md flex items-center gap-2 text-sm text-blue-600"
                                        onClick={() => setIsAddingWarehouse(true)}
                                      >
                                        <Plus className="h-4 w-4" />
                                        <span>Add Warehouse</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Split Stock Option */}
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center space-x-2 mb-4">
                            <input
                              type="checkbox"
                              id="splitStock"
                              checked={isSplitStock}
                              onChange={(e) => {
                                setIsSplitStock(e.target.checked)
                                if (!e.target.checked) {
                                  setCustomerAllocations([])
                                  setExpandedCustomerIndex(null)
                                }
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <Label htmlFor="splitStock" className="text-sm font-semibold cursor-pointer">
                              Split stock between customer and warehouse
                            </Label>
                          </div>
                          
                          {isSplitStock && (
                            <div className="space-y-4 mt-4">
                              {expandedCustomerIndex !== null && customerAllocations[expandedCustomerIndex] ? (
                                /* Show Expanded Form - Hide Grid */
                                <div className="border rounded-lg p-4 bg-white space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-sm">Customer {expandedCustomerIndex + 1}</h4>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const newAllocations = customerAllocations.filter((_, idx) => idx !== expandedCustomerIndex)
                                          setCustomerAllocations(newAllocations)
                                          setExpandedCustomerIndex(null)
                                        }}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setExpandedCustomerIndex(null)}
                                        className="text-gray-600 hover:text-gray-700"
                                      >
                                        <ChevronDown className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label>Select Customer *</Label>
                                    <Select
                                      value={customerAllocations[expandedCustomerIndex].customerId}
                                      onValueChange={(value) => {
                                        const customer = customers.find((c: any) => c._id === value)
                                        const newAllocations = [...customerAllocations]
                                        newAllocations[expandedCustomerIndex] = {
                                          ...customerAllocations[expandedCustomerIndex],
                                          customerId: value,
                                          customerName: customer?.name || ''
                                        }
                                        setCustomerAllocations(newAllocations)
                                      }}
                                      required
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select customer" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {customers.map((customer: any) => (
                                          <SelectItem key={customer._id} value={customer._id}>
                                            {customer.name} {customer.email ? `(${customer.email})` : ''}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <Label>Selling Price (₹) *</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={customerAllocations[expandedCustomerIndex].sellingPrice || ''}
                                      onChange={(e) => {
                                        const newAllocations = [...customerAllocations]
                                        newAllocations[expandedCustomerIndex] = {
                                          ...customerAllocations[expandedCustomerIndex],
                                          sellingPrice: parseFloat(e.target.value) || 0
                                        }
                                        setCustomerAllocations(newAllocations)
                                      }}
                                      placeholder="0.00"
                                      required
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label>Allocate Stock - Enter quantities for customer (remaining goes to warehouse)</Label>
                                    <div className="border rounded-lg overflow-x-auto mt-2">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Product Name</TableHead>
                                            <TableHead>Total Accepted</TableHead>
                                            <TableHead>To Customer</TableHead>
                                            <TableHead>To Warehouse (Auto)</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {selectedInward.items.map((item: any, idx: number) => {
                                            const customerAlloc = customerAllocations[expandedCustomerIndex]
                                            const allocation = customerAlloc.itemAllocations.find(a => a.productId === item.productId) || { customerQuantity: 0 }
                                            const customerQty = allocation.customerQuantity || 0
                                            const totalAllocatedToCustomers = customerAllocations.reduce((sum, ca) => {
                                              const alloc = ca.itemAllocations.find(a => a.productId === item.productId)
                                              return sum + (alloc?.customerQuantity || 0)
                                            }, 0)
                                            const warehouseQty = item.acceptedQuantity - totalAllocatedToCustomers
                                            return (
                                              <TableRow key={idx}>
                                                <TableCell className="font-medium">{item.productName}</TableCell>
                                                <TableCell>
                                                  <Badge variant="outline">{item.acceptedQuantity}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                  <Input
                                                    type="number"
                                                    min="0"
                                                    max={item.acceptedQuantity - (totalAllocatedToCustomers - customerQty)}
                                                    value={customerQty}
                                                    onChange={(e) => {
                                                      const newQty = parseInt(e.target.value) || 0
                                                      const newAllocations = [...customerAllocations]
                                                      const itemAllocs = [...customerAlloc.itemAllocations]
                                                      const existingIndex = itemAllocs.findIndex(a => a.productId === item.productId)
                                                      
                                                      if (existingIndex >= 0) {
                                                        itemAllocs[existingIndex].customerQuantity = newQty
                                                      } else {
                                                        itemAllocs.push({
                                                          productId: item.productId,
                                                          customerQuantity: newQty
                                                        })
                                                      }
                                                      newAllocations[expandedCustomerIndex] = {
                                                        ...customerAlloc,
                                                        itemAllocations: itemAllocs
                                                      }
                                                      setCustomerAllocations(newAllocations)
                                                    }}
                                                    className="w-24"
                                                    placeholder="0"
                                                  />
                                                </TableCell>
                                                <TableCell>
                                                  <Badge variant={warehouseQty > 0 ? "default" : "outline"} className={warehouseQty > 0 ? "bg-green-600" : ""}>
                                                    {warehouseQty} units
                                                  </Badge>
                                                  {warehouseQty < 0 && (
                                                    <p className="text-xs text-red-600 mt-1">Invalid</p>
                                                  )}
                                                </TableCell>
                                              </TableRow>
                                            )
                                          })}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* Show Grid - Hide Expanded Form */
                                <>
                                  {/* Add Customer Dropdown Button */}
                                  <div className="flex justify-end">
                                    <Select
                                      onValueChange={(value) => {
                                        const customer = customers.find((c: any) => c._id === value)
                                        const newAllocation = {
                                          customerId: value,
                                          customerName: customer?.name || '',
                                          sellingPrice: 0,
                                          itemAllocations: selectedInward.items.map((item: any) => ({
                                            productId: item.productId,
                                            customerQuantity: 0
                                          }))
                                        }
                                        setCustomerAllocations([...customerAllocations, newAllocation])
                                        setExpandedCustomerIndex(customerAllocations.length)
                                      }}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Add Customer" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {customers.map((customer: any) => (
                                          <SelectItem key={customer._id} value={customer._id}>
                                            {customer.name} {customer.email ? `(${customer.email})` : ''}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* Customer Grid (3 columns) - Show first 10 customers */}
                                  {customerAllocations.slice(0, 10).length > 0 && (
                                    <div className="grid grid-cols-3 gap-3">
                                      {customerAllocations.slice(0, 10).map((customerAlloc, customerIndex) => (
                                        <Button
                                          key={customerIndex}
                                          type="button"
                                          variant="outline"
                                          onClick={() => setExpandedCustomerIndex(customerIndex)}
                                          className="w-full h-20 flex flex-col items-center justify-center gap-1 border-2 border-dashed hover:border-solid hover:border-blue-500 transition-all"
                                        >
                                          <User className="h-5 w-5 text-gray-400" />
                                          <span className="text-xs font-medium">
                                            {customerAlloc.customerName || `Customer ${customerIndex + 1}`}
                                          </span>
                                          {customerAlloc.sellingPrice > 0 && (
                                            <span className="text-xs text-gray-500">
                                              ₹{customerAlloc.sellingPrice}
                                            </span>
                                          )}
                                        </Button>
                                      ))}
                                    </div>
                                  )}
                                  
                                  <p className="text-xs text-muted-foreground">
                                    Click on a customer button to configure allocation. Enter the quantity you want to allocate to each customer. The remaining quantity will automatically go to warehouse.
                                  </p>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Page 2: Additional Customers (10th onwards) */}
                  {grnFormPage === 2 && customerAllocations.length > 10 && (
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <h3 className="font-semibold mb-4">Additional Customers</h3>
                        
                        {expandedCustomerIndex !== null && expandedCustomerIndex >= 10 && customerAllocations[expandedCustomerIndex] ? (
                          /* Show Expanded Form - Hide Grid */
                          <div className="border rounded-lg p-4 bg-white space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm">Customer {expandedCustomerIndex + 1}</h4>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newAllocations = customerAllocations.filter((_, idx) => idx !== expandedCustomerIndex)
                                    setCustomerAllocations(newAllocations)
                                    setExpandedCustomerIndex(null)
                                  }}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setExpandedCustomerIndex(null)}
                                  className="text-gray-600 hover:text-gray-700"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <Label>Select Customer *</Label>
                              <Select
                                value={customerAllocations[expandedCustomerIndex].customerId}
                                onValueChange={(value) => {
                                  const customer = customers.find((c: any) => c._id === value)
                                  const newAllocations = [...customerAllocations]
                                  newAllocations[expandedCustomerIndex] = {
                                    ...customerAllocations[expandedCustomerIndex],
                                    customerId: value,
                                    customerName: customer?.name || ''
                                  }
                                  setCustomerAllocations(newAllocations)
                                }}
                                required
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select customer" />
                                </SelectTrigger>
                                <SelectContent>
                                  {customers.map((customer: any) => (
                                    <SelectItem key={customer._id} value={customer._id}>
                                      {customer.name} {customer.email ? `(${customer.email})` : ''}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label>Selling Price (₹) *</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={customerAllocations[expandedCustomerIndex].sellingPrice || ''}
                                onChange={(e) => {
                                  const newAllocations = [...customerAllocations]
                                  newAllocations[expandedCustomerIndex] = {
                                    ...customerAllocations[expandedCustomerIndex],
                                    sellingPrice: parseFloat(e.target.value) || 0
                                  }
                                  setCustomerAllocations(newAllocations)
                                }}
                                placeholder="0.00"
                                required
                              />
                            </div>
                            
                            <div>
                              <Label>Allocate Stock - Enter quantities for customer (remaining goes to warehouse)</Label>
                              <div className="border rounded-lg overflow-x-auto mt-2">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Product Name</TableHead>
                                      <TableHead>Total Accepted</TableHead>
                                      <TableHead>To Customer</TableHead>
                                      <TableHead>To Warehouse (Auto)</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedInward.items.map((item: any, idx: number) => {
                                      const customerAlloc = customerAllocations[expandedCustomerIndex]
                                      const allocation = customerAlloc.itemAllocations.find(a => a.productId === item.productId) || { customerQuantity: 0 }
                                      const customerQty = allocation.customerQuantity || 0
                                      const totalAllocatedToCustomers = customerAllocations.reduce((sum, ca) => {
                                        const alloc = ca.itemAllocations.find(a => a.productId === item.productId)
                                        return sum + (alloc?.customerQuantity || 0)
                                      }, 0)
                                      const warehouseQty = item.acceptedQuantity - totalAllocatedToCustomers
                                      return (
                                        <TableRow key={idx}>
                                          <TableCell className="font-medium">{item.productName}</TableCell>
                                          <TableCell>
                                            <Badge variant="outline">{item.acceptedQuantity}</Badge>
                                          </TableCell>
                                          <TableCell>
                                            <Input
                                              type="number"
                                              min="0"
                                              max={item.acceptedQuantity - (totalAllocatedToCustomers - customerQty)}
                                              value={customerQty}
                                              onChange={(e) => {
                                                const newQty = parseInt(e.target.value) || 0
                                                const newAllocations = [...customerAllocations]
                                                const itemAllocs = [...customerAlloc.itemAllocations]
                                                const existingIndex = itemAllocs.findIndex(a => a.productId === item.productId)
                                                
                                                if (existingIndex >= 0) {
                                                  itemAllocs[existingIndex].customerQuantity = newQty
                                                } else {
                                                  itemAllocs.push({
                                                    productId: item.productId,
                                                    customerQuantity: newQty
                                                  })
                                                }
                                                newAllocations[expandedCustomerIndex] = {
                                                  ...customerAlloc,
                                                  itemAllocations: itemAllocs
                                                }
                                                setCustomerAllocations(newAllocations)
                                              }}
                                              className="w-24"
                                              placeholder="0"
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <Badge variant={warehouseQty > 0 ? "default" : "outline"} className={warehouseQty > 0 ? "bg-green-600" : ""}>
                                              {warehouseQty} units
                                            </Badge>
                                            {warehouseQty < 0 && (
                                              <p className="text-xs text-red-600 mt-1">Invalid</p>
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    })}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Show Grid - Hide Expanded Form */
                          <>
                            {/* Add Customer Dropdown Button */}
                            <div className="flex justify-end mb-4">
                              <Select
                                onValueChange={(value) => {
                                  const customer = customers.find((c: any) => c._id === value)
                                  const newAllocation = {
                                    customerId: value,
                                    customerName: customer?.name || '',
                                    sellingPrice: 0,
                                    itemAllocations: selectedInward.items.map((item: any) => ({
                                      productId: item.productId,
                                      customerQuantity: 0
                                    }))
                                  }
                                  setCustomerAllocations([...customerAllocations, newAllocation])
                                  setExpandedCustomerIndex(customerAllocations.length)
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Add Customer" />
                                </SelectTrigger>
                                <SelectContent>
                                  {customers.map((customer: any) => (
                                    <SelectItem key={customer._id} value={customer._id}>
                                      {customer.name} {customer.email ? `(${customer.email})` : ''}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Customer Grid (3 columns) */}
                            {customerAllocations.slice(10).length > 0 && (
                              <div className="grid grid-cols-3 gap-3">
                                {customerAllocations.slice(10).map((customerAlloc, customerIndex) => {
                                  const actualIndex = customerIndex + 10
                                  return (
                                    <Button
                                      key={actualIndex}
                                      type="button"
                                      variant="outline"
                                      onClick={() => setExpandedCustomerIndex(actualIndex)}
                                      className="w-full h-20 flex flex-col items-center justify-center gap-1 border-2 border-dashed hover:border-solid hover:border-blue-500 transition-all"
                                    >
                                      <User className="h-5 w-5 text-gray-400" />
                                      <span className="text-xs font-medium">
                                        {customerAlloc.customerName || `Customer ${actualIndex + 1}`}
                                      </span>
                                      {customerAlloc.sellingPrice > 0 && (
                                        <span className="text-xs text-gray-500">
                                          ₹{customerAlloc.sellingPrice}
                                        </span>
                                      )}
                                    </Button>
                                  )
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Page 2 or 3: Summary Table with Notes */}
                  {((grnFormPage === 2 && customerAllocations.length <= 10) || (grnFormPage === 3 && customerAllocations.length > 10)) && (
                    <div className="space-y-6">
                      <div>
                        <Label>Items Summary - {isSplitStock ? 'Stock Allocation' : 'Only Accepted Quantities Will Be Added to Warehouse'}</Label>
                        <div className="border rounded-lg overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Received Qty</TableHead>
                                <TableHead>Damaged Qty</TableHead>
                                <TableHead>Lost Qty</TableHead>
                                {isSplitStock ? (
                                  <>
                                    <TableHead className="bg-blue-50">To Customer</TableHead>
                                    <TableHead className="bg-green-50">To Warehouse</TableHead>
                                  </>
                                ) : (
                                  <TableHead className="bg-green-50">Accepted Qty (Will be added to warehouse)</TableHead>
                                )}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedInward.items.map((item: any, idx: number) => {
                                const totalReceived = item.receivedQuantity
                                const totalDamaged = item.damagedQuantity || 0
                                const totalLost = item.lostQuantity || 0
                                const acceptedQty = item.acceptedQuantity
                                // Calculate total customer allocation for this item across all customers
                                const totalCustomerQty = isSplitStock ? customerAllocations.reduce((sum, ca) => {
                                  const alloc = ca.itemAllocations.find(a => a.productId === item.productId)
                                  return sum + (alloc?.customerQuantity || 0)
                                }, 0) : 0
                                const warehouseQty = acceptedQty - totalCustomerQty
                                
                                return (
                                  <TableRow key={idx}>
                                    <TableCell className="font-medium">{item.productName}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline">{totalReceived}</Badge>
                                    </TableCell>
                                    <TableCell>
                                      {totalDamaged > 0 ? (
                                        <Badge variant="destructive" className="bg-orange-500">{totalDamaged} (waste)</Badge>
                                      ) : (
                                        <span className="text-gray-400">0</span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {totalLost > 0 ? (
                                        <Badge variant="destructive" className="bg-yellow-500">{totalLost} (waste)</Badge>
                                      ) : (
                                        <span className="text-gray-400">0</span>
                                      )}
                                    </TableCell>
                                    {isSplitStock ? (
                                      <>
                                        <TableCell className="bg-blue-50">
                                          <Badge variant="default" className="bg-blue-600">{totalCustomerQty} units</Badge>
                                          <p className="text-xs text-blue-700 mt-1">To {customerAllocations.length} customer{customerAllocations.length > 1 ? 's' : ''}</p>
                                        </TableCell>
                                        <TableCell className="bg-green-50">
                                          <Badge variant="default" className="bg-green-600">{warehouseQty} units</Badge>
                                          <p className="text-xs text-green-700 mt-1">To warehouse</p>
                                        </TableCell>
                                      </>
                                    ) : (
                                      <TableCell className="bg-green-50">
                                        <Badge variant="default" className="bg-green-600">{acceptedQty} units</Badge>
                                        <p className="text-xs text-green-700 mt-1">Will be added to warehouse</p>
                                      </TableCell>
                                    )}
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                          <p className="text-xs text-blue-800">
                            {isSplitStock ? (
                              <>
                                <strong>Summary:</strong> Total Accepted Quantity = {selectedInward.items.reduce((sum: number, item: any) => sum + item.acceptedQuantity, 0)} units.
                                {' '}Customer allocation = {selectedInward.items.reduce((sum: number, item: any) => {
                                  const totalCustomerQty = customerAllocations.reduce((customerSum, ca) => {
                                    const alloc = ca.itemAllocations.find(a => a.productId === item.productId)
                                    return customerSum + (alloc?.customerQuantity || 0)
                                  }, 0)
                                  return sum + totalCustomerQty
                                }, 0)} units across {customerAllocations.length} customer{customerAllocations.length > 1 ? 's' : ''}.
                                {' '}Warehouse allocation = {selectedInward.items.reduce((sum: number, item: any) => {
                                  const totalCustomerQty = customerAllocations.reduce((customerSum, ca) => {
                                    const alloc = ca.itemAllocations.find(a => a.productId === item.productId)
                                    return customerSum + (alloc?.customerQuantity || 0)
                                  }, 0)
                                  return sum + (item.acceptedQuantity - totalCustomerQty)
                                }, 0)} units.
                              </>
                            ) : (
                              <>
                                <strong>Summary:</strong> Total Accepted Quantity = {selectedInward.items.reduce((sum: number, item: any) => sum + item.acceptedQuantity, 0)} units will be added to warehouse stock.
                                {selectedInward.items.reduce((sum: number, item: any) => sum + (item.damagedQuantity || 0) + (item.lostQuantity || 0), 0) > 0 && (
                                  <> {selectedInward.items.reduce((sum: number, item: any) => sum + (item.damagedQuantity || 0) + (item.lostQuantity || 0), 0)} units will be recorded as waste.</>
                                )}
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label>Notes (Optional)</Label>
                        <Textarea
                          value={grnForm.notes}
                          onChange={(e) => setGRNForm({...grnForm, notes: e.target.value})}
                          placeholder="Add any additional notes..."
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                  </form>
                </div>
              )}
              
              {/* Fixed Footer with Pagination */}
              {selectedInward && (
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center" style={{ flexShrink: 0 }}>
                  <div className="flex items-center space-x-2">
                    {grnFormPage > 1 && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setGrnFormPage(prev => prev - 1)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const totalPages = customerAllocations.length > 10 ? 3 : 2
                      return <span className="text-sm text-gray-600">Page {grnFormPage} of {totalPages}</span>
                    })()}
                  </div>
                  <div className="flex items-center space-x-2">
                    {grnFormPage === 1 ? (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          const nextPage = customerAllocations.length > 10 ? 2 : 2
                          setGrnFormPage(nextPage)
                        }}
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : grnFormPage === 2 && customerAllocations.length > 10 ? (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setGrnFormPage(3)}
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsGenerateGRNFromInwardOpen(false)
                            setSelectedInward(null)
                            setIsSplitStock(false)
                            setCustomerAllocations([])
                            setGrnFormPage(1)
                            setGRNForm({ 
                              poNumber: "", 
                              receivedQuantity: "", 
                              warehouseName: "Main Warehouse", 
                              grnType: "GRN_CREATED",
                              supplierName: "",
                              location: {},
                              notes: "",
                              items: [] 
                            })
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          form="grn-form"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Generate GRN
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>


        </main>
      </div>
    </div>
  )
}

