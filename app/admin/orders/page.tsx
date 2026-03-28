import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingCart, Calendar, User, CreditCard, PackageOpen } from "lucide-react";
import { OrderStatusSelect } from "@/components/order-status-select";

const prisma = new PrismaClient();

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date);
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true, 
      items: true 
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <Link href="/admin" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад в панель
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-green-600" />
            Заказы клиентов
          </h1>
          <p className="text-gray-500 mt-1">Здесь отображаются все оформленные заказы. Меняйте статус по мере их выполнения.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Номер & Дата</th>
                  <th className="px-6 py-4">Клиент</th>
                  <th className="px-6 py-4">Товары</th>
                  <th className="px-6 py-4">Сумма</th>
                  <th className="px-6 py-4">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order: any) => {
       
                  const calculatedTotal = order.items?.reduce((sum: number, item: any) => {
                    return sum + (item.price * (item.quantity || 1));
                  }, 0) || 0;

                  const finalTotal = order.total || calculatedTotal;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      
                      <td className="px-6 py-4 align-top">
                        <p className="font-bold text-gray-900 mb-1">#{order.id.slice(-8).toUpperCase()}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>

                      <td className="px-6 py-4 align-top">
                        {order.user ? (
                          <>
                            <div className="flex items-center gap-2 font-medium text-gray-900 mb-1">
                              <User className="h-4 w-4 text-gray-400" />
                              {order.user.name || "Без имени"}
                            </div>
                            <p className="text-xs text-gray-500 ml-6">{order.user.email}</p>
                          </>
                        ) : (
                          <span className="text-gray-400 italic">Гость</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {order.items && order.items.length > 0 ? (
                          <div className="flex flex-col gap-3">
                            {order.items.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-3">
                                {item.image ? (
                                  <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                                    <Image src={item.image} alt="Товар" fill className="object-contain p-1" />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
                                    <PackageOpen className="h-5 w-5" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 line-clamp-1" title={item.name}>
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatPrice(item.price)} × {item.quantity || 1} шт.
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-xs">Нет данных о товарах</span>
                        )}
                      </td>

                      <td className="px-6 py-4 align-top">
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          {formatPrice(finalTotal)} 
                        </div>
                      </td>

                      <td className="px-6 py-4 align-top">
                        <OrderStatusSelect orderId={order.id} currentStatus={order.status || "NEW"} />
                      </td>

                    </tr>
                  );
                })}

                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <ShoppingCart className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">Пока нет ни одного заказа</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}