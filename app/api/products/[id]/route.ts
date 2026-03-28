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


export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!(await checkAdmin())) return NextResponse.json({ error: "Нет прав" }, { status: 403 });

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка при удалении" }, { status: 500 });
  }
}


export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!(await checkAdmin())) return NextResponse.json({ error: "Нет прав" }, { status: 403 });

    const body = await request.json();
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка при обновлении" }, { status: 500 });
  }
}