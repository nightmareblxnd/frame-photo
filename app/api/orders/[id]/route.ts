import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

async function checkAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return false;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.role === "ADMIN";
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await checkAdmin())) return NextResponse.json({ error: "Нет прав доступа" }, { status: 403 });
    
    const { id } = await params;
    const body = await request.json();

    // Обновляем статус заказа
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Ошибка при обновлении статуса:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}