"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Edit2, Loader2, X } from "lucide-react";

export function ProfileNameForm({ initialName }: { initialName: string | null }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName || "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Имя не может быть пустым");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Не удалось сохранить имя");

      toast.success("Имя успешно обновлено");
      setIsEditing(false);

      router.refresh(); 
    } catch (error) {
      toast.error("Произошла ошибка при сохранении");
    } finally {
      setIsLoading(false);
    }
  };

  // Режим просмотра (с карандашом)
  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-semibold text-gray-900">
          {initialName || "Без имени"}
        </h2>
        <button 
          onClick={() => setIsEditing(true)} 
          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          title="Изменить имя"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Режим редактирования (инпут + кнопки)
  return (
    <div className="flex items-center gap-2 mb-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 w-full max-w-[200px]"
        placeholder="Ваше имя"
        autoFocus
        onKeyDown={(e) => e.key === 'Enter' && handleSave()} // Сохранение по Enter
      />
      <button 
        onClick={handleSave} 
        disabled={isLoading} 
        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
      </button>
      <button 
        onClick={() => {
          setIsEditing(false);
          setName(initialName || "");
        }} 
        disabled={isLoading} 
        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}