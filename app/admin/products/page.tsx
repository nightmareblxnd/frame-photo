import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { Plus, ArrowLeft, Package, CheckCircle2, XCircle } from "lucide-react";
import { ProductAdminActions } from "@/components/product-admin-actions";

const prisma = new PrismaClient();

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);
};

export default async function AdminProductsPage() {

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <Link href="/admin" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад в панель
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="h-8 w-8 text-purple-600" />
              Управление товарами
            </h1>
            <p className="text-gray-500 mt-1">Всего товаров в базе: {products.length}</p>
          </div>
          
          <Link 
            href="/admin/products/new" 
            className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Добавить товар
          </Link>
        </div>

        {/* Таблица товаров */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Товар</th>
                  <th className="px-6 py-4">Категория / Бренд</th>
                  <th className="px-6 py-4">Цена</th>
                  <th className="px-6 py-4">Наличие</th>
                  <th className="px-6 py-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden relative flex-shrink-0">
                          <Image 
                            src={product.image} 
                            alt={product.name} 
                            fill 
                            className="object-cover"
                            
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1" title={product.name}>{product.name}</p>
                          <p className="text-xs text-gray-400">ID: {product.id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{product.category}</p>
                      <p className="text-xs text-gray-500">{product.brand}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{formatPrice(product.price)}</p>
                      {product.oldPrice && <p className="text-xs text-gray-400 line-through">{formatPrice(product.oldPrice)}</p>}
                    </td>
                    <td className="px-6 py-4">
                      {product.inStock ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle2 className="h-3.5 w-3.5" /> В наличии
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="h-3.5 w-3.5" /> Нет на складе
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <ProductAdminActions id={product.id} />
                    </td>
                  </tr>
                ))}
                
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Товаров пока нет. Нажмите «Добавить товар», чтобы начать!
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