import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ImageIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";

const prisma = new PrismaClient();

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export default async function ArticlesIndexPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          На главную
        </Link>
        <h1 className="text-3xl md:text-4xl mb-8 text-gray-900">Блог и статьи</h1>
        
        {articles.length === 0 ? (
          <p className="text-gray-500">Статей пока нет.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {articles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 h-full">
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  {article.image ? (
                    <Image 
                      src={article.image} 
                      alt={article.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-10 w-10 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(article.createdAt)}
                  </div>
                  <h2 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3 mt-auto">
                    {article.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}