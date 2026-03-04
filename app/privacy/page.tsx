import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Legal
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              How we collect, use, and protect your information at Adminza.in
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We collect information you provide when registering, placing orders, or contacting us. This may include your name, email address, phone number, billing and shipping address, and company details where relevant.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use your information to process orders, provide customer support, send order updates, and improve our services. We may also use it to send promotional communications with your consent.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, or destruction.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our website may use cookies to enhance your experience, remember preferences, and analyse site traffic. You can manage cookie settings in your browser.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              For any questions about this Privacy Policy or your data, contact us at customer@adminza.com or at our address: B-427, Balaji Bhavan, Plot No.42A, Sector-11, CBD Belapur, Navi Mumbai 400614.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
