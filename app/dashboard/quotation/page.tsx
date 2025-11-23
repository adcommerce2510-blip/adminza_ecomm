"use client"

import React, { useRef, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Download, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface QuotationData {
  _id?: string
  quotationNo?: string
  quotationDate?: string
  userEmail?: string
  userName?: string
  userPhone?: string
  userAddress?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  company?: string
  gstNumber?: string
  items?: Array<{
    itemId?: string
    itemName: string
    quantity: number
    price: number
    total?: number
  }>
  totalAmount?: number
  description?: string
  notes?: string
  status?: string
}

const QuotationPreview = ({ data = {} as QuotationData, showDownloadButton = true, isPdfExport = false, isEditable = false, editableItems = [], onItemsChange = () => {} }) => {
  const previewRef = useRef<HTMLDivElement>(null)

  // Extract customer and quotation data
  const customerName = data?.userName || data?.company || "Customer Name"
  const customerAddress = data?.userAddress?.street || "Customer Address"
  const customerCity = data?.userAddress?.city || "Customer City"
  const customerState = data?.userAddress?.state || "Maharashtra"
  const customerZipCode = data?.userAddress?.zipCode || "400001"
  const customerCountry = data?.userAddress?.country || "India"
  const customerEmail = data?.userEmail || "customer@email.com"
  const customerPhone = data?.userPhone || "1234567890"
  const customerGstNumber = data?.gstNumber || "N/A"
  const company = data?.company || ""

  const quotationNo = data?.quotationNo || `QUO-${Date.now()}`
  const quotationDate = data?.quotationDate || new Date().toLocaleDateString('en-IN')

  const items = isEditable ? editableItems : (data?.items || [])
  const totalAmount = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0)

  // PDF Export (placeholder - can be enhanced later)
  const handleDownloadPDF = async () => {
    try {
      // Use window.print for now
      window.print()
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  return (
    <div>
      {showDownloadButton && (
        <button
          onClick={handleDownloadPDF}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold text-sm"
          type="button"
        >
          <Download className="h-4 w-4 inline mr-2" />
          Download PDF
        </button>
      )}
      <div
        ref={previewRef}
        className="w-[800px] mx-auto bg-white shadow-lg text-black"
        style={{ 
          fontFamily: 'Arial, sans-serif', 
          color: isPdfExport ? '#000000' : '#000', 
          background: isPdfExport ? '#ffffff' : '#fff', 
          minHeight: '800px',
          padding: '20px',
          fontSize: '12px',
          ...(isPdfExport && {
            color: '#000000 !important',
            backgroundColor: '#ffffff !important'
          })
        }}
      >
        {/* PDF-specific CSS overrides */}
        {isPdfExport && (
          <style>
            {`
              * {
                color: #000000 !important;
                background-color: transparent !important;
                border-color: #000000 !important;
              }
              .bg-white, .bg-gray-50, .bg-gray-100 {
                background-color: #ffffff !important;
              }
              .text-black, .text-gray-900 {
                color: #000000 !important;
              }
              .text-gray-600 {
                color: #4b5563 !important;
              }
              .border-gray-200, .border-gray-300 {
                border-color: #d1d5db !important;
              }
              .shadow-lg {
                box-shadow: none !important;
              }
            `}
          </style>
        )}

        {/* Header with Logo on left and Title on right */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '2px solid #000', paddingBottom: '15px' }}>
          {/* Logo on Left */}
          <div style={{ width: '120px', height: '120px' }}>
            <img 
              src="/logo.png" 
              alt="Adminza Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          
          {/* Title and Quotation Info on Right */}
          <div style={{ textAlign: 'right', flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '32px', marginBottom: '12px', color: '#000', letterSpacing: '2px' }}>QUOTATION</div>
            <div style={{ fontSize: '11px', lineHeight: '1.8', color: '#333' }}>
              <div style={{ marginBottom: '4px' }}><strong>Quotation No:</strong> {quotationNo}</div>
              <div><strong>Date:</strong> {quotationDate}</div>
            </div>
          </div>
        </div>

        {/* Sender Details - Left Oriented, Full Width */}
        <div style={{ marginBottom: '25px', fontSize: '11px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '13px', color: '#000', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>From / Sender:</div>
          <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '14px', color: '#000' }}>Dhanasvi Office & Print - Packaging Private Limited.</div>
          <div style={{ fontSize: '11px', lineHeight: '1.8', color: '#333' }}>
            <div>Office No. B-427, A Wing, Balaji Bhavan, Plot No 42A</div>
            <div>Sector 11, C.B.D. Belapur, Navi Mumbai, Maharashtra 400614</div>
            <div style={{ marginTop: '10px' }}>
              <div><strong>GSTIN:</strong> 27AALCD5002FIZY</div>
              <div><strong>Phone:</strong> 8433661506</div>
            </div>
          </div>
        </div>

        {/* Receiver Details - Left Oriented, Full Width */}
        <div style={{ marginBottom: '30px', fontSize: '11px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '13px', color: '#000', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>To / Receiver:</div>
          <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '14px', color: '#000' }}>{customerName}</div>
          {company && company !== customerName && (
            <div style={{ fontSize: '11px', marginBottom: '4px', color: '#333' }}>{company}</div>
          )}
          <div style={{ fontSize: '11px', lineHeight: '1.8', color: '#333' }}>
            {customerAddress && <div>{customerAddress}</div>}
            {(customerCity || customerState || customerZipCode) && (
              <div>{[customerCity, customerState, customerZipCode].filter(Boolean).join(', ')}</div>
            )}
            {customerCountry && <div>{customerCountry}</div>}
            <div style={{ marginTop: '10px' }}>
              {customerGstNumber && customerGstNumber !== 'N/A' && <div><strong>GSTIN:</strong> {customerGstNumber}</div>}
              {customerPhone && <div><strong>Phone:</strong> {customerPhone}</div>}
              {customerEmail && <div><strong>Email:</strong> {customerEmail}</div>}
            </div>
          </div>
        </div>

        {/* Items Table - Simple table with products and prices */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '20px', fontSize: '11px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '8px 6px', border: '1px solid #000', textAlign: 'center', width: '8%', fontWeight: 'bold' }}>Sr. No</th>
              <th style={{ padding: '8px 6px', border: '1px solid #000', textAlign: 'left', width: '42%', fontWeight: 'bold' }}>Product / Service Description</th>
              <th style={{ padding: '8px 6px', border: '1px solid #000', textAlign: 'center', width: '15%', fontWeight: 'bold' }}>Quantity</th>
              <th style={{ padding: '8px 6px', border: '1px solid #000', textAlign: 'right', width: '15%', fontWeight: 'bold' }}>Unit Price (₹)</th>
              <th style={{ padding: '8px 6px', border: '1px solid #000', textAlign: 'right', width: '20%', fontWeight: 'bold' }}>Total Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => {
                const itemTotal = item.total || ((item.price || 0) * (item.quantity || 0))
                return (
                  <tr key={index}>
                    <td style={{ padding: '6px', border: '1px solid #000', textAlign: 'center', fontSize: '10px' }}>{index + 1}</td>
                    <td style={{ padding: '6px', border: '1px solid #000', fontSize: '10px' }}>{item.itemName}</td>
                    <td style={{ padding: '6px', border: '1px solid #000', textAlign: 'center', fontSize: '10px' }}>
                      {isEditable ? (
                        <input
                          type="number"
                          min="1"
                          value={item.quantity || 1}
                          onChange={(e) => {
                            const newItems = [...items]
                            const newQuantity = parseInt(e.target.value) || 1
                            newItems[index].quantity = newQuantity
                            newItems[index].total = newQuantity * (newItems[index].price || 0)
                            onItemsChange(newItems)
                          }}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur()
                            }
                          }}
                          style={{ 
                            width: '70px', 
                            padding: '4px 6px', 
                            textAlign: 'center', 
                            border: '2px solid #2563eb', 
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '500',
                            backgroundColor: '#f0f9ff',
                            outline: 'none',
                            cursor: 'text'
                          }}
                          className="editable-input"
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td style={{ padding: '6px', border: '1px solid #000', textAlign: 'right', fontSize: '10px' }}>
                      {isEditable ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
                          <span style={{ fontSize: '10px', fontWeight: '500' }}>₹</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price || 0}
                            onChange={(e) => {
                              const newItems = [...items]
                              const newPrice = parseFloat(e.target.value) || 0
                              newItems[index].price = newPrice
                              newItems[index].total = (newItems[index].quantity || 1) * newPrice
                              onItemsChange(newItems)
                            }}
                            onFocus={(e) => e.target.select()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur()
                              }
                            }}
                            style={{ 
                              width: '100px', 
                              padding: '4px 6px', 
                              textAlign: 'right', 
                              border: '2px solid #2563eb', 
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '500',
                              backgroundColor: '#f0f9ff',
                              outline: 'none',
                              cursor: 'text'
                            }}
                            className="editable-input"
                          />
                        </div>
                      ) : (
                        `₹${(item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      )}
                    </td>
                    <td style={{ padding: '6px', border: '1px solid #000', textAlign: 'right', fontSize: '10px', fontWeight: 'bold' }}>₹{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '12px', border: '1px solid #000', textAlign: 'center', fontSize: '10px' }}>
                  No items found
                </td>
              </tr>
            )}
            {/* Total Row */}
            <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
              <td colSpan={4} style={{ padding: '8px 6px', border: '1px solid #000', textAlign: 'right', fontSize: '11px' }}>
                Grand Total:
              </td>
              <td style={{ padding: '8px 6px', border: '1px solid #000', textAlign: 'right', fontSize: '12px' }}>
                ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Description/Notes Section - Professional Format (No Table) */}
        {(data?.description || data?.notes) && (
          <div style={{ marginBottom: '20px', fontSize: '11px' }}>
            {data?.description && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#666' }}>Description:</div>
                <div style={{ color: '#333', lineHeight: '1.5' }}>{data.description}</div>
              </div>
            )}
            {data?.notes && (
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#666' }}>Notes:</div>
                <div style={{ color: '#333', lineHeight: '1.5' }}>{data.notes}</div>
              </div>
            )}
          </div>
        )}

        {/* Status Section */}
        {data?.status && (
          <div style={{ marginBottom: '20px', fontSize: '11px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Status: <span style={{ textTransform: 'uppercase' }}>{data.status}</span></div>
          </div>
        )}

        {/* Footer Note */}
        <div style={{ marginTop: '30px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '10px', textAlign: 'justify', lineHeight: '1.4' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Terms & Conditions:</div>
          <div>• Goods once sold will be returned/replaced only if reported damaged or incorrect within 24 hours of delivery; no returns on customized items.</div>
          <div>• Prices are exclusive/inclusive of GST as applicable; delivery beyond 5 KM is chargeable and timelines may vary due to external factors.</div>
          <div>• All payments must be cleared through approved modes; ADMINZA is not liable for delays/failures of banks or payment gateways.</div>
          <div>• All disputes are subject to the jurisdiction of Courts of India, and ADMINZA's liability is limited to the invoice value only.</div>
        </div>

        {/* Authorised Signatory */}
        <div style={{ marginTop: '40px', textAlign: 'right' }}>
          <div style={{ display: 'inline-block' }}>
            <div style={{ height: '40px' }}></div>
            <div style={{ borderTop: '1px solid #000', width: '150px', marginBottom: '5px' }}></div>
            <div style={{ fontWeight: 'bold', fontSize: '11px', textAlign: 'center' }}>Authorised Signatory</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function QuotationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [quotationData, setQuotationData] = useState<QuotationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRequote, setIsRequote] = useState(false)
  const [editableItems, setEditableItems] = useState<Array<{ itemId?: string; itemName: string; quantity: number; price: number; total?: number }>>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const quotationId = searchParams.get('id')
    const requoteParam = searchParams.get('requote')
    
    setIsRequote(requoteParam === 'true')

    if (quotationId) {
      fetch(`/api/quotations/${quotationId}`)
        .then(res => res.json())
        .then(response => {
          if (response.success && response.data) {
            const quotation = response.data
            // Calculate totals for items if not present
            const itemsWithTotals = (quotation.items || []).map((item: any) => ({
              ...item,
              total: item.total || (item.price * item.quantity)
            }))
            
            const totalAmount = quotation.totalAmount || itemsWithTotals.reduce((sum: number, item: any) => sum + item.total, 0)
            
            setQuotationData({
              ...quotation,
              items: itemsWithTotals,
              totalAmount,
              quotationNo: quotation.quotationNo || `QUO-${quotation._id?.toString().slice(-8) || Date.now()}`,
              quotationDate: quotation.quotationDate ? new Date(quotation.quotationDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')
            })
            
            // Initialize editable items if in requote mode - deep copy to allow independent editing
            if (requoteParam === 'true') {
              setEditableItems(itemsWithTotals.map((item: any) => ({ 
                itemId: item.itemId || '',
                itemName: item.itemName || '',
                quantity: item.quantity || 1,
                price: item.price || 0,
                total: item.total || (item.price * item.quantity)
              })))
            }
          } else {
            console.error('Failed to fetch quotation:', response.error)
            alert('Failed to load quotation. Please try again.')
          }
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching quotation:', error)
          alert('Error loading quotation. Please try again.')
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [searchParams])
  
  const handleSubmitRequote = async () => {
    if (!quotationData) return
    
    setSubmitting(true)
    try {
      // Generate unique quotation number
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      const quotationNo = `QUO-${timestamp}-${random}`
      
      // Calculate total amount
      const totalAmount = editableItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0)
      
      // Create new quotation with updated data
      const requoteData = {
        userId: quotationData._id ? undefined : (quotationData as any).userId || 'guest',
        userEmail: quotationData.userEmail,
        userName: quotationData.userName || 'Guest',
        userPhone: quotationData.userPhone || '',
        userAddress: quotationData.userAddress || {},
        items: editableItems.map(item => ({
          itemId: item.itemId || '',
          itemName: item.itemName,
          quantity: item.quantity || 1,
          price: item.price || 0
        })),
        totalAmount: totalAmount,
        description: quotationData.description || '',
        company: quotationData.company || '',
        gstNumber: quotationData.gstNumber || '',
        status: 'pending',
        quotationDate: new Date(),
        quotationNo: quotationNo,
        notes: quotationData.notes || ''
      }
      
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requoteData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Update the original quotation status to "sent re-quote" if it was a requote
        if (quotationData._id && isRequote) {
          try {
            await fetch(`/api/quotations/${quotationData._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                status: 'sent re-quote'
              }),
            })
          } catch (error) {
            console.error('Error updating original quotation status:', error)
            // Don't fail the whole operation if status update fails
          }
        }
        
        alert('New quotation created successfully!')
        router.push(`/dashboard/quotation?id=${result.data._id}`)
      } else {
        alert('Error creating quotation: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating requote:', error)
      alert('Error creating quotation')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotation...</p>
        </div>
      </div>
    )
  }

  if (!quotationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Quotation Data</h1>
          <p className="text-gray-600 mb-6">Unable to load quotation. Please try again.</p>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRequote ? 'Create New Quotation' : 'Quotation'}
          </h1>
          {isRequote && (
            <Button 
              onClick={handleSubmitRequote}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {submitting ? 'Creating...' : 'Create New Quotation'}
            </Button>
          )}
          {!isRequote && <div></div>}
        </div>

        {/* Quotation Preview */}
        <div className="flex justify-center">
          <QuotationPreview 
            data={quotationData} 
            showDownloadButton={!isRequote} 
            isPdfExport={false}
            isEditable={isRequote}
            editableItems={editableItems}
            onItemsChange={setEditableItems}
          />
        </div>
        
        {/* Submit Button at Bottom for Requote */}
        {isRequote && (
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleSubmitRequote}
              disabled={submitting}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
            >
              <Save className="h-5 w-5 mr-2" />
              {submitting ? 'Creating New Quotation...' : 'Submit New Quotation'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

