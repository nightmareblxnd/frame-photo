"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Loader2 } from "lucide-react";

export function ArticleAdminControls({ slug }: { slug: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите безвозвратно удалить эту статью?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/articles/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Ошибка при удалении");
      
      router.push("/articles");
      router.refresh();
    } catch (error) {
      alert("Не удалось удалить статью");
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 mb-8">
      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        Панель админа
      </span>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Link 
          href={`/admin/articles/${slug}/edit`}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
        >
          <Pencil className="h-4 w-4 shrink-0" />
          <span className="truncate">Редактировать</span>
        </Link>
        
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : <Trash2 className="h-4 w-4 shrink-0" />}
          <span className="truncate">Удалить</span>
        </button>
      </div>
    </div>
  );
}