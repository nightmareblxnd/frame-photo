import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers"; 

const prisma = new PrismaClient();


export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: "Ошибка при получении статей" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Вы не авторизованы" }, { status: 401 });
    }


    const user = await prisma.user.findUnique({ 
      where: { id: userId } 
    });


    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "У вас нет прав администратора" }, { status: 403 });
    }


    const body = await request.json();
    const { title, slug, description, content, image, author } = body;

    const article = await prisma.article.create({
      data: { 
        title, 
        slug, 
        description, 
        content, 
        image, 
        author: author || "Администратор" 
      },
    });

    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    console.error("Ошибка при создании статьи:", error);

    return NextResponse.json(
      { error: "Ошибка при создании. Возможно, такой URL (slug) уже существует." }, 
      { status: 500 }
    );
  }
}