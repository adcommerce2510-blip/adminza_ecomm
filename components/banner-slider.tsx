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
    <section className="relative w-full h-auto bg-background py-0 mt-0">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 pt-[85px] sm:pt-[110px] md:pt-[130px] lg:pt-[185px]">
        <div className="relative w-full aspect-[16/3.5] sm:aspect-[16/3.8] md:aspect-[25/5] lg:aspect-[32/5] max-h-[90px] sm:max-h-[140px] md:max-h-[250px] lg:max-h-[300px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-white">
          {/* Slider Images */}
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image}
                alt={`Banner ${index + 1}`}
                fill
                className="object-cover object-center"
                priority={index === 0}
                quality={95}
              />
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
            aria-label="Previous slide"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white rotate-180" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
            aria-label="Next slide"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? "bg-white w-8" : "bg-white/50 w-2"
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
