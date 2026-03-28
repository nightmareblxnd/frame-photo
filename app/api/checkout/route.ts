import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

interface CheckoutItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, address, paymentMethod, items, totalPrice } = body;


    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

  
    const order = await prisma.order.create({
      data: {
        userId: userId || null, 
        totalPrice,
        paymentMethod,
        address,
        items: {
          create: items.map((item: CheckoutItem) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });


    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsHtml = items
      .map(
        (item: CheckoutItem) =>
          `<li><strong>${item.name}</strong> — ${item.quantity} шт. x ${item.price} ₽</li>`
      )
      .join("");

    const mailOptions = {
      from: `"Фрэйм - магазин фототехники" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Ваш заказ #${order.id.slice(-6).toUpperCase()} успешно принят!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Здравствуйте, ${name}!</h2>
          <p>Ваш заказ <strong>#${order.id.slice(-6).toUpperCase()}</strong> принят в обработку.</p>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
            <h3>Детали заказа:</h3>
            <ul>${itemsHtml}</ul>
            <p><strong>Итого к оплате: ${totalPrice} ₽</strong></p>
            <p>Способ оплаты: ${paymentMethod === "card" ? "Картой онлайн" : "Наличными"}<br/>
            Адрес: ${address}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Заказ оформлен" });
  } catch (error) {
    console.error("Ошибка при оформлении заказа:", error);
    return NextResponse.json(
      { error: "Произошла ошибка при сохранении заказа" },
      { status: 500 }
    );
  }
}