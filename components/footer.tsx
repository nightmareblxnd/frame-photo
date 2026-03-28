import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from '../public/logo.svg';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-neutral-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center">
          
     
          <Link href="/" className="mb-8 hover:opacity-80 transition-opacity">
            <div className="w-[140px] h-[45px] relative flex items-center justify-center">
              <Image 
                src={logo} 
                alt="Фрэйм" 
                fill 
                className="object-contain" 
              />
            </div>
          </Link>

          <nav className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 mb-10 text-sm font-medium">
            <Link href="/catalog" className="text-white hover:text-neutral-400 transition-colors">
              Каталог товаров
            </Link>
            <Link href="/articles" className="text-white hover:text-neutral-400 transition-colors">
              Блог и статьи
            </Link>
            <Link href="/contacts" className="text-white hover:text-neutral-400 transition-colors">
              Контакты
            </Link>
            <Link href="/about" className="text-white hover:text-neutral-400 transition-colors">
              О компании
            </Link>
            <Link href="/returns" className="text-white hover:text-neutral-400 transition-colors">
              Возврат и обмен
            </Link>
            <Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors">
              Политика конфиденциальности
            </Link>
          </nav>

      
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-10 text-sm">
            <a 
              href="tel:+79035735338" 
              className="flex items-center gap-2.5 text-neutral-300 hover:text-white transition-colors group"
            >
              <span className="p-2 bg-neutral-900 rounded-full group-hover:bg-neutral-800 transition-colors">
                <Phone className="h-4 w-4" />
              </span>
              <span className="font-medium tracking-wide">+7 (903) 573-53-38</span>
            </a>
            
            <a 
              href="mailto:support@framephoto.ru" 
              className="flex items-center gap-2.5 text-neutral-300 hover:text-white transition-colors group"
            >
              <span className="p-2 bg-neutral-900 rounded-full group-hover:bg-neutral-800 transition-colors">
                <Mail className="h-4 w-4" />
              </span>
              <span className="font-medium tracking-wide">support@frame-photo.ru</span>
            </a>

            <div className="flex items-center gap-2.5 text-neutral-400 cursor-default">
              <span className="p-2 bg-neutral-900 rounded-full">
                <MapPin className="h-4 w-4" />
              </span>
              <span className="tracking-wide">Москва, Башня Империя</span>
            </div>
          </div>


          <div className="w-full text-center text-xs text-neutral-500 border-t border-neutral-800 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>Не является настоящим магазином.</p>
            <p>Курсовая работа для ГБПОУ 26 КАДР</p>
            <p className="text-neutral-400 font-medium tracking-wider uppercase">Дизайн — Виктория Шарова</p>
          </div>
        </div>
      </div>
    </footer>
  );
}