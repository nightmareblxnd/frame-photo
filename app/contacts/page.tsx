import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactsPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Свяжитесь с нами</h1>
          <p className="text-gray-600">Мы всегда на связи и готовы помочь с выбором или ответить на вопросы.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
   
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Телефон</h3>
                <p className="text-xl font-bold text-gray-900">+7 (903) 573-53-38</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-50 p-3 rounded-full text-green-600">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Электронная почта</h3>
                <p className="text-lg font-medium text-gray-900">support@framephoto.ru</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-50 p-3 rounded-full text-purple-600">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Главный офис</h3>
                <p className="text-base text-gray-900 leading-relaxed">г. Москва, Пресненская наб., д. 6, стр. 2<br/>Башня Империя, 51 этаж</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-50 p-3 rounded-full text-orange-600">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Режим работы</h3>
                <p className="text-base text-gray-900">Пн-Вс: с 10:00 до 21:00<br/>Без выходных и перерывов</p>
              </div>
            </div>
          </div>

          {/* Яндекс Карта */}
          <div className="bg-gray-200 rounded-3xl overflow-hidden h-[400px] md:h-auto min-h-[400px] relative border border-gray-100 shadow-sm">
            <iframe
              src="https://yandex.ru/map-widget/v1/?mode=search&text=Москва%2C%20Пресненская%20набережная%2C%206%20строение%202"
              width="100%"
              height="100%"
              allowFullScreen={true}
              className="absolute inset-0 w-full h-full border-0"
              title="Яндекс Карта - Башня Империя"
            ></iframe>
          </div>
        </div>
      </div>
    </main>
  );
}