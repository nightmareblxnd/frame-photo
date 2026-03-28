import { Search, ShoppingBag, CreditCard, Box } from "lucide-react";

export default function HowToOrderPage() {
  const steps = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Выберите технику",
      description: "Воспользуйтесь нашим удобным каталогом или поиском. Изучите характеристики, почитайте наши статьи и добавьте нужный товар в корзину.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <ShoppingBag className="h-8 w-8" />,
      title: "Оформите корзину",
      description: "Перейдите в корзину, проверьте комплектацию заказа. Если у вас есть промокод — самое время его применить!",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Оплата и доставка",
      description: "Укажите адрес для нашей бесплатной доставки по России. Выберите удобный способ оплаты: картой онлайн, при получении или в рассрочку.",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: <Box className="h-8 w-8" />,
      title: "Получите заказ",
      description: "Мы надежно упакуем вашу новую технику и отправим в кратчайшие сроки. Вам придет трек-номер для отслеживания.",
      color: "bg-orange-50 text-orange-600"
    }
  ];

  return (
    <main className="min-h-screen bg-white pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Как сделать заказ</h1>
          <p className="text-lg text-gray-600">Всего 4 простых шага отделяют вас от идеальных кадров.</p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-8 items-start bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100">
              <div className="flex-shrink-0">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${step.color}`}>
                  {step.icon}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Шаг {index + 1}</span>
                  <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-gray-900 rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-2xl font-bold mb-4">Остались вопросы?</h2>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto">
            Если у вас возникли трудности с оформлением заказа, наши менеджеры с радостью помогут вам по телефону или в чате.
          </p>
          <a href="/contacts" className="inline-block bg-white text-gray-900 px-8 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors">
            Связаться с нами
          </a>
        </div>
      </div>
    </main>
  );
}