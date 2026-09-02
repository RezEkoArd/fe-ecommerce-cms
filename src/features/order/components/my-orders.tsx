"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyOrders } from "../hooks/use-order";
import { STATUS_META } from "../utils/status";
import { formatRupiah } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export function MyOrders() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isError } = useMyOrders();

  if (!user) {
    return (
      <div className="py-20 text-center">
        <p className="mb-6 text-muted-foreground">
          Masuk untuk melihat riwayat pesananmu.
        </p>
        <Button render={<Link href="/masuk?redirect=/pesanan" />} nativeButton={false}>Masuk</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-20 text-center text-sm text-muted-foreground">
        Gagal memuat pesanan. Coba muat ulang halaman.
      </p>
    );
  }

  if (!data?.length) {
    return (
      <div className="py-20 text-center">
        <div className="mb-4 text-4xl text-primary opacity-40">空</div>
        <h2 className="mb-2 text-lg font-medium">Belum ada pesanan</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Pesanan yang kamu buat akan muncul di sini.
        </p>
        <Button render={<Link href="/produk" />} nativeButton={false}>Mulai belanja</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {data.map((order) => {
        const meta = STATUS_META[order.Status];

        return (
          <Card key={order.ID} className="gap-0 p-6.5">
            <div className="mb-4.5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-1 font-mono text-[15px] font-bold">
                  {order.ID.slice(0, 8)}
                </div>
                <div className="text-[13px] text-muted-foreground">
                  {formatDate(order.CreatedAt)}
                </div>
              </div>
              <Badge className={meta.className}>{meta.label}</Badge>
            </div>

            {!!order.Items?.length && (
              <div className="mb-4 grid gap-1.5 border-b pb-4">
                {order.Items.map((item) => (
                  <div
                    key={item.ID}
                    className="flex justify-between text-[13px]"
                  >
                    <span className="text-muted-foreground">
                      {item.ProductName} × {item.Quantity}
                    </span>
                    <span className="tabular-nums">
                      {formatRupiah(Number(item.Price) * item.Quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {order.Shipping?.Recipient && (
              <div className="mb-4 border-b pb-4 text-[13px] text-muted-foreground">
                <div className="mb-0.5 font-medium text-foreground">
                  Dikirim ke
                </div>
                <div>
                  {order.Shipping.Recipient} · {order.Shipping.Phone}
                </div>
                <div>
                  {order.Shipping.Street}, {order.Shipping.City}{" "}
                  {order.Shipping.PostalCode}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {formatRupiah(order.Total)}
                </span>
              </span>
              {Number(order.Discount) > 0 && (
                <span className="text-[13px] text-accent">
                  Hemat {formatRupiah(order.Discount)}
                </span>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
