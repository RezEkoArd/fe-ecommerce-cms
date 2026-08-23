import { OrderStatus } from "../types/api";

// Dipakai bersama tabel dan modal detail — satu sumber label & warna status.
export const STATUS_META: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  paid: { label: "Dibayar", className: "bg-primary/10 text-primary" },
  shipped: { label: "Dikirim", className: "bg-accent/10 text-accent" },
  completed: { label: "Selesai", className: "bg-success/12 text-success" },
  cancelled: {
    label: "Dibatalkan",
    className: "bg-destructive/10 text-destructive",
  },
};
