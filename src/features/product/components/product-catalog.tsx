"use client";

import { useSearchParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "./product-card";
import { useProducts } from "../hooks/use-products";

const PAGE_SIZE = 12;

export function ProductCatalog() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category") ?? "";

  const { data, isLoading, isError } = useProducts({
    limit: PAGE_SIZE,
    ...(categoryId ? { category_id: categoryId } : {}),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6.5 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="aspect-[4/5]" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Gagal memuat produk. Coba muat ulang halaman.
      </p>
    );
  }

  if (!data?.items.length) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Tidak ada produk di kategori ini.
      </p>
    );
  }

  return (
    <>
      <div className="mb-7 border-b pb-4.5 text-sm text-muted-foreground">
        {data.total} produk
      </div>
      <div className="grid grid-cols-2 gap-6.5 lg:grid-cols-3">
        {data.items.map((product) => (
          <ProductCard key={product.ID} product={product} />
        ))}
      </div>
    </>
  );
}
