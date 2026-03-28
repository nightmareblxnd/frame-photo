import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const brand = searchParams.get("brand");
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 500000;
    const sortBy = searchParams.get("sortBy") || "default";
    const search = searchParams.get("search") || "";

    const where: any = {
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    };

    if (category && category !== "all") {
      where.category = category;
    }
    
    if (subcategory && subcategory !== "all" && subcategory !== "Все подкатегории") {
      where.subcategory = subcategory;
    }
    
    if (brand && brand !== "all") {
      where.brand = brand;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    let orderBy: any = { createdAt: "desc" }; 
    
    if (sortBy === "price-asc") orderBy = { price: "asc" };
    if (sortBy === "price-desc") orderBy = { price: "desc" };
    if (sortBy === "rating") orderBy = { rating: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    const distinctBrands = await prisma.product.findMany({
      distinct: ['brand'],
      select: { brand: true },
      where: { brand: { not: "" } }
    });
    const brands = distinctBrands.map(b => b.brand).filter(Boolean);

    const distinctCategories = await prisma.product.findMany({
      distinct: ['category', 'subcategory'],
      select: { category: true, subcategory: true },
      where: { category: { not: "" } }
    });

    const categories = Array.from(new Set(distinctCategories.map(c => c.category).filter(Boolean)));
    
    const subcategoriesByCategory: Record<string, string[]> = {};

    distinctCategories.forEach((item: { category: string; subcategory: string | null }) => {
      if (item.category) {
        if (!subcategoriesByCategory[item.category]) {
          subcategoriesByCategory[item.category] = [];
        }
        if (item.subcategory && !subcategoriesByCategory[item.category].includes(item.subcategory)) {
          subcategoriesByCategory[item.category].push(item.subcategory);
        }
      }
    });

    return NextResponse.json({
      products,
      categories,
      brands,
      subcategoriesByCategory,
    });

  } catch (error) {
    console.error("Ошибка при получении товаров:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Нет прав" }, { status: 403 });


    const body = await request.json();

    const newProduct = await prisma.product.create({
      data: body,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Ошибка создания товара:", error);
    return NextResponse.json({ error: "Ошибка при сохранении" }, { status: 500 });
  }
}