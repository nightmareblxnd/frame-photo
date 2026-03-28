"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const STATUSES = [
  { value: "PENDING", label: "В обработке", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "ACCEPTED", label: "Принят", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { value: "SHIPPED", label: "Передан в доставку", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "DELIVERED", label: "Выполнен", color: "bg-green-50 text-green-700 border-green-200" },
  { value: "CANCELED", label: "Отменен", color: "bg-red-50 text-red-700 border-red-200" },
];

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus || "NEW");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) throw new Error("Ошибка");
      router.refresh(); 
    } catch (error) {
      alert("Не удалось обновить статус заказа");
      setStatus(currentStatus); 
    } finally {
      setIsLoading(false);
    }
  };

  const currentConfig = STATUSES.find(s => s.value === status) || STATUSES[0];

  return (
    <div className="relative flex items-center">
      <select
        value={status}
        onChange={handleChange}
        disabled={isLoading}
        className={`appearance-none font-medium text-xs px-3 py-1.5 rounded-full outline-none cursor-pointer border pr-6 transition-all ${currentConfig.color} ${isLoading ? 'opacity-50' : 'opacity-100'}`}
      >
        {STATUSES.map(s => (
          <option key={s.value} value={s.value} className="bg-white text-gray-900 font-medium">
            {s.label}
          </option>
        ))}
      </select>
      
      <div className="absolute right-2 pointer-events-none flex items-center justify-center">
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin text-current opacity-70" />
        ) : (
          <svg className="w-3 h-3 text-current opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        )}
      </div>
    </div>
  );
}