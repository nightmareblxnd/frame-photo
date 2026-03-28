"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingCart, Heart, Check, X, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";
import { toast } from "sonner";

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    oldPrice: number | null;
    description: string | null;
    inStock: boolean;
    image: string;
    slug: string;
    images: { id: string; url: string }[];
    specifications: { id: string; name: string; value: string }[];
  };
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export function ProductDetails({ product }: ProductDetailsProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  const allImages = [product.image, ...product.images.map(img => img.url)];
  const uniqueImages = Array.from(new Set(allImages));
  const [activeImage, setActiveImage] = useState(uniqueImages[0]);

  const { addItem } = useCartStore();
  const { items: favoriteItems, toggleFavorite } = useFavoritesStore();

  const isFavorite = favoriteItems.some((item) => item.id === product.id);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shortProductData = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    slug: product.slug,
  };

  const handleAddToCart = () => {
    addItem(shortProductData);
    toast.success("Товар добавлен", {
      description: product.name,
    });
  };


  const handleToggleFavorite = async () => {

    toggleFavorite(shortProductData);

    try {

      const res = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });


      if (!res.ok && res.status !== 401) {
        throw new Error("Ошибка сервера");
      }
    } catch (error) {

      console.error("Ошибка при сохранении в БД:", error);
      toggleFavorite(shortProductData); 
      toast.error("Не удалось сохранить в избранное");
    }
  };

  const SpecificationsBlock = () => {
    if (product.specifications.length === 0) return null;
    
    return (
      <div className="mt-10">
        <h3 className="text-lg font-medium mb-4">Характеристики</h3>
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          {product.specifications.map((spec, index) => (
            <div 
              key={spec.id} 
              className={`flex flex-col sm:flex-row py-3 px-4 ${index !== product.specifications.length - 1 ? 'border-b border-gray-100' : ''} ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}
            >
              <span className="text-sm text-gray-500 w-full sm:w-1/2 mb-1 sm:mb-0">{spec.name}</span>
              <span className="text-sm text-gray-900 font-medium w-full sm:w-1/2">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-12 pt-8">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <nav className="flex items-center text-sm text-gray-500 mb-8 hidden md:flex">
          <a href="/" className="hover:text-gray-900">Главная</a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <a href="/catalog" className="hover:text-gray-900">Каталог</a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          <div className="w-full md:w-1/2 lg:w-3/5">
            <div className="relative aspect-square sm:aspect-[4/3] w-full bg-gray-50 rounded-2xl overflow-hidden mb-4 border border-gray-100">
              <Image src={activeImage} alt={product.name} fill className="object-contain p-4" priority />
            </div>
            
            {uniqueImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {uniqueImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === img ? "border-gray-900" : "border-transparent hover:border-gray-300"
                    } bg-gray-50`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}

            <div className="hidden md:block">
              <SpecificationsBlock />
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col">
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{product.brand}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                  <Check className="h-4 w-4" /> В наличии
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm font-medium">
                  <X className="h-4 w-4" /> Нет в наличии
                </span>
              )}
            </div>

            <div className="hidden md:block mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
                )}
                {product.oldPrice && (
                  <span className="ml-auto bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  В корзину
                </button>
           
                <button 
                  onClick={handleToggleFavorite}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex-shrink-0"
                >
                  <Heart className={`h-6 w-6 transition-colors ${isMounted && isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
              </div>
            </div>

            {product.description && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">О товаре</h3>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{product.description}</p>
              </div>
            )}

            <div className="md:hidden">
              <SpecificationsBlock />
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through leading-none mb-1">{formatPrice(product.oldPrice)}</span>
          )}
          <span className="text-xl font-bold text-gray-900 leading-none">{formatPrice(product.price)}</span>
        </div>
        
        <div className="flex gap-2 w-1/2">
   
          <button 
            onClick={handleToggleFavorite}
            className="p-3 border border-gray-200 rounded-xl flex-shrink-0 flex items-center justify-center bg-white"
          >
            <Heart className={`h-5 w-5 ${isMounted && isFavorite ? "fill-red-500 text-red-500" : "text-gray-900"}`} />
          </button>
          <button 
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1 bg-gray-900 disabled:bg-gray-300 text-white rounded-xl font-medium flex items-center justify-center transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}