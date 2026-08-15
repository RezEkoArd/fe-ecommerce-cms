"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/features/product/hooks/use-products";
import { formatRupiah } from "@/lib/utils";

const LOW_STOCK_THRESHOLD = 6;

export function RecentProducts() {
  const { data, isLoading, isError } = useProducts({ limit: 5 });

  return (
    <Card className="gap-0 px-6 py-5.5">
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-base font-bold">Produk Terbaru</h2>
        <Link href="/products" className="text-[13px] text-primary hover:underline">
          Lihat semua →
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : isError ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Gagal memuat produk.
        </p>
      ) : !data?.items.length ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Belum ada produk. Tambahkan produk pertamamu.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.04em] text-muted-foreground">
                <th className="pb-3 font-normal">Produk</th>
                <th className="pb-3 font-normal">Kategori</th>
                <th className="pb-3 text-right font-normal">Harga</th>
                <th className="pb-3 text-right font-normal">Stok</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((product) => (
                <tr key={product.ID} className="border-t">
                  <td className="py-3.5 font-medium">{product.Name}</td>
                  <td className="py-3.5 text-muted-foreground">
                    {product.Category?.Name ?? "—"}
                  </td>
                  <td className="py-3.5 text-right tabular-nums">
                    {formatRupiah(product.Price)}
                  </td>
                  <td className="py-3.5 text-right">
                    {product.Stock < LOW_STOCK_THRESHOLD ? (
                      <Badge className="bg-accent/10 text-accent tabular-nums">
                        {product.Stock}
                      </Badge>
                    ) : (
                      <span className="tabular-nums">{product.Stock}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
