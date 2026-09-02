"use client";

import { useState } from "react";
import Image from "next/image";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductFormDialog } from "./product-form-dialog";
import { useDeleteProduct, useProducts } from "../hooks/use-products";
import { useDebounced } from "@/lib/use-debounced";
import { formatRupiah } from "@/lib/utils";
import type { Product, ProductImage } from "@/types/api";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useConfirm } from "@/lib/use-confirm";


const LOW_STOCK_THRESHOLD = 6;
const PAGE_SIZE = 20;

export function ProductTable() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>();
  const [tableBody] = useAutoAnimate<HTMLTableSectionElement>();

  const debouncedSearch = useDebounced(search, 350);
  const confirmDelete = useConfirm<Product>();

  const { data, isLoading, isError } = useProducts({
    limit: PAGE_SIZE,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  });
  const remove = useDeleteProduct();

  function openCreate() {
    setEditing(undefined);
    setDialogOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setDialogOpen(true);
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk…"
          className="max-w-70 bg-card"
        />
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Tambah Produk
        </Button>
      </div>

      <Card className="gap-0 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary text-left text-xs uppercase tracking-[0.04em] text-muted-foreground">
                <th className="px-6 py-3.5 font-normal">Produk</th>
                <th className="px-6 py-3.5 font-normal">Kategori</th>
                <th className="px-6 py-3.5 text-right font-normal">Harga</th>
                <th className="px-6 py-3.5 text-right font-normal">Stok</th>
                <th className="px-6 py-3.5 text-right font-normal">Aksi</th>
              </tr>
            </thead>
            <tbody ref={tableBody}>
              {isLoading ? (
                [0, 1, 2].map((i) => (
                  <tr key={i} className="border-t">
                    <td colSpan={5} className="px-6 py-4">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr className="border-t">
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    Gagal memuat produk. Coba muat ulang halaman.
                  </td>
                </tr>
              ) : !data?.items.length ? (
                <tr className="border-t">
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    {debouncedSearch
                      ? `Tidak ada produk cocok dengan "${debouncedSearch}".`
                      : "Belum ada produk. Tambahkan produk pertamamu."}
                  </td>
                </tr>
              ) : (
                data.items.map((product) => (
                  <tr key={product.ID} className="border-t">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <ProductThumbnail
                          images={product.Images}
                          alt={product.Name}
                        />
                        <div className="min-w-0">
                          <div className="font-medium">{product.Name}</div>
                          <div className="text-xs text-muted-foreground">
                            {product.Slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground">
                      {product.Category?.Name ?? "—"}
                    </td>
                    <td className="px-6 py-3.5 text-right tabular-nums">
                      {formatRupiah(product.Price)}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {product.Stock < LOW_STOCK_THRESHOLD ? (
                        <Badge className="bg-accent/10 text-accent tabular-nums">
                          {product.Stock}
                        </Badge>
                      ) : (
                        <span className="tabular-nums">{product.Stock}</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEdit(product)}
                          aria-label={`Edit ${product.Name}`}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => confirmDelete.ask(product)}
                          aria-label={`Hapus ${product.Name}`}
                          className="text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!!data?.total && (
          <div className="border-t px-6 py-3 text-xs text-muted-foreground">
            Menampilkan {data.items.length} dari {data.total} produk
          </div>
        )}
      </Card>

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editing}
      />

      <ConfirmDialog
  open={confirmDelete.isOpen}
  onOpenChange={confirmDelete.setOpen}
  title="Hapus produk?"
  description={
    <>
      Produk <strong>{confirmDelete.target?.Name}</strong> akan dihapus
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

/** Thumbnail produk — gambar utama, atau kotak kosong kalau belum ada. */
function ProductThumbnail({
  images,
  alt,
}: {
  images: ProductImage[] | null;
  alt: string;
}) {
  const primary = images?.find((img) => img.IsPrimary) ?? images?.[0];

  if (!primary) {
    return (
      <div className="size-10 shrink-0 overflow-hidden rounded border">
        <ImagePlaceholder size="sm" />
      </div>
    );
  }

  return (
    <div className="relative size-10 shrink-0 overflow-hidden rounded border bg-muted">
      <Image src={primary.URL} alt={alt} fill sizes="40px" className="object-cover" />
    </div>
  );
}
