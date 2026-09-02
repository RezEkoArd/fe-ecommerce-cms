"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryFormDialog } from "./category-form-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useCategories, useDeleteCategory } from "../hooks/use-categories";
import { useConfirm } from "@/lib/use-confirm";
import type { Category } from "@/types/api";

export function CategoryTable() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>();
  const [tableBody] = useAutoAnimate<HTMLTableSectionElement>();

  const { data, isLoading, isError } = useCategories();
  const remove = useDeleteCategory();
  const confirmDelete = useConfirm<Category>();

  function openCreate() {
    setEditing(undefined);
    setDialogOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setDialogOpen(true);
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Kelompokkan produk ke dalam kategori.
        </p>
        <Button onClick={openCreate}>
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
                <th className="px-6 py-3.5 text-right font-normal">Produk</th>
                <th className="px-6 py-3.5 text-right font-normal">Aksi</th>
              </tr>
            </thead>
            <tbody ref={tableBody}>
              {isLoading ? (
                [0, 1, 2].map((i) => (
                  <tr key={i} className="border-t">
                    <td colSpan={4} className="px-6 py-4">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr className="border-t">
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                    Gagal memuat kategori. Coba muat ulang halaman.
                  </td>
                </tr>
              ) : !data?.length ? (
                <tr className="border-t">
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                    Belum ada kategori. Tambahkan kategori pertamamu.
                  </td>
                </tr>
              ) : (
                data.map((category) => {
                  const inUse = (category.ProductCount ?? 0) > 0;
                  return (
                    <tr key={category.ID} className="border-t">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          {category.ImageURL ? (
                            <div className="relative size-9 shrink-0 overflow-hidden rounded-md border">
                              <Image
                                src={category.ImageURL}
                                alt=""
                                fill
                                sizes="36px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="size-9 shrink-0 overflow-hidden rounded-md border">
                              <ImagePlaceholder size="sm" />
                            </div>
                          )}
                          <span className="font-medium">{category.Name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">
                        {category.Slug}
                      </td>
                      <td className="px-6 py-3.5 text-right tabular-nums text-muted-foreground">
                        {category.ProductCount ?? 0}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEdit(category)}
                            aria-label={`Edit kategori ${category.Name}`}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => confirmDelete.ask(category)}
                            // Backend menolak hapus kategori yang masih dipakai;
                            // tombol dinonaktifkan agar admin tahu lebih awal.
                            disabled={inUse || remove.isPending}
                            title={
                              inUse
                                ? "Masih dipakai produk — pindahkan produknya dulu"
                                : undefined
                            }
                            aria-label={`Hapus kategori ${category.Name}`}
                            className="text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* key memaksa form dibuat ulang saat kategori berganti,
          supaya defaultValues ikut tersegarkan. */}
      <CategoryFormDialog
        key={editing?.ID ?? "new"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editing}
      />

      <ConfirmDialog
        open={confirmDelete.isOpen}
        onOpenChange={confirmDelete.setOpen}
        title="Hapus kategori?"
        description={
          <>
            Kategori <strong>{confirmDelete.target?.Name}</strong> akan dihapus
            permanen. Tindakan ini tidak bisa dibatalkan.
          </>
        }
        confirmLabel="Hapus"
        variant="destructive"
        isPending={remove.isPending}
        onConfirm={() => {
          if (!confirmDelete.target) return;
          remove.mutate(confirmDelete.target.ID, {
            onSuccess: () => confirmDelete.close(),
          });
        }}
      />
    </>
  );
}
