"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Search, 
  X, 
  History, 
  TrendingUp, 
  ArrowRight,
  Camera,
  Blend,
  MemoryStick,
  Presentation,
  Battery,
  CameraOff
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

// Типы для результатов поиска
interface SearchResult {
  id: string;
  title: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  image: string;
  url: string;
  icon?: React.ReactNode;
}

// Популярные запросы по фототехнике
const popularSearches = [
  "Sony A7 IV",
  "Canon R6 Mark II",
  "SanDisk",
  "Manfrotto штатив",
  "Sigma объектив",
  "Peak Design фотосумка",
  "Карты памяти CFexpress",
  "Объектив 50mm",
];

// Иконки для категорий
const categoryIcons: Record<string, React.ReactNode> = {
  "Фотоаппараты": <Camera className="h-4 w-4" />,
  "Объективы": <Blend className="h-4 w-4" />,
  "Карты памяти": <MemoryStick className="h-4 w-4" />,
  "Штативы": <Presentation className="h-4 w-4" />,
  "Аксессуары": <Battery className="h-4 w-4" />,
  "Вспышки": <Battery className="h-4 w-4" />,
  "Студийное оборудование": <Presentation className="h-4 w-4" />,
  "Системы стабилизации": <Camera className="h-4 w-4" />,
};

// Категории для популярных категорий (внизу)
const categories = [
  { name: "Фотоаппараты", icon: Camera },
  { name: "Объективы", icon: Blend },
  { name: "Карты памяти", icon: MemoryStick },
  { name: "Штативы", icon: Presentation },
  { name: "Аксессуары", icon: Battery },
];

// Форматирование цены
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export function SearchBlock() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Загрузка истории поиска из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Сохранение истории поиска
  const saveSearchHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Поиск товаров через API
  const searchProducts = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        
        const searchResults = data.products.map((product: any) => ({
          id: product.id,
          title: product.name,
          brand: product.brand,
          category: product.category,
          subcategory: product.subcategory,
          price: product.price,
          image: product.image,
          url: `/product/${product.slug}`,
          icon: categoryIcons[product.category] || <Camera className="h-4 w-4" />,
        }));
        
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Дебаунс для поиска 
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 1) {
        searchProducts(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchProducts]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    saveSearchHistory(searchQuery);
    setIsOpen(false);
    if (searchQuery.length > 1) {
      searchProducts(searchQuery);
    }
  };

  // Обработчик фокуса 
  const handleFocus = () => {
    setIsOpen(true);
  };

  const showSuggestions = query.length === 0;
  const showResults = query.length > 1 && (results.length > 0 || isLoading);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-10 left-10 transform rotate-12">
          <Camera className="w-64 h-64 text-gray-800" />
        </div>
        <div className="absolute bottom-10 right-10 transform -rotate-12">
          <Blend className="w-48 h-48 text-gray-800" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Заголовок */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-center mb-8">
            От аксессуаров,{" "}
            <span className="font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              до профессиональных камер
            </span>
          </h2>

          {/* Поисковый блок */}
          <div ref={searchRef} className="relative">
            {/* Поле поиска */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 transition-colors duration-200 ${
                  isOpen || query ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"
                }`} />
              </div>
              
              <Input
                ref={inputRef}
                type="text"
                placeholder="Поиск..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleFocus}
                className="w-full h-14 pl-12 pr-12 text-lg bg-gray-50 border-2 border-gray-200 rounded-2xl
                         focus:bg-white focus:border-gray-400 focus:ring-0 focus:shadow-lg
                         placeholder:text-gray-400 transition-all duration-200
                         hover:border-gray-300 hover:shadow-md"
              />

              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Выпадающая панель с результатами или подсказками */}
            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {showResults && (
                  <>
                    {isLoading && (
                      <div className="p-8 text-center">
                        <div className="inline-flex items-center gap-2 text-gray-500">
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                          <span>Поиск...</span>
                        </div>
                      </div>
                    )}

                    {!isLoading && results.length > 0 && (
                      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                        {results.map((result) => (
                          <Link
                            key={result.id}
                            href={result.url}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors group"
                            onClick={() => handleSearch(result.title)}
                          >
                            {/* Изображение товара */}
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={result.image}
                                alt={result.title}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder-camera.jpg";
                                }}
                              />
                            </div>
                            
                            {/* Информация о товаре */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900 group-hover:text-gray-700 truncate">
                                  {result.title}
                                </p>
                                {result.brand && (
                                  <span className="text-xs text-gray-400 flex-shrink-0">
                                    {result.brand}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                                  {result.category}
                                </span>
                                {result.subcategory && (
                                  <>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-500">
                                      {result.subcategory}
                                    </span>
                                  </>
                                )}
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs font-medium text-gray-700">
                                  {formatPrice(result.price)}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                          </Link>
                        ))}
                      </div>
                    )}

                    {!isLoading && query.length > 1 && results.length === 0 && (
                      <div className="p-8 text-center">
                        <CameraOff className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 mb-2">Ничего не найдено</p>
                        <p className="text-sm text-gray-400">
                          Попробуйте изменить поисковый запрос
                        </p>
                      </div>
                    )}
                  </>
                )}

                {showSuggestions && (
                  <div className="p-4">
                    {/* История поиска */}
                    {recentSearches.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <History className="h-4 w-4" />
                          <span>Недавние запросы</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => handleSearch(term)}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Популярные запросы */}
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>Популярные запросы</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleSearch(term)}
                            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-sm text-gray-600 transition-colors border border-gray-200"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Популярные категории */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <span className="text-sm text-gray-500 py-2">Популярные категории:</span>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={`/catalog?category=${encodeURIComponent(category.name)}`}
                  onClick={() => handleSearch(category.name)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-full text-sm text-gray-700 transition-all hover:shadow-md"
                >
                  <Icon className="h-4 w-4 text-gray-600" />
                  {category.name}
                </Link>
              );
            })}
          </div>

          {/* Популярные бренды */}
          <div className="mt-6 text-center text-sm text-gray-400">
            <span>Популярные бренды: </span>
            {["Sony", "Canon", "Nikon", "Fujifilm", "Panasonic", "Godox", "Manfrotto", "DJI"].map((brand, i, arr) => (
              <span key={brand}>
                <button
                  onClick={() => handleSearch(brand)}
                  className="text-gray-600 hover:text-gray-900 hover:underline mx-1"
                >
                  {brand}
                </button>
                {i < arr.length - 1 && "•"}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}