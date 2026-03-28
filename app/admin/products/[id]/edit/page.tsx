"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Save, Image as ImageIcon } from "lucide-react";

const CATEGORIES = [
  "Фотоаппараты", "Объективы", "Вспышки", "Штативы", 
  "Студийное оборудование", "Системы стабилизации", "Аксессуары", "Карты памяти"
];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", slug: "", brand: "", category: "Фотоаппараты", subcategory: "", 
    price: "", oldPrice: "", image: "", rating: "5.0", inStock: true,
  });


  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        const product = data.products?.find((p: any) => p.id === id);
        if (product) {
          setFormData({
            ...product,
            price: String(product.price),
            oldPrice: product.oldPrice ? String(product.oldPrice) : "",
            rating: product.rating ? String(product.rating) : "5.0",
            subcategory: product.subcategory || "",
          });
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      rating: formData.rating ? Number(formData.rating) : null,
    };

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error("Ошибка при сохранении");
      
      router.push("/admin/products"); 
      router.refresh(); 
    } catch (error) {
      alert("Не удалось обновить товар. Проверьте данные.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <Link href="/admin/products" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к списку
        </Link>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
              <ImageIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Редактирование товара</h1>
              <p className="text-gray-500 text-sm mt-1">ID товара: {id}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Название товара *</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">URL-адрес (Slug) *</label>
                  <input required type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Бренд *</label>
                    <input required type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Рейтинг</label>
                    <input type="number" step="0.1" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Текущая цена (₽) *</label>
                    <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none font-semibold text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Старая цена</label>
                    <input type="number" value={formData.oldPrice} onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Категория *</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none cursor-pointer">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Подкатегория</label>
                  <input type="text" value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Ссылка на фотографию *</label>
                <input required type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none" />
              </div>

              <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors w-max">
                <input type="checkbox" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                <span className="font-semibold text-gray-900">Товар есть в наличии на складе</span>
              </label>
            </div>

            <div className="flex justify-end pt-8">
              <button type="submit" disabled={isSaving} className="bg-purple-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-purple-700 flex items-center gap-2 shadow-sm shadow-purple-200 transition-colors disabled:opacity-70">
                {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {isSaving ? "Сохраняем..." : "Сохранить изменения"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}