import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email обязателен" }, { status: 400 });
    }


    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationCode.deleteMany({
      where: { email },
    });

    await prisma.verificationCode.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });


    const transporter = nodemailer.createTransport({
      service: "Yandex",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Фрэйм - магазин фототехники" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Ваш код для входа: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
          <h2>Вход в личный кабинет</h2>
          <p style="color: #4b5563; font-size: 16px;">
            Ваш одноразовый код для авторизации:
          </p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111827;">
              ${code}
            </span>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Код действителен 10 минут. Никому не сообщайте его.
          </p>
        </div>
      `,
    };


    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Код отправлен" });
  } catch (error) {
    console.error("Ошибка при отправке кода:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}