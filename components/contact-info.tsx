import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-8">
      {/* Contact Details */}
      <Card className="glass-effect border-2 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Address</h4>
                <p className="text-muted-foreground">
                  B-427, Balaji Bhavan, Plot No.42A, Sector-11, CBD Belapur, Navi Mumbai 400614
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Contact</h4>
                <p className="text-muted-foreground">
                  +91-8433661506
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-success" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Email</h4>
                <p className="text-muted-foreground">
                  customer@adminza.com
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Business Hours</h4>
                <p className="text-muted-foreground">
                  Monday - Friday: 9:00 AM - 7:00 PM
                  <br />
                  Saturday: 10:00 AM - 5:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
