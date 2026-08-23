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
import { Switch } from "@/components/ui/switch";
import { useCoupon, useToggleCouponActive } from "../hooks/use-coupons";
import { formatRupiah } from "@/lib/utils";

type CouponDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  couponId: string | undefined;
};

export function CouponDetailDialog({
  open,
  onOpenChange,
  couponId,
}: CouponDetailDialogProps) {
  const { data: coupon, isLoading, isError } = useCoupon(couponId);
  const toggle = useToggleCouponActive();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detail Kupon</DialogTitle>
          <DialogDescription>
            Informasi lengkap dan status kupon.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="grid gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : isError || !coupon ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Gagal memuat detail kupon.
          </p>
        ) : (
          <div className="grid gap-4">
            <Row label="Kode">
              <span className="font-mono font-medium">{coupon.Code}</span>
            </Row>

            <Row label="Jenis diskon">
              {coupon.DiscountType === "percent" ? "Persentase" : "Nominal"}
            </Row>

            <Row label="Nilai diskon">
              <span className="tabular-nums">
                {coupon.DiscountType === "percent"
                  ? `${coupon.DiscountValue}%`
                  : formatRupiah(coupon.DiscountValue)}
              </span>
            </Row>

            <Row label="Berlaku sampai">
              {coupon.ExpiresAt ? formatDate(coupon.ExpiresAt) : "Tanpa batas"}
            </Row>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <div className="text-sm font-medium">Status kupon</div>
                <div className="text-xs text-muted-foreground">
                  {coupon.IsActive
                    ? "Bisa dipakai pelanggan saat checkout."
                    : "Tidak bisa dipakai pelanggan."}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  className={
                    coupon.IsActive
                      ? "bg-success/12 text-success"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {coupon.IsActive ? "Aktif" : "Nonaktif"}
                </Badge>
                <Switch
                  checked={coupon.IsActive}
                  disabled={toggle.isPending}
                  onCheckedChange={(checked) =>
                    toggle.mutate({ id: coupon.ID, isActive: checked })
                  }
                  aria-label="Aktifkan kupon"
                />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
