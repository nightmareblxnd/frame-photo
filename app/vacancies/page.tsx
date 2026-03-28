import { Briefcase, Camera, Coffee, Zap, ArrowRight } from "lucide-react";

export default function VacanciesPage() {
  const jobs = [
    {
      title: "Менеджер-консультант по фототехнике",
      type: "Полная занятость",
      location: "Москва, офис",
      salary: "от 90 000 ₽",
      description: "Ищем человека, который может с закрытыми глазами отличить байонет E от RF. Вы будете помогать нашим клиентам подбирать идеальную технику для их задач."
    },
    {
      title: "Специалист по контенту (Видеомейкер)",
      type: "Гибрид",
      location: "Москва / Удаленно",
      salary: "от 120 000 ₽",
      description: "Нам нужен креативный человек для съемок обзоров новинок на YouTube и ведения наших соцсетей. Технику для съемок предоставим!"
    },
    {
      title: "Специалист службы поддержки",
      type: "Удаленная работа",
      location: "Любой город",
      salary: "от 70 000 ₽",
      description: "Помощь клиентам в чате и по телефону: статусы заказов, вопросы по доставке и базовая консультация."
    }
  ];

  return (
    <main className="min-h-screen bg-white pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Шапка вакансий */}
        <div className="bg-gray-900 rounded-3xl p-8 md:p-16 text-center text-white mb-16 relative overflow-hidden">

          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gray-800 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Создавайте историю вместе с Фрэйм</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Мы — команда фанатов фотографии. Если вы любите камеры так же сильно, как мы, и хотите работать в одном из крупнейших магазинов РФ — нам по пути!
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> 16 лет на рынке</span>
              <span className="flex items-center gap-2"><Camera className="h-4 w-4" /> Доступ к топовой технике</span>
            </div>
          </div>
        </div>


        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Почему у нас круто?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <Zap className="h-8 w-8 text-yellow-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Скидки для своих</h3>
            <p className="text-gray-600 text-sm">Возможность покупать любую технику из ассортимента по закупочным ценам.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <Camera className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Техника в аренду</h3>
            <p className="text-gray-600 text-sm">Берем камеры из тест-парка на выходные для личных творческих проектов.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <Coffee className="h-8 w-8 text-orange-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Комфортный офис</h3>
            <p className="text-gray-600 text-sm">Современный шоурум в центре с кофемашиной, зоной отдыха и фотостудией.</p>
          </div>
        </div>

        {/* Список вакансий */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Открытые позиции</h2>
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <div key={index} className="group bg-white p-6 md:p-8 rounded-2xl border border-gray-200 hover:border-gray-400 transition-colors flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div className="max-w-2xl">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{job.type}</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">{job.location}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                <p className="text-gray-600 text-sm">{job.description}</p>
              </div>
              
              <div className="flex flex-col md:items-end w-full md:w-auto mt-4 md:mt-0">
                <span className="text-lg font-bold text-gray-900 mb-4 md:mb-2">{job.salary}</span>
                <button className="w-full md:w-auto bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  Откликнуться <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          Не нашли подходящую вакансию, но хотите работать у нас? <br/>
          Присылайте резюме на <a href="mailto:hr@frame-photo.ru" className="text-gray-900 font-medium underline">hr@framephoto.ru</a>
        </div>

      </div>
    </main>
  );
}