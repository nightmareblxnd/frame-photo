import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ favorites: [] });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { favoriteProducts: true },
    });

    return NextResponse.json({ favorites: user?.favoriteProducts || [] });
  } catch (error) {
    console.error("Ошибка при получении избранного:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}