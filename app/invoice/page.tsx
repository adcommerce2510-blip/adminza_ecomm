"use client"

import React, { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { generateStandardizedPDF } from "@/utils/pdfGenerator"

interface InvoiceData {
  customerId?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  customerCity?: string
  customerState?: string
  customerZipCode?: string
  customerGstNumber?: string
  invoiceNo?: string
  invoiceDate?: string
  orderId?: string
  orderNo?: string
  items?: Array<{
    name: string
    quantity: number
    price: number
    total: number
    hslCode?: string
  }>
  subtotal?: number
  tax?: number
  total?: number
  gstType?: 'CGST/SGST' | 'IGST'
  gstRate?: number
  additionalCharges?: Array<{
    name: string
    amount: number
  }>
}

// Helper to convert number to words (simple, for INR)
function numberToWords(num: number) {
  if (isNaN(num)) return "";
  if (num === 0) return "Zero";
  if (num > 999999999) return "Amount too large";
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function inWords(n: number): string {
    let str = "";
    if (n > 19) {
      str += b[Math.floor(n / 10)];
      if (n % 10) str += " " + a[n % 10];
    } else if (n > 0) {
      str += a[n];
    }
    return str;
  }
  let crore = Math.floor(num / 10000000);
  let lakh = Math.floor((num / 100000) % 100);
  let thousand = Math.floor((num / 1000) % 100);
  let hundred = Math.floor((num / 100) % 10);
  let rest = Math.floor(num % 100);
  let result = "";
  if (crore) result += inWords(crore) + " Crore ";
  if (lakh) result += inWords(lakh) + " Lakh ";
  if (thousand) result += inWords(thousand) + " Thousand ";
  if (hundred) result += a[hundred] + " Hundred ";
  if (rest) {
    if (result !== "") result += "and ";
    result += inWords(rest) + " ";
  }
  return result.trim();
}

function amountToWordsWithPaise(amount: number) {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let words = numberToWords(rupees);
  if (words) words += ' Rupees';
  if (paise > 0) words += ' and ' + numberToWords(paise) + ' Paise';
  words += ' only';
  return words;
}

// Calculation helpers
const safeNumber = (val: any) => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseFloat(val.replace(/,/g, '')) || 0;
  return 0;
};

