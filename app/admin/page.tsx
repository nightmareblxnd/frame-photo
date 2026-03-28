import Link from "next/link";
import { FileText, Package, ShoppingCart, Users, TrendingUp, Settings, Plus, List } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-200">
          <div className="p-3 bg-gray-900 rounded-2xl text-white">
            <Settings className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Панель управления</h1>
            <p className="text-gray-500">Выберите, что необходимо сделать</p>
          </div>
        </div>


        <h2 className="text-xl font-bold text-gray-900 mb-6">Основные разделы</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* КАРТОЧКА СТАТЕЙ */}
          <div className="flex flex-col p-8 rounded-3xl border border-blue-100 bg-blue-50/50 bg-white shadow-sm hover:shadow-md transition-all">
            <div className="mb-6"><FileText className="h-8 w-8 text-blue-500" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Статьи и блог</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
              Написание новых статей, удаление и редактирование существующих материалов блога.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/admin/articles/new" className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" /> Написать статью
              </Link>
              <Link href="/articles" className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                <List className="h-4 w-4" /> Все статьи
              </Link>
            </div>
          </div>

          {/* КАРТОЧКА ТОВАРОВ */}
          <div className="flex flex-col p-8 rounded-3xl border border-purple-100 bg-purple-50/50 bg-white shadow-sm hover:shadow-md transition-all">
            <div className="mb-6"><Package className="h-8 w-8 text-purple-500" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Каталог товаров</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
              Добавление новых камер, объективов, управление ценами и остатками.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/admin/products" className="flex items-center justify-center gap-2 bg-purple-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">
                <List className="h-4 w-4" /> Управление товарами
              </Link>
            </div>
          </div>

          {/* КАРТОЧКА ЗАКАЗОВ */}
          <div className="flex flex-col p-8 rounded-3xl border border-green-100 bg-green-50/50 bg-white shadow-sm hover:shadow-md transition-all">
            <div className="mb-6"><ShoppingCart className="h-8 w-8 text-green-500" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Заказы клиентов</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
              Просмотр новых заказов, изменение статусов (в обработке, в пути, доставлен).
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/admin/orders" className="flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
                <List className="h-4 w-4" /> Список заказов
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}