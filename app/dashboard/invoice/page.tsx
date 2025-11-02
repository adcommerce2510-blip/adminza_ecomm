"use client"

import React, { useRef, useState, useEffect } from "react";
import { generateStandardizedPDF } from "../../../utils/pdfGenerator";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Download, Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

interface InvoiceData {
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity?: string;
  customerState?: string;
  customerZipCode?: string;
  customerGstNumber?: string;
  invoiceNo?: string;
  invoiceDate?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal?: number;
  tax?: number;
  total?: number;
  gstType?: 'CGST/SGST' | 'IGST';
  gstRate?: number;
}

const InvoicePreview = ({ data = {} as InvoiceData, showDownloadButton = true, isPdfExport = false }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  // Extract customer and invoice data
  const customerName = data?.customerName || "Customer Name";
  const customerAddress = data?.customerAddress || "Customer Address";
  const customerCity = data?.customerCity || "Customer City";
  const customerState = data?.customerState || "Maharashtra";
  const customerZipCode = data?.customerZipCode || "400001";
  const customerEmail = data?.customerEmail || "customer@email.com";
  const customerPhone = data?.customerPhone || "1234567890";
  const customerGstNumber = data?.customerGstNumber || "N/A";

  // Debug log to see what data we're receiving (can be removed in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Invoice Preview Data:', data);
    console.log('Customer Name:', customerName);
    console.log('Customer Address:', customerAddress);
    console.log('Customer Email:', customerEmail);
  }

  const invoiceNo = data?.invoiceNo || `INV-${Date.now()}`;
  const invoiceDate = data?.invoiceDate || new Date().toLocaleDateString('en-IN');

  const items = data?.items || [];
  const subtotal = safeNumber(data?.subtotal) || 0;
  const gstType = data?.gstType || 'CGST/SGST';
  const gstRate = safeNumber(data?.gstRate) || 18;

  // Calculate tax
  let cgst = 0, sgst = 0, igst = 0;
  if (gstType === 'IGST') {
    igst = +(subtotal * (gstRate / 100)).toFixed(2);
  } else {
    cgst = +(subtotal * (gstRate / 200)).toFixed(2);
    sgst = +(subtotal * (gstRate / 200)).toFixed(2);
  }

  const totalTax = cgst + sgst + igst;
  const grandTotal = +(subtotal + totalTax).toFixed(2);
  const amountInWords = amountToWordsWithPaise(grandTotal);

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
          <div style={{ width: '80px' }}>
            <div style={{ width: '70px', height: '70px' }}>
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
              <div>IRN: {invoiceNo.replace('INV-', 'IRN')}</div>
              <div>Invoice Number: {invoiceNo}</div>
            </div>
          </div>
          <div style={{ width: '80px' }}>
            {/* Empty div for balance */}
          </div>
        </div>

        {/* Order Details Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '10px', fontSize: '11px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 6px', border: '1px solid #000', fontWeight: 'bold', backgroundColor: '#f0f0f0', width: '15%' }}>Order Id</td>
              <td style={{ padding: '4px 6px', border: '1px solid #000', width: '18%' }}>{invoiceNo.replace('INV-', 'ORD')}</td>
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
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>ADMINZA BUSINESS SOLUTIONS</div>
                <div style={{ fontSize: '10px', lineHeight: '1.2' }}>
                  <div>Shop 1 & 2, Ground Floor, Business Plaza</div>
                  <div>Plot Number 123, Sector 15, CBD Belapur</div>
                  <div>Navi Mumbai, Maharashtra - 400614</div>
                  <div style={{ marginTop: '4px' }}>
                    <div>GSTIN: 27ADMIN1234A1Z5</div>
                    <div>PAN: ADMIN1234A</div>
                    <div>CIN: U74140MH2023PTC123456</div>
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
              <th style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'center', width: '12%', fontWeight: 'bold' }}>UPC</th>
              <th style={{ padding: '4px 2px', border: '1px solid #000', textAlign: 'center', width: '25%', fontWeight: 'bold' }}>Item Description</th>
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
                  <td style={{ padding: '3px 2px', border: '1px solid #000', textAlign: 'center', fontSize: '8px' }}>{Math.floor(Math.random() * 10000000000000)}</td>
                  <td style={{ padding: '3px 2px', border: '1px solid #000', fontSize: '9px' }}>
                    {item.name} (HSN-{Math.floor(Math.random() * 100000000)}) | {Math.floor(Math.random() * 500) + 100} ml
                  </td>
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

        {/* Company Details */}
        <div style={{ marginBottom: '15px', fontSize: '11px', lineHeight: '1.4' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Company Details</div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>ADMINZA BUSINESS SOLUTIONS (formerly known as Adminza Private Limited)</div>
          <div>GSTIN: 27ADMIN1234A1Z5</div>
          <div>FSSAI License Number: 10018064001545</div>
          <div>CIN: U74140MH2023PTC123456</div>
          <div>PAN: ADMIN1234A</div>
          <div style={{ marginTop: '8px' }}>
            <strong>Reverse Charge Status:</strong> Whether the tax is payable on reverse charge - No
          </div>
        </div>

        {/* Terms & Conditions */}
        <div style={{ marginBottom: '20px', fontSize: '10px', lineHeight: '1.3' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Terms & Conditions</div>
          <div style={{ textAlign: 'justify' }}>
            If you have any issues or queries in respect of your order, please contact customer chat support through Adminza platform or drop in email at info@adminza.com
          </div>
          <div style={{ textAlign: 'justify', marginTop: '3px' }}>
            In case you need to get more information about seller's or Adminza's FSSAI status, please visit https://foscos.fssai.gov.in/ and use the FBO search option with FSSAI License / Registration number.
          </div>
          <div style={{ textAlign: 'justify', marginTop: '3px' }}>
            Please note that we never ask for bank account details such as CVV, account number, UPI Pin, etc. across our support channels. For your safety please do not share these details with anyone over any medium.
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
  );
};

export default function InvoicePage() {
  const searchParams = useSearchParams();
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [currentInventory, setCurrentInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Get customer ID and items from URL params
    const customerId = searchParams.get('customerId');
    const itemsParam = searchParams.get('items');

    if (customerId && itemsParam) {
      try {
        const items = JSON.parse(decodeURIComponent(itemsParam));

        // First try to fetch customer details from Customer collection
        console.log('Fetching customer with ID:', customerId);
        fetch(`/api/customers/${customerId}`)
          .then(res => {
            console.log('Customer API response status:', res.status);
            return res.json();
          })
          .then(response => {
            console.log('Customer API response:', response);
            
            let customer: any = null;
            
            // If customer exists in Customer collection, use that data
            if (response.success && response.data) {
              customer = response.data;
              console.log('Using customer data from Customer collection:', customer);
            } else {
              // If customer doesn't exist in Customer collection, try to get data from e-shop inventory
              console.log('Customer not found in Customer collection, fetching from e-shop inventory');
              return fetch('/api/eshop-inventory')
                .then(res => res.json())
                .then(inventoryResponse => {
                  console.log('E-shop inventory response:', inventoryResponse);
                  const inventoryArray = inventoryResponse.data || inventoryResponse;
                  const customerInventory = inventoryArray.find((item: any) => item.customerId === customerId);
                  
                  if (customerInventory) {
                    // Create customer object from e-shop inventory data
                    customer = {
                      _id: customerId,
                      name: customerInventory.customerName,
                      email: `${customerInventory.customerName.toLowerCase().replace(/\s+/g, '')}@email.com`,
                      phone: '1234567890',
                      address: 'Customer Address',
                      city: 'Customer City',
                      state: 'Maharashtra',
                      zipCode: '400001',
                      gstNumber: 'N/A'
                    };
                    console.log('Created customer object from e-shop inventory:', customer);
                  }
                  return customer;
                });
            }
            
            return customer;
          })
          .then(customer => {
            if (!customer) {
              console.error('No customer data found');
              alert('No customer data found');
              return;
            }
            
            const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

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
              invoiceNo: `INV-${Date.now()}`,
              invoiceDate: new Date().toLocaleDateString('en-IN'),
              items: items.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity
              })),
              subtotal,
              gstType: 'CGST/SGST' as const,
              gstRate: 18
            };

            console.log('Final invoice data:', invoice);

            // Fetch current inventory for this customer first
            return fetch(`/api/eshop-inventory?t=${Date.now()}`, {
              cache: 'no-cache',
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              }
            })
            .then(res => res?.json())
            .then(inventoryData => {
              console.log('Raw inventory data:', inventoryData);
              // Handle both direct array and wrapped response formats
              const inventoryArray = inventoryData.data || inventoryData;
              const customerInventory = inventoryArray.filter((item: any) => item.customerId === searchParams.get('customerId'));
              console.log('Filtered customer inventory:', customerInventory);
              setCurrentInventory(customerInventory);
              
              // Update invoice items to use available stock quantities
              const updatedItems = invoice.items.map((invoiceItem: any) => {
                const inventoryItem = customerInventory.find((inv: any) => 
                  inv.productName === invoiceItem.name || 
                  inv.productName?.toLowerCase().trim() === invoiceItem.name?.toLowerCase().trim()
                );
                
                if (inventoryItem) {
                  const invoicedQty = inventoryItem.invoicedQuantity || 0;
                  const availableStock = inventoryItem.quantity - invoicedQty;
                  
                  return {
                    ...invoiceItem,
                    quantity: availableStock, // Use available stock as initial quantity
                    total: invoiceItem.price * availableStock
                  };
                }
                return invoiceItem;
              });
              
              const updatedSubtotal = updatedItems.reduce((sum: number, item: any) => sum + item.total, 0);
              
              const finalInvoiceData = {
                ...invoice,
                items: updatedItems,
                subtotal: updatedSubtotal
              };
              
              setInvoiceData(finalInvoiceData);
              setLoading(false);
            });
          })
          .then(() => {
            // This .then() is now handled above
          })
          .catch(error => {
            console.error('Error fetching customer:', error);
            setLoading(false);
          });
      } catch (error) {
        console.error('Error parsing items:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const handleQuantityChange = (itemIndex: number, newQuantity: number) => {
    if (invoiceData && newQuantity >= 0 && invoiceData.items) {
      const updatedItems = [...invoiceData.items];
      updatedItems[itemIndex].quantity = newQuantity;
      updatedItems[itemIndex].total = updatedItems[itemIndex].price * newQuantity;

      const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);

      setInvoiceData({
        ...invoiceData,
        items: updatedItems,
        subtotal
      });
    }
  };

  const handlePriceChange = (itemIndex: number, newPrice: number) => {
    if (invoiceData && newPrice >= 0 && invoiceData.items) {
      const updatedItems = [...invoiceData.items];
      updatedItems[itemIndex].price = newPrice;
      updatedItems[itemIndex].total = newPrice * updatedItems[itemIndex].quantity;

      const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);

      setInvoiceData({
        ...invoiceData,
        items: updatedItems,
        subtotal
      });
    }
  };

  const handleGenerateInvoice = async () => {
    if (!invoiceData) return;

    setSaving(true);

    try {
      // Generate and download invoice
      const filename = `Invoice_${invoiceData.invoiceNo}.pdf`;

      const { data: pdfData } = await generateStandardizedPDF(
        <InvoicePreview data={invoiceData} showDownloadButton={false} isPdfExport={true} />,
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

      // Update inventory quantities (deduct billed amounts)
      const updatePromises = (invoiceData.items || []).map(async (invoiceItem) => {
        // Find the corresponding inventory item with better matching
        const inventoryItem = currentInventory.find(inv => 
          inv.productName === invoiceItem.name || 
          inv.productName?.toLowerCase().trim() === invoiceItem.name?.toLowerCase().trim()
        );

        console.log('Looking for inventory item:', invoiceItem.name);
        console.log('Available inventory items:', currentInventory.map(inv => inv.productName));
        console.log('Found inventory item:', inventoryItem);

        if (inventoryItem) {
          const newInvoicedQuantity = (inventoryItem.invoicedQuantity || 0) + invoiceItem.quantity;
          const remainingQuantity = inventoryItem.quantity - newInvoicedQuantity;
          console.log(`Updating ${inventoryItem.productName}:`);
          console.log(`  Total Stock: ${inventoryItem.quantity}`);
          console.log(`  Previous Invoiced: ${inventoryItem.invoicedQuantity || 0}`);
          console.log(`  New Invoice: ${invoiceItem.quantity}`);
          console.log(`  Total Invoiced: ${newInvoicedQuantity}`);
          console.log(`  Remaining: ${remainingQuantity}`);

          // Update the inventory item - increment invoicedQuantity
          const response = await fetch(`/api/eshop-inventory/${inventoryItem._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              quantity: inventoryItem.quantity, // Keep original quantity
              invoicedQuantity: newInvoicedQuantity, // Increment invoiced quantity
              price: inventoryItem.price,
              notes: inventoryItem.notes,
              lastUpdated: new Date().toISOString()
            }),
          });

          const result = await response.json();
          console.log('Update result:', result);

          if (!result.success) {
            console.error('Failed to update inventory item:', result.error);
          }
        } else {
          console.error(`No inventory item found for: ${invoiceItem.name}`);
        }
      });

      await Promise.all(updatePromises);

      // Count successful updates
      const successfulUpdates = (invoiceData.items || []).filter((invoiceItem) => {
        return currentInventory.find(inv => 
          inv.productName === invoiceItem.name || 
          inv.productName?.toLowerCase().trim() === invoiceItem.name?.toLowerCase().trim()
        );
      }).length;

      // Wait a moment for database updates to complete, then refresh the current inventory
      await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
      
      try {
        const refreshedInventoryResponse = await fetch(`/api/eshop-inventory?t=${Date.now()}`, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const refreshedInventoryData = await refreshedInventoryResponse.json();
        console.log('Refreshed inventory data:', refreshedInventoryData);
        
        const refreshedInventoryArray = refreshedInventoryData.data || refreshedInventoryData;
        const refreshedCustomerInventory = refreshedInventoryArray.filter((item: any) => item.customerId === searchParams.get('customerId'));
        console.log('Filtered customer inventory:', refreshedCustomerInventory);
        
        setCurrentInventory(refreshedCustomerInventory);
      } catch (error) {
        console.error('Error refreshing inventory:', error);
      }

      alert(`Invoice generated successfully! Updated ${successfulUpdates} inventory items.`);

      // Redirect to dashboard My Customers tab after successful invoice generation
      setTimeout(() => {
        window.location.href = '/dashboard?section=customer-management&subsection=my-customers';
      }, 2000); // 2 second delay to allow user to see the success message

    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Error generating invoice. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Invoice Data</h1>
          <p className="text-gray-600 mb-6">Unable to load invoice. Please try again.</p>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-gray-900">Invoice Generator</h1>
          <div></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Invoice Controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Invoice Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(invoiceData.items || []).map((item, index) => {
                    // Find corresponding inventory item to get available stock
                    const inventoryItem = currentInventory.find(inv => 
                      inv.productName === item.name || 
                      inv.productName?.toLowerCase().trim() === item.name?.toLowerCase().trim()
                    );
                    const invoicedQty = inventoryItem?.invoicedQuantity || 0;
                    const availableStock = inventoryItem ? (inventoryItem.quantity - invoicedQty) : 0;
                    
                    return (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-medium text-sm mb-2">{item.name}</h4>
                        <div className="text-xs text-gray-500 mb-2">Available: {availableStock} units</div>

                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs">Quantity</Label>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantityChange(index, Math.max(0, item.quantity - 1))}
                                disabled={item.quantity <= 0}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const newQty = parseInt(e.target.value) || 0;
                                  const limitedQty = Math.min(newQty, availableStock);
                                  handleQuantityChange(index, limitedQty);
                                }}
                                min="0"
                                max={availableStock}
                                className="w-16 text-center text-sm"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantityChange(index, Math.min(item.quantity + 1, availableStock))}
                                disabled={item.quantity >= availableStock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                        <div>
                          <Label className="text-xs">Price (₹)</Label>
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) => handlePriceChange(index, parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            className="text-sm"
                          />
                        </div>

                          <div className="text-xs text-gray-600">
                            Total: ₹{item.total.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Current Inventory Info */}
                {currentInventory.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-sm">Current Inventory</h5>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            const response = await fetch(`/api/eshop-inventory?t=${Date.now()}`, {
                              cache: 'no-cache',
                              headers: { 
                                'Cache-Control': 'no-cache',
                                'Pragma': 'no-cache'
                              }
                            });
                            const data = await response.json();
                            const inventoryArray = data.data || data;
                            const customerInventory = inventoryArray.filter((item: any) => item.customerId === searchParams.get('customerId'));
                            setCurrentInventory(customerInventory);
                          } catch (error) {
                            console.error('Error refreshing inventory:', error);
                          }
                        }}
                        className="text-xs px-2 py-1 h-6"
                      >
                        Refresh
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {currentInventory.map((item) => {
                        const invoicedQty = item.invoicedQuantity || 0;
                        const availableQty = item.quantity - invoicedQty;
                        return (
                          <div key={item._id} className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                            <div className="font-medium">{item.productName}</div>
                            <div>Current Stock: {availableQty}</div>
                            <div>Price: ₹{item.price}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Invoice Preview */}
          <div className="lg:col-span-3">
            <div className="flex justify-end mb-4">
              <Button
                onClick={handleGenerateInvoice}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Generate Invoice
                  </>
                )}
              </Button>
            </div>

            <InvoicePreview data={invoiceData} showDownloadButton={false} isPdfExport={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
