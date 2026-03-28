import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PrismaClient, Order, OrderItem } from "@prisma/client";
import { Package, LogOut, User as UserIcon, Calendar, MapPin, CreditCard } from "lucide-react";
import { ProfileNameForm } from "./ProfileNameForm";

type OrderWithItems = Order & {
  items: OrderItem[];
};

const prisma = new PrismaClient();

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency', currency: 'RUB', minimumFractionDigits: 0
  }).format(price);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(date);
};


const statusMap: Record<string, { text: string; color: string }> = {
  PENDING: { text: "В обработке", color: "bg-blue-50 text-blue-700 border-blue-200" },
  ACCEPTED: { text: "Принят", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  SHIPPED: { text: "Передан в доставку", color: "bg-purple-50 text-purple-700 border-purple-200" },
  DELIVERED: { text: "Выполнен", color: "bg-green-50 text-green-700 border-green-200" },
  CANCELED: { text: "Отменен", color: "bg-red-50 text-red-700 border-red-200" },
};


async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  redirect("/login");
}

export default async function ProfilePage() {

  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }, 
    include: { items: true }, 
  });

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Боковая панель пользователя */}
          <aside className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="h-8 w-8 text-gray-500" />
              </div>
              <ProfileNameForm initialName={user.name} />
              <p className="text-sm text-gray-500 mb-6 break-all">{user.email}</p>
              
              <hr className="border-gray-100 mb-6" />
              
              <nav className="space-y-2">
                <a href="#orders" className="flex items-center gap-3 text-sm font-medium text-gray-900 bg-gray-50 px-4 py-2.5 rounded-xl">
                  <Package className="h-4 w-4" />
                  Мои заказы
                </a>
                
                {/* Кнопка выхода */}
                <form action={logout}>
                  <button type="submit" className="w-full flex items-center gap-3 text-sm font-medium text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors">
                    <LogOut className="h-4 w-4" />
                    Выйти
                  </button>
                </form>
              </nav>
            </div>
          </aside>

          {/* Основной контент: Заказы */}
          <main className="w-full md:w-2/3 lg:w-3/4" id="orders">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">История заказов</h1>

            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">У вас пока нет заказов</h3>
                <p className="text-gray-500 mb-6">Сделайте свой первый заказ в каталоге</p>
                <a href="/catalog" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 transition-colors">
                  Перейти в каталог
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order: OrderWithItems) => {
                  const status = statusMap[order.status] || { text: order.status, color: "bg-gray-100 text-gray-800" };
                  
                  return (
                    <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {/* Шапка заказа */}
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Заказ #{order.id.slice(-6).toUpperCase()}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.text}
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(order.totalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Детали заказа (Адрес и оплата) */}
                      <div className="px-6 py-4 border-b border-gray-50 flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-600 bg-white">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <span>{order.address}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CreditCard className="h-4 w-4 text-gray-400 mt-0.5" />
                          <span>{order.paymentMethod === "card" ? "Оплата картой" : "Наличными при получении"}</span>
                        </div>
                      </div>

                      {/* Список товаров */}
                      <div className="px-6 py-4 bg-white">
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Состав заказа</h4>
                        <div className="space-y-3">
                          {order.items.map((item: OrderItem) => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{item.quantity}x</span>
                                <span className="text-gray-600 line-clamp-1">{item.name}</span>
                              </div>
                              <span className="text-gray-900 font-medium whitespace-nowrap ml-4">
                                {formatPrice(item.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>

      </div>
    </div>
  );
}