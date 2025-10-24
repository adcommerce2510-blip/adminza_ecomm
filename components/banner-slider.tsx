"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"

export function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const sliderImages = [
    "/slider1.jpg",
    "/slider2.jpg",
    "/slider3.jpg",
    "/slider4.jpg",
    "/slider5.jpg",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [sliderImages.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)
  }

  return (
    <section className="relative w-full h-auto bg-background py-2 md:py-4 mt-0 md:mt-2">
      <div className="max-w-[1400px] mx-auto px-0">
        <div className="relative w-full aspect-[16/10] md:aspect-[16/8] lg:aspect-[16/5] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-900">
          {/* Slider Images */}
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`Banner ${index + 1}`}
                fill
                className="object-contain"
                priority={index === 0}
                quality={95}
              />
            </div>
          ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
        aria-label="Previous slide"
      >
        <ArrowRight className="w-6 h-6 text-white rotate-180" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
        aria-label="Next slide"
      >
        <ArrowRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
        </div>
      </div>
    </section>
  )
}

