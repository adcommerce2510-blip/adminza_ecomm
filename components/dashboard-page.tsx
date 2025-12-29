"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useDashboardLogout } from "@/components/dashboard-auth"
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
  Copy,
  RefreshCw,
  ArrowLeft,
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
  // Edit inventory item dialog state (My Customers)
  const [isEshopEditOpen, setIsEshopEditOpen] = useState(false)
  const [eshopEditForm, setEshopEditForm] = useState<{ id: string; productName: string; quantity: number; price: number; notes?: string }>({ id: "", productName: "", quantity: 1, price: 0, notes: "" })

  // Inventory Management States
  const [isInventoryManagementExpanded, setIsInventoryManagementExpanded] = useState(false)
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])
  const [currentPOPage, setCurrentPOPage] = useState(1)
  const poPerPage = 5
  const [warehouseStock, setWarehouseStock] = useState<any[]>([])
  const [wasteEntries, setWasteEntries] = useState<any[]>([])
  const [isPODialogOpen, setIsPODialogOpen] = useState(false)
  const [isGRNDialogOpen, setIsGRNDialogOpen] = useState(false)
  const [isWasteDialogOpen, setIsWasteDialogOpen] = useState(false)
  const [isViewPODialogOpen, setIsViewPODialogOpen] = useState(false)
  const [viewingPO, setViewingPO] = useState<any>(null)
  const [poForm, setPOForm] = useState({
    supplierName: "",
    items: [] as any[],
    deliveryType: "to_warehouse" as "to_warehouse" | "direct_to_customer",
    customerId: "",
    customerName: "",
    expectedDate: "",
    notes: ""
  })
  const [grnForm, setGRNForm] = useState({
    poNumber: "",
    receivedQuantity: "",
    warehouseName: "Main Warehouse",
    items: [] as Array<{
      productId: string
      productName: string
      orderedQuantity: number
      receivedQuantity: number
      damagedQuantity: number
      lostQuantity: number
    }>
  })
  const [wasteForm, setWasteForm] = useState({
    productId: "",
    productName: "",
    quantity: "",
    reason: "damaged" as "damaged" | "expired" | "lost" | "other",
    description: "",
    warehouseName: "Main Warehouse"
  })
  const [selectedPO, setSelectedPO] = useState<any>(null)

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
      const [productsData, servicesData, categoriesData, subCategoriesData, level2CategoriesData, customersData, eshopData, ordersData, quotationsData, enquiriesData, invoicesData, purchaseOrdersData, warehouseStockData, wasteEntriesData, suppliersData] = await Promise.all([
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
        fetch('/api/suppliers?isActive=true').then(res => res.json()).then(data => data.success ? data.data : []).catch(() => [])
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
    setIsRetopUpDialogOpen(true)
    setOpenDropdownId(null) // Close dropdown
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
          const previousQuantity = product.quantity
          const newQuantity = product.quantity + product.quantityToAdd
          
          const result = await updateEshopInventory(product._id, {
            quantity: newQuantity,
            notes: `Re-topped up with ${product.quantityToAdd} units. ${product.notes || ""}`
          })
          
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
        // If delivery type is to_warehouse, automatically update warehouse stock
        if (poForm.deliveryType === 'to_warehouse') {
          try {
            for (const item of poForm.items) {
              await fetch('/api/warehouse-stock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  productId: item.productId,
                  productName: item.productName,
                  availableStock: item.quantity,
                  quantityAdded: item.quantity,
                  lastSupplier: poForm.supplierName,
                  warehouseName: 'Main Warehouse'
                })
              })
            }
            // Refresh warehouse stock
            const wsData = await fetchWarehouseStock()
            setWarehouseStock(wsData)
          } catch (error) {
            console.error('Error updating warehouse stock:', error)
          }
        }
        
        setPurchaseOrders([...purchaseOrders, result.data])
        setPOForm({
          supplierName: "",
          items: [],
          deliveryType: "to_warehouse",
          customerId: "",
          customerName: "",
          expectedDate: "",
          notes: ""
        })
        setIsPODialogOpen(false)
        alert('Purchase order created successfully' + (poForm.deliveryType === 'to_warehouse' ? ' and warehouse stock updated' : ''))
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

  // GRN Handler
  const handleGRNSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!grnForm.poNumber || !selectedPO) {
        alert('Please select a purchase order')
        return
      }

      // Validate items
      for (const item of grnForm.items) {
        const acceptedQty = item.receivedQuantity - item.damagedQuantity - item.lostQuantity
        if (acceptedQty < 0) {
          alert(`Invalid quantities for ${item.productName}. Accepted quantity cannot be negative.`)
          return
        }
        if (item.receivedQuantity > item.orderedQuantity) {
          alert(`Received quantity for ${item.productName} cannot exceed ordered quantity.`)
          return
        }
      }
      
      const response = await fetch('/api/grn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poNumber: grnForm.poNumber,
          warehouseName: grnForm.warehouseName,
          items: grnForm.items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            receivedQuantity: item.receivedQuantity,
            damagedQuantity: item.damagedQuantity || 0,
            lostQuantity: item.lostQuantity || 0,
            acceptedQuantity: item.receivedQuantity - (item.damagedQuantity || 0) - (item.lostQuantity || 0)
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
        setGRNForm({ poNumber: "", receivedQuantity: "", warehouseName: "Main Warehouse", items: [] })
        setSelectedPO(null)
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
                  My Customers
                </Button>
                <Button 
                  variant={activeSubSection === "block-unblock-customer" ? "default" : "ghost"} 
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection("customer-management")
                    setActiveSubSection("block-unblock-customer")
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
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Add New Service</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleServiceSubmit} className="space-y-4">
                                <div>
                                  <Label htmlFor="service-name">Service Name</Label>
                                  <Input
                                    id="service-name"
                                    placeholder="Enter service name"
                                    value={serviceForm.name}
                                    onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                                    required
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
                                    <SelectTrigger>
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
                                      <SelectTrigger>
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
                                      <SelectTrigger>
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
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="service-location">Location</Label>
                                  <Input
                                    id="service-location"
                                    placeholder="Enter service location"
                                    value={serviceForm.location}
                                    onChange={(e) => setServiceForm({...serviceForm, location: e.target.value})}
                                    required
                                  />
                                </div>
                                
                                {/* Image Upload Section */}
                                <div>
                                  <Label htmlFor="service-images">Images</Label>
                                  <div className="mb-2">
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
                                    rows={3}
                                    className="resize-none"
                                    style={{ maxHeight: '120px', overflowY: 'auto' }}
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {serviceForm.description.length}/5000 characters
                                  </p>
                                </div>
                                <div className="flex justify-end space-x-2">
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
                              </form>
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
                        ) : services.map((service: any) => (
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
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteService(service._id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
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
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Add New Product</DialogTitle>
                              </DialogHeader>
                              <div className="max-h-[80vh] overflow-y-auto">
                                <form onSubmit={handleProductSubmit} className="space-y-4">
                                <div>
                                  <Label htmlFor="product-name">Product Name</Label>
                                  <Input
                                    id="product-name"
                                    placeholder="Enter product name"
                                    value={productForm.name}
                                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                                    required
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
                                    <SelectTrigger>
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
                                      <SelectTrigger>
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
                                      <SelectTrigger>
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
                                    <Label htmlFor="product-stock">Stock Quantity</Label>
                                    <Input
                                      id="product-stock"
                                      type="number"
                                      placeholder="0"
                                      value={productForm.stock}
                                      onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                                      required
                                    />
                                </div>
                                <div>
                                  <Label htmlFor="product-description">Description</Label>
                                  <Textarea
                                    id="product-description"
                                    placeholder="Enter product description"
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                                    required
                                    rows={3}
                                    className="resize-none"
                                    style={{ maxHeight: '120px', overflowY: 'auto' }}
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {productForm.description.length}/5000 characters
                                  </p>
                                </div>
                                <div>
                                  <Label htmlFor="product-hsl-code">HSL Code</Label>
                                  <Input
                                    id="product-hsl-code"
                                    placeholder="Enter HSL Code"
                                    value={productForm.hslCode}
                                    onChange={(e) => setProductForm({...productForm, hslCode: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="product-images">Images</Label>
                                  <div className="mb-2">
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
                                <div className="flex justify-end space-x-2">
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
                        ) : products
                          .filter((product: any) => 
                            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                            (selectedCategory === "all" || product.category === selectedCategory)
                          )
                          .map((product: any) => (
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
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product._id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
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
                          <>
                            {/* Products */}
                            {products
                              .filter((product: any) => 
                                product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                (selectedCategory === "all" || product.category === selectedCategory)
                              )
                              .map((product: any) => (
                              <TableRow key={`product-${product._id}`}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{product.name}</div>
                                    <div className="text-sm text-muted-foreground">{product.vendor}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">Product</Badge>
                                </TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>₹{product.price.toLocaleString()}</TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div>Stock: {product.stock}</div>
                                    <div>Orders: {product.orders}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={product.status === "Active" ? "default" : "destructive"}>
                                    {product.status}
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
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product._id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                            {/* Services */}
                            {services
                              .filter((service: any) => 
                                service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                (selectedCategory === "all" || service.category === selectedCategory)
                              )
                              .map((service: any) => (
                              <TableRow key={`service-${service._id}`}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{service.name}</div>
                                    <div className="text-sm text-muted-foreground">{service.vendor}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">Service</Badge>
                                </TableCell>
                                <TableCell>{service.category}</TableCell>
                                <TableCell>₹{service.price.toLocaleString()}</TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div>Duration: {service.duration}</div>
                                    <div>Location: {service.location}</div>
                                    <div>Orders: {service.orders}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={service.status === "Active" ? "default" : "destructive"}>
                                    {service.status}
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
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteService(service._id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </>
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
                            categories.map((category: any) => (
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
                            ))
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
                            subCategories.map((subCategory: any) => (
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
                            ))
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
                            level2Categories.map((level2Category: any) => (
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
                            ))
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
                  <div className="flex items-center justify-between space-x-2">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search customers..."
                        value={customerSearchTerm}
                        onChange={(e) => setCustomerSearchTerm(e.target.value)}
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
                  ) : (
                    <>
                      {/* Group inventory by customer */}
                      {Object.entries(
                        eshopInventory
                          .filter((item: any) => 
                            item.customerName.toLowerCase().includes(customerSearchTerm.toLowerCase())
                          )
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
                      ).map(([customerId, customerData]: [string, any]) => (
                        <Card key={customerId}>
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
                                    // Call the existing handleRetopUp function
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
                                      customerId: customerId,
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
                                {customerData.products.map((item: any) => {
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
                                                onClick={() => openEshopEditDialog(item)}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                              >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
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
                              </TableBody>
                            </Table>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
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
                        ) : (
                          customers
                            .filter((customer: any) => 
                              customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                              customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                              customer.phone.includes(customerSearchTerm)
                            )
                            .map((customer: any, index: number) => (
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
                            ))
                        )}
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
                        ) : (
                          suppliers.map((supplier: any, index: number) => (
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
                            ))
                        )}
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
                        ) : (
                          customers
                            .filter((customer: any) => 
                              customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                              customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                              customer.phone.includes(customerSearchTerm) ||
                              customer.username?.toLowerCase().includes(customerSearchTerm.toLowerCase())
                            )
                            .map((customer: any) => (
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
                            ))
                        )}
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
                                    <Badge 
                                      variant={po.status === 'received' ? 'default' : po.status === 'cancelled' ? 'destructive' : 'secondary'}
                                      className={
                                        po.status === 'received' 
                                          ? 'bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm' 
                                          : po.status === 'cancelled'
                                          ? 'bg-red-500 hover:bg-red-600 text-white border-0 shadow-sm'
                                          : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300 shadow-sm'
                                      }
                                    >
                                      {po.status === 'received' && <div className="h-2 w-2 rounded-full bg-white mr-1.5"></div>}
                                      {po.status === 'pending' && <div className="h-2 w-2 rounded-full bg-yellow-600 mr-1.5"></div>}
                                      {po.status === 'cancelled' && <div className="h-2 w-2 rounded-full bg-white mr-1.5"></div>}
                                      {po.status}
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="py-4">
                                  <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                    <Calendar className="h-4 w-4 text-blue-500" />
                                    {new Date(po.createdAt).toLocaleDateString()}
                                  </div>
                                </TableCell>
                                <TableCell className="py-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setViewingPO(po)
                                      setIsViewPODialogOpen(true)
                                    }}
                                    className="hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md transition-all duration-200 border-2 group/btn"
                                  >
                                    <Eye className="h-4 w-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
                                    View
                                  </Button>
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
                  {/* Pending Requests Section - Table 1 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Purchase Order Requests</CardTitle>
                      <CardDescription>Accept purchase orders to receive goods from supplier. Once accepted, goods will be added to warehouse stock below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const pendingPOs = purchaseOrders.filter((po: any) => 
                          po.status === 'pending' && po.deliveryType === 'to_warehouse'
                        )
                        
                        return (
                          <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                            <Table>
                              <TableHeader>
                                <TableRow className="transition-all duration-200" style={{ backgroundColor: '#1e2961' }}>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>PO Number</TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Supplier</TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Products</TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Total Quantity</TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Expected Date</TableHead>
                                  <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Created Date</TableHead>
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
                                ) : pendingPOs.length === 0 ? (
                                  <TableRow className="bg-white hover:bg-blue-50/30 transition-all duration-200">
                                    <TableCell colSpan={7} className="text-center py-12">
                                      <div className="flex flex-col items-center text-muted-foreground">
                                        <FileText className="h-16 w-16 mb-4 opacity-30 text-blue-400" />
                                        <p className="text-lg font-medium">No pending purchase order requests</p>
                                        <p className="text-sm mt-1">All purchase orders have been accepted</p>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  pendingPOs.map((po: any, index: number) => {
                                    const totalQuantity = po.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
                                    return (
                                      <TableRow 
                                        key={po._id}
                                        className="bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 cursor-pointer border-b border-gray-100 group"
                                      >
                                        <TableCell className="font-semibold text-slate-900 group-hover:text-green-700 transition-colors py-4">
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
                                          <div className="space-y-1">
                                            {po.items.map((item: any, idx: number) => (
                                              <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 mr-1 mb-1">
                                                <ShoppingCart className="h-3 w-3 mr-1" />
                                                {item.productName} - {item.quantity}
                                              </Badge>
                                            ))}
                                          </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors">
                                            {totalQuantity} units
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                          <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                            <Calendar className="h-4 w-4 text-blue-500" />
                                            {po.expectedDate ? new Date(po.expectedDate).toLocaleDateString() : '-'}
                                          </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                          <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                            <Calendar className="h-4 w-4 text-indigo-500" />
                                            {new Date(po.createdAt).toLocaleDateString()}
                                          </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                          <Button
                                            variant="default"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              setSelectedPO(po)
                                              // Initialize GRN form with all PO items
                                              setGRNForm({
                                                poNumber: po.poNumber,
                                                receivedQuantity: totalQuantity.toString(),
                                                warehouseName: "Main Warehouse",
                                                items: po.items.map((item: any) => ({
                                                  productId: item.productId,
                                                  productName: item.productName,
                                                  orderedQuantity: item.quantity,
                                                  receivedQuantity: item.quantity, // Default: all received
                                                  damagedQuantity: 0,
                                                  lostQuantity: 0
                                                }))
                                              })
                                              setIsGRNDialogOpen(true)
                                            }}
                                            className="bg-green-600 hover:bg-green-700 hover:shadow-md text-white transition-all duration-200 group/btn"
                                          >
                                            <Package className="h-4 w-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
                                            Accept & Receive
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    )
                                  })
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>

                  {/* Current Warehouse Stock Section - Table 2 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Warehouse Stock</CardTitle>
                      <CardDescription>Accepted and received stock in warehouse. This shows actual physical stock available.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                        <Table>
                          <TableHeader>
                            <TableRow className="transition-all duration-200" style={{ backgroundColor: '#1e2961' }}>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Product Name</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Admin Stock</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Warehouse Stock</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Difference</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Last Supplier</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Total Received</TableHead>
                              <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Last Received</TableHead>
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
                            ) : warehouseStock.length === 0 ? (
                              <TableRow className="bg-white hover:bg-blue-50/30 transition-all duration-200">
                                <TableCell colSpan={7} className="text-center py-12">
                                  <div className="flex flex-col items-center text-muted-foreground">
                                    <Package className="h-16 w-16 mb-4 opacity-30 text-blue-400" />
                                    <p className="text-lg font-medium">No warehouse stock found</p>
                                    <p className="text-sm mt-1">Stock will appear here once goods are received</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              warehouseStock.map((stock: any, index: number) => {
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
                    <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                      <Table>
                        <TableHeader>
                          <TableRow className="transition-all duration-200" style={{ backgroundColor: '#1e2961' }}>
                            <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Product Name</TableHead>
                            <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Quantity</TableHead>
                            <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Reason</TableHead>
                            <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Description</TableHead>
                            <TableHead className="font-bold py-4" style={{ color: '#ffffff' }}>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            <TableRow className="bg-white hover:bg-blue-50/30 transition-all duration-200">
                              <TableCell colSpan={5} className="text-center py-8">
                                <div className="flex items-center justify-center gap-2">
                                  <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                                  <span className="text-gray-600">Loading...</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : wasteEntries.length === 0 ? (
                            <TableRow className="bg-white hover:bg-blue-50/30 transition-all duration-200">
                              <TableCell colSpan={5} className="text-center py-12">
                                <div className="flex flex-col items-center text-muted-foreground">
                                  <Trash2 className="h-16 w-16 mb-4 opacity-30 text-red-400" />
                                  <p className="text-lg font-medium">No waste entries found</p>
                                  <p className="text-sm mt-1">Record waste entries to track damaged or lost products</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            wasteEntries.map((waste: any, index: number) => (
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
                                    {new Date(waste.date).toLocaleDateString()}
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

              {/* View Product Details Dialog */}
              <Dialog open={isViewProductDetailsDialogOpen} onOpenChange={setIsViewProductDetailsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <DialogTitle>
                        {isEditMode ? 'Edit Product Details' : 'View All Product'} - {viewingProductDetails?.productName}
                      </DialogTitle>
                      <div className="flex space-x-2">
                        {!isEditMode && (
                          <Button onClick={handleEditModeToggle} variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        )}
                        {isEditMode && (
                          <>
                            <Button onClick={handleSaveChanges} size="sm">
                              <FileText className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                            <Button onClick={handleCancelEdit} variant="outline" size="sm">
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </DialogHeader>
                  {viewingProductDetails && (
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

                      <div className="flex justify-between">
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
                  )}
                </DialogContent>
              </Dialog>

              {/* Re-top up Full-Page Overlay */}
              {isEshopDialogOpen && editingCustomerId && (
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
                      setIsEshopDialogOpen(false)
                      setIsRetopUpMode(false)
                      setCustomerProducts([])
                      setEditingCustomerId(null)
                    }}
                  />
                  
                  {/* Content Container - Positioned in current viewport */}
                  <div 
                    className="fixed z-[9999] flex items-center justify-center pointer-events-none" 
                    id="retopup-content-container"
                    style={{
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: '100vw',
                      height: '100vh'
                    }}
                  >
                    {/* Content Card - Centered in Viewport */}
                    <div className="relative z-10 w-full max-w-[98vw] mx-4 bg-card rounded-lg shadow-2xl border pointer-events-auto max-h-[90vh] overflow-y-auto" id="retopup-content-card">
                      {/* Header with Close Button */}
                      <div className="sticky top-0 z-20 bg-card border-b px-6 py-4 rounded-t-lg flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold">
                    {isRetopUpMode ? `Re-top up Stock for ${editingCustomer?.name}` : `Edit Products for ${editingCustomer?.name}`}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">
                    {isRetopUpMode 
                      ? "Enter additional quantities to add to current stock (shown in quantity fields)"
                      : "Manage products and quantities for this customer"
                    }
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsEshopDialogOpen(false)
                            setIsRetopUpMode(false)
                            setCustomerProducts([])
                            setEditingCustomerId(null)
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                  <div className="space-y-6">
                    {/* Add Product Button */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Customer Products</h3>
                      <Button onClick={handleAddProductToCustomer} className="bg-blue-600 hover:bg-blue-700">
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
                          {customerProducts.map((product, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {product.isNew ? (
                                  <Select
                                    value={product.productId || ""}
                                    onValueChange={(value) => {
                                      const updatedProducts = [...customerProducts]
                                      updatedProducts[index] = { ...product, productId: value }
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
                                  <span className="font-medium">{product.name}</span>
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
                                  onClick={() => handleRemoveProductFromCustomer(index.toString())}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
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

                    {/* Action Buttons */}
                          <div className="flex justify-between items-center pt-4 border-t">
                            <Button 
                              variant="outline"
                              onClick={() => {
                                setIsEshopDialogOpen(false)
                                setIsRetopUpMode(false)
                                setCustomerProducts([])
                                setEditingCustomerId(null)
                              }}
                              className="flex items-center gap-2"
                            >
                              <ArrowLeft className="h-4 w-4" />
                              Back to My Customers
                            </Button>
                            <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEshopDialogOpen(false)
                          setIsRetopUpMode(false)
                          setCustomerProducts([])
                          setEditingCustomerId(null)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleUpdateCustomerProducts}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isRetopUpMode ? "Update Stock" : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
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

          {/* Re-top Up Dialog */}
          <Dialog open={isRetopUpDialogOpen} onOpenChange={setIsRetopUpDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Re-top Up Stock - {retopUpCustomerName}</DialogTitle>
                <DialogDescription>
                  Add additional stock to existing products
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRetopUpSubmit} className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity to Add</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerProductsForRetopUp.map((product, index) => (
                      <TableRow key={product._id}>
                        <TableCell className="font-medium">{product.productName}</TableCell>
                        <TableCell>{product.quantity - (product.invoicedQuantity || 0)} units</TableCell>
                        <TableCell>₹{product.price?.toLocaleString() || 0}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="0"
                            value={product.quantityToAdd || ""}
                            onChange={(e) => {
                              const updated = [...customerProductsForRetopUp]
                              updated[index].quantityToAdd = parseInt(e.target.value) || 0
                              setCustomerProductsForRetopUp(updated)
                            }}
                            min="0"
                            className="w-24"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Notes Field */}
                <div className="mt-4">
                  <Label htmlFor="retopup-notes">Notes (Optional)</Label>
                  <Textarea
                    id="retopup-notes"
                    placeholder="Add any notes about this re-top up..."
                    value={retopUpNotes}
                    onChange={(e) => setRetopUpNotes(e.target.value)}
                    rows={3}
                    className="mt-2"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsRetopUpDialogOpen(false)
                    setRetopUpNotes("")
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Update Stock
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

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
                <div className="grid grid-cols-2 gap-4">
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

          {/* GRN Full-Page Overlay */}
          {isGRNDialogOpen && selectedPO && (
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
                  setGRNForm({ poNumber: "", receivedQuantity: "", warehouseName: "Main Warehouse", items: [] })
                  setSelectedPO(null)
                }}
              />
              
              {/* Content Container */}
              <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-8 pb-8 overflow-y-auto pointer-events-none">
                {/* Content Card - Centered */}
                <div className="relative z-10 w-full max-w-[98vw] mx-4 bg-card rounded-lg shadow-2xl border pointer-events-auto max-h-[90vh] overflow-y-auto">
                  {/* Header with Close Button */}
                  <div className="sticky top-0 z-20 bg-card border-b px-6 py-4 rounded-t-lg flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Receive Goods (GRN) - {grnForm.poNumber}</h2>
                      <p className="text-sm text-muted-foreground mt-1">Accept goods from supplier. Optionally record damaged or lost items.</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsGRNDialogOpen(false)
                        setGRNForm({ poNumber: "", receivedQuantity: "", warehouseName: "Main Warehouse", items: [] })
                        setSelectedPO(null)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <form onSubmit={handleGRNSubmit} className="space-y-4">
                  <div>
                    <Label>PO Number</Label>
                    <Input
                      value={grnForm.poNumber}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label>Warehouse</Label>
                    <Input
                      value={grnForm.warehouseName}
                      onChange={(e) => setGRNForm({...grnForm, warehouseName: e.target.value})}
                    />
                  </div>

                  {/* Items Table with Damaged/Lost Fields */}
                  <div>
                    <Label className="mb-2 block">Items - Record Received, Damaged, and Lost Quantities</Label>
                    <div className="border rounded-lg overflow-x-auto">
                      <Table className="min-w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[200px]">Product Name</TableHead>
                            <TableHead className="min-w-[120px]">Ordered Qty</TableHead>
                            <TableHead className="min-w-[140px]">Received Qty</TableHead>
                            <TableHead className="min-w-[140px]">Damaged Qty</TableHead>
                            <TableHead className="min-w-[140px]">Lost Qty</TableHead>
                            <TableHead className="min-w-[140px]">Accepted Qty</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {grnForm.items.map((item, index) => {
                            const acceptedQty = item.receivedQuantity - item.damagedQuantity - item.lostQuantity
                            return (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{item.productName}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{item.orderedQuantity}</Badge>
                                </TableCell>
                                <TableCell className="min-w-[140px]">
                                  <Input
                                    type="number"
                                    min="0"
                                    max={item.orderedQuantity}
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
                                    value={item.damagedQuantity}
                                    onChange={(e) => {
                                      const newItems = [...grnForm.items]
                                      newItems[index].damagedQuantity = parseInt(e.target.value) || 0
                                      // Auto-adjust received quantity if damaged exceeds received
                                      if (newItems[index].damagedQuantity + newItems[index].lostQuantity > newItems[index].receivedQuantity) {
                                        newItems[index].receivedQuantity = newItems[index].damagedQuantity + newItems[index].lostQuantity
                                      }
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
                                    value={item.lostQuantity}
                                    onChange={(e) => {
                                      const newItems = [...grnForm.items]
                                      newItems[index].lostQuantity = parseInt(e.target.value) || 0
                                      // Auto-adjust received quantity if lost exceeds received
                                      if (newItems[index].damagedQuantity + newItems[index].lostQuantity > newItems[index].receivedQuantity) {
                                        newItems[index].receivedQuantity = newItems[index].damagedQuantity + newItems[index].lostQuantity
                                      }
                                      setGRNForm({...grnForm, items: newItems})
                                    }}
                                    className="w-full min-w-[100px]"
                                    placeholder="0"
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
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Accepted Qty = Received Qty - Damaged Qty - Lost Qty
                    </p>
                  </div>

                      <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => {
                          setIsGRNDialogOpen(false)
                          setGRNForm({ poNumber: "", receivedQuantity: "", warehouseName: "Main Warehouse", items: [] })
                          setSelectedPO(null)
                        }}>
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={grnForm.items.some((item: any) => {
                            const accepted = item.receivedQuantity - item.damagedQuantity - item.lostQuantity
                            return accepted < 0
                          })}
                        >
                          Accept & Receive Goods
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
                    <SelectContent>
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
                      <SelectContent>
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
        </main>
      </div>
    </div>
  )
}
