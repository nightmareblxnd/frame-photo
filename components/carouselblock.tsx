"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ad3 from '../public/ad3.jpg'
import ad2 from '../public/ad2.jpg'
import ad1 from '../public/ad1.png'

const slides = [
  { id: "1", image: ad1, alt: "Слайд 1" },
  { id: "2", image: ad2, alt: "Слайд 2" },
  { id: "3", image: ad3, alt: "Слайд 3" },
];

export function CarouselBlock() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    if (!isHovered) {
      autoPlayRef.current = setInterval(nextSlide, 4000); 
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isHovered, nextSlide]);

  return (
    <section className="bg-white py-2 md:py-4">
      <div className="container mx-auto px-4 max-w-7xl">
        <div 
          className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-100 aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Слайды */}
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {slide.image ? (
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none"></div>
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 1400px"
                    className="object-cover"
                    priority={index === 0}
                    quality={90}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-xl">Слайд {index + 1}</span>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white z-20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
            aria-label="Предыдущий слайд"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white z-20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
            aria-label="Следующий слайд"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Индикаторы */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? "w-8 md:w-12 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                    : "w-2 bg-white/50 hover:bg-white/90"
                }`}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}