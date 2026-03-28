"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, CreditCard, Banknote } from "lucide-react";
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

export default function CheckoutPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { items, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    paymentMethod: "card", 
  });

  useEffect(() => {
    setIsMounted(true);

    if (items.length === 0 && !isSuccess) {
      router.push("/catalog");
      return;
    }


    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {

            setFormData(prev => ({
              ...prev,
              name: data.user.name || "",
              email: data.user.email || "",
            }));
          }
        }
      } catch (error) {
        console.error("Не удалось загрузить данные профиля");
      }
    };

    fetchUserProfile();
  }, [items.length, isSuccess, router]);

  if (!isMounted || (items.length === 0 && !isSuccess)) return null;

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    if (!formData.name.trim() || !formData.email.trim() || !formData.address.trim()) {
      toast.error("Пожалуйста, заполните все обязательные поля");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items,
          totalPrice,
        }),
      });

      if (!response.ok) throw new Error("Ошибка при отправке");

      setIsSuccess(true);
      clearCart();
      toast.success("Заказ успешно оформлен!");
      window.scrollTo(0, 0);

    } catch (error) {
      toast.error("Произошла ошибка при оформлении заказа. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };


  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-white">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-semibold mb-4 text-center">Заказ успешно оформлен!</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Мы отправили письмо с деталями заказа на почту <strong>{formData.email}</strong>. 
        </p>
        <Link 
          href="/catalog" 
          className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          Вернуться к покупкам
        </Link>
      </div>
    );
  }


  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart" className="p-2 hover:bg-white rounded-full transition-colors hidden md:block">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Оформление заказа</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
       
          <form id="checkout-form" onSubmit={handleSubmit} className="w-full lg:w-2/3 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium mb-6">Ваши данные</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Имя и фамилия</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                    placeholder="Иван Иванов"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (туда придет чек)</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                    placeholder="ivan@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Адрес доставки</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all resize-none"
                    placeholder="г. Москва, ул. Ленина, д. 1"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium mb-6">Способ оплаты</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`
                  relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all
                  ${formData.paymentMethod === 'card' ? 'border-gray-900 bg-gray-50' : 'border-gray-100 hover:border-gray-200'}
                `}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="sr-only"
                  />
                  <CreditCard className={`h-6 w-6 mb-3 ${formData.paymentMethod === 'card' ? 'text-gray-900' : 'text-gray-400'}`} />
                  <span className="font-medium text-gray-900">Картой через терминал</span>
                  <span className="text-xs text-gray-500 mt-1">Mir Pay, СБП и другие виды оплаты</span>
                </label>

                <label className={`
                  relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all
                  ${formData.paymentMethod === 'cash' ? 'border-gray-900 bg-gray-50' : 'border-gray-100 hover:border-gray-200'}
                `}>
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="sr-only"
                  />
                  <Banknote className={`h-6 w-6 mb-3 ${formData.paymentMethod === 'cash' ? 'text-gray-900' : 'text-gray-400'}`} />
                  <span className="font-medium text-gray-900">Наличными</span>
                  <span className="text-xs text-gray-500 mt-1">При получении курьеру</span>
                </label>
              </div>
            </div>
            
            <div className="lg:hidden">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Подтвердить заказ'}
              </button>
            </div>
          </form>

          {/* Правая колонка - Чек */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-medium mb-6">Ваш заказ</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 line-clamp-1 pr-4">
                      {item.quantity} x {item.name}
                    </span>
                    <span className="font-medium text-gray-900 flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100 mb-6" />
              
              <div className="flex justify-between items-end mb-8">
                <span className="text-gray-900 font-medium">К оплате</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(totalPrice)}
                </span>
              </div>

         
              <button
                type="submit"
                form="checkout-form"
                disabled={isLoading}
                className="hidden lg:flex w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors justify-center items-center gap-2 shadow-lg shadow-gray-900/20"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Подтвердить заказ'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}