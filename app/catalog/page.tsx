import { Catalog } from "@/components/catalog";
import { Suspense } from "react";

export default function CatalogPage() {
  return (
    <main className="min-h-screen pt-12">
      <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center text-gray-500">Загрузка каталога...</div>}>
        <Catalog />
      </Suspense>
    </main>
  );
}