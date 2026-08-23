"use client";

import { useUpdateOrderStatus } from "../hooks/use-order";
import type { OrderStatus } from "../types/api";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "paid", label: "Dibayar" },
  { value: "shipped", label: "Dikirim" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const { mutate, isPending } = useUpdateOrderStatus();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) =>
        mutate({ id: orderId, status: e.target.value as OrderStatus })
      }
      className="h-8 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
