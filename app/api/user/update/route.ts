import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function PATCH(request: Request) {
  try {
    const { name } = await request.json();
    
  
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }


    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}