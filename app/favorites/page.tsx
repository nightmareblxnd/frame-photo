"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useFavoritesStore } from "@/store/favorites";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function FavoritesPage() {
  const [isMounted, setIsMounted] = useState(false);
  

  const { items, toggleFavorite } = useFavoritesStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleAddToCart = (item: any) => {
    addItem(item);
    toast.success("Товар добавлен в корзину", {
      description: item.name,
    });
  };

  const handleRemove = (item: any) => {
    toggleFavorite(item);
    toast.info("Удалено из избранного", {
      description: item.name,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <Heart className="h-10 w-10 text-red-300 fill-red-100" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">В избранном пока пусто</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Сохраняйте товары, которые вам понравились, чтобы не потерять их и вернуться к покупке позже.
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
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Заголовок страницы */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/catalog" className="p-2 hover:bg-gray-50 rounded-full transition-colors hidden md:block">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Избранное <span className="text-gray-400 text-xl font-normal">({items.length})</span>
          </h1>
        </div>

        {/* Сетка товаров (похожа на каталог, но с другими кнопками) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => (
            <article 
              key={item.id} 
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all flex flex-col group relative"
            >
              {/* Кнопка удаления в правом верхнем углу */}
              <button 
                onClick={() => handleRemove(item)}
                className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                title="Удалить из избранного"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {/* Фото товара */}
              <Link href={`/product/${item.slug}`} className="relative w-full aspect-square bg-gray-50 overflow-hidden block">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              {/* Информация */}
              <div className="p-4 flex flex-col flex-grow">
                <Link href={`/product/${item.slug}`} className="mb-2">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors">
                    {item.name}
                  </h3>
                </Link>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(item.price)}
                  </span>
                  
                  {/* Кнопка "В корзину" */}
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors flex-shrink-0"
                    title="Добавить в корзину"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        
      </div>
    </div>
  );
}