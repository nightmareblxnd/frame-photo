import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();


    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {

      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }


    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { favoriteProducts: { select: { id: true } } },
    });

    if (!user) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });

  
    const isFavorite = user.favoriteProducts.some((p) => p.id === productId);

    if (isFavorite) {

      await prisma.user.update({
        where: { id: userId },
        data: {
          favoriteProducts: {
            disconnect: { id: productId },
          },
        },
      });
      return NextResponse.json({ success: true, isFavorite: false });
    } else {

      await prisma.user.update({
        where: { id: userId },
        data: {
          favoriteProducts: {
            connect: { id: productId },
          },
        },
      });
      return NextResponse.json({ success: true, isFavorite: true });
    }
  } catch (error) {
    console.error("Ошибка при переключении избранного:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}