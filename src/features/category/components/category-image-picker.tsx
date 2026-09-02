"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/api-client";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_CATEGORY_IMAGE_SIZE,
  uploadCategoryImage,
} from "../utils/api/upload-category-image";

type CategoryImagePickerProps = {
  value: string;
  onChange: (url: string) => void;
};

export function CategoryImagePicker({
  value,
  onChange,
}: CategoryImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Format harus JPG, PNG, atau WebP");
      return;
    }
    if (file.size > MAX_CATEGORY_IMAGE_SIZE) {
      toast.error("Ukuran gambar maksimal 2 MB");
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadCategoryImage(file);
      onChange(url);
      toast.success("Gambar berhasil diunggah");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploading(false);
      // Reset supaya file yang sama bisa dipilih ulang setelah dihapus.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-start gap-4">
      {value ? (
        <div className="relative size-24 shrink-0 overflow-hidden rounded-md border">
          <Image
            src={value}
            alt=""
            fill
            sizes="96px"
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Hapus gambar"
            className="absolute right-1 top-1 rounded bg-destructive/90 p-1 text-destructive-foreground"
          >
            <X className="size-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex size-24 shrink-0 flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed text-muted-foreground transition-colors hover:border-ring hover:text-foreground disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              <ImagePlus className="size-5" />
              <span className="text-[11px]">Unggah</span>
            </>
          )}
        </button>
      )}

      <p className="pt-1 text-xs text-muted-foreground">
        Opsional. JPG, PNG, atau WebP, maksimal 2 MB. Tampil di kartu kategori
        storefront.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
