"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useDashboardLogout } from "@/components/dashboard-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  LogOut
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

const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'products')
  
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
  const [activeSection, setActiveSection] = useState("dashboard")
  const [activeSubSection, setActiveSubSection] = useState("all-items")
  const [isProductsManagementExpanded, setIsProductsManagementExpanded] = useState(false)
  const [isCustomerManagementExpanded, setIsCustomerManagementExpanded] = useState(false)
  const [isOrdersExpanded, setIsOrdersExpanded] = useState(false)
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
    notes: ""
  })
  const [eshopSearchTerm, setEshopSearchTerm] = useState("")
  const [isRetopUpDialogOpen, setIsRetopUpDialogOpen] = useState(false)
  const [retopUpItem, setRetopUpItem] = useState<any>(null)
  const [retopUpQuantity, setRetopUpQuantity] = useState("")
  const [isRecordUsageDialogOpen, setIsRecordUsageDialogOpen] = useState(false)
  const [recordUsageItem, setRecordUsageItem] = useState<any>(null)
  const [usedQuantity, setUsedQuantity] = useState("")
  const [orders, setOrders] = useState<any[]>([])
  const [orderSearchTerm, setOrderSearchTerm] = useState("")
  const [isViewOrderDialogOpen, setIsViewOrderDialogOpen] = useState(false)
  const [viewingOrder, setViewingOrder] = useState<any>(null)
  const [quotations, setQuotations] = useState<any[]>([])
  const [quotationSearchTerm, setQuotationSearchTerm] = useState("")
  const [isViewQuotationDialogOpen, setIsViewQuotationDialogOpen] = useState(false)
  const [viewingQuotation, setViewingQuotation] = useState<any>(null)
  const [isEditQuotationDialogOpen, setIsEditQuotationDialogOpen] = useState(false)
  const [editingQuotation, setEditingQuotation] = useState<any>(null)
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [enquirySearchTerm, setEnquirySearchTerm] = useState("")
  const [isViewEnquiryDialogOpen, setIsViewEnquiryDialogOpen] = useState(false)
  const [viewingEnquiry, setViewingEnquiry] = useState<any>(null)
  const [isEditEnquiryDialogOpen, setIsEditEnquiryDialogOpen] = useState(false)
  const [editingEnquiry, setEditingEnquiry] = useState<any>(null)
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

  // Use logout function from context
  const { handleLogout } = useDashboardLogout()

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
    price: "",
    stock: "",
    description: "",
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
    location: ""
  })

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [productsData, servicesData, categoriesData, subCategoriesData, level2CategoriesData, customersData, eshopData, ordersData, quotationsData, enquiriesData] = await Promise.all([
          fetchProducts(),
          fetchServices(),
          fetchCategories(),
          fetchSubCategories(),
          fetchLevel2Categories(),
          fetchCustomers(),
          fetchEshopInventory(),
          fetchOrders(),
          fetchQuotations(),
          fetchEnquiries()
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
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

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

  // Handle edit E-Shop item
  const handleEditEshopItem = (item: any) => {
    // Load all products for this customer
    const customerInventory = eshopInventory.filter((inv: any) => inv.customerId === item.customerId)
    setCustomerProducts(customerInventory)
    setEditingCustomerId(item.customerId)
    setIsRetopUpMode(false) // Not re-top up mode
    setIsEshopDialogOpen(true)
    setOpenDropdownId(null) // Close dropdown
  }

  // This function is now defined later (line ~1072) to handle both create and update

  // Handle Re-top up - Opens Edit Manually dialog for adding stock
  const handleRetopUp = (item: any) => {
    // Load all products for this customer and update quantities to current remaining stock
    const customerInventory = eshopInventory.filter((inv: any) => inv.customerId === item.customerId).map((inv: any) => ({
      ...inv,
      // Use the current remaining quantity (Total Stock) for re-top up
      quantity: inv.quantity - (inv.invoicedQuantity || 0)
    }))
    setCustomerProducts(customerInventory)
    setEditingCustomerId(item.customerId)
    setIsRetopUpMode(true) // Mark as re-top up mode
    setIsEshopDialogOpen(true)
    setOpenDropdownId(null) // Close dropdown
  }

  // Handle Re-top up submit
  const handleRetopUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newQuantity = retopUpItem.quantity + parseInt(retopUpQuantity)
      const result = await updateEshopInventory(retopUpItem._id, {
        quantity: newQuantity,
        notes: `Re-topped up with ${retopUpQuantity} units. ${retopUpItem.notes || ""}`
      })
      
      if (result.success) {
        setEshopInventory(eshopInventory.map((item: any) => 
          item._id === retopUpItem._id ? result.data : item
        ))
        setIsRetopUpDialogOpen(false)
        setRetopUpItem(null)
        setRetopUpQuantity("")
      } else {
        alert('Error re-topping up: ' + result.error)
      }
    } catch (error) {
      console.error('Error re-topping up:', error)
      alert('Error re-topping up')
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

      const result = await createProduct({
        ...productForm,
        category: categoryString,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        vendor: "Admin"
      })
      
      if (result.success) {
        setProducts([...products, result.data])
        setProductForm({ name: "", mainCategory: "", subCategory: "", level2Category: "", price: "", stock: "", description: "", images: [] })
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
        vendor: "Admin"
      })
      
      if (result.success) {
        setServices([...services, result.data])
        setServiceForm({ name: "", mainCategory: "", subCategory: "", level2Category: "", price: "", duration: "", description: "", location: "" })
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
      setEshopForm({ customerId: '', customerName: '', productId: '', productName: '', quantity: '', price: 0, notes: '' })
    } catch (error) {
      console.error('Error submitting inventory:', error)
      alert('Error submitting inventory')
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

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true)
      const result = await uploadFile(file)
      if (result.success) {
        return result.data.url
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

  return (
    <div className="flex h-screen bg-background">
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
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-card border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Manage your products and services</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
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

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
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
                                <div>
                                  <Label htmlFor="service-description">Description</Label>
                                  <Textarea
                                    id="service-description"
                                    placeholder="Enter service description"
                                    value={serviceForm.description}
                                    onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                                    required
                                  />
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button type="button" variant="outline" onClick={() => {
                                    setIsServiceDialogOpen(false)
                                    setServiceForm({ name: "", mainCategory: "", subCategory: "", level2Category: "", price: "", duration: "", description: "", location: "" })
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
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="product-price">Price (₹)</Label>
                                    <Input
                                      id="product-price"
                                      type="number"
                                      placeholder="0"
                                      value={productForm.price}
                                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                                      required
                                    />
                                  </div>
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
                                </div>
                                <div>
                                  <Label htmlFor="product-description">Description</Label>
                                  <Textarea
                                    id="product-description"
                                    placeholder="Enter product description"
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                                    required
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
                                            const url = await handleImageUpload(files[i])
                                            if (url) urls.push(url)
                                          }
                                          setProductForm({...productForm, images: [...productForm.images, ...urls]})
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 min-h-[120px] max-h-[200px] overflow-hidden">
                                    {productForm.images.length > 0 ? (
                                      <div className="grid grid-cols-2 gap-2 h-full">
                                        {productForm.images.map((image, index) => (
                                          <div key={index} className="relative h-20">
                                            <img 
                                              src={image} 
                                              alt={`Product ${index + 1}`} 
                                              className="w-full h-full object-cover rounded border"
                                            />
                                            <Button
                                              type="button"
                                              variant="destructive"
                                              size="sm"
                                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full z-10"
                                              onClick={() => setProductForm({...productForm, images: productForm.images.filter((_, i) => i !== index)})}
                                            >
                                              ×
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-center h-full flex flex-col justify-center">
                                        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <span className="mt-2 block text-sm font-medium text-muted-foreground">
                                          No images uploaded yet
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button type="button" variant="outline" onClick={() => {
                                    setIsProductDialogOpen(false)
                                    setProductForm({ name: "", mainCategory: "", subCategory: "", level2Category: "", price: "", stock: "", description: "", images: [] })
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
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Orders</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
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
                            <TableCell>₹{product.price.toLocaleString()}</TableCell>
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

          {/* Customer Management Section */}
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
                    <Dialog open={isEshopDialogOpen} onOpenChange={setIsEshopDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product Inventory
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-none w-[98vw] max-h-[90vh] overflow-y-auto" style={{ width: '98vw', maxWidth: '98vw' }}>
                        <DialogHeader>
                          <DialogTitle>
                            {isRetopUpMode ? 'Re-top up Stock for' : 'Edit Products for'} {customerProducts[0]?.customerName || 'Customer'}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Description */}
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                              {isRetopUpMode ? 'Enter additional quantities to add to current stock (shown in quantity fields)' : 'Manage all products for this customer'}
                            </div>
                          </div>
                          {/* Products Table */}
                          <div className="border rounded-lg overflow-x-auto">
                            <Table className="min-w-[1200px]">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Product Name</TableHead>
                                  <TableHead>Price (₹)</TableHead>
                                  <TableHead>Discount (₹)</TableHead>
                                  <TableHead>{isRetopUpMode ? 'Add Qty' : 'Quantity'}</TableHead>
                                  <TableHead>Notes</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {customerProducts.map((product: any, index: number) => (
                                  <TableRow key={product._id}>
                                    <TableCell>
                                      {product.isNew ? (
                                        <Select
                                          value={product.productId}
                                          onValueChange={(value) => {
                                            const selectedProduct = products.find((p: any) => p._id === value)
                                            const updatedProducts = [...customerProducts]
                                            updatedProducts[index] = {
                                              ...updatedProducts[index],
                                              productId: value,
                                              productName: selectedProduct?.name || '',
                                              price: selectedProduct?.price || 0
                                            }
                                            setCustomerProducts(updatedProducts)
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select product" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {products.map((p: any) => (
                                              <SelectItem key={p._id} value={p._id}>
                                                {p.name} - ₹{p.price}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        <div className="font-medium">{product.productName}</div>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        value={product.price}
                                        onChange={(e) => {
                                          const updatedProducts = [...customerProducts]
                                          updatedProducts[index].price = parseFloat(e.target.value) || 0
                                          setCustomerProducts(updatedProducts)
                                        }}
                                        min="0"
                                        step="0.01"
                                        className="w-32"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <div className="font-medium text-green-600">
                                        ₹{((product.price || 0) * 0.33).toFixed(1)}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        value={product.quantity}
                                        onChange={(e) => {
                                          const updatedProducts = [...customerProducts]
                                          updatedProducts[index].quantity = parseInt(e.target.value) || 1
                                          setCustomerProducts(updatedProducts)
                                        }}
                                        min="1"
                                        className="w-24"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        value={product.notes || ''}
                                        onChange={(e) => {
                                          const updatedProducts = [...customerProducts]
                                          updatedProducts[index].notes = e.target.value
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
                                        onClick={() => handleRemoveProductFromCustomer(product._id)}
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
                          <div className="border-t pt-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Sub Total:</span>
                                <div className="flex space-x-8">
                                  <span className="text-sm font-medium">
                                    ₹{customerProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()}
                                  </span>
                                  <span className="text-sm font-medium text-green-600">
                                    ₹{customerProducts.reduce((sum, p) => sum + (p.price * p.quantity * 0.33), 0).toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Tax:</span>
                                <span className="text-sm font-medium">
                                  ₹{customerProducts.reduce((sum, p) => sum + (p.price * p.quantity * 0.25), 0).toFixed(1)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Discount:</span>
                                <span className="text-sm font-medium">
                                  ₹{customerProducts.reduce((sum, p) => sum + (p.price * p.quantity * 0.33), 0).toFixed(1)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center border-t pt-2">
                                <span className="text-lg font-bold">Grand Total:</span>
                                <div className="flex space-x-8">
                                  <span className="text-lg font-bold">
                                    ₹{customerProducts.reduce((sum, p) => sum + (p.price * p.quantity * 0.92), 0).toFixed(1)}
                                  </span>
                                  <span className="text-sm font-medium text-green-600">
                                    ₹{customerProducts.reduce((sum, p) => sum + (p.price * p.quantity * 0.33), 0).toFixed(1)}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {customerProducts.reduce((sum, p) => sum + p.quantity, 0)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => {
                              setIsEshopDialogOpen(false)
                              setCustomerProducts([])
                              setEditingCustomerId(null)
                              setIsRetopUpMode(false)
                            }}>
                              Cancel
                            </Button>
                            <Button onClick={handleUpdateCustomerProducts}>
                              {isRetopUpMode ? 'Update Stock' : 'Save Changes'}
                            </Button>
                          </div>
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
                                <CardTitle className="text-xl">{customerData.customerName}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {customerData.products.length} product{customerData.products.length !== 1 ? 's' : ''} in stock
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => {
                                    // Use the first product to get customer info, then load all products
                                    const firstProduct = customerData.products[0];
                                    handleRetopUp(firstProduct);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Re-top up
                                </Button>
                                <Button
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
                                <TableRow>
                                  <TableHead>Product Name</TableHead>
                                  <TableHead>Total Stock</TableHead>
                                  <TableHead>Last Invoice</TableHead>
                                  <TableHead>Last Updated</TableHead>
                                  <TableHead>Notes</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {customerData.products.map((item: any) => {
                                  const invoicedQty = item.invoicedQuantity || 0;
                                  const remainingQty = item.quantity - invoicedQty;
                                  return (
                                    <TableRow key={item._id}>
                                      <TableCell>
                                        <div className="font-medium">{item.productName}</div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant={remainingQty < 10 ? "destructive" : "default"}>
                                          {remainingQty} units
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant="outline">
                                          {invoicedQty} units
                                        </Badge>
                                      </TableCell>
                                    <TableCell>
                                      <div className="text-sm text-muted-foreground">
                                        {new Date(item.lastUpdated).toLocaleDateString()}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                                        {item.notes || "-"}
                                      </div>
                                    </TableCell>
                                    <TableCell className="relative">
                                      <div className="relative flex space-x-2">
                                        <Button 
                                          size="sm"
                                          onClick={() => handleRetopUp(item)}
                                          className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                          <Plus className="h-4 w-4 mr-1" />
                                          Re-top up
                                        </Button>
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
                                                onClick={() => handleRecordUsage(item)}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                              >
                                                <DollarSign className="h-4 w-4 mr-2" />
                                                Record Usage
                                              </button>
                                              <button
                                                onClick={() => handleEditEshopItem(item)}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                              >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Manually
                                              </button>
                                              <button
                                                onClick={() => handleViewProductDetails(item)}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                              >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
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
                        <TableRow>
                          <TableHead>Customer Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Joined Date</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
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
                                  <div className="text-sm text-muted-foreground max-w-xs truncate">
                                    {customer.address ? `${customer.address}, ${customer.city || ''}` : '-'}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(customer.createdAt).toLocaleDateString()}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm text-muted-foreground">
                                    {customer.lastLogin ? new Date(customer.lastLogin).toLocaleString() : 'Never'}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={customer.isBlocked ? "destructive" : "default"}>
                                    {customer.isBlocked ? "Blocked" : "Active"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleEditCustomer(customer)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCustomer(customer._id)}>
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



          {/* Orders Section */}
          {activeSection === "orders" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Orders Management</h2>
                <p className="text-muted-foreground">View and manage all customer orders</p>
              </div>

              {/* All Orders Tab */}
              {activeSubSection === "all-orders" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>All Orders</CardTitle>
                    <div className="flex items-center space-x-2">
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
                      <TableRow>
                        <TableHead>Order No</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
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
                      ) : (
                        orders
                          .filter((order: any) => 
                            order.orderNo.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                            order.customerName.toLowerCase().includes(orderSearchTerm.toLowerCase())
                          )
                          .map((order: any) => (
                            <TableRow key={order._id}>
                              <TableCell>
                                <div className="font-medium">#{order.orderNo}</div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{order.customerName}</div>
                                <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm max-w-xs truncate">
                                  {order.shippingAddress?.street || order.shippingAddress?.city 
                                    ? `${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}`
                                    : '-'
                                  }
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">₹{order.totalAmount.toLocaleString()}</div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleTimeString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={order.status === "Confirmed" ? "default" : "secondary"}>
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Select
                                    value={order.status}
                                    onValueChange={(value) => updateOrderStatus(order._id, value)}
                                  >
                                    <SelectTrigger className="w-32 h-8">
                                      <SelectValue />
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
                                  <div className="relative">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleOrderDropdown(order._id)
                                      }}
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                    
                                    {openOrderDropdownId === order._id && (
                                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]">
                                        <div className="py-1">
                                          <button
                                            onClick={() => {
                                              handleViewOrder(order)
                                              setOpenOrderDropdownId(null)
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                          >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View
                                          </button>
                                          <button
                                            onClick={() => {
                                              handleEditOrder(order)
                                              setOpenOrderDropdownId(null)
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                          >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                          </button>
                                          <button
                                            onClick={() => {
                                              deleteOrder(order._id)
                                              setOpenOrderDropdownId(null)
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                                          >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
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
                            <TableRow>
                              <TableHead>Product Name</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {viewingOrder.items?.map((item: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <div className="font-medium">{item.productName}</div>
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>₹{item.price.toLocaleString()}</TableCell>
                                <TableCell>₹{item.total.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
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
                            {orderEditForm.items?.map((item: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <div className="font-medium">{item.productName}</div>
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>₹{item.price.toLocaleString()}</TableCell>
                                <TableCell>₹{item.total.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
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
                        ) : (
                          quotations
                            .filter((quotation: any) => 
                              (quotation.userName?.toLowerCase() || '').includes(quotationSearchTerm.toLowerCase()) ||
                              (quotation.userEmail?.toLowerCase() || '').includes(quotationSearchTerm.toLowerCase())
                            )
                            .map((quotation: any) => (
                              <TableRow key={quotation._id}>
                                <TableCell>
                                  <div className="font-medium">{quotation.userName || 'Guest'}</div>
                                  <div className="text-sm text-muted-foreground">{quotation.userEmail}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">{quotation.company || '-'}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">{quotation.userPhone || '-'}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">{quotation.items?.length || 0} items</div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    {new Date(quotation.quotationDate).toLocaleDateString()}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(quotation.quotationDate).toLocaleTimeString()}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant={quotation.status === "pending" ? "secondary" : "default"}>
                                      {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                                    </Badge>
                                    <Select
                                      value={quotation.status}
                                      onValueChange={(value) => updateQuotationStatus(quotation._id, value)}
                                    >
                                      <SelectTrigger className="w-32 h-8">
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
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
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
                                      onClick={() => handleEditQuotation(quotation)}
                                      title="Edit quotation"
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
                            ))
                        )}
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
                            <TableRow>
                              <TableHead>Item Name</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Subtotal</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {viewingQuotation.items?.map((item: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <div className="font-medium">{item.itemName}</div>
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>₹{item.price?.toLocaleString() || '0'}</TableCell>
                                <TableCell>₹{((item.price || 0) * (item.quantity || 0)).toLocaleString()}</TableCell>
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

              {/* Re-top up Dialog */}
              <Dialog open={isEshopDialogOpen} onOpenChange={setIsEshopDialogOpen}>
                <DialogContent className="max-w-none w-[98vw] max-h-[90vh] overflow-y-auto" style={{ width: '98vw', maxWidth: '98vw' }}>
                  <DialogTitle>
                    {isRetopUpMode ? `Re-top up Stock for ${editingCustomer?.name}` : `Edit Products for ${editingCustomer?.name}`}
                  </DialogTitle>
                  <DialogDescription>
                    {isRetopUpMode 
                      ? "Enter additional quantities to add to current stock (shown in quantity fields)"
                      : "Manage products and quantities for this customer"
                    }
                  </DialogDescription>

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
                    <div className="flex justify-end space-x-4">
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
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Enquiries Tab */}
          {activeSubSection === "enquiries" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Enquiries</CardTitle>
                  <div className="flex items-center space-x-2">
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

                  <div className="flex justify-end">
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
        </main>
      </div>
    </div>
  )
}
