"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { 
  Building2, 
  Target, 
  MessageSquare, 
  Users, 
  Share2, 
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Handshake,
  Lightbulb,
  Scale,
  Eye,
  Sparkles,
  CheckCircle2
} from "lucide-react"

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }))
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    const sections = document.querySelectorAll('[id^="section-"]')
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="bg-white">
        {/* Hero Section - Our Story */}
        <section className="pt-20 md:pt-28 pb-8 md:pb-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                {/* Left Side - Text Content */}
                <div 
                  id="section-story"
                  className={`transition-all duration-1000 ${
                    isVisible["section-story"] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                  }`}
                >
                  <h1 
                    className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
                    style={{
                      background: 'linear-gradient(135deg, #92400e 0%, #ea580c 50%, #f97316 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    About Us
                  </h1>
                  <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
                    <p>
                      Welcome to <strong className="text-gray-900">Dhanasvi Office & Print-Packaging Private Limited (ADMINZA)</strong>, your trusted partner in delivering high-quality printing, stationery, office support services, and comprehensive office solutions.
                    </p>
                    <p>
                      With years of experience in the industry, we are dedicated to meeting the diverse needs of businesses and individuals, ensuring that your office operations run smoothly, efficiently, and with the utmost professionalism.
                    </p>
                    <p>
                      At Adminza, we understand the pivotal role that office supplies and support services play in the success of any business, hence we offer a one-stop shop for all your printing, stationery, and office solution requirements, designed to save time, reduce stress and be cost-effective and also enhance productivity.
                    </p>
                  </div>
                </div>

                {/* Right Side - Image */}
                <div 
                  id="section-image"
                  className={`h-[500px] md:h-[600px] lg:h-[700px] transition-all duration-1000 mt-12 lg:mt-68 ${
                    isVisible["section-image"] ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                  }`}
                >
                  <img
                    src="/modern-office-desk-setup.jpg"
                    alt="Professional Office Setup"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="pt-8 md:pt-12 pb-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div 
                id="section-why"
                className={`text-center mb-16 transition-all duration-1000 ${
                  isVisible["section-why"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Badge className="mb-4 px-4 py-1.5 text-sm font-semibold bg-blue-100 text-blue-700 border-blue-200">
                  Our Strengths
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Why Choose Us?
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We offer comprehensive solutions designed to enhance your business operations
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    id: "quality",
                    icon: Handshake,
                    title: "Quality & Reliability",
                    description: "Top-notch products and services you can rely on",
                    color: "teal"
                  },
                  {
                    id: "customer",
                    icon: Users,
                    title: "Customer-Centric",
                    description: "Personalized solutions that make a real difference",
                    color: "blue"
                  },
                  {
                    id: "pricing",
                    icon: Scale,
                    title: "Competitive Pricing",
                    description: "Best value for money without compromising quality",
                    color: "purple"
                  },
                  {
                    id: "innovation",
                    icon: Lightbulb,
                    title: "Innovative Solutions",
                    description: "Cutting-edge products and modern office supplies",
                    color: "orange"
                  }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.id}
                      id={`section-${item.id}`}
                      className={`transition-all duration-1000 ${
                        index === 0 ? "delay-100" : index === 1 ? "delay-200" : index === 2 ? "delay-300" : "delay-400"
                      } ${
                        isVisible[`section-${item.id}`] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                      }`}
                    >
                      <Card className="border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white h-full text-center p-8">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${
                          item.color === "teal" ? "from-teal-500 to-teal-600" :
                          item.color === "blue" ? "from-blue-500 to-blue-600" :
                          item.color === "purple" ? "from-purple-500 to-purple-600" :
                          "from-orange-500 to-orange-600"
                        } flex items-center justify-center mx-auto mb-6 shadow-md`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Mission */}
                <div
                  id="section-mission"
                  className={`transition-all duration-1000 delay-200 ${
                    isVisible["section-mission"] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                  }`}
                >
                  <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 bg-white h-full">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600"></div>
                    <CardContent className="p-10">
                      <div className="flex items-start gap-6 mb-6">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md">
                          <Target className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Our Mission</h2>
                          <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
                        </div>
                      </div>
                      <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                        At Adminza, we understand the pivotal role that office supplies and support services play in the success of any business, hence we offer a one-stop shop for all your printing, stationery, and office solution requirements, designed to save time, reduce stress and be cost-effective and also enhance productivity.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Vision */}
                <div
                  id="section-vision"
                  className={`transition-all duration-1000 delay-300 ${
                    isVisible["section-vision"] ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                  }`}
                >
                  <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 bg-white h-full">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600"></div>
                    <CardContent className="p-10">
                      <div className="flex items-start gap-6 mb-6">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                          <Eye className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Our Vision</h2>
                          <div className="w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                        </div>
                      </div>
                      <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                        To be the leading B2B marketplace for office infrastructure and IT services, empowering businesses with seamless access to high-quality products and unparalleled support, fostering growth and efficiency.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Sections */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Feedback Card */}
                <div
                  id="section-feedback"
                  className={`transition-all duration-1000 delay-200 ${
                    isVisible["section-feedback"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  <Card className="group border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-green-400 bg-white h-full">
                    <CardContent className="p-10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                          <MessageSquare className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Your Feedback Matters</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-8">
                        As we build & grow our products & services, please feel free to give us your valuable feedback & suggestions to help us improve your shopping experience or if you have any difficulty connecting with us, please contact us.
                      </p>
                      <Link href="/contact">
                        <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-12 font-semibold shadow-md hover:shadow-lg transition-all">
                          Contact Us
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>

                {/* Registration Card */}
                <div
                  id="section-register"
                  className={`transition-all duration-1000 delay-300 ${
                    isVisible["section-register"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  <Card className="group border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-purple-400 bg-white h-full">
                    <CardContent className="p-10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                          <Users className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Stay Connected</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-8">
                        Please do register yourself on our website, to help us reach out to you and keep you informed about all the new & exciting products that we will continue to offer, and also get some fantastic promotions & offers.
                      </p>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 font-semibold shadow-md hover:shadow-lg transition-all">
                        Register Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div
                id="section-social"
                className={`transition-all duration-1000 ${
                  isVisible["section-social"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Card className="border border-gray-200 shadow-lg bg-white">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
                  <CardContent className="p-12">
                    <div className="text-center mb-10">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-md">
                        <Share2 className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Follow Us</h2>
                      <div className="w-20 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-6"></div>
                      <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                        For ongoing updates on new products, announcements and stories like us on <strong className="text-blue-600">Facebook</strong> & <strong className="text-pink-600">Instagram</strong> and follow us on <strong className="text-blue-700">LinkedIn</strong> & <strong className="text-sky-500">Twitter</strong>.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md transition-all duration-300 border border-gray-200 group"
                      >
                        <Facebook className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold">Facebook</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 hover:bg-pink-50 hover:border-pink-400 hover:shadow-md transition-all duration-300 border border-gray-200 group"
                      >
                        <Instagram className="h-6 w-6 text-pink-600 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold">Instagram</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md transition-all duration-300 border border-gray-200 group"
                      >
                        <Linkedin className="h-6 w-6 text-blue-700 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold">LinkedIn</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 hover:bg-sky-50 hover:border-sky-400 hover:shadow-md transition-all duration-300 border border-gray-200 group"
                      >
                        <Twitter className="h-6 w-6 text-sky-500 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold">Twitter</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Message */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div
                id="section-closing"
                className={`transition-all duration-1000 ${
                  isVisible["section-closing"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Card className="border border-gray-200 shadow-xl bg-white">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500"></div>
                  <CardContent className="p-12 text-center">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-md">
                      <Building2 className="h-10 w-10 text-white" />
                    </div>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-relaxed">
                      We look forward to welcoming you at <strong className="text-blue-700">AOSS – ADMINZA OFFICE SUPORT SOLUTIONS</strong>.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
