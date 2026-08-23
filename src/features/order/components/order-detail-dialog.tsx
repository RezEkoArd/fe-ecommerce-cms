"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusSelect } from "./order-status-select";
import { useOrder } from "../hooks/use-order";
import { STATUS_META } from "../utils/status";
import { formatRupiah } from "@/lib/utils";

type OrderDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string | undefined;
};

export function OrderDetailDialog({
  open,
  onOpenChange,
  orderId,
}: OrderDetailDialogProps) {
  const { data: order, isLoading, isError } = useOrder(orderId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Detail Pesanan</DialogTitle>
          <DialogDescription>
            {order ? (
              <span className="font-mono">{order.ID.slice(0, 8)}</span>
            ) : (
              "Informasi lengkap pesanan."
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="grid gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : isError || !order ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Gagal memuat detail pesanan.
          </p>
        ) : (
          <div className="grid gap-6">
            {/* Status + pengubahnya */}
            <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <div>
                <div className="mb-1.5 text-xs text-muted-foreground">
                  Status pesanan
                </div>
                <Badge className={STATUS_META[order.Status].className}>
                  {STATUS_META[order.Status].label}
                </Badge>
              </div>
              <OrderStatusSelect orderId={order.ID} status={order.Status} />
            </div>

            {/* Pemesan */}
            <Section title="Pemesan">
              {order.User ? (
                <div className="grid gap-1.5">
                  <Row label="Nama">{order.User.Name}</Row>
                  <Row label="Email">{order.User.Email}</Row>
                  <Row label="ID User">
                    <span className="font-mono text-xs">
                      {order.User.ID.slice(0, 8)}
                    </span>
                  </Row>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Data pemesan tidak tersedia.
                </p>
              )}
            </Section>

            {/* Item pesanan */}
            <Section title={`Item (${order.Items?.length ?? 0})`}>
              {!order.Items?.length ? (
                <p className="text-sm text-muted-foreground">
                  Tidak ada item pada pesanan ini.
                </p>
              ) : (
                <div className="grid gap-3">
                  {order.Items.map((item) => (
                    <div
                      key={item.ID}
                      className="flex items-start justify-between gap-4 border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium">
                          {item.ProductName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.Quantity} × {formatRupiah(item.Price)}
                        </div>
                      </div>
                      <div className="shrink-0 text-sm font-medium tabular-nums">
                        {formatRupiah(
                          Number(item.Price) * item.Quantity,
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Rincian biaya */}
            <Section title="Rincian">
              <div className="grid gap-2">
                <Row label="Subtotal">
                  <span className="tabular-nums">
                    {formatRupiah(order.Subtotal)}
                  </span>
                </Row>

                {Number(order.Discount) > 0 && (
                  <Row
                    label={
                      order.Coupon
                        ? `Diskon (${order.Coupon.Code})`
                        : "Diskon"
                    }
                  >
                    <span className="tabular-nums text-accent">
                      −{formatRupiah(order.Discount)}
                    </span>
                  </Row>
                )}

                {Number(order.Tax) > 0 && (
                  <Row label="Pajak">
                    <span className="tabular-nums">
                      {formatRupiah(order.Tax)}
                    </span>
                  </Row>
                )}

                <div className="mt-1 flex items-baseline justify-between border-t pt-3">
                  <span className="font-medium">Total</span>
                  <span className="text-base font-bold tabular-nums">
                    {formatRupiah(order.Total)}
                  </span>
                </div>
              </div>
            </Section>

            {/* Waktu */}
            <Section title="Waktu">
              <div className="grid gap-1.5">
                <Row label="Dibuat">{formatDateTime(order.CreatedAt)}</Row>
                <Row label="Diperbarui">{formatDateTime(order.UpdatedAt)}</Row>
              </div>
            </Section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2.5 text-xs uppercase tracking-[0.06em] text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
