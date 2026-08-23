"use client"

import { useForm } from "react-hook-form";
import { useCreateCoupon, useUpdateCoupon } from "../hooks/use-coupons";
import { Coupon } from "../types/api";
import { CouponInput, CouponOutput, couponSchema } from "../schema/coupon-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";



type CouponFormDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Diisi untuk mode edit; kosong berarti tambah baru. */
    coupon?: Coupon;
};

export function CouponFormDialog({
    open,
    onOpenChange,
    coupon,
}: CouponFormDialogProps) {
    const isEdit = !!coupon;
    const create = useCreateCoupon();
    const update = useUpdateCoupon(coupon?.ID ?? "");
    const { mutate, isPending } = isEdit ? update : create;

    const form = useForm<CouponInput, unknown, CouponOutput>({
        resolver: zodResolver(couponSchema),
        defaultValues: {
            code: coupon?.Code ?? "",
            discount_type: coupon?.DiscountType ?? "percent",
            discount_value: coupon ? Number(coupon.DiscountValue) : 0,
            // Input type="date" butuh format YYYY-MM-DD, bukan ISO penuh.
            expires_at: coupon?.ExpiresAt ? coupon.ExpiresAt.slice(0, 10) : "",
            is_active: coupon?.IsActive ?? true,
        },
    });

    const discountType = form.watch("discount_type");

    function handleSubmit(values: CouponOutput) {
        mutate(values, {
        onSuccess: () => {
            form.reset();
            onOpenChange(false);
        },
        });
    }

    return (
            <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Kupon" : "Tambah Kupon"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui detail kupon."
              : "Kupon dipakai pelanggan saat checkout."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode kupon</FormLabel>
                  <FormControl>
                    <Input placeholder="DISKON10" className="uppercase" {...field} />
                  </FormControl>
                  <FormDescription>
                    Otomatis disimpan sebagai huruf kapital.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="discount_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis diskon</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <option value="percent">Persentase (%)</option>
                        <option value="fixed">Nominal (Rp)</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {discountType === "percent" ? "Diskon (%)" : "Diskon (Rp)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={discountType === "percent" ? 1 : 1000}
                        {...field}
                        value={String(field.value ?? "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="expires_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Berlaku sampai</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Kosongkan jika kupon tidak punya masa berlaku.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2.5">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="mt-0!">Aktifkan kupon</FormLabel>
                </FormItem>
              )}
            />

            <div className="mt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan…" : isEdit ? "Simpan" : "Tambah"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    )
}