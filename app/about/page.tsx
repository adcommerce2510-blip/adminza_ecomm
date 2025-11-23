import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  Building2, 
  Target, 
  MessageSquare, 
  Users, 
  Share2, 
  CheckCircle2,
  Award,
  TrendingUp,
  Clock,
  DollarSign,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Handshake,
  Lightbulb,
  Scale
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Badge className="mb-6 px-4 py-2 text-sm font-semibold bg-primary/10 text-primary border-primary/20">
              About Us
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
              Welcome
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              Your trusted partner in delivering high-quality printing, stationery, office support services, and comprehensive office solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="border-2 shadow-xl overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Who We Are</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Welcome to <strong className="text-blue-700">Dhanasvi Office & Print-Packaging Private Limited (ADMINZA)</strong>, your trusted partner in delivering high-quality printing, stationery, office support services, and comprehensive office solutions. With years of experience in the industry, we are dedicated to meeting the diverse needs of businesses and individuals, ensuring that your office operations run smoothly, efficiently, and with the utmost professionalism.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mt-4">
                      At Adminza, we understand the pivotal role that office supplies and support services play in the success of any business, hence we offer a one-stop shop for all your printing, stationery, and office solution requirements, designed to save time, reduce stress and be cost-effective and also enhance productivity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
              <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Quality and Reliability */}
              <Card className="border-2 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6">
                    <Handshake className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality and Reliability</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We pride ourselves on offering top-notch products and services that our clients can rely on. With a commitment to quality and attention to detail, we ensure that your office needs are met to the highest standards.
                  </p>
                </CardContent>
              </Card>

              {/* Customer-Centric Approach */}
              <Card className="border-2 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6">
                    <Users className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer-Centric Approach</h3>
                  <p className="text-gray-700 leading-relaxed">
                    At Adminza, our customers are at the heart of everything we do. We listen closely to your needs and offer personalized solutions that make a real difference in your daily operations. We aim to build long-term relationships based on trust, reliability, and excellence.
                  </p>
                </CardContent>
              </Card>

              {/* Competitive Pricing */}
              <Card className="border-2 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6">
                    <Scale className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Competitive Pricing</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We believe that high-quality office supplies and services should be accessible to businesses of all sizes. Our competitive pricing structure ensures that you get the best value for your money without compromising on quality.
                  </p>
                </CardContent>
              </Card>

              {/* Innovative Solutions */}
              <Card className="border-2 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6">
                    <Lightbulb className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovative Solutions</h3>
                  <p className="text-gray-700 leading-relaxed">
                    In an ever-evolving business landscape, we are committed to staying at the forefront of innovation. Our team continually explores new products, technologies, and processes to help your business thrive. Whether you need cutting-edge printing techniques or modern office supplies, we have the solutions to keep you ahead of the curve.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission and Vision Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Our Mission */}
              <Card className="border-2 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-blue-800 flex items-center justify-center shadow-lg">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    At Adminza, we understand the pivotal role that office supplies and support services play in the success of any business, hence we offer a one-stop shop for all your printing, stationery, and office solution requirements, designed to save time, reduce stress and be cost-effective and also enhance productivity.
                  </p>
                </CardContent>
              </Card>

              {/* Our Vision */}
              <Card className="border-2 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To become the leading provider of comprehensive office solutions, recognized for our commitment to quality, innovation, and customer satisfaction. We envision a future where businesses of all sizes have seamless access to premium office supplies and support services that drive their success.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Sections */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feedback Card */}
              <Card className="border-2 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <MessageSquare className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Your Feedback Matters</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    As we build & grow our products & services, please feel free to give us your valuable feedback & suggestions to help us improve your shopping experience or if you have any difficulty connecting with us, please contact us.
                  </p>
                  <Link href="/contact">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Contact Us
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Registration Card */}
              <Card className="border-2 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                      <Users className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Stay Connected</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Please do register yourself on our website, to help us reach out to you and keep you informed about all the new & exciting products that we will continue to offer, and also get some fantastic promotions & offers.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Share2 className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Follow Us</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    For ongoing updates on new products, announcements and stories like us on <strong>Facebook</strong> & <strong>Instagram</strong> and follow us on <strong>LinkedIn</strong> & <strong>Twitter</strong>.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-16 flex-col gap-2 hover:bg-blue-50 hover:border-blue-500">
                    <Facebook className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-medium">Facebook</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2 hover:bg-pink-50 hover:border-pink-500">
                    <Instagram className="h-6 w-6 text-pink-600" />
                    <span className="text-sm font-medium">Instagram</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2 hover:bg-blue-50 hover:border-blue-500">
                    <Linkedin className="h-6 w-6 text-blue-700" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2 hover:bg-sky-50 hover:border-sky-500">
                    <Twitter className="h-6 w-6 text-sky-500" />
                    <span className="text-sm font-medium">Twitter</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Closing Message */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 shadow-xl bg-gradient-to-br from-gray-50 to-blue-50">
              <CardContent className="p-8 md:p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">
                  We look forward to welcoming you at <strong className="text-blue-700">AOSS – ADMINZA OFFICE SUPORT SOLUTIONS</strong>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  )
}

