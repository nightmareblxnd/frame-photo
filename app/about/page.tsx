import Image from "next/image";
import { Users, Truck, ShieldCheck, Camera } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Главный блок */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Больше, чем просто магазин техники
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Мы — компания <span className="font-semibold text-gray-900">Фрэйм</span>. С 2010 года мы помогаем фотографам, видеографам и контент-мейкерам находить идеальное оборудование для воплощения их самых смелых творческих идей.
          </p>
        </div>

        {/* Блок с цифрами */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto bg-gray-900 text-white rounded-xl flex items-center justify-center mb-6">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2"> Больше 50 000</h3>
            <p className="text-gray-600 font-medium">Довольных клиентов</p>
            <p className="text-sm text-gray-500 mt-3">Доверяют нам выбор своей техники по всей России.</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto bg-gray-900 text-white rounded-xl flex items-center justify-center mb-6">
              <Truck className="h-7 w-7" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">Бесплатная</h3>
            <p className="text-gray-600 font-medium">и быстрая доставка</p>
            <p className="text-sm text-gray-500 mt-3">Бережно и оперативно доставляем заказы в любой уголок России.</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto bg-gray-900 text-white rounded-xl flex items-center justify-center mb-6">
              <Camera className="h-7 w-7" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">16 лет</h3>
            <p className="text-gray-600 font-medium">Опыта на рынке</p>
            <p className="text-sm text-gray-500 mt-3">Мы знаем о фототехнике всё и делимся этой экспертизой с вами.</p>
          </div>
        </div>

        {/* Текстовый блок */}
        <div className="bg-gray-900 text-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Наша философия</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Мы верим, что правильный кадр способен остановить время и рассказать историю, которую не передать словами. Но чтобы поймать этот кадр, нужен надежный инструмент.
              </p>
              <p>
                В <span className="text-white font-medium">Фрэйм</span> мы не просто продаем камеры и объективы. Мы тщательно отбираем ассортимент, тестируем новинки и предлагаем только то, в чем уверены сами. Наша миссия — сделать профессиональную и любительскую съемку доступной, комфортной и приносящей радость.
              </p>
            </div>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">

            <div className="aspect-square bg-gray-800 rounded-2xl"></div>
            <div className="aspect-square bg-gray-700 rounded-2xl mt-8"></div>
          </div>
        </div>
      </div>
    </main>
  );
}