import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, ImageIcon } from "lucide-react";

const prisma = new PrismaClient();

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export async function ArticlesBlock() {

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  if (articles.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-medium">Последние статьи</h2>
          <Link href="/articles" className="text-base text-gray-500 hover:text-gray-900 flex items-center gap-1">
            Все <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="md:hidden">
          <div className="flex overflow-x-auto gap-3 pb-3 scrollbar-hide">
            {articles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="flex-shrink-0 w-[260px]">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="relative w-full aspect-[4/3] bg-gray-100">
                    {article.image ? (
                      <Image src={article.image} alt={article.title} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(article.createdAt)}
                    </div>
                    <h3 className="text-sm font-medium mb-1 line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{article.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Десктопная сетка */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.slice(0, 3).map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="block group">
              <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-400 transition-colors h-full">
                <div className="relative w-full aspect-[4/3] bg-gray-100">
                   {article.image ? (
                      <Image 
                        src={article.image} 
                        alt={article.title} 
                        fill 
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-10 w-10 text-gray-300" />
                      </div>
                    )}
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(article.createdAt)}
                  </div>
                  <h3 className="text-base font-medium mb-1 group-hover:text-gray-600 transition-colors">{article.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{article.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}