import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import abouthomeimg from '../public/abouthomeimg.png'

export function AboutHome() {
  return (
    <section className="bg-white py-8 md:py-12">
      <div className="container mx-auto">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Левая часть с текстом */}
            <div className="flex-1 text-left">
              {/* Заголовок */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">
                Почему стоит выбрать{" "}
                <span className="font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  наш магазин
                </span>
              </h2>
              
              {/* Описание */}
              <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                Мы работаем с 2010 года и помогаем фотографам находить идеальную технику. 
                В нашем магазине только оригинальные товары с официальной гарантией, 
                профессиональные консультации и быстрая доставка по всей России. 
                Более 50 000 клиентов уже доверились нам — присоединяйтесь!
              </p>
              
              {/* Кнопка перехода */}
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors group"
              >
                <span>Подробнее о нас</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Правая часть с фото*/}
            <div className="hidden md:block flex-1">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                
                

                
                <Image
                  src={abouthomeimg}
                  alt=""
                  fill
                  className="object-cover"
                />
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}