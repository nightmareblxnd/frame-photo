"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Save, Image as ImageIcon, Plus, Trash2 } from "lucide-react";

const CATEGORIES = [
  "Фотоаппараты", "Объективы", "Вспышки", "Штативы", 
  "Студийное оборудование", "Системы стабилизации", "Аксессуары", "Карты памяти"
];

interface Spec {
  name: string;
  value: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    brand: "",
    category: "Фотоаппараты",
    subcategory: "",
    price: "",
    oldPrice: "",
    image: "", // Главная фотография (обложка)
    description: "", 
    rating: "5.0",
    inStock: true,
  });

  // Состояния для динамических списков
  const [specifications, setSpecifications] = useState<Spec[]>([]);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]); // Состояние для доп. фото

  // Управление характеристиками
  const addSpec = () => {
    setSpecifications([...specifications, { name: "", value: "" }]);
  };

  const removeSpec = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: keyof Spec, newValue: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = newValue;
    setSpecifications(newSpecs);
  };

  // Управление дополнительными фотографиями
  const addImage = () => {
    setAdditionalImages([...additionalImages, ""]);
  };

  const removeImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...additionalImages];
    newImages[index] = value;
    setAdditionalImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Фильтруем пустые значения
    const validSpecs = specifications.filter(spec => spec.name.trim() !== "" && spec.value.trim() !== "");
    const validImages = additionalImages.filter(url => url.trim() !== "");

    // Формируем данные для Prisma
    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      rating: formData.rating ? Number(formData.rating) : null,
      
      // Связанные таблицы Prisma создаст автоматически
      specifications: {
        create: validSpecs.map((spec, index) => ({
          name: spec.name,
          value: spec.value,
          order: index
        }))
      },
      images: {
        create: validImages.map((url, index) => ({
          url: url,
          order: index
        }))
      }
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error("Ошибка при сохранении");
      
      router.push("/admin/products"); 
      router.refresh();
    } catch (error) {
      alert("Не удалось сохранить товар. Проверьте данные или измените URL (slug).");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9а-яё]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData({ ...formData, name, slug: generatedSlug });
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Добавление нового товара</h1>
              <p className="text-gray-500 text-sm mt-1">Заполните данные, чтобы товар появился в каталоге.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Левая колонка */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Название товара *</label>
                  <input required type="text" placeholder="Например: Sony Alpha A7 IV" value={formData.name} onChange={handleNameChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">URL-адрес (Slug) *</label>
                  <input required type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-3 bg-gray-100 border border-gray-200 text-gray-500 rounded-xl outline-none" />
                  <p className="text-xs text-gray-400 mt-2">Генерируется автоматически.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Бренд *</label>
                    <input required type="text" placeholder="Sony, Canon..." value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Рейтинг</label>
                    <input type="number" step="0.1" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none" />
                  </div>
                </div>
              </div>

              {/* Правая колонка */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Текущая цена (₽) *</label>
                    <input required type="number" placeholder="250000" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none font-semibold text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Старая цена (зачеркн.)</label>
                    <input type="number" placeholder="280000" value={formData.oldPrice} onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Категория *</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none cursor-pointer">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Подкатегория</label>
                  <input type="text" placeholder="Например: Беззеркальные" value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none" />
                </div>
              </div>
            </div>

            {/* Описание */}
            <div className="pt-6 border-t border-gray-100 space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Описание товара</label>
                <textarea 
                  rows={4} 
                  placeholder="Подробное описание товара..." 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none resize-none" 
                />
              </div>

              {/* БЛОК ХАРАКТЕРИСТИК */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Характеристики</h3>
                    <p className="text-xs text-gray-500 mt-1">Добавьте важные параметры (например, Матрица - 24Мп)</p>
                  </div>
                  <button type="button" onClick={addSpec} className="text-xs font-medium bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-purple-300 hover:text-purple-600 transition-colors flex items-center gap-1 shadow-sm">
                    <Plus className="h-3 w-3" /> Добавить
                  </button>
                </div>

                <div className="space-y-3">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="Название (напр. Цвет)" 
                        value={spec.name} 
                        onChange={(e) => updateSpec(index, "name", e.target.value)} 
                        className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="Значение (напр. Черный)" 
                        value={spec.value} 
                        onChange={(e) => updateSpec(index, "value", e.target.value)} 
                        className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                      />
                      <button type="button" onClick={() => removeSpec(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg border border-transparent hover:border-red-100 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {specifications.length === 0 && (
                    <div className="text-center py-4 bg-white rounded-xl border border-dashed border-gray-300">
                      <p className="text-sm text-gray-400">Характеристики пока не добавлены</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Главная фотография */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Ссылка на главную фотографию (Обложка) *</label>
                <input required type="text" placeholder="/images/main-photo.webp" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none" />
                <p className="text-xs text-gray-400 mt-2">Эта картинка будет отображаться в каталоге на карточке товара</p>
              </div>

              {/* БЛОК ДОПОЛНИТЕЛЬНЫХ ФОТО */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Дополнительные фотографии (Галерея)</h3>
                    <p className="text-xs text-gray-500 mt-1">Добавьте ссылки на другие ракурсы товара</p>
                  </div>
                  <button type="button" onClick={addImage} className="text-xs font-medium bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-purple-300 hover:text-purple-600 transition-colors flex items-center gap-1 shadow-sm">
                    <Plus className="h-3 w-3" /> Добавить фото
                  </button>
                </div>

                <div className="space-y-3">
                  {additionalImages.map((url, index) => (
                    <div key={index} className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="Ссылка на фото (напр. /images/photo-2.webp)" 
                        value={url} 
                        onChange={(e) => updateImage(index, e.target.value)} 
                        className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                      />
                      <button type="button" onClick={() => removeImage(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg border border-transparent hover:border-red-100 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {additionalImages.length === 0 && (
                    <div className="text-center py-4 bg-white rounded-xl border border-dashed border-gray-300">
                      <p className="text-sm text-gray-400">Дополнительных фотографий пока нет</p>
                    </div>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors w-max">
                <input type="checkbox" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                <span className="font-semibold text-gray-900">Товар есть в наличии на складе</span>
              </label>
            </div>

            <div className="flex justify-end pt-8">
              <button type="submit" disabled={isSaving} className="bg-purple-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-purple-700 flex items-center gap-2 shadow-sm shadow-purple-200 transition-colors disabled:opacity-70">
                {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {isSaving ? "Сохраняем..." : "Опубликовать товар"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}