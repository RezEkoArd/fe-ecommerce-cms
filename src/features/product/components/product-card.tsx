import Image from "next/image";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import Link from "next/link";

import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/types/api";

export function ProductCard({ product }: { product: Product }) {
  const image = product.Images?.find((i) => i.IsPrimary) ?? product.Images?.[0];

  return (
    <div className="flex flex-col">
      <Link
        href={`/produk/${product.Slug}`}
        className="mb-3.5 overflow-hidden rounded-lg border bg-secondary"
      >
        <div className="relative aspect-[4/5]">
          {image ? (
            <Image
              src={image.URL}
              alt={product.Name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <ImagePlaceholder label="Tanpa gambar" />
          )}
        </div>
      </Link>

      <div className="mb-1 text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
        {product.Category?.Name ?? "—"}
      </div>
      <Link
        href={`/produk/${product.Slug}`}
        className="mb-1.5 text-[15px] font-medium hover:text-primary"
      >
        {product.Name}
      </Link>
      <div className="text-[15px] tabular-nums">
        {formatRupiah(product.Price)}
      </div>
    </div>
  );
}
