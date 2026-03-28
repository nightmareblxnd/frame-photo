"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart"; 

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  

  const { items, removeItem, updateQuantity, clearCart } = useCartStore();


  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; 
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);


  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Ваша корзина пуста</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Похоже, вы еще ничего не добавили. Перейдите в каталог, чтобы найти нужную фототехнику.
        </p>
        <Link 
          href="/catalog" 
          className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/catalog" className="p-2 hover:bg-gray-50 rounded-full transition-colors hidden md:block">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Корзина <span className="text-gray-400 text-xl font-normal">({totalItems})</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Список товаров */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4 md:gap-6">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col sm:flex-row gap-4 p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Картинка товара */}
                <Link href={`/product/${item.slug}`} className="relative w-full sm:w-32 aspect-square bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-contain p-2"
                  />
                </Link>

                {/* Инфа о товаре и управление */}
                <div className="flex flex-col flex-grow justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <Link href={`/product/${item.slug}`} className="font-medium text-gray-900 hover:text-gray-600 line-clamp-2">
                      {item.name}
                    </Link>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex flex-row items-center justify-between mt-4">
                    {/* Кнопки плюс/минус */}
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50/50">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50 text-gray-600"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors text-gray-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Цена товара */}
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end mt-2">
              <button 
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Очистить корзину
              </button>
            </div>
          </div>

          {/* Боковая панель с итогами (Чек) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Детали заказа</h2>
              
              <div className="flex justify-between mb-4 text-gray-600 text-sm">
                <span>Товары ({totalItems} шт.)</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between mb-6 text-gray-600 text-sm pb-6 border-b border-gray-200">
                <span>Доставка</span>
                <span className="text-green-600 font-medium">Бесплатно</span>
              </div>
              
              <div className="flex justify-between items-end mb-8">
                <span className="text-gray-900 font-medium">Итого</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <Link href="/checkout" className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-gray-900/20">
                Перейти к оформлению
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}