import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Support
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Support</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're here to help. Reach out for orders, technical help, or general enquiries.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <a href="mailto:customer@adminza.com" className="flex items-start gap-4 p-6 rounded-xl border bg-card hover:border-primary/30 transition-colors">
                <Mail className="h-8 w-8 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-muted-foreground text-sm">customer@adminza.com</p>
                  <p className="text-muted-foreground text-sm mt-2">We typically respond within 24 hours.</p>
                </div>
              </a>
              <a href="tel:+918433661506" className="flex items-start gap-4 p-6 rounded-xl border bg-card hover:border-primary/30 transition-colors">
                <Phone className="h-8 w-8 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <p className="text-muted-foreground text-sm">+91-8433661506</p>
                  <p className="text-muted-foreground text-sm mt-2">Mon–Fri, 9 AM – 7 PM IST</p>
                </div>
              </a>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-xl border bg-card mb-8">
              <MapPin className="h-8 w-8 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Office</h3>
                <p className="text-muted-foreground">
                  B-427, Balaji Bhavan, Plot No.42A, Sector-11, CBD Belapur, Navi Mumbai 400614
                </p>
              </div>
            </div>
            <div className="text-center">
              <Link href="/contact">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact form
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
