"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Loader2 } from "lucide-react";

export function ProductAdminActions({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Удалить этот товар навсегда? Отменить это действие будет невозможно.")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Ошибка при удалении");
      
      router.refresh();
    } catch (error) {
      alert("Не удалось удалить товар");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <Link 
        href={`/admin/products/${id}/edit`}
        className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
        title="Редактировать"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        title="Удалить"
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
    </div>
  );
}