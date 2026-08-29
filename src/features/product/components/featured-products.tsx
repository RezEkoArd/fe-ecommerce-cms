"use client";

import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "./product-card";
import { useProducts } from "../hooks/use-products";

export function FeaturedProducts() {
  const { data, isLoading, isError } = useProducts({ limit: 4 });

  return (
    <section className="mx-auto max-w-300 px-10 pb-30 pt-16">
      <div className="mb-9 flex items-baseline justify-between">
        <h2 className="text-[26px] font-bold">Produk Unggulan</h2>
        <Link href="/produk" className="text-sm text-primary hover:underline">
          Lihat semua →
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-6.5 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-[4/5]" />
          ))}
        </div>
      ) : isError ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Gagal memuat produk.
        </p>
      ) : !data?.items.length ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Belum ada produk.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-6.5 lg:grid-cols-4">
          {data.items.map((product) => (
            <ProductCard key={product.ID} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
