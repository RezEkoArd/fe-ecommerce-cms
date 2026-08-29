"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductBySlug } from "../hooks/use-products";
import { cn, formatRupiah } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { useAddToCart } from "@/features/cart/hooks/use-cart";
import { useAuthStore } from "@/store/auth-store";

export function ProductDetail({ slug }: { slug: string }) {
  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addToCart = useAddToCart();

  function handleAddToCart() {
    if (!product) return;

    // Belum login → ke halaman masuk, lalu kembali ke produk ini.
    if (!user) {
      router.push(`/masuk?redirect=/produk/${product.Slug}`);
      return;
    }

    addToCart.mutate({ productId: product.ID, quantity: qty });
  }

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-300 gap-16 px-10 pb-30 pt-8 lg:grid-cols-[1.1fr_1fr]">
        <Skeleton className="aspect-4/5" />
        <div className="grid gap-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-300 px-10 py-30 text-center">
        <h1 className="mb-3 text-2xl font-bold">Produk tidak ditemukan</h1>
        <p className="mb-8 text-muted-foreground">
          Produk yang kamu cari mungkin sudah tidak tersedia.
        </p>
        <Link
          href="/produk"
          className="inline-block rounded-md bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground"
        >
          Kembali ke katalog
        </Link>
      </div>
    );
  }

  const images = product.Images ?? [];
  const stock = product.Stock;
  const isOutOfStock = stock <= 0;

  return (
    <div className="mx-auto max-w-300 px-10 pb-30 pt-8">
      <nav className="mb-9 text-[13px] text-muted-foreground">
        <Link href="/produk" className="hover:text-foreground">
          Katalog
        </Link>
        <span className="mx-2">/</span>
        <span>{product.Category?.Name ?? "Tanpa kategori"}</span>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.Name}</span>
      </nav>

      <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
        {/* Galeri */}
        <div>
          <div className="relative mb-4 aspect-4/5 overflow-hidden rounded-xl border bg-secondary">
            {images[activeImage] ? (
              <Image
                src={images[activeImage].URL}
                alt={product.Name}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Tanpa gambar
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((image, i) => (
                <button
                  key={image.ID}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`Lihat gambar ${i + 1}`}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border-2 transition-colors",
                    i === activeImage ? "border-primary" : "border-border",
                  )}
                >
                  <Image
                    src={image.URL}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informasi */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-3 text-xs uppercase tracking-[0.06em] text-muted-foreground">
            {product.Category?.Name ?? "Tanpa kategori"}
          </div>
          <h1 className="mb-2.5 text-[34px] font-bold leading-tight">
            {product.Name}
          </h1>
          <div className="mb-7 text-[26px] font-medium tabular-nums">
            {formatRupiah(product.Price)}
          </div>

          {product.Description && (
            <p className="mb-8 leading-relaxed text-muted-foreground">
              {product.Description}
            </p>
          )}

          <div className="mb-7 flex items-center gap-2 text-sm">
            <span
              className={cn(
                "inline-block size-2 rounded-full",
                isOutOfStock
                  ? "bg-muted-foreground"
                  : stock > 8
                    ? "bg-success"
                    : "bg-accent",
              )}
            />
            <span>
              {isOutOfStock
                ? "Stok habis"
                : stock > 8
                  ? `Stok tersedia (${stock})`
                  : `Stok terbatas — tersisa ${stock}`}
            </span>
          </div>

          <div className="flex items-stretch gap-3.5">
            <div className="flex items-center rounded-lg border">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1 || isOutOfStock}
                aria-label="Kurangi jumlah"
                className="flex size-11 items-center justify-center text-muted-foreground disabled:opacity-40"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center tabular-nums">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(stock, q + 1))}
                disabled={qty >= stock || isOutOfStock}
                aria-label="Tambah jumlah"
                className="flex size-11 items-center justify-center text-muted-foreground disabled:opacity-40"
              >
                <Plus className="size-4" />
              </button>
            </div>

            {/* <Button className="h-11 flex-1" disabled={isOutOfStock}>
              {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
            </Button> */}

            <Button
              className="h-11 flex-1"
              disabled={isOutOfStock || addToCart.isPending}
              onClick={handleAddToCart}
            >
              {isOutOfStock
                ? "Stok Habis"
                : addToCart.isPending
                  ? "Menambahkan…"
                  : "Tambah ke Keranjang"}
            </Button>
          </div>

          <div className="mt-9 grid gap-3.5 border-t pt-6 text-sm">
            <Row label="Pengiriman">2–4 hari kerja</Row>
            <Row label="Pengembalian">7 hari setelah diterima</Row>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{children}</span>
    </div>
  );
}
