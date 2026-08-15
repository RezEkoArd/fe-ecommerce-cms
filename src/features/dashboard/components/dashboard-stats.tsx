"use client";

import { Package, Tags, AlertTriangle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/features/category/hooks/use-categories";
import { useProducts } from "@/features/product/hooks/use-products";

const LOW_STOCK_THRESHOLD = 6;

export function DashboardStats() {
  // limit besar supaya hitungan stok menipis mencakup semua produk.
  const products = useProducts({ limit: 100 });
  const categories = useCategories();

  const isLoading = products.isLoading || categories.isLoading;

  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-31" />
        ))}
      </div>
    );
  }

  if (products.isError || categories.isError) {
    return (
      <Card className="p-6 text-sm text-muted-foreground">
        Gagal memuat ringkasan. Coba muat ulang halaman.
      </Card>
    );
  }

  const items = products.data?.items ?? [];
  const lowStock = items.filter((p) => p.Stock < LOW_STOCK_THRESHOLD).length;

  const stats = [
    {
      label: "Total produk",
      value: products.data?.total ?? 0,
      hint: "Produk terdaftar",
      icon: Package,
      tone: "text-muted-foreground",
    },
    {
      label: "Kategori",
      value: categories.data?.length ?? 0,
      hint: "Kelompok produk",
      icon: Tags,
      tone: "text-muted-foreground",
    },
    {
      label: "Stok menipis",
      value: lowStock,
      hint: `Kurang dari ${LOW_STOCK_THRESHOLD} unit`,
      icon: AlertTriangle,
      tone: lowStock > 0 ? "text-accent" : "text-muted-foreground",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map(({ label, value, hint, icon: Icon, tone }) => (
        <Card key={label} className="gap-0 px-6 py-5.5">
          <div className="mb-3.5 flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">{label}</span>
            <Icon className={`size-4 ${tone}`} />
          </div>
          <div className="mb-2 text-[28px] font-bold tracking-tight tabular-nums">
            {value}
          </div>
          <div className={`text-xs ${tone}`}>{hint}</div>
        </Card>
      ))}
    </div>
  );
}
