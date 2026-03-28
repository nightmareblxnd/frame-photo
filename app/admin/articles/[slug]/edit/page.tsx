"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "", slug: "", description: "", image: "", author: "", content: "",
  });


  useEffect(() => {
    fetch(`/api/articles`)
      .then(res => res.json())
      .then(articles => {
        const article = articles.find((a: any) => a.slug === slug);
        if (article) {
          setFormData(article);
        }
        setIsLoading(false);
      });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/articles/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Ошибка при сохранении");
      
      alert("Статья успешно обновлена!");
      router.push(`/articles/${formData.slug}`);
      router.refresh();
    } catch (error) {
      alert("Ошибка. Возможно, такой URL уже занят.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href={`/articles/${slug}`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Назад к статье
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Редактирование статьи</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Заголовок *</label>
                  <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ссылка (URL) *</label>
                  <input required type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 border rounded-lg bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Автор *</label>
                  <input required type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Путь к картинке *</label>
                  <input required type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Краткое описание *</label>
                  <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg resize-none" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <label className="block text-sm font-medium mb-2">Текст статьи (Markdown) *</label>
              <textarea required rows={20} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-4 border rounded-lg font-mono text-sm leading-relaxed" />
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={isSaving} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 flex items-center gap-2">
                {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                Сохранить изменения
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}