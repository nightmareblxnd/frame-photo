"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, User, ShoppingBag, Menu, X, Search, ChevronDown, Camera, Blend, MemoryStick, Presentation, ShieldCheck, Battery } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import logo from '../public/logo.svg'; 
import Image from 'next/image';
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";
import { useRouter } from "next/navigation";

const categories = [
  { name: "Фотоаппараты", icon: Camera },
  { name: "Объективы", icon: Blend },
  { name: "Вспышки", icon: Battery },
  { name: "Штативы", icon: Presentation },
  { name: "Студийное оборудование", icon: Presentation },
  { name: "Системы стабилизации", icon: Camera },
  { name: "Аксессуары", icon: Battery },
  { name: "Карты памяти", icon: MemoryStick },
];

export function Header({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileCatalogExpanded, setIsMobileCatalogExpanded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { items: cartItems } = useCartStore();
  const { items: favoriteItems, setFavorites } = useFavoritesStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Загрузка избранного
      const fetchFavorites = async () => {
        try {
          const res = await fetch("/api/favorites");
          if (res.ok) {
            const data = await res.json();
            if (data.favorites) setFavorites(data.favorites);
          }
        } catch (error) {
          console.error("Ошибка при загрузке избранного:", error);
        }
      };
      fetchFavorites();

      // Проверка на админа
      const checkAdminRole = async () => {
        try {
          const res = await fetch("/api/user/role");
          if (res.ok) {
            const data = await res.json();
            if (data.role === "ADMIN") setIsAdmin(true);
          }
        } catch (error) {
          console.error("Ошибка проверки роли:", error);
        }
      };
      checkAdminRole();
    }
  }, [isAuthenticated, setFavorites]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCatalogOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMobileSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) setIsMobileSearchOpen(false);
  };

  const navItems = [
    { href: "/articles", label: "Статьи" },
    { href: "/about", label: "О нас" },
    { href: "/contacts", label: "Контакты" },
  ];

  const iconButtons = [
    ...(isAdmin ? [{ href: "/admin", icon: ShieldCheck, label: "Админ-панель" }] : []),
    { href: "/favorites", icon: Heart, label: "Избранное", count: favoriteItems.length },
    { href: isAuthenticated ? "/profile" : "/login", icon: User, label: "Аккаунт" },
    { href: "/cart", icon: ShoppingBag, label: "Корзина", count: cartItems.length },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-black text-white z-50 border-b border-neutral-800 h-20">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* ЛОГОТИП */}
          <Link href='/' className="flex-shrink-0 z-20 relative">
            <div className="w-[120px] md:w-[150px] h-[40px] md:h-[50px] flex items-center justify-center">
              <Image src={logo} alt="Логотип" className="object-contain" />
            </div>
          </Link>

          {/* ЦЕНТРАЛЬНАЯ НАВИГАЦИЯ (ДЕСКТОП) */}
          <nav className="hidden lg:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            <div 
              className="relative"
              onMouseEnter={() => setIsCatalogOpen(true)}
              onMouseLeave={() => setIsCatalogOpen(false)}
              ref={dropdownRef}
            >
              <Link 
                href="/catalog"
                className="flex items-center gap-1 text-sm font-medium text-white hover:text-neutral-300 py-6"
                onClick={() => setIsCatalogOpen(false)}
              >
                Каталог
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCatalogOpen ? 'rotate-180' : ''}`} />
              </Link>

              {isCatalogOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-100 p-6 grid grid-cols-2 gap-x-8 gap-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="col-span-2 mb-2 pb-2 border-b border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Все категории</span>
                    <Link href="/catalog" className="text-sm text-blue-600 hover:text-blue-800 font-medium">Смотреть весь каталог →</Link>
                  </div>
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.name}
                        href={`/catalog?category=${encodeURIComponent(cat.name)}`}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                        onClick={() => setIsCatalogOpen(false)}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-200">
                          <Icon className="h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                        </div>
                        <span className="font-medium text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{cat.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white hover:text-neutral-300 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ПРАВЫЙ БЛОК: ПОИСК + ИКОНКИ */}
          <div className="flex items-center gap-1 md:gap-2 lg:gap-4 z-20 relative bg-black">
            
            {/* Поиск десктоп */}
            <form onSubmit={handleSearchSubmit} className="hidden md:block relative group mr-2">
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[200px] lg:w-[250px] h-10 pl-10 pr-4 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 focus:bg-neutral-800 transition-all focus:w-[250px] lg:focus:w-[300px]"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 group-focus-within:text-white transition-colors" />
              <button type="submit" className="hidden" />
            </form>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:text-neutral-300 hover:bg-neutral-800"
              onClick={() => {
                setIsMobileSearchOpen(!isMobileSearchOpen);
                setIsMobileMenuOpen(false);
              }}
            >
              <Search className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-1">
              {iconButtons.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    variant="ghost"
                    size="icon"
                    className="relative text-white hover:text-neutral-300 hover:bg-neutral-800"
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{item.label}</span>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white transform translate-x-1/2 -translate-y-1/2">
                          {item.count}
                        </span>
                      )}
                    </Link>
                  </Button>
                );
              })}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:text-neutral-300 hover:bg-neutral-800"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Меню</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ВЫПАДАЮЩАЯ СТРОКА ПОИСКА (МОБИЛКА) */}
      {isMobileSearchOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-black border-t border-neutral-800 p-4 animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Искать технику..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
            <button type="submit" className="hidden" />
          </form>
        </div>
      )}

      {/* МОБИЛЬНОЕ МЕНЮ (НА ВЕСЬ ЭКРАН) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-20 left-0 right-0 bottom-0 bg-black overflow-y-auto animate-in fade-in z-40">
          <div className="container mx-auto px-4 py-6 flex flex-col min-h-full">
            
            <nav className="flex flex-col space-y-2 mb-8">
              {/* Каталог аккордеон */}
              <div className="border-b border-neutral-800 pb-2 mb-2">
                <button 
                  onClick={() => setIsMobileCatalogExpanded(!isMobileCatalogExpanded)}
                  className="w-full flex justify-between items-center py-3 text-lg font-medium text-white"
                >
                  Каталог
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isMobileCatalogExpanded ? 'rotate-180 text-neutral-400' : 'text-neutral-500'}`} />
                </button>
                
                {isMobileCatalogExpanded && (
                  <div className="pl-4 py-2 flex flex-col gap-3 animate-in fade-in slide-in-from-top-1">
                    <Link 
                      href="/catalog" 
                      className="text-neutral-400 py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Смотреть все товары
                    </Link>
                    {categories.map(cat => (
                      <Link
                        key={cat.name}
                        href={`/catalog?category=${encodeURIComponent(cat.name)}`}
                        className="text-neutral-300 py-1 flex items-center gap-3"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Остальные ссылки */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium text-white hover:text-neutral-300 transition-colors py-3 border-b border-neutral-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

          </div>
        </div>
      )}
    </header>
  );
}