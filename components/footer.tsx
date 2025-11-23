import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-blue-700 relative z-30" style={{background: 'linear-gradient(135deg, #000000 0%, #0300ff 100%)'}}>
       <div className="container mx-auto px-4 py-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info */}
          <div>
             <div className="flex flex-col items-center mb-3">
                 <img 
                   src="/logo.png" 
                   alt="Adminza Logo" 
                   style={{height: '100px', width: 'auto'}}
                   className="object-contain mb-2"
                 />
               <span className="text-2xl font-bold text-white">Adminza.in</span>
             </div>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-gray-300">
                <MapPin className="h-4 w-4 mr-2" />
                <span>B-427, Balaji Bhavan, Plot No.42A, Sector-11, CBD Belapur, Navi Mumbai 400614</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Phone className="h-4 w-4 mr-2" />
                <span>+91-8433661506</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                <span>customercare@adminza.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 ml-6">
             <h3 className="font-semibold mb-3 text-white text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors text-base">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="text-gray-300 hover:text-white transition-colors text-base">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-base">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-white transition-colors text-base">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-gray-300 hover:text-white transition-colors text-base">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="mt-8 ml-6">
             <h3 className="font-semibold mb-3 text-white text-lg">Popular Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/categories/it-support"
                  className="text-gray-300 hover:text-white transition-colors text-base"
                >
                  IT Support
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/furniture-interior"
                  className="text-gray-300 hover:text-white transition-colors text-base"
                >
                  Office Furniture
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/cleaning-solutions"
                  className="text-gray-300 hover:text-white transition-colors text-base"
                >
                  Cleaning Services
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/printing-solutions"
                  className="text-gray-300 hover:text-white transition-colors text-base"
                >
                  Printing & Signage
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/amc-services"
                  className="text-gray-300 hover:text-white transition-colors text-base"
                >
                  AMC Services
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/business-promotion"
                  className="text-gray-300 hover:text-white transition-colors text-base"
                >
                  Business Promotion
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/office-support"
                  className="text-gray-300 hover:text-white transition-colors text-base"
                >
                  Office Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="mt-8 ml-6">
             <h3 className="font-semibold mb-3 text-white text-lg">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors text-base">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors text-base">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors text-base">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white transition-colors text-base">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-gray-300 hover:text-white transition-colors text-base">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-gray-300 hover:text-white transition-colors text-base">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors text-base">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

         <div className="border-t border-blue-700 mt-6 pt-6 text-center text-gray-300">
          <p>&copy; 2025 Adminza.in. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
