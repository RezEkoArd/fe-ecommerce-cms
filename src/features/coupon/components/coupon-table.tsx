"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";
import { useCoupons, useDeleteCoupon } from "../hooks/use-coupons";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CouponFormDialog } from "./coupon-form-dialog";
import { CouponDetailDialog } from "./coupon-detail-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Coupon } from "../types/api";
import { useConfirm } from "@/lib/use-confirm";
import { formatRupiah } from "@/lib/utils";

export function CouponTable() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | undefined>();
  const [detailId, setDetailId] = useState<string | undefined>();
  const [tableBody] = useAutoAnimate<HTMLTableSectionElement>();

  const { data, isLoading, isError } = useCoupons();
  const remove = useDeleteCoupon();
  const confirmDelete = useConfirm<Coupon>();

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(coupon: Coupon) {
    setEditing(coupon);
    setFormOpen(true);
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Kupon potongan harga untuk pelanggan.
        </p>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Tambah Kupon
        </Button>
      </div>

      <Card className="gap-0 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary text-left text-xs uppercase tracking-[0.04em] text-muted-foreground">
                <th className="px-6 py-3.5 font-normal">Kode</th>
                <th className="px-6 py-3.5 font-normal">Diskon</th>
                <th className="px-6 py-3.5 font-normal">Berlaku sampai</th>
                <th className="px-6 py-3.5 text-right font-normal">Status</th>
                <th className="px-6 py-3.5 text-right font-normal">Aksi</th>
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
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Gagal memuat kupon. Coba muat ulang halaman.
                  </td>
                </tr>
              ) : !data?.length ? (
                <tr className="border-t">
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Belum ada kupon. Tambahkan kupon pertamamu.
                  </td>
                </tr>
              ) : (
                data.map((coupon) => (
                  <tr
                    key={coupon.ID}
                    onClick={() => setDetailId(coupon.ID)}
                    className="cursor-pointer border-t transition-colors hover:bg-muted/50"
                  >
                    <td className="px-6 py-3.5 font-mono font-medium">
                      {coupon.Code}
                    </td>
                    <td className="px-6 py-3.5 tabular-nums">
                      {formatDiscount(coupon)}
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground">
                      {formatExpiry(coupon.ExpiresAt)}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {coupon.IsActive ? (
                        <Badge className="bg-success/12 text-success">
                          Aktif
                        </Badge>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground">
                          Nonaktif
                        </Badge>
                      )}
                    </td>
                    {/* stopPropagation supaya klik tombol tidak ikut
                        membuka modal detail milik baris. */}
                    <td
                      className="px-6 py-3.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEdit(coupon)}
                          aria-label={`Edit kupon ${coupon.Code}`}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => confirmDelete.ask(coupon)}
                          aria-label={`Hapus kupon ${coupon.Code}`}
                          className="text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* key memaksa form dibuat ulang saat kupon berganti,
          supaya defaultValues ikut tersegarkan. */}
      <CouponFormDialog
        key={editing?.ID ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        coupon={editing}
      />

      <CouponDetailDialog
        open={!!detailId}
        onOpenChange={(open) => !open && setDetailId(undefined)}
        couponId={detailId}
      />

      <ConfirmDialog
        open={confirmDelete.isOpen}
        onOpenChange={confirmDelete.setOpen}
        title="Hapus kupon?"
        description={
          <>
            Kupon <strong>{confirmDelete.target?.Code}</strong> akan dihapus
            permanen. Tindakan ini tidak bisa dibatalkan.
          </>
        }
        confirmLabel="Hapus"
        variant="destructive"
        isPending={remove.isPending}
        onConfirm={() => {
          if (!confirmDelete.target) return;
          remove.mutate(confirmDelete.target.ID, {
            onSuccess: () => confirmDelete.close(),
          });
        }}
      />
    </>
  );
}

function formatDiscount(coupon: Coupon) {
  return coupon.DiscountType === "percent"
    ? `${coupon.DiscountValue}%`
    : formatRupiah(coupon.DiscountValue);
}

function formatExpiry(expiresAt: string | null) {
  if (!expiresAt) return "Tanpa batas";
  return new Date(expiresAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
