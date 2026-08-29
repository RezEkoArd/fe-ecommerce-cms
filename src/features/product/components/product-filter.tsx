"use client"

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/features/category/hooks/use-categories";
import { cn } from "@/lib/utils";

export function ProductFilter() {
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "";
  const { data, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="grid gap-1.5">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-9" />
        ))}
      </div>
    );
  }

  const total = data?.reduce((sum, c) => sum + (c.ProductCount ?? 0), 0) ?? 0;

  return (
    <div>
      <h3 className="mb-4 text-[13px] uppercase tracking-[0.08em] text-muted-foreground">
        Kategori
      </h3>
      <div className="flex flex-col gap-0.5">
        <FilterLink href="/produk" isActive={!active} label="Semua" count={total} />
        {data?.map((category) => (
          <FilterLink
            key={category.ID}
            href={`/produk?category=${category.ID}`}
            isActive={active === category.ID}
            label={category.Name}
            count={category.ProductCount ?? 0}
          />
        ))}
      </div>
    </div>
  );
}

function FilterLink({
  href,
  isActive,
  label,
  count,
}: {
  href: string;
  isActive: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors",
        isActive
          ? "bg-secondary font-medium"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <span>{label}</span>
      <span className="text-[13px] text-muted-foreground">{count}</span>
    </Link>
  );
}
