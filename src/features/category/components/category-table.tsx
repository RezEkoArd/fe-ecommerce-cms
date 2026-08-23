"use client";

import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryFormDialog } from "./category-form-dialog";
import { useCategories } from "../hooks/use-categories";

export function CategoryTable() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tableBody] = useAutoAnimate<HTMLTableSectionElement>();
  const { data, isLoading, isError } = useCategories();

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Kelompokkan produk ke dalam kategori.
        </p>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" />
          Tambah Kategori
        </Button>
      </div>

      <Card className="gap-0 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary text-left text-xs uppercase tracking-[0.04em] text-muted-foreground">
                <th className="px-6 py-3.5 font-normal">Nama Kategori</th>
                <th className="px-6 py-3.5 font-normal">Slug</th>
              </tr>
            </thead>
            <tbody ref={tableBody}>
              {isLoading ? (
                [0, 1, 2].map((i) => (
                  <tr key={i} className="border-t">
                    <td colSpan={2} className="px-6 py-4">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr className="border-t">
                  <td colSpan={2} className="px-6 py-10 text-center text-muted-foreground">
                    Gagal memuat kategori. Coba muat ulang halaman.
                  </td>
                </tr>
              ) : !data?.length ? (
                <tr className="border-t">
                  <td colSpan={2} className="px-6 py-10 text-center text-muted-foreground">
                    Belum ada kategori. Tambahkan kategori pertamamu.
                  </td>
                </tr>
              ) : (
                data.map((category) => (
                  <tr key={category.ID} className="border-t">
                    <td className="px-6 py-3.5 font-medium">{category.Name}</td>
                    <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">
                      {category.Slug}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <CategoryFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
