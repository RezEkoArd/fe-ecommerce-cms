import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Backend mengirim harga sebagai string (tipe decimal di DB),
// jadi konversi dulu sebelum diformat.
export function formatRupiah(value: string | number) {
  const amount = typeof value === "string" ? Number(value) : value
  if (Number.isNaN(amount)) return "—"

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}
