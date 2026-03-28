import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email и код обязательны" }, { status: 400 });
    }


    const verification = await prisma.verificationCode.findUnique({
      where: {
        email_code: {
          email,
          code,
        },
      },
    });

  
    if (!verification) {
      return NextResponse.json({ error: "Неверный код" }, { status: 400 });
    }


    if (verification.expiresAt < new Date()) {
      // Удаляем просроченный мусор из базы
      await prisma.verificationCode.delete({ where: { id: verification.id } });
      return NextResponse.json({ error: "Время действия кода истекло. Запросите новый." }, { status: 400 });
    }

    await prisma.verificationCode.delete({ where: { id: verification.id } });

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,

        },
      });
    }

    const cookieStore = await cookies();
    
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, 
      path: "/",
    });


    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, role: user.role } 
    });

  } catch (error) {
    console.error("Ошибка при проверке кода:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}