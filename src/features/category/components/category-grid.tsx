"use client";

import Link from "next/link";
import Image from "next/image";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "../hooks/use-categories";

export function CategoryGrid() {
  const { data, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="mx-auto max-w-300 px-10 pb-10 pt-24">
        <div className="grid grid-cols-2 gap-4.5 sm:grid-cols-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      </section>
    );
  }

  if (!data?.length) return null;

  return (
    <section className="mx-auto max-w-300 px-10 pb-10 pt-24">
      <div className="mb-9 flex items-baseline justify-between">
        <h2 className="text-[26px] font-bold">Kategori</h2>
        <Link href="/produk" className="text-sm text-primary hover:underline">
          Semua produk →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4.5 sm:grid-cols-5">
        {data.map((category) => (
          <Link
            key={category.ID}
            href={`/produk?category=${category.ID}`}
            className="overflow-hidden rounded-lg border bg-card transition-colors hover:border-ring"
          >
            <div className="relative aspect-square bg-secondary">
              {category.ImageURL ? (
                <Image
                  src={category.ImageURL}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover"
                />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
            <div className="p-3.5">
              <div className="text-[15px] font-medium">{category.Name}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {category.ProductCount ?? 0} produk
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
