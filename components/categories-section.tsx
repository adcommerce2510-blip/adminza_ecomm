import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { AnimatedWrapper, StaggeredContainer } from "@/components/animated-wrapper"

interface CategoryCard {
  id: number
  title: string
  description: string
  href: string
  buttonText: string
  image: string
  items: string[]
}

const categoryCards: CategoryCard[] = [
  {
    id: 1,
    title: "Office Stationery",
    description: "Complete range of office supplies and stationery items for all your business needs",
    href: "/categories/office-stationery",
    buttonText: "Shop Now",
    image: "/office-stationery-bundle.jpg",
    items: [
      "Paper Products & Writing Materials",
      "Files & Documents Holder",
      "Office Tools & Accessories",
      "Desk Essentials & Organizers"
    ]
  },
  {
    id: 2,
    title: "IT Support & Network",
    description: "Hardware installations, cloud services, and comprehensive network security solutions",
    href: "/categories/it-support",
    buttonText: "Learn More",
    image: "/it-network-setup-office.jpg",
    items: [
      "Data Solutions & Cloud Services",
      "Network Security & Firewalls",
      "Hardware Installations",
      "Safety Systems & CCTV"
    ]
  },
  {
    id: 3,
    title: "Cleaning Solutions",
    description: "Professional cleaning and premises maintenance services for pristine workspaces",
    href: "/categories/cleaning-solutions",
    buttonText: "Explore",
    image: "/office-cleaning.png",
    items: [
      "Professional Deep Cleaning",
      "Carpet & Chair Shampooing",
      "Marble Polishing",
      "Floor Scrubbing Services"
    ]
  },
  {
    id: 4,
    title: "Business Promotion",
    description: "Branding solutions, marketing materials, and comprehensive promotional strategies",
    href: "/categories/business-promotion",
    buttonText: "Promote",
    image: "/corporate-branding-materials.jpg",
    items: [
      "Logo and Branding Solutions",
      "Digital Marketing Solutions",
      "Website Design Solutions",
      "2D/3D Animation Videos"
    ]
  },
  {
    id: 5,
    title: "Office Support Solutions",
    description: "Complete office support services including courier, relocation, and space solutions",
    href: "/categories/office-support",
    buttonText: "Support",
    image: "/modern-office-desk-setup.jpg",
    items: [
      "Courier Services",
      "Packaging & Relocation",
      "Office Beautification",
      "Office Space Solutions"
    ]
  },
  {
    id: 6,
    title: "Office Furniture & Interior",
    description: "Modern furniture and complete interior fit-out solutions for professional workspaces",
    href: "/categories/furniture-interior",
    buttonText: "Furnish",
    image: "/modern-office-desk-front-view.jpg",
    items: [
      "Office Chairs & Workstations",
      "Fit-outs & Interiors",
      "Conference Tables",
      "File Cabinets & Shelves"
    ]
  },
  {
    id: 7,
    title: "Printing Solutions",
    description: "Professional printing services and custom branded materials for all business needs",
    href: "/categories/printing-solutions",
    buttonText: "Print",
    image: "/large-format-printing-banners.jpg",
    items: [
      "Sign Board Printing",
      "Visiting Card Printing",
      "Brochure & Pamphlet Printing",
      "Customized Files Printing"
    ]
  },
  {
    id: 8,
    title: "AMC Services",
    description: "Annual maintenance contracts and technical support for all your business equipment",
    href: "/categories/amc-services",
    buttonText: "Maintain",
    image: "/ergonomic-office-chair.png",
    items: [
      "Plumbing Services",
      "Carpentry Services",
      "Electrician Services",
      "AC Servicing"
    ]
  },
  {
    id: 9,
    title: "Corporate Gifting",
    description: "Premium corporate gifts and employee recognition items with custom branding",
    href: "/categories/corporate-gifting",
    buttonText: "Gift",
    image: "/desk-organizer-set.jpg",
    items: [
      "Promotional Items",
      "Custom Merchandise",
      "Executive Gifts",
      "Employee Recognition"
    ]
  }
]

export function CategoriesSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedWrapper animation="fade-in-down">
          <div className="text-center mb-12 relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-20 w-16 h-16 bg-accent/5 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-primary/3 rounded-full animate-pulse delay-500"></div>
            </div>
            
            <AnimatedWrapper animation="scale-in" delay={200}>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 text-primary rounded-full text-sm font-medium mb-8 border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105">
                <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
                Comprehensive Solutions
                <div className="w-2 h-2 bg-primary rounded-full ml-3 animate-pulse"></div>
              </div>
            </AnimatedWrapper>
            
            <AnimatedWrapper animation="fade-in-up" delay={400}>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent relative" style={{background: 'linear-gradient(135deg, #000000 0%, #0300ff 100%)', WebkitBackgroundClip: 'text'}}>
                Explore All Categories
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full opacity-20 animate-bounce"></div>
              </h2>
            </AnimatedWrapper>
            
            <AnimatedWrapper animation="fade-in-up" delay={600}>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed relative">
                Discover our comprehensive range of business solutions and services designed to meet all your enterprise needs
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
              </p>
            </AnimatedWrapper>
          </div>
        </AnimatedWrapper>

        {/* Main Category Cards */}
        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16" staggerDelay={150}>
          {categoryCards.map((card) => (
            <Link key={card.id} href={card.href}>
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden h-[320px] relative category-card-premium">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={card.id <= 3}
                  />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 hover:bg-black/50 transition-all duration-300 z-[1]"></div>
                  
                {/* Content */}
                <div className="relative z-10 h-full p-6 flex flex-col justify-between text-white">
                  <div>
                    <h3 className="text-xl font-bold mb-3 leading-tight text-white drop-shadow-lg font-serif category-title-premium">
                      {card.title}
                    </h3>
                    <p className="text-base mb-4 leading-relaxed line-clamp-2 text-white drop-shadow-md font-serif">
                      {card.description}
                    </p>
                    
                    {/* Feature List - Show only 2 items */}
                    <div className="space-y-2 mb-4">
                      {card.items.slice(0, 2).map((item: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          <span className="text-sm text-white drop-shadow-sm font-serif">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Button */}
                  <Button className="w-fit text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg category-button-premium" style={{background: 'linear-gradient(135deg, #000000 0%, #0300ff 100%)'}}>
                    {card.buttonText}
                    <ArrowRightIcon className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </StaggeredContainer>

      </div>
    </section>
  )
}