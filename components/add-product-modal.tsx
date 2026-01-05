"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Image, Video, Package, Save, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// ============================================
// INTERFACES & TYPES
// ============================================

interface ProductFormData {
  name: string
  description: string
  price: number
  category: string
  mainCategory: string
  subCategory: string
  availableSizes: string[]
  color: string
  material: string
  stock: number
  featured: boolean
  featuredNickname?: string
  images: File[]
  videos: File[]
  imageUrls: string[]
  videoUrls: string[]
  exclusive: boolean
  limitedTimeDeal: boolean
}

interface MainCategory {
  _id: string
  name: string
  image: string
}

interface SubCategory {
  _id: string
  name: string
  mainCategory: string
  image: string
}

const AVAILABLE_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']

// ============================================
// COMPLETE ADD PRODUCT MODAL COMPONENT
// ============================================

export default function AddProductModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}) {
  const { toast } = useToast()
  
  // Form State
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    category: "",
    mainCategory: "",
    subCategory: "",
    availableSizes: [],
    color: "",
    material: "",
    stock: 0,
    featured: false,
    featuredNickname: "",
    exclusive: false,
    limitedTimeDeal: false,
    images: [],
    videos: [],
    imageUrls: [],
    videoUrls: []
  })

  // Category State
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [availableSubCategories, setAvailableSubCategories] = useState<SubCategory[]>([])

  // Upload State
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imageUrlInput, setImageUrlInput] = useState("")
  const [videoUrlInput, setVideoUrlInput] = useState("")

  // Fetch Categories on Mount
  useEffect(() => {
    if (isOpen) {
      fetchCategories()
      // Lock page scroll when modal is open
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      // Unlock page scroll when modal is closed
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isOpen])

  // Update Available Sub Categories when Main Category Changes
  useEffect(() => {
    if (formData.mainCategory) {
      const filtered = subCategories.filter(sub => sub.mainCategory === formData.mainCategory)
      setAvailableSubCategories(filtered)
      // Reset sub category if current one doesn't belong to selected main category
      if (formData.subCategory && !filtered.find(sub => sub.name === formData.subCategory)) {
        setFormData(prev => ({ ...prev, subCategory: "" }))
      }
    } else {
      setAvailableSubCategories([])
    }
  }, [formData.mainCategory, subCategories])

  // ============================================
  // HANDLER FUNCTIONS
  // ============================================

  const fetchCategories = async () => {
    try {
      const [mainRes, subRes] = await Promise.all([
        fetch('/api/categories/main'),
        fetch('/api/categories/sub')
      ])
      
      const mainData = await mainRes.json()
      const subData = await subRes.json()
      
      if (mainData.success) {
        setMainCategories(mainData.categories || [])
      }
      
      if (subData.success) {
        setSubCategories(subData.subCategories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      availableSizes: prev.availableSizes.includes(size)
        ? prev.availableSizes.filter(s => s !== size)
        : [...prev.availableSizes, size]
    }))
  }

  const handleCustomSize = () => {
    const customSize = prompt('Enter custom size:')
    if (customSize && !formData.availableSizes.includes(customSize)) {
      setFormData(prev => ({
        ...prev,
        availableSizes: [...prev.availableSizes, customSize]
      }))
    }
  }

  const handleFileUpload = (type: 'images' | 'videos', files: FileList | null) => {
    if (!files) return
    
    const newFiles = Array.from(files)
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ...newFiles]
    }))
  }

  const removeFile = (type: 'images' | 'videos', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const addImageUrl = () => {
    if (!imageUrlInput.trim()) return
    
    if (!validateUrl(imageUrlInput)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL",
        variant: "destructive"
      })
      return
    }

    setFormData(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, imageUrlInput.trim()]
    }))
    setImageUrlInput("")
  }

  const addVideoUrl = () => {
    if (!videoUrlInput.trim()) return
    
    if (!validateUrl(videoUrlInput)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid video URL",
        variant: "destructive"
      })
      return
    }

    setFormData(prev => ({
      ...prev,
      videoUrls: [...prev.videoUrls, videoUrlInput.trim()]
    }))
    setVideoUrlInput("")
  }

  const removeImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }))
  }

  const removeVideoUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videoUrls: prev.videoUrls.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formDataToSend = new FormData()
      
      // Build hierarchical category string
      let categoryString = formData.mainCategory
      if (formData.subCategory) {
        categoryString = `${formData.mainCategory}/${formData.subCategory}`
      }
      
      // Add text data
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price.toString())
      formDataToSend.append('category', categoryString)
      formDataToSend.append('mainCategory', formData.mainCategory)
      if (formData.subCategory) {
        formDataToSend.append('subCategory', formData.subCategory)
      }
      formDataToSend.append('availableSizes', JSON.stringify(formData.availableSizes))
      formDataToSend.append('color', formData.color)
      formDataToSend.append('material', formData.material)
      formDataToSend.append('stock', formData.stock.toString())
      formDataToSend.append('featured', formData.featured.toString())
      if (formData.featuredNickname) {
        formDataToSend.append('featuredNickname', formData.featuredNickname)
      }
      formDataToSend.append('exclusive', formData.exclusive.toString())
      formDataToSend.append('limitedTimeDeal', formData.limitedTimeDeal.toString())

      // Add images
      formData.images.forEach((image) => {
        formDataToSend.append(`images`, image)
      })

      // Add videos
      formData.videos.forEach((video) => {
        formDataToSend.append(`videos`, video)
      })

      // Add image URLs
      formData.imageUrls.forEach((url) => {
        formDataToSend.append('imageUrls', url)
      })

      // Add video URLs
      formData.videoUrls.forEach((url) => {
        formDataToSend.append('videoUrls', url)
      })

      const response = await fetch('/api/products/upload', {
        method: 'POST',
        body: formDataToSend
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      
      if (result.warning) {
        toast({
          title: "Upload Successful with Warning",
          description: result.warning,
          variant: "default"
        })
      } else {
        toast({
          title: "Success!",
          description: "Product uploaded successfully",
        })
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        mainCategory: "",
        subCategory: "",
        availableSizes: [],
        color: "",
        material: "",
        stock: 0,
        featured: false,
        featuredNickname: "",
        exclusive: false,
        limitedTimeDeal: false,
        images: [],
        videos: [],
        imageUrls: [],
        videoUrls: []
      })
      setImageUrlInput("")
      setVideoUrlInput("")
      setUploadProgress(0)
      onSuccess?.()
      onClose()

    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload product. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '896px',
          maxWidth: '896px',
          height: '90vh',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 border-b bg-white" style={{ flexShrink: 0, minHeight: 'auto' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Add New Product</h2>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </Button>
          </div>
        </div>

        {/* Scrollable Content - Viewing Window */}
        <div 
          className="flex-1 grn-dialog-scroll bg-white"
          style={{
            overflowY: 'scroll',
            overflowX: 'hidden',
            minHeight: 0,
            flex: '1 1 0%',
            width: '100%',
            maxWidth: '100%',
            position: 'relative',
            height: 'calc(90vh - 100px)',
            maxHeight: 'calc(90vh - 100px)'
          }}
        >
          {/* Content inside the card - this scrolls */}
          <div className="p-6" style={{ width: '100%', boxSizing: 'border-box' }}>
            {/* Upload Form */}
            <div className="space-y-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Add New Product</h3>
                </div>
                <p className="text-sm text-muted-foreground">Fill in the product details and upload images/videos</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6" style={{ width: '100%', boxSizing: 'border-box' }}>
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Premium Brown Leather Jacket"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      placeholder="299.99"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the product features, quality, and craftsmanship..."
                    rows={4}
                    required
                  />
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mainCategory">Main Category *</Label>
                    <Select 
                      value={formData.mainCategory} 
                      onValueChange={(value) => {
                        handleInputChange('mainCategory', value)
                        handleInputChange('subCategory', '') // Reset sub category
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select main category" />
                      </SelectTrigger>
                      <SelectContent>
                        {mainCategories.map((cat) => (
                          <SelectItem key={cat._id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subCategory">Sub Category (Jacket Type) *</Label>
                    <Select 
                      value={formData.subCategory} 
                      onValueChange={(value) => handleInputChange('subCategory', value)}
                      disabled={!formData.mainCategory || availableSubCategories.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={!formData.mainCategory ? "Select main category first" : "Select jacket type"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubCategories.map((subCat) => (
                          <SelectItem key={subCat._id} value={subCat.name}>
                            {subCat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!formData.mainCategory && (
                      <p className="text-xs text-muted-foreground">Select main category first</p>
                    )}
                    {formData.mainCategory && availableSubCategories.length === 0 && (
                      <p className="text-xs text-muted-foreground">No sub categories available. Create one in Categories tab.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Available Sizes</Label>
                    <div className="space-y-3">
                      {/* Standard Sizes */}
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {AVAILABLE_SIZES.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeToggle(size)}
                            className={`
                              px-3 py-2 text-sm font-medium rounded-lg border transition-colors
                              ${formData.availableSizes.includes(size)
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                              }
                            `}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      
                      {/* Custom Size Button */}
                      <div className="flex justify-start">
                        <button
                          type="button"
                          onClick={handleCustomSize}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Custom
                        </button>
                      </div>
                      
                      {/* Selected Sizes Display */}
                      {formData.availableSizes.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Selected sizes:</p>
                          <div className="flex flex-wrap gap-1">
                            {formData.availableSizes.map((size) => (
                              <span
                                key={size}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                              >
                                {size}
                                <button
                                  type="button"
                                  onClick={() => handleSizeToggle(size)}
                                  className="hover:text-red-500"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      placeholder="Brown, Black, Tan, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      value={formData.material}
                      onChange={(e) => handleInputChange('material', e.target.value)}
                      placeholder="Genuine Leather, Suede, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock || ''}
                      onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                      placeholder="10"
                    />
                  </div>
                </div>

                {/* Product Tags */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Product Tags</Label>
                  
                  {/* Featured Toggle */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => handleInputChange('featured', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                      {formData.featured && <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">Featured</Badge>}
                    </div>
                    {formData.featured && (
                      <div className="ml-6">
                        <Label htmlFor="featuredNickname">Short Name / Nickname (shown on hover)</Label>
                        <Input
                          id="featuredNickname"
                          value={formData.featuredNickname || ''}
                          onChange={(e) => handleInputChange('featuredNickname', e.target.value)}
                          placeholder="e.g., Rider, Bomber, Aviator"
                        />
                      </div>
                    )}
                  </div>

                  {/* Exclusive Toggle */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="exclusive"
                      checked={formData.exclusive}
                      onChange={(e) => handleInputChange('exclusive', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="exclusive">Exclusive Product</Label>
                    {formData.exclusive && <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0">Exclusive</Badge>}
                  </div>

                  {/* Limited Time Deal Toggle */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="limitedTimeDeal"
                      checked={formData.limitedTimeDeal}
                      onChange={(e) => handleInputChange('limitedTimeDeal', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="limitedTimeDeal">Limited Time Deal</Label>
                    {formData.limitedTimeDeal && <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">Limited Deal</Badge>}
                  </div>
                </div>

                {/* File Uploads */}
                <div className="space-y-4">
                  {/* Images Upload */}
                  <div className="space-y-2">
                    <Label>Product Images *</Label>
                    
                    {/* File Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">Upload product images</p>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload('images', e.target.files)}
                        className="max-w-xs mx-auto"
                      />
                    </div>

                    {/* URL Input */}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Or add image URLs</Label>
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={addImageUrl}
                          variant="outline"
                          disabled={!imageUrlInput.trim()}
                        >
                          Add URL
                        </Button>
                      </div>
                    </div>

                    {/* Uploaded Files Preview */}
                    {formData.images.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Uploaded Files</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {formData.images.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                                <Image className="h-8 w-8 text-gray-400" />
                              </div>
                              <p className="text-xs text-center mt-1 truncate">{file.name}</p>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeFile('images', index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Image URLs Preview */}
                    {formData.imageUrls.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Image URLs</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {formData.imageUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={url}
                                  alt={`Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                  }}
                                />
                                <div className="hidden w-full h-full items-center justify-center">
                                  <Image className="h-8 w-8 text-gray-400" />
                                </div>
                              </div>
                              <p className="text-xs text-center mt-1 truncate">{url}</p>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImageUrl(index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Videos Upload */}
                  <div className="space-y-2">
                    <Label>Product Videos (Optional)</Label>
                    
                    {/* File Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <Video className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">Upload product videos</p>
                      <Input
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={(e) => handleFileUpload('videos', e.target.files)}
                        className="max-w-xs mx-auto"
                      />
                    </div>

                    {/* URL Input */}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Or add video URLs</Label>
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          placeholder="https://example.com/video.mp4"
                          value={videoUrlInput}
                          onChange={(e) => setVideoUrlInput(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={addVideoUrl}
                          variant="outline"
                          disabled={!videoUrlInput.trim()}
                        >
                          Add URL
                        </Button>
                      </div>
                    </div>

                    {/* Uploaded Files Preview */}
                    {formData.videos.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Uploaded Files</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {formData.videos.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                  <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-xs text-gray-600 truncate">{file.name}</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeFile('videos', index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Video URLs Preview */}
                    {formData.videoUrls.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Video URLs</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {formData.videoUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                <div className="text-center">
                                  <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-xs text-gray-600 truncate">{url.split('/').pop()}</p>
                                </div>
                              </div>
                              <p className="text-xs text-center mt-1 truncate">{url}</p>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeVideoUrl(index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Validation Status */}
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className={`flex items-center gap-2 ${formData.name ? 'text-green-600' : 'text-red-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${formData.name ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {formData.name ? 'Product name provided' : 'Product name required'}
                  </div>
                  <div className={`flex items-center gap-2 ${formData.description ? 'text-green-600' : 'text-red-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${formData.description ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {formData.description ? 'Description provided' : 'Description required'}
                  </div>
                  <div className={`flex items-center gap-2 ${formData.mainCategory ? 'text-green-600' : 'text-red-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${formData.mainCategory ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {formData.mainCategory ? `Main category selected: ${formData.mainCategory}` : 'Main category required (Mens or Womens)'}
                  </div>
                  <div className={`flex items-center gap-2 ${formData.subCategory ? 'text-green-600' : 'text-red-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${formData.subCategory ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {formData.subCategory ? `Sub category selected: ${formData.subCategory}` : 'Sub category required (jacket type)'}
                  </div>
                  <div className={`flex items-center gap-2 ${(formData.images.length > 0 || formData.imageUrls.length > 0) ? 'text-green-600' : 'text-red-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${(formData.images.length > 0 || formData.imageUrls.length > 0) ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {(formData.images.length > 0 || formData.imageUrls.length > 0) 
                      ? `Images provided (${formData.images.length} files, ${formData.imageUrls.length} URLs)` 
                      : 'At least one image required (upload file or add URL)'}
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isUploading || !formData.name || !formData.description || !formData.mainCategory || !formData.subCategory || (formData.images.length === 0 && formData.imageUrls.length === 0)}
                >
                  {isUploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Upload Product
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
