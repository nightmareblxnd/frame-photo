"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; 
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Loader2, Search } from "lucide-react";

// Типы
interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  oldPrice?: number;
  image: string;
  slug: string;
  inStock: boolean;
  rating?: number;
}

interface Filters {
  category: string;
  subcategory: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  sortBy: "default" | "price-asc" | "price-desc" | "rating";
}

// Форматирование цены
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export function Catalog() {

  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const searchFromUrl = searchParams.get("search");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [subcategoriesByCategory, setSubcategoriesByCategory] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchFromUrl || "");
  
  const [filters, setFilters] = useState<Filters>({
    category: categoryFromUrl || "all", 
    subcategory: "all",
    brand: "all",
    minPrice: 0,
    maxPrice: 500000,
    sortBy: "default",
  });
  
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    subcategories: true,
    brands: true,
    price: true,
  });

  useEffect(() => {
    if (categoryFromUrl) {
      setFilters(prev => ({ ...prev, category: categoryFromUrl, subcategory: "all" }));
    }
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [categoryFromUrl, searchFromUrl]);

  // Загрузка товаров
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category !== "all") params.append("category", filters.category);
      if (filters.subcategory !== "all" && filters.subcategory !== "Все подкатегории") 
        params.append("subcategory", filters.subcategory);
      if (filters.brand !== "all") params.append("brand", filters.brand);
      if (filters.minPrice > 0) params.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice < 500000) params.append("maxPrice", filters.maxPrice.toString());
      if (filters.sortBy !== "default") params.append("sortBy", filters.sortBy);
      if (searchQuery) params.append("search", searchQuery);
      
      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      
      setProducts(data?.products || []);
      setCategories(data?.categories || []);
      setBrands(data?.brands || []);
      setSubcategoriesByCategory(data?.subcategoriesByCategory || {});
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
      setCategories([]);
      setBrands([]);
      setSubcategoriesByCategory({});
    } finally {
      setIsLoading(false);
    }
  }, [filters, searchQuery]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const resetFilters = () => {
    setFilters({
      category: "all",
      subcategory: "all",
      brand: "all",
      minPrice: 0,
      maxPrice: 500000,
      sortBy: "default",
    });
    setSearchQuery("");
  };

  const handleCategoryChange = (category: string) => {
    setFilters({
      ...filters,
      category: category,
      subcategory: "all", 
    });
  };

  const maxPrice = 500000;
  

  const currentSubcategories = filters.category !== "all" && filters.category !== ""
    ? (subcategoriesByCategory[filters.category] || ["Все подкатегории"])
    : [];


  const safeCategories = categories || [];
  const safeBrands = brands || [];

  return (
    <section className="bg-white py-4 md:py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок */}
          <h1 className="text-2xl md:text-3xl font-light mb-6">
            <span className="font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Каталог
            </span>{" "}
            товаров
          </h1>

          {/* Строка поиска и сортировки */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as Filters["sortBy"] })}
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-gray-400 text-sm"
              >
                <option value="default">По умолчанию</option>
                <option value="price-asc">Сначала дешевле</option>
                <option value="price-desc">Сначала дороже</option>
                <option value="rating">По рейтингу</option>
              </select>

              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden px-4 py-2 border border-gray-200 rounded-xl flex items-center gap-2 text-sm"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Фильтры
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Боковая панель с фильтрами */}
            <aside
              className={`
                md:w-64 flex-shrink-0
                ${showMobileFilters ? "block" : "hidden md:block"}
              `}
            >
              <div className="bg-gray-50 p-4 rounded-xl sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medium">Фильтры</h2>
                  <button
                    onClick={resetFilters}
                    className="text-xs text-gray-500 hover:text-gray-900"
                  >
                    Сбросить все
                  </button>
                </div>

                {/* Фильтр по категориям */}
                <div className="mb-4 border-b border-gray-200 pb-4">
                  <button
                    onClick={() =>
                      setExpandedSections((prev) => ({
                        ...prev,
                        categories: !prev.categories,
                      }))
                    }
                    className="flex items-center justify-between w-full text-sm font-medium mb-2"
                  >
                    Категории
                    {expandedSections.categories ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {expandedSections.categories && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="category"
                          value="all"
                          checked={filters.category === "all"}
                          onChange={() => handleCategoryChange("all")}
                          className="text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-gray-700">Все товары</span>
                      </label>
                      {safeCategories.map((cat) => (
                        <label key={cat} className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="category"
                            value={cat}
                            checked={filters.category === cat}
                            onChange={() => handleCategoryChange(cat)}
                            className="text-gray-600 focus:ring-gray-500"
                          />
                          <span className="text-gray-700">{cat}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Фильтр по подкатегориям */}
                {filters.category !== "all" && filters.category !== "" && currentSubcategories.length > 0 && (
                  <div className="mb-4 border-b border-gray-200 pb-4">
                    <button
                      onClick={() =>
                        setExpandedSections((prev) => ({
                          ...prev,
                          subcategories: !prev.subcategories,
                        }))
                      }
                      className="flex items-center justify-between w-full text-sm font-medium mb-2"
                    >
                      Подкатегории
                      {expandedSections.subcategories ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {expandedSections.subcategories && (
                      <div className="space-y-2">
                        {currentSubcategories.map((sub) => (
                          <label key={sub} className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name="subcategory"
                              value={sub}
                              checked={filters.subcategory === sub}
                              onChange={() => setFilters({ ...filters, subcategory: sub })}
                              className="text-gray-600 focus:ring-gray-500"
                            />
                            <span className="text-gray-700">{sub}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Фильтр по брендам */}
                <div className="mb-4 border-b border-gray-200 pb-4">
                  <button
                    onClick={() =>
                      setExpandedSections((prev) => ({
                        ...prev,
                        brands: !prev.brands,
                      }))
                    }
                    className="flex items-center justify-between w-full text-sm font-medium mb-2"
                  >
                    Бренды
                    {expandedSections.brands ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {expandedSections.brands && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="brand"
                          value="all"
                          checked={filters.brand === "all"}
                          onChange={() => setFilters({ ...filters, brand: "all" })}
                          className="text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-gray-700">Все бренды</span>
                      </label>
                      {safeBrands.map((brand) => (
                        <label key={brand} className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="brand"
                            value={brand}
                            checked={filters.brand === brand}
                            onChange={() => setFilters({ ...filters, brand: brand })}
                            className="text-gray-600 focus:ring-gray-500"
                          />
                          <span className="text-gray-700">{brand}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Фильтр по цене */}
                <div className="mb-4">
                  <button
                    onClick={() =>
                      setExpandedSections((prev) => ({
                        ...prev,
                        price: !prev.price,
                      }))
                    }
                    className="flex items-center justify-between w-full text-sm font-medium mb-2"
                  >
                    Цена
                    {expandedSections.price ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {expandedSections.price && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="От"
                          value={filters.minPrice || ""}
                          onChange={(e) =>
                            setFilters({ ...filters, minPrice: Number(e.target.value) || 0 })
                          }
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded"
                        />
                        <input
                          type="number"
                          placeholder="До"
                          value={filters.maxPrice === maxPrice ? "" : filters.maxPrice}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              maxPrice: e.target.value ? Number(e.target.value) : maxPrice,
                            })
                          }
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded"
                        />
                      </div>

                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={filters.maxPrice}
                        onChange={(e) =>
                          setFilters({ ...filters, maxPrice: Number(e.target.value) })
                        }
                        className="w-full"
                      />

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0 ₽</span>
                        <span>{formatPrice(maxPrice)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="md:hidden w-full mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm"
                >
                  Применить фильтры
                </button>
              </div>
            </aside>

            {/* Сетка товаров */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-2">Товары не найдены</p>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-4">
                    Найдено товаров: {products.length}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        className="group block"
                      >
                        <article className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all h-full flex flex-col">
                          {/* Фото товара */}
                          <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-camera.jpg";
                              }}
                            />
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white text-sm font-medium px-3 py-1 bg-black/70 rounded-full">
                                  Нет в наличии
                                </span>
                              </div>
                            )}
                            {product.subcategory && (
                              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md text-xs text-white">
                                {product.subcategory}
                              </div>
                            )}
                          </div>

                          {/* Информация о товаре */}
                          <div className="p-3 flex flex-col flex-grow">
                            <div className="flex items-start justify-between mb-1">
                              <span className="text-xs text-gray-500">{product.brand}</span>
                              {product.rating && (
                                <span className="text-xs text-gray-600">★ {product.rating}</span>
                              )}
                            </div>

                            <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700">
                              {product.name}
                            </h3>

                            <div className="mt-auto">
                              <div className="flex items-baseline gap-2">
                                <span className="text-base font-semibold text-gray-900">
                                  {formatPrice(product.price)}
                                </span>
                                {product.oldPrice && (
                                  <span className="text-xs text-gray-400 line-through">
                                    {formatPrice(product.oldPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #4b5563;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.2s;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          background: #1f2937;
        }
      `}</style>
    </section>
  );
}