"use client"

import React, { useRef, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

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

const QuotationPreview = ({ data = {} as QuotationData }) => {
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

  const items = data?.items || []
  const totalAmount = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0)

  return (
    <div
      ref={previewRef}
      className="w-full max-w-4xl mx-auto bg-white shadow-lg text-black"
      style={{ 
        fontFamily: 'Arial, sans-serif', 
        color: '#000', 
        background: '#fff', 
        minHeight: '800px',
        padding: '20px',
        fontSize: '12px',
      }}
    >
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
                  <td style={{ padding: '6px', border: '1px solid #000', textAlign: 'center', fontSize: '10px' }}>{item.quantity}</td>
                  <td style={{ padding: '6px', border: '1px solid #000', textAlign: 'right', fontSize: '10px' }}>
                    ₹{(item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '6px', border: '1px solid #000', textAlign: 'right', fontSize: '10px', fontWeight: 'bold' }}>
                    ₹{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
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
  )
}

export default function UserQuotationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [quotationData, setQuotationData] = useState<QuotationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [isReQuoteDialogOpen, setIsReQuoteDialogOpen] = useState(false)
  const [requoteMessage, setRequoteMessage] = useState("")

  useEffect(() => {
    const quotationId = searchParams.get('id')
    
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

  const handleAccept = async () => {
    if (!quotationData?._id) return
    
    setActionLoading('accept')
    try {
      const response = await fetch(`/api/quotations/${quotationData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userResponse: 'accepted'
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        alert('Quotation accepted successfully!')
        router.push('/my-accounts')
      } else {
        alert('Error accepting quotation: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error accepting quotation:', error)
      alert('Error accepting quotation')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!quotationData?._id) return
    
    setActionLoading('reject')
    try {
      const response = await fetch(`/api/quotations/${quotationData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userResponse: 'rejected'
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        alert('Quotation rejected.')
        router.push('/my-accounts')
      } else {
        alert('Error rejecting quotation: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error rejecting quotation:', error)
      alert('Error rejecting quotation')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRequestReQuote = () => {
    setIsReQuoteDialogOpen(true)
  }

  const handleSubmitReQuote = async () => {
    if (!quotationData?._id) return
    
    setActionLoading('requote')
    try {
      const response = await fetch(`/api/quotations/${quotationData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userResponse: 're-quote',
          requoteMessage: requoteMessage.trim(),
          status: 'requested re-quote'
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        alert('Re-quote request submitted successfully!')
        setIsReQuoteDialogOpen(false)
        setRequoteMessage("")
        router.push('/my-accounts')
      } else {
        alert('Error submitting re-quote request: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error submitting re-quote request:', error)
      alert('Error submitting re-quote request')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading quotation...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!quotationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Quotation Data</h1>
            <p className="text-gray-600 mb-6">Unable to load quotation. Please try again.</p>
            <Link href="/my-accounts">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Account
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header with Action Buttons */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link href="/my-accounts">
              <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Account
              </Button>
            </Link>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleAccept}
                disabled={actionLoading !== null || quotationData.userResponse === 'accepted' || quotationData.userResponse === 'rejected'}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {actionLoading === 'accept' ? 'Processing...' : 'Accept'}
              </Button>
              
              <Button
                onClick={handleReject}
                disabled={actionLoading !== null || quotationData.userResponse === 'rejected' || quotationData.userResponse === 'accepted'}
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                {actionLoading === 'reject' ? 'Processing...' : 'Reject'}
              </Button>
              
              <Button
                onClick={handleRequestReQuote}
                disabled={actionLoading !== null || quotationData.userResponse === 'accepted' || quotationData.userResponse === 'rejected'}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {actionLoading === 'requote' ? 'Processing...' : 'Request for Re-Quote'}
              </Button>
            </div>
          </div>

          {/* Quotation Preview */}
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex justify-center">
                <QuotationPreview data={quotationData} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Re-Quote Message Dialog */}
      {isReQuoteDialogOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setIsReQuoteDialogOpen(false)
              setRequoteMessage("")
            }}
          />
          {/* Dialog Content - Positioned below navbar */}
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-6 w-full max-w-md mx-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Request for Re-Quote</h3>
                <p className="text-sm text-gray-600">
                  Please provide a message explaining what changes you would like in the quotation.
                </p>
              </div>
              <div>
                <Label htmlFor="requote-message" className="text-sm font-medium text-gray-700 block mb-2">
                  Message
                </Label>
                <Textarea
                  id="requote-message"
                  placeholder="Enter your message here (e.g., price adjustments, quantity changes, etc.)"
                  value={requoteMessage}
                  onChange={(e) => setRequoteMessage(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md p-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsReQuoteDialogOpen(false)
                    setRequoteMessage("")
                  }}
                  disabled={actionLoading !== null}
                  type="button"
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReQuote}
                  disabled={actionLoading !== null || !requoteMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                >
                  {actionLoading === 'requote' ? 'Submitting...' : 'Send'}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

