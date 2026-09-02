import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ImagePlaceholderProps = {
  className?: string;
  /** Ukuran ikon mengikuti besar wadah — "sm" untuk thumbnail tabel. */
  size?: "sm" | "md" | "lg";
  label?: string;
};

/**
 * Ditampilkan saat produk belum punya gambar. Dipakai bersama tabel admin,
 * kartu katalog, dan galeri detail supaya tampilannya konsisten.
 */
export function ImagePlaceholder({
  className,
  size = "md",
  label,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2 bg-secondary text-muted-foreground",
        className,
      )}
    >
      <ImageIcon
        className={cn(
          size === "sm" && "size-4",
          size === "md" && "size-7",
          size === "lg" && "size-10",
        )}
        // Dekorasi — teks label sudah menjelaskan maksudnya.
        aria-hidden
      />
      {label && <span className="text-xs">{label}</span>}
    </div>
  );
}
