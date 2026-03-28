"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import camera from '../public/cataloghomecamera.webp'
import lens from '../public/cataloghomelens.webp'      
import light from '../public/cataloghomelight.webp'    
import tripod from '../public/cataloghometripod.webp'  
import studio from '../public/cataloghomestudio.webp'  
import stabil from '../public/cataloghomestabil.webp'  
import accessories from '../public/cataloghomeaccess.webp' 

const categories = [
  { id: "1", name: "Фотоаппараты", image: camera, slug: "cameras" },
  { id: "2", name: "Объективы", image: lens, slug: "lenses" },
  { id: "3", name: "Вспышки", image: light, slug: "flashes" },
  { id: "4", name: "Штативы", image: tripod, slug: "tripods" },
  { id: "5", name: "Студийное оборудование", image: studio, slug: "studio" },
  { id: "6", name: "Системы стабилизации", image: stabil, slug: "stabilization" },
  { id: "7", name: "Аксессуары", image: accessories, slug: "accessories" },
];

export function CatalogHome() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-white py-2 md:py-2">
      <div className="container mx-auto px-4">
        
        <div className="flex justify-center">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 md:gap-8 pb-6 px-2 max-w-full md:justify-center scrollbar-hide snap-x"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${encodeURIComponent(cat.name)}`}
                className="flex-shrink-0 group flex flex-col items-center w-[100px] md:w-[120px] snap-center"
              >
                <div className="w-full aspect-square relative bg-gray-50 rounded-2xl md:rounded-[2rem] p-3 transition-all duration-300 shadow-sm border border-gray-100 group-hover:shadow-md group-hover:-translate-y-0.5 group-hover:border-gray-200 group-hover:bg-white mb-4">
                  {cat.image ? (
                    <Image 
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100px, 120px"
                      className="object-contain p-2 md:p-3 group-hover:scale-110 transition-transform duration-500 drop-shadow-sm"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-300 text-xs font-medium">Фото</span>
                    </div>
                  )}
                </div>
                
                {/* Название категории */}
                <p className="text-xs md:text-sm text-center font-medium text-gray-600 group-hover:text-gray-900 transition-colors leading-snug">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
        
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}