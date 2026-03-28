import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { ProductDetails } from "./ProductDetails";

const prisma = new PrismaClient();

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {

  const resolvedParams = await params;

  const product = await prisma.product.findUnique({
    where: { 
      slug: resolvedParams.slug 
    },
    include: {
      images: {
        orderBy: { order: 'asc' }
      },
      specifications: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!product) {
    notFound();
  }

  return (
    <ProductDetails product={product} />
  );
}