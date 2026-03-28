import { RefreshCcw, ShieldCheck, Box, Clock } from "lucide-react";

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-white pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Возврат и гарантия</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Мы уверены в качестве нашей техники, но понимаем, что иногда планы меняются. В магазине «Фрэйм» процесс возврата такой же простой, как и покупка.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Блок возврата */}
          <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <RefreshCcw className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14 дней на раздумья</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Вы можете вернуть товар надлежащего качества в течение 14 дней с момента получения, если он не был в употреблении, сохранены его товарный вид, потребительские свойства, пломбы и фабричные ярлыки.
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center gap-2"><Box className="h-4 w-4 text-blue-500" /> Упаковка не должна быть повреждена</li>
              <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-blue-500" /> Деньги возвращаются в течение 3-5 дней</li>
            </ul>
          </div>

          {/* Блок гарантии */}
          <div className="bg-green-50/50 rounded-3xl p-8 border border-green-100">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Официальная гарантия</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Вся фото- и видеотехника в нашем магазине сертифицирована. Мы предоставляем официальную гарантию от производителя сроком от 1 до 3 лет, а также нашу собственную поддержку.
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-green-500" /> Гарантийный талон в каждом заказе</li>
              <li className="flex items-center gap-2"><RefreshCcw className="h-4 w-4 text-green-500" /> Замена брака без долгих экспертиз</li>
            </ul>
          </div>
        </div>

        {/* Инструкция */}
        <div className="bg-gray-900 text-white rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-6">Как оформить возврат?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-gray-500 font-bold text-xl mb-2">01</div>
              <h3 className="font-semibold mb-2">Свяжитесь с нами</h3>
              <p className="text-gray-400 text-sm">Напишите на почту returns@frame-photo.ru или позвоните нам. Укажите номер заказа.</p>
            </div>
            <div>
              <div className="text-gray-500 font-bold text-xl mb-2">02</div>
              <h3 className="font-semibold mb-2">Отправьте товар</h3>
              <p className="text-gray-400 text-sm">Бесплатно отправьте технику через СДЭК или принесите в наш офис.</p>
            </div>
            <div>
              <div className="text-gray-500 font-bold text-xl mb-2">03</div>
              <h3 className="font-semibold mb-2">Получите деньги</h3>
              <p className="text-gray-400 text-sm">Мы проверим состояние товара и моментально переведем средства на вашу карту.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}