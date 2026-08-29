import { Skeleton } from "@/components/ui/skeleton";
import { ProductCatalog } from "@/features/product/components/product-catalog";
import { ProductFilter } from "@/features/product/components/product-filter";
import { Suspense } from "react";


export const metadata = {
    title: "Katalog — ichiba 市場",
    description: "Semua produk busana butik Jepang"
};

export default function ProductPage() {
    return (
            <div className="mx-auto max-w-300 px-10 pb-30 pt-12">
      <div className="mb-10">
        <div className="mb-2 text-xs uppercase tracking-[0.06em] text-muted-foreground">
          Katalog
        </div>
        <h1 className="text-[38px] font-bold">Semua Produk</h1>
      </div>

      <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={<Skeleton className="h-40" />}>
            <ProductFilter />
          </Suspense>
        </aside>

        <div>
          <Suspense fallback={<Skeleton className="h-96" />}>
            <ProductCatalog />
          </Suspense>
        </div>
      </div>
    </div>

    )
}