const InvoicePreview = ({ data = {} as InvoiceData, showDownloadButton = true, isPdfExport = false }) => {
  const previewRef = useRef<HTMLDivElement>(null)

  // Extract customer and invoice data
  const customerName = data?.customerName || "Customer Name"
  const customerAddress = data?.customerAddress || "Customer Address"
  const customerCity = data?.customerCity || "Customer City"
  const customerState = data?.customerState || "Maharashtra"
  const customerZipCode = data?.customerZipCode || "400001"
  const customerEmail = data?.customerEmail || "customer@email.com"
  const customerPhone = data?.customerPhone || "1234567890"
  const customerGstNumber = data?.customerGstNumber || "N/A"

  const invoiceNo = data?.invoiceNo || `INV-${Date.now()}`
  const invoiceDate = data?.invoiceDate || new Date().toLocaleDateString('en-IN')

  const items = data?.items || []
  const subtotal = safeNumber(data?.subtotal) || 0
  const gstType = data?.gstType || 'CGST/SGST'
  const gstRate = safeNumber(data?.gstRate) || 18

  // Calculate tax
  let cgst = 0, sgst = 0, igst = 0
  if (gstType === 'IGST') {
    igst = +(subtotal * (gstRate / 100)).toFixed(2)
  } else {
    cgst = +(subtotal * (gstRate / 200)).toFixed(2)
    sgst = +(subtotal * (gstRate / 200)).toFixed(2)
  }

  const totalTax = cgst + sgst + igst
  const additionalCharges = data?.additionalCharges || []
  const additionalChargesTotal = additionalCharges.reduce((sum, charge) => sum + (charge.amount || 0), 0)
  const grandTotal = +(subtotal + totalTax + additionalChargesTotal).toFixed(2)
  const amountInWords = amountToWordsWithPaise(grandTotal)

  // PDF Export
  const handleDownloadPDF = async () => {
    try {
      const filename = `Invoice_${invoiceNo}.pdf`;

      const { data: pdfData } = await generateStandardizedPDF(
        <InvoicePreview data={{ ...data, invoiceNo }} showDownloadButton={false} isPdfExport={true} />,
        filename
      );

      // Create blob and download
      const blob = new Blob([pdfData as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div>
      {showDownloadButton && (
        <button
          onClick={handleDownloadPDF}
          className="mb-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition font-semibold text-sm"
          type="button"
        >
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
          minHeight: '1100px',
          padding: '20px',
          fontSize: '12px',
          // Override any modern CSS color functions for PDF export
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
        {/* Header with Logo and Invoice Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ width: '120px' }}>
            <div style={{ width: '130px', height: '130px' }}>
              <img 
                src="/logo.png" 
                alt="Adminza Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '5px' }}>TAX INVOICE</div>
            <div style={{ fontSize: '10px', lineHeight: '1.3' }}>
              <div>Invoice Number: {invoiceNo}</div>
            </div>
          </div>
          <div style={{ width: '120px' }}>
            {/* Empty div for balance */}
          </div>
        </div>

        {/* Order Details Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '10px', fontSize: '11px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 6px', border: '1px solid #000', fontWeight: 'bold', backgroundColor: '#f0f0f0', width: '15%' }}>Order No</td>
              <td style={{ padding: '4px 6px', border: '1px solid #000', width: '18%' }}>{data?.orderNo || 'N/A'}</td>
              <td style={{ padding: '4px 6px', border: '1px solid #000', fontWeight: 'bold', backgroundColor: '#f0f0f0', width: '15%' }}>Invoice No</td>
              <td style={{ padding: '4px 6px', border: '1px solid #000', width: '18%' }}>{invoiceNo}</td>
              <td style={{ padding: '4px 6px', border: '1px solid #000', fontWeight: 'bold', backgroundColor: '#f0f0f0', width: '15%' }}>Invoice Date</td>
              <td style={{ padding: '4px 6px', border: '1px solid #000', width: '19%' }}>{invoiceDate}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 6px', border: '1px solid #000', fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Place of Supply</td>
              <td style={{ padding: '4px 6px', border: '1px solid #000' }} colSpan={5}>{customerState || 'Maharashtra'}</td>
            </tr>
          </tbody>
        </table>

        {/* Seller and Buyer Details Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '10px', fontSize: '11px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '6px', border: '1px solid #000', fontWeight: 'bold', backgroundColor: '#f0f0f0', width: '15%', verticalAlign: 'top' }}>
                Sold By / Seller
              </td>
              <td style={{ padding: '6px', border: '1px solid #000', width: '35%', verticalAlign: 'top' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Dhanasvi Office & Print - Packaging Private Limited.</div>
                <div style={{ fontSize: '10px', lineHeight: '1.2' }}>
                  <div>Office No. B-427, A Wing, Balaji Bhavan, Plot No 42A</div>
                  <div>Sector 11, C.B.D. Belapur, Navi Mumbai</div>
                  <div>Maharashtra - 400614</div>
                  <div style={{ marginTop: '4px' }}>
                    <div>GSTIN: 27AALCD5002FIZY</div>
                    <div>Phone: 8433661506</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '6px', border: '1px solid #000', fontWeight: 'bold', backgroundColor: '#f0f0f0', width: '15%', verticalAlign: 'top' }}>
                Invoice To
              </td>
              <td style={{ padding: '6px', border: '1px solid #000', width: '35%', verticalAlign: 'top' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{customerName}</div>
                <div style={{ fontSize: '10px', lineHeight: '1.2' }}>
                  {customerAddress && <div>{customerAddress}</div>}
                  {(customerCity || customerState || customerZipCode) && (
                    <div>{[customerCity, customerState, customerZipCode].filter(Boolean).join(', ')}</div>
                  )}
                  <div style={{ marginTop: '4px' }}>
                    <div>GSTIN: {customerGstNumber || 'N/A'}</div>
                    <div>Pin code: {customerZipCode || 'N/A'}</div>
                    <div>State: {customerState || 'Maharashtra'}</div>
                    {customerPhone && <div>Phone: {customerPhone}</div>}
                    {customerEmail && <div>Email: {customerEmail}</div>}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '10px', fontSize: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'center', width: '4%', fontWeight: 'bold' }}>Sr. no</th>
              <th style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'center', width: '25%', fontWeight: 'bold' }}>Item Description</th>
              <th style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'center', width: '12%', fontWeight: 'bold' }}>HSL Code</th>
              <th style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'center', width: '8%', fontWeight: 'bold' }}>MRP</th>
              <th style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'center', width: '8%', fontWeight: 'bold' }}>Discount</th>
              <th style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'center', width: '5%', fontWeight: 'bold' }}>Qty.</th>
              <th style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'center', width: '8%', fontWeight: 'bold' }}>Taxable Value</th>
              <th style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'center', width: '6%', fontWeight: 'bold' }}>CGST (%)</th>
              <th style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'center', width: '7%', fontWeight: 'bold' }}>CGST (INR)</th>
              <th style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'center', width: '6%', fontWeight: 'bold' }}>SGST (%)</th>
              <th style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'center', width: '7%', fontWeight: 'bold' }}>SGST (INR)</th>
              <th style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'center', width: '6%', fontWeight: 'bold' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const itemCgst = gstType === 'IGST' ? 0 : +(item.total * (gstRate / 200)).toFixed(2);
              const itemSgst = gstType === 'IGST' ? 0 : +(item.total * (gstRate / 200)).toFixed(2);
              const itemTotal = +(item.total + itemCgst + itemSgst).toFixed(2);

              return (
                <tr key={index}>
                  <td style={{ padding: '3px 2px', border: '1px solid #000', textAlign: 'center', fontSize: '9px' }}>{index + 1}</td>
                  <td style={{ padding: '3px 2px', border: '1px solid #000', fontSize: '9px' }}>
                    {item.name} (HSN-{Math.floor(Math.random() * 100000000)}) | {Math.floor(Math.random() * 500) + 100} ml
                  </td>
                  <td style={{ padding: '3px 2px', border: '1px solid #000', textAlign: 'center', fontSize: '9px' }}>{item.hslCode || '-'}</td>
                  <td style={{ padding: '3px 2px', border: '1px solid #000', textAlign: 'right', fontSize: '9px' }}>{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '3px 2px', border: '1px solid #000', textAlign: 'right', fontSize: '9px' }}>{((item.price * 0.4)).toFixed(2)}</td>
                  <td style={{ padding: '3px 2px', border: '1px solid #000', textAlign: 'center', fontSize: '9px' }}>{item.quantity}</td>
                  <td style={{ padding: '3px 2px', border: '1px solid #000', textAlign: 'right', fontSize: '9px' }}>{item.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '3px 2px', border: '1px solid #000', textAlign: 'center', fontSize: '9px' }}>{gstType === 'IGST' ? '0.00' : (gstRate / 2).toFixed(2)}</td>
                  <td style={{ padding: '3px 2px', border: '1px solid #000', textAlign: 'right', fontSize: '9px' }}>{itemCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '3px 2px', border: '1px solid #000', textAlign: 'center', fontSize: '9px' }}>{gstType === 'IGST' ? '0.00' : (gstRate / 2).toFixed(2)}</td>
                  <td style={{ padding: '3px 2px', border: '1px solid #000', textAlign: 'right', fontSize: '9px' }}>{itemSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '3px 2px', border: '1px solid #000', textAlign: 'right', fontSize: '9px' }}>{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              );
            })}
            {/* Total Row */}
            <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
              <td style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'center', fontSize: '9px' }}>Total</td>
              <td style={{ padding: '4px 2px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px 2px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px 2px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px 2px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'center', fontSize: '9px' }}>
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </td>
              <td style={{ padding: '4px 2px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px 2px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'right', fontSize: '9px' }}>
                {cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
              <td style={{ padding: '4px 2px', border: '1px solid #000' }}></td>
              <td style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'right', fontSize: '9px' }}>
                {sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
              <td style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'right', fontSize: '9px' }}>
                {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Amount in Words Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '10px', fontSize: '11px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '6px', border: '1px solid #000', fontWeight: 'bold', backgroundColor: '#f0f0f0', width: '20%' }}>
                Amount in Words:
              </td>
              <td style={{ padding: '6px', border: '1px solid #000' }}>
                {amountInWords}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Additional Charges Table */}
        {additionalCharges.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '10px', fontSize: '11px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '6px', border: '1px solid #000', textAlign: 'left', fontWeight: 'bold', width: '70%' }}>Additional Charges</th>
                <th style={{ padding: '6px', border: '1px solid #000', textAlign: 'right', fontWeight: 'bold', width: '30%' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {additionalCharges.map((charge, index) => (
                <tr key={index}>
                  <td style={{ padding: '6px', border: '1px solid #000' }}>{charge.name}</td>
                  <td style={{ padding: '6px', border: '1px solid #000', textAlign: 'right' }}>
                    {charge.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                <td style={{ padding: '6px', border: '1px solid #000', textAlign: 'right' }}>Total Additional Charges:</td>
                <td style={{ padding: '6px', border: '1px solid #000', textAlign: 'right' }}>
                  {additionalChargesTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {/* Bank Details with QR Code */}
        <div style={{ marginBottom: '15px', fontSize: '11px', lineHeight: '1.4', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: '1' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Bank Details</div>
            <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>DHANASVI OFFICE AND PRINT PACKAGING PRIVATE LIMITED</div>
            <div style={{ marginBottom: '3px' }}>STATE BANK OF INDIA, SECTOR-11, CBD BELAPUR, NAVI MUMBAI 400614</div>
            <div style={{ marginBottom: '3px' }}><strong>A/C No:</strong> 43918417934</div>
            <div style={{ marginBottom: '3px' }}><strong>IFSC Code:</strong> SBIN0013551</div>
            <div style={{ marginBottom: '3px' }}><strong>UPI ID:</strong> dhanasviofficeprintpackaging@sbi</div>
            <div style={{ marginBottom: '3px' }}><strong>PAN:</strong> AALCD5002F</div>
            <div><strong>GSTIN:</strong> 27AALCD5002FIZY</div>
          </div>
          <div style={{ marginLeft: '20px', textAlign: 'center', marginTop: '40px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '11px' }}>SCAN & PAY</div>
            <img 
              src="/qr_code-adminzaa-removebg-preview.png" 
              alt="QR Code for Payment"
              style={{ width: '120px', height: '120px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Terms & Conditions */}
        <div style={{ marginBottom: '20px', fontSize: '10px', lineHeight: '1.3' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Terms & Conditions</div>
          <div style={{ textAlign: 'justify', marginBottom: '3px' }}>
            • Goods once sold will be returned/replaced only if reported damaged or incorrect within 24 hours of delivery; no returns on customized items.
          </div>
          <div style={{ textAlign: 'justify', marginBottom: '3px' }}>
            • Prices are exclusive/inclusive of GST as applicable; delivery beyond 5 KM is chargeable and timelines may vary due to external factors.
          </div>
          <div style={{ textAlign: 'justify', marginBottom: '3px' }}>
            • All payments must be cleared through approved modes; ADMINZA is not liable for delays/failures of banks or payment gateways.
          </div>
          <div style={{ textAlign: 'justify' }}>
            • All disputes are subject to the jurisdiction of Courts of India, and ADMINZA's liability is limited to the invoice value only.
          </div>
        </div>

        {/* Authorised Signatory */}
        <div style={{ marginTop: '30px', textAlign: 'right' }}>
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

export default function InvoicePage() {
  const searchParams = useSearchParams()
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const customerId = searchParams.get('customerId')
    const itemsParam = searchParams.get('items')
    const orderId = searchParams.get('orderId')
    const customerEmail = searchParams.get('customerEmail')

    // Fetch next invoice number first
    const fetchNextInvoiceNumber = async () => {
      try {
        const response = await fetch('/api/invoices?nextNumber=true')
        const result = await response.json()
        if (result.success && result.nextInvoiceNo) {
          return result.nextInvoiceNo
        }
      } catch (error) {
        console.error('Error fetching next invoice number:', error)
      }
      return null
    }

    if (customerId && itemsParam) {
      try {
        const items = JSON.parse(decodeURIComponent(itemsParam))

        // Fetch next invoice number
        fetchNextInvoiceNumber().then((nextInvoiceNo) => {
          // Try to fetch customer details from order first
          let customer: any = null
          let order: any = null

          if (orderId && customerEmail) {
            fetch(`/api/orders?email=${encodeURIComponent(customerEmail)}`)
              .then(res => res.json())
              .then(orderResponse => {
                if (orderResponse.success && orderResponse.data && orderResponse.data.length > 0) {
                  order = orderResponse.data.find((o: any) => o._id === orderId) || orderResponse.data[0]
                  customer = {
                    _id: customerId,
                    name: order.customerName || order.shippingAddress?.receiverName || 'Customer',
                    email: order.customerEmail || order.userEmail || '',
                    phone: order.customerPhone || order.phone || '',
                    address: order.shippingAddress?.street || '',
                    city: order.shippingAddress?.city || '',
                    state: order.shippingAddress?.state || '',
                    zipCode: order.shippingAddress?.zipCode || '',
                    gstNumber: order.gstNumber || 'N/A'
                  }
                  createInvoice(customer, items, order, nextInvoiceNo)
                } else {
                  // Fallback: create invoice with minimal data
                  createInvoiceWithMinimalData(items, nextInvoiceNo)
                }
              })
              .catch(() => {
                createInvoiceWithMinimalData(items, nextInvoiceNo)
              })
          } else {
            // No order ID, try to get from customer collection
            fetch(`/api/customers/${customerId}`)
              .then(res => res.json())
              .then(response => {
                if (response.success && response.data) {
                  customer = response.data
                  createInvoice(customer, items, null, nextInvoiceNo)
                } else {
                  createInvoiceWithMinimalData(items, nextInvoiceNo)
                }
              })
              .catch(() => {
                createInvoiceWithMinimalData(items, nextInvoiceNo)
              })
          }

          function createInvoice(customer: any, items: any[], order: any, invoiceNo: string | null) {
            const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)

            // Convert invoiceDate to proper format
            const invoiceDateStr = new Date().toLocaleDateString('en-IN')
            const dateParts = invoiceDateStr.split('/')
            let invoiceDateISO = new Date().toISOString()
            if (dateParts.length === 3) {
              const day = parseInt(dateParts[0], 10)
              const month = parseInt(dateParts[1], 10) - 1
              const year = parseInt(dateParts[2], 10)
              const dateObj = new Date(year, month, day)
              if (!isNaN(dateObj.getTime())) {
                invoiceDateISO = dateObj.toISOString()
              }
            }

            const invoice = {
              customerId: customer._id,
              customerName: customer.name,
              customerEmail: customer.email,
              customerPhone: customer.phone,
              customerAddress: customer.address,
              customerCity: customer.city,
              customerState: customer.state,
              customerZipCode: customer.zipCode,
              customerGstNumber: customer.gstNumber,
              invoiceNo: invoiceNo || 'INV-0001',
              invoiceDate: invoiceDateStr,
              orderId: order?._id || orderId || undefined,
              orderNo: order?.orderNo || undefined,
              items: items.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity,
                hslCode: item.hslCode || ''
              })),
              subtotal,
              gstType: 'CGST/SGST' as const,
              gstRate: 18,
              additionalCharges: []
            }

            setInvoiceData(invoice)
            setLoading(false)

            // Save invoice to database
            saveInvoiceToDatabase(invoice, invoiceDateISO)
          }

          function createInvoiceWithMinimalData(items: any[], invoiceNo: string | null) {
            const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)

            // Convert invoiceDate to proper format
            const invoiceDateStr = new Date().toLocaleDateString('en-IN')
            const dateParts = invoiceDateStr.split('/')
            let invoiceDateISO = new Date().toISOString()
            if (dateParts.length === 3) {
              const day = parseInt(dateParts[0], 10)
              const month = parseInt(dateParts[1], 10) - 1
              const year = parseInt(dateParts[2], 10)
              const dateObj = new Date(year, month, day)
              if (!isNaN(dateObj.getTime())) {
                invoiceDateISO = dateObj.toISOString()
              }
            }

            const invoice = {
              customerId: customerId || 'N/A',
              customerName: 'Customer',
              customerEmail: customerEmail || '',
              customerPhone: '',
              customerAddress: '',
              customerCity: '',
              customerState: '',
              customerZipCode: '',
              customerGstNumber: 'N/A',
              invoiceNo: invoiceNo || 'INV-0001',
              invoiceDate: invoiceDateStr,
              orderId: orderId || undefined,
              orderNo: undefined,
              items: items.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity,
                hslCode: item.hslCode || ''
              })),
              subtotal,
              gstType: 'CGST/SGST' as const,
              gstRate: 18,
              additionalCharges: []
            }

            setInvoiceData(invoice)
            setLoading(false)

            // Save invoice to database
            saveInvoiceToDatabase(invoice, invoiceDateISO)
          }

          async function saveInvoiceToDatabase(invoice: InvoiceData, invoiceDateISO: string) {
            if (saving) return // Prevent duplicate saves
            setSaving(true)

            try {
              // Calculate totals
              const subtotal = invoice.subtotal || 0
              const gstType = invoice.gstType || 'CGST/SGST'
              const gstRate = invoice.gstRate || 18
              let cgst = 0, sgst = 0, igst = 0
              if (gstType === 'IGST') {
                igst = +(subtotal * (gstRate / 100)).toFixed(2)
              } else {
                cgst = +(subtotal * (gstRate / 200)).toFixed(2)
                sgst = +(subtotal * (gstRate / 200)).toFixed(2)
              }
              const totalTax = cgst + sgst + igst
              const additionalChargesTotal = (invoice.additionalCharges || []).reduce((sum: number, charge: any) => sum + (charge.amount || 0), 0)
              const grandTotal = +(subtotal + totalTax + additionalChargesTotal).toFixed(2)

              const invoiceToSave = {
                customerId: invoice.customerId,
                customerName: invoice.customerName,
                customerEmail: invoice.customerEmail,
                customerPhone: invoice.customerPhone,
                customerAddress: invoice.customerAddress,
                customerCity: invoice.customerCity,
                customerState: invoice.customerState,
                customerZipCode: invoice.customerZipCode,
                customerGstNumber: invoice.customerGstNumber,
                invoiceNo: invoice.invoiceNo,
                invoiceDate: invoiceDateISO,
                items: invoice.items || [],
                subtotal: invoice.subtotal || 0,
                tax: totalTax,
                total: grandTotal,
                gstType: invoice.gstType || 'CGST/SGST',
                gstRate: invoice.gstRate || 18,
                additionalCharges: invoice.additionalCharges || [],
                orderId: invoice.orderId,
                orderNo: invoice.orderNo
              }

              const saveResponse = await fetch('/api/invoices', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(invoiceToSave),
              })

              const saveResult = await saveResponse.json()
              if (saveResult.success && saveResult.data) {
                // Update invoice data with the saved invoice number
                if (saveResult.data.invoiceNo) {
                  setInvoiceData({
                    ...invoice,
                    invoiceNo: saveResult.data.invoiceNo
                  })
                }
                console.log('Invoice saved successfully:', saveResult.data.invoiceNo)
              } else {
                console.error('Error saving invoice:', saveResult.error)
              }
            } catch (error) {
              console.error('Error saving invoice to database:', error)
            } finally {
              setSaving(false)
            }
          }
        }).catch(error => {
          console.error('Error fetching next invoice number:', error)
          setLoading(false)
        })
      } catch (error) {
        console.error('Error parsing items:', error)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (!invoiceData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Invoice Data</h1>
          <p className="text-gray-600 mb-6">Unable to load invoice. Please try again.</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8 px-4">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/my-accounts">
            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Accounts
            </Button>
          </Link>
        </div>
        <InvoicePreview data={invoiceData} showDownloadButton={true} isPdfExport={false} />
      </div>
      <Footer />
    </div>
  )
}

