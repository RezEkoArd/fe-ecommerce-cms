"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusSelect } from "./order-status-select";
import { OrderDetailDialog } from "./order-detail-dialog";
import { formatRupiah } from "@/lib/utils";
import { STATUS_META } from "../utils/status";
import { useOrders } from "../hooks/use-order";

export function OrderTable() {
  const [detailId, setDetailId] = useState<string | undefined>();
  const [tableBody] = useAutoAnimate<HTMLTableSectionElement>();
  const { data, isLoading, isError } = useOrders();

  return (
    <>
      <Card className="gap-0 overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary text-left text-xs uppercase tracking-[0.04em] text-muted-foreground">
              <th className="px-6 py-3.5 font-normal">Pesanan</th>
              <th className="px-6 py-3.5 font-normal">Tanggal</th>
              <th className="px-6 py-3.5 text-right font-normal">Total</th>
              <th className="px-6 py-3.5 font-normal">Status</th>
              <th className="px-6 py-3.5 text-right font-normal">Ubah</th>
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
                  Gagal memuat pesanan. Coba muat ulang halaman.
                </td>
              </tr>
            ) : !data?.length ? (
              <tr className="border-t">
                <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                  Belum ada pesanan masuk.
                </td>
              </tr>
            ) : (
              data.map((order) => {
                const meta = STATUS_META[order.Status];
                return (
                  <tr
                    key={order.ID}
                    onClick={() => setDetailId(order.ID)}
                    className="cursor-pointer border-t transition-colors hover:bg-muted/50"
                  >
                    <td className="px-6 py-3.5">
                      <div className="font-mono text-xs font-medium">
                        {order.ID.slice(0, 8)}
                      </div>
                      {Number(order.Discount) > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Diskon {formatRupiah(order.Discount)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground">
                      {formatDate(order.CreatedAt)}
                    </td>
                    <td className="px-6 py-3.5 text-right font-medium tabular-nums">
                      {formatRupiah(order.Total)}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge className={meta.className}>{meta.label}</Badge>
                    </td>
                    {/* stopPropagation supaya mengubah status tidak ikut
                        membuka modal detail milik baris. */}
                    <td
                      className="px-6 py-3.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-end">
                        <OrderStatusSelect
                          orderId={order.ID}
                          status={order.Status}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!!data?.length && (
        <div className="border-t px-6 py-3 text-xs text-muted-foreground">
          {data.length} pesanan
        </div>
      )}
      </Card>

      <OrderDetailDialog
        open={!!detailId}
        onOpenChange={(open) => !open && setDetailId(undefined)}
        orderId={detailId}
      />
    </>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
