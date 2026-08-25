"use client";

import { useRef } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Star, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  useDeleteProductImage,
  useUploadProductImage,
} from "../hooks/use-products";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
} from "../utils/api/upload-product-image";
import type { ProductImage } from "@/types/api";

const MAX_IMAGES = 5;

type ProductImageManagerProps = {
  productId: string;
  images: ProductImage[] | null;
};

export function ProductImageManager({
  productId,
  images,
}: ProductImageManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadProductImage(productId);
  const remove = useDeleteProductImage(productId);

  const list = images ?? [];
  const isFull = list.length >= MAX_IMAGES;

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    const slot = MAX_IMAGES - list.length;
    const selected = Array.from(files).slice(0, slot);

    if (files.length > slot) {
      toast.error(`Hanya ${slot} gambar lagi yang bisa ditambahkan`);
    }

    for (const file of selected) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error(`${file.name}: format harus JPG, PNG, atau WebP`);
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`${file.name}: ukuran maksimal 5 MB`);
        continue;
      }
      upload.mutate(file);
    }

    // Reset supaya file yang sama bisa dipilih ulang setelah dihapus.
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">Gambar produk</span>
        <span className="text-xs text-muted-foreground">
          {list.length}/{MAX_IMAGES}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {list.map((image) => (
          <div
            key={image.ID}
            className="group relative aspect-square overflow-hidden rounded-md border bg-muted"
          >
            <Image
              src={image.URL}
              alt=""
              fill
              sizes="(max-width: 640px) 33vw, 20vw"
              className="object-cover"
            />

            {image.IsPrimary && (
              <span
                title="Gambar utama"
                className="absolute left-1.5 top-1.5 rounded bg-primary/90 p-1 text-primary-foreground"
              >
                <Star className="size-3 fill-current" />
              </span>
            )}

            <button
              type="button"
              onClick={() => remove.mutate(image.ID)}
              disabled={remove.isPending}
              aria-label="Hapus gambar"
              className="absolute right-1.5 top-1.5 rounded bg-destructive/90 p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-50"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}

        {/* Slot unggah — hilang saat sudah 5 gambar. */}
        {!isFull && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={upload.isPending}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed text-muted-foreground transition-colors hover:border-ring hover:text-foreground disabled:opacity-50"
          >
            {upload.isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                <ImagePlus className="size-5" />
                <span className="text-[11px]">Tambah</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="text-xs text-muted-foreground">
        JPG, PNG, atau WebP. Maksimal 5 MB per gambar. Gambar pertama menjadi
        gambar utama.
      </p>
    </div>
  );
}

/** Placeholder saat produk belum tersimpan — gambar butuh ID produk. */
export function ProductImageManagerPlaceholder() {
  return (
    <div className="grid gap-2 rounded-md border border-dashed p-4 text-center">
      <span className="text-sm font-medium">Gambar produk</span>
      <p className="text-xs text-muted-foreground">
        Simpan produk terlebih dahulu, lalu buka kembali untuk menambahkan
        gambar.
      </p>
    </div>
  );
}
