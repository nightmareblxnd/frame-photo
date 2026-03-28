import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, List, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { cookies } from "next/headers";
import { ArticleAdminControls } from "@/components/article-admin-controls";

const prisma = new PrismaClient();

const generateSlug = (text: string) => {
  return text.toLowerCase().replace(/[^a-zа-яё0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(date);
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (!article) notFound();


  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  let isAdmin = false;

  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && user.role === "ADMIN") {
      isAdmin = true;
    }
  }

  // Оглавление
  const headings = (article.content.match(/^##\s+(.+)$/gm) || []).map(h => {
    const text = h.replace('## ', '');
    return { text, id: generateSlug(text) };
  });

  return (
    <article className="min-h-screen bg-white pb-20 pt-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <Link href="/articles" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Все статьи
        </Link>

        {/* ПАНЕЛЬ АДМИНА */}
        {isAdmin && <ArticleAdminControls slug={article.slug} />}

        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-100 text-sm">
          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
            <User className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-gray-900">{article.author || "Редакция Фрэйм"}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(article.createdAt)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Обновлено: {formatDate(article.updatedAt)}</span>
          </div>
        </div>

        {article.image && (
          <div className="relative aspect-video w-full mb-12 rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
            <Image src={article.image} alt={article.title} fill className="object-cover" priority />
          </div>
        )}

      
        <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          
          <div className="md:w-2/3 lg:w-3/4">
            <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-2xl prose-img:border prose-img:border-gray-100 prose-p:mb-6 prose-p:leading-relaxed">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  h2: ({node, ...props}) => {
                    const text = String(props.children).replace(/,/g, '');
                    return <h2 id={generateSlug(text)} className="scroll-mt-24" {...props} />
                  }
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </div>

          <aside className="md:w-1/3 lg:w-1/4">
            <div className="sticky top-24 bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-4 md:mb-0">
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm">
                <List className="h-4 w-4" />
                Оглавление
              </h3>
              {headings.length > 0 ? (
                <ul className="space-y-3">
                  {headings.map((heading, index) => (
                    <li key={index}>
                      <a href={`#${heading.id}`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors block leading-snug">
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">Оглавление пусто</p>
              )}
            </div>
          </aside>
          
        </div>
      </div>
    </article>
  );
}