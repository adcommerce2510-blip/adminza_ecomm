import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Legal
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Terms & Conditions</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Terms of use for Adminza.in Business Solutions
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              By accessing or using Adminza.in, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our website or services.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Use of Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our platform is intended for business customers. You agree to use the site only for lawful purposes and in accordance with these terms. You must not misuse the site, attempt to gain unauthorised access, or interfere with its operation.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Orders and Payment</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All orders are subject to acceptance and availability. Prices are as displayed at the time of order. We reserve the right to correct pricing errors. Payment terms are as agreed at the time of purchase or as per our standard terms for your account.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All content on this website, including text, logos, and images, is the property of Adminza.in or its licensors and is protected by applicable intellectual property laws.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Return Policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We accept returns on most products within 7–15 days of delivery, subject to items being unused, in original packaging, and with proof of purchase. Customised or perishable items (e.g. printed stationery, branded goods) may not be eligible for return. For defective or wrong items, we will arrange replacement or refund. To initiate a return, contact us at customer@adminza.com with your order number and reason. Refunds are processed within 7–10 business days after we receive the returned goods. For services (e.g. AMC, installation, printing), refunds are handled as per the specific service agreement.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Shipping Policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We ship across India. Delivery timelines depend on product type and location; typically 3–7 business days for standard orders. Bulk or heavy consignments (e.g. furniture, equipment) may take longer and will be communicated at the time of order. Shipping charges may apply based on order value and destination; free shipping may be offered on orders above a specified value as per our current promotions. You will receive order and tracking details via email or SMS. Risk of loss passes to you upon delivery. For delayed or missing shipments, please contact us with your order number so we can assist.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Contact</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              For questions about these Terms & Conditions, contact us at customer@adminza.com or B-427, Balaji Bhavan, Plot No.42A, Sector-11, CBD Belapur, Navi Mumbai 400614.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
