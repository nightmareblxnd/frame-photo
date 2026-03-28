import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    
    if (!userId) return NextResponse.json({ role: "USER" });
    
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { role: true }
    });
    
    return NextResponse.json({ role: user?.role || "USER" });
  } catch (error) {
    return NextResponse.json({ role: "USER" });
  }
}