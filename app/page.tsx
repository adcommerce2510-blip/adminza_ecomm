import { Header } from "@/components/header"
import { BannerSlider } from "@/components/banner-slider"
import { DynamicCategoriesSection } from "@/components/dynamic-categories-section"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Zap, 
  Award,
  ArrowRight,
  Star,
  Quote
} from "lucide-react"
import { AnimatedWrapper, StaggeredContainer } from "@/components/animated-wrapper"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Banner Slider */}
        <BannerSlider />

        {/* Categories Section */}
        <DynamicCategoriesSection />

        {/* Why Choose Us Section */}
        <section className="pt-2 pb-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedWrapper animation="fade-in-up">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <AnimatedWrapper animation="fade-in" delay={200}>
                  <Badge className="mb-4" variant="outline">
                    <Award className="w-4 h-4 mr-2" />
                    Why Choose Adminza
                  </Badge>
                </AnimatedWrapper>
                <AnimatedWrapper animation="fade-in-up" delay={400}>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Your Trusted <span className="gradient-text bg-clip-text text-transparent" style={{background: 'linear-gradient(135deg, #000000 0%, #0300ff 100%)', WebkitBackgroundClip: 'text'}}>Business Partner</span>
                  </h2>
                </AnimatedWrapper>
                <AnimatedWrapper animation="fade-in-up" delay={600}>
                  <p className="text-lg text-muted-foreground">
                    We provide comprehensive business solutions with verified vendors, competitive pricing, and exceptional service quality.
                  </p>
                </AnimatedWrapper>
              </div>
            </AnimatedWrapper>

            <StaggeredContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={150}>
              {[
                {
                  icon: ShieldCheck,
                  title: "Verified Vendors",
                  description: "All vendors are thoroughly verified and certified to ensure quality and reliability.",
                  color: "text-blue-600",
                  bgImage: "/office-stationery-bundle.jpg",
                  bgGradient: "from-blue-500/20 to-blue-600/10"
                },
                {
                  icon: TrendingUp,
                  title: "Competitive Pricing",
                  description: "Get the best deals with transparent pricing and no hidden charges.",
                  color: "text-green-600",
                  bgImage: "/modern-office-desk-setup.jpg",
                  bgGradient: "from-green-500/20 to-green-600/10"
                },
                {
                  icon: Zap,
                  title: "Fast Delivery",
                  description: "Quick turnaround time with pan-India delivery network and tracking.",
                  color: "text-orange-600",
                  bgImage: "/desk-organizer-set.jpg",
                  bgGradient: "from-orange-500/20 to-orange-600/10"
                },
                {
                  icon: Users,
                  title: "Expert Support",
                  description: "24/7 dedicated customer support to assist you at every step.",
                  color: "text-purple-600",
                  bgImage: "/it-network-setup-office.jpg",
                  bgGradient: "from-purple-500/20 to-purple-600/10"
                },
                {
                  icon: CheckCircle2,
                  title: "Quality Assurance",
                  description: "Rigorous quality checks to ensure you get the best products and services.",
                  color: "text-red-600",
                  bgImage: "/corporate-branding-materials.jpg",
                  bgGradient: "from-red-500/20 to-red-600/10"
                },
                {
                  icon: Award,
                  title: "Trusted by 1000+",
                  description: "Join thousands of satisfied businesses across India.",
                  color: "text-indigo-600",
                  bgImage: "/large-format-printing-banners.jpg",
                  bgGradient: "from-indigo-500/20 to-indigo-600/10"
                }
              ].map((feature, index) => (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] cursor-pointer overflow-hidden h-[280px] relative feature-card-premium">
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-110"
                    style={{ backgroundImage: `url(${feature.bgImage})` }}
                  >
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-85 hover:opacity-75 transition-all duration-300`}></div>
                    
                    {/* Content */}
                    <CardContent className="relative z-10 h-full p-8 flex flex-col justify-between">
                      <div>
                        <div className={`w-20 h-20 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center mb-8 hover-bounce feature-icon-premium shadow-lg`}>
                          <feature.icon className={`w-10 h-10 text-white drop-shadow-lg`} />
                        </div>
                        <h3 className="text-2xl font-bold mb-6 text-white drop-shadow-xl feature-title-premium leading-tight">{feature.title}</h3>
                        <p className="text-white text-base leading-relaxed drop-shadow-lg font-medium">{feature.description}</p>
                      </div>
                      
                      {/* Decorative element */}
                      <div className="absolute bottom-6 right-6 w-10 h-10 bg-white/30 rounded-full animate-pulse shadow-lg"></div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </StaggeredContainer>
          </div>
        </section>

        <section className="py-12 bg-[#020617] relative overflow-hidden">
          {/* Extremely compact background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-5 left-5 w-32 h-32 bg-blue-600/10 rounded-full blur-[80px] animate-pulse"></div>
            <div className="absolute bottom-5 right-5 w-48 h-48 bg-indigo-600/10 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1.5s'}}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <AnimatedWrapper animation="fade-in-down">
              <div className="text-center max-w-4xl mx-auto mb-10">
                <AnimatedWrapper animation="scale-in" delay={200}>
                  <Badge className="mb-4 px-3 py-1 bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold rounded-full uppercase tracking-[0.2em] text-[8px]">
                    Process
                  </Badge>
                </AnimatedWrapper>
                <AnimatedWrapper animation="fade-in-up" delay={400}>
                  <h2 className="text-4xl md:text-5xl font-black mb-6 leading-none tracking-tighter text-white">
                    Four Steps To <span className="text-blue-500">Excellence</span>
                  </h2>
                </AnimatedWrapper>
                <AnimatedWrapper animation="fade-in-up" delay={600}>
                  <p className="text-base md:text-lg text-slate-400 leading-relaxed font-medium max-w-xl mx-auto opacity-80">
                    Seamless integration designed to streamline your business procurement.
                  </p>
                </AnimatedWrapper>
              </div>
            </AnimatedWrapper>

            <StaggeredContainer className="grid grid-cols-1 md:grid-cols-4 gap-x-12 gap-y-16 max-w-6xl mx-auto" staggerDelay={150}>
              {[
                { step: "01", title: "Browse", description: "Explore our catalog of premium office products." },
                { step: "02", title: "Select", description: "Leverage verified vendor insights for informed decisions." },
                { step: "03", title: "Execute", description: "Streamlined procurement with secure payments." },
                { step: "04", title: "Deliver", description: "Timely logistics ensures your operations miss no beats." }
              ].map((step, index) => (
                <div key={index} className="relative group">
                  <div className="text-center flex flex-col items-center">
                    {/* Architectural Step Indicator */}
                    <div className="w-16 h-16 mb-8 rounded-full flex items-center justify-center text-white font-black text-xl relative transition-all duration-500 group-hover:scale-110 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
                      <div className="absolute inset-0 bg-blue-600 rounded-full opacity-5 group-hover:opacity-20 transition-opacity"></div>
                      <span className="relative z-10 text-blue-500">{step.step}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-3 text-white tracking-tight">{step.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm lg:text-base font-medium opacity-80 px-4">{step.description}</p>
                  </div>
                  
                  {/* Architectural Connecting Line */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-[65%] w-[70%] h-px bg-gradient-to-r from-blue-500/30 to-transparent"></div>
                  )}
                </div>
              ))}
            </StaggeredContainer>

            <AnimatedWrapper animation="fade-in-up" delay={800}>
              <div className="text-center mt-12 pb-4">
                <Link href="/categories">
                  <Button size="lg" className="h-14 px-12 rounded-full border border-blue-500/30 bg-blue-600/5 text-blue-400 font-black hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-[0_10px_40px_-15px_rgba(37,99,235,0.3)] hover:shadow-[0_20px_50px_-10px_rgba(37,99,235,0.5)] group/cta">
                    Get Started Now
                    <ArrowRight className="ml-3 h-5 w-5 group-hover/cta:translate-x-1.5 transition-transform" strokeWidth={3} />
                  </Button>
                </Link>
              </div>
            </AnimatedWrapper>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-28 bg-white border-t border-slate-100 relative overflow-hidden">
          {/* Professional background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0300ff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-20 right-10 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1.5s'}}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <AnimatedWrapper animation="fade-in-down">
              <div className="text-center max-w-4xl mx-auto mb-20">
                <AnimatedWrapper animation="scale-in" delay={200}>
                  <Badge className="mb-6 bg-blue-600/10 text-blue-700 border-none px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[11px]" variant="outline">
                    Client Success
                  </Badge>
                </AnimatedWrapper>
                <AnimatedWrapper animation="fade-in-up" delay={400}>
                  <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.05]">
                    Trusted By <span className="bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">Industry Leaders</span>
                  </h2>
                </AnimatedWrapper>
                <AnimatedWrapper animation="fade-in-up" delay={600}>
                  <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
                    Discover how businesses across the nation leverage our comprehensive solutions to achieve operational excellence.
                  </p>
                </AnimatedWrapper>
              </div>
            </AnimatedWrapper>

            <StaggeredContainer className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto" staggerDelay={200}>
              {[
                {
                  name: "Rajesh Kumar",
                  company: "Tech Solutions Pvt Ltd",
                  review: "Adminza has been a game-changer for our office supply needs. The quality and service are exceptional!",
                  rating: 5,
                  avatar: "👨‍💼"
                },
                {
                  name: "Priya Sharma",
                  company: "Creative Agency",
                  review: "From furniture to IT solutions, everything we need is available at competitive prices. Highly recommended!",
                  rating: 5,
                  avatar: "👩‍💻"
                },
                {
                  name: "Amit Patel",
                  company: "Manufacturing Co",
                  review: "The vendor network is excellent and the customer support team is always ready to help. Great experience!",
                  rating: 5,
                  avatar: "👨‍🏭"
                }
              ].map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] cursor-pointer overflow-hidden testimonials-card">
                  <CardContent className="p-8 relative">
                    {/* Background decorative pattern */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-accent/5 rounded-bl-3xl"></div>
                    
                    {/* Quote icon */}
                    <div className="w-16 h-16 text-primary/20 mb-6 testimonials-quote">
                      <Quote className="w-full h-full" />
                    </div>
                    
                    {/* Star rating */}
                    <div className="flex mb-6 testimonials-stars">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400 hover-bounce" style={{animationDelay: `${i * 0.1}s`}} />
                      ))}
                    </div>
                    
                    {/* Review text */}
                    <p className="text-slate-700 mb-8 italic text-lg leading-relaxed font-medium testimonials-review">"{testimonial.review}"</p>
                    
                    {/* Customer info */}
                    <div className="border-t border-slate-200 pt-6 flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center text-2xl mr-4 testimonials-avatar">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-lg testimonials-name">{testimonial.name}</p>
                        <p className="text-slate-600 font-medium testimonials-company">{testimonial.company}</p>
                      </div>
                    </div>
                    
                    {/* Decorative corner element */}
                    <div className="absolute bottom-4 right-4 w-6 h-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </StaggeredContainer>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
