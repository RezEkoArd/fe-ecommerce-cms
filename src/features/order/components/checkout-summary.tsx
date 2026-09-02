"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/features/cart/hooks/use-cart";
import { calculateCartTotal } from "@/features/cart/utils/cart-total";
import { useCheckout } from "../hooks/use-order";
import { CheckoutAddress } from "./checkout-address";
import { formatRupiah } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export function CheckoutSummary() {
  const [couponCode, setCouponCode] = useState("");
  const [addressId, setAddressId] = useState("");
  const user = useAuthStore((s) => s.user);
  const { data: cart, isLoading } = useCart();
  const { mutate: submitOrder, isPending } = useCheckout();

  if (!user) {
    return (
      <div className="py-20 text-center">
        <p className="mb-6 text-muted-foreground">
          Masuk terlebih dahulu untuk checkout.
        </p>
        <Button render={<Link href="/masuk?redirect=/checkout" />} nativeButton={false}>Masuk</Button>
      </div>
    );
  }

  if (isLoading) return <Skeleton className="h-96" />;

  const items = cart?.Items ?? [];

  if (!items.length) {
    return (
      <div className="py-20 text-center">
        <p className="mb-6 text-muted-foreground">Keranjang masih kosong.</p>
        <Button render={<Link href="/produk" />} nativeButton={false}>Mulai belanja</Button>
      </div>
    );
  }

  const { subtotal } = calculateCartTotal(cart);

  return (
    <div className="grid gap-14 lg:grid-cols-[1fr_340px]">
      <div className="grid gap-9">
        <section>
          <h2 className="mb-5 text-[15px] font-bold">Alamat Pengiriman</h2>
          <CheckoutAddress selectedId={addressId} onSelect={setAddressId} />
        </section>

        <section>
        <h2 className="mb-5 text-[15px] font-bold">Item Pesanan</h2>
        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item.ID}
              className="flex items-start justify-between gap-4 border-b pb-4"
            >
              <div>
                <div className="text-sm font-medium">
                  {item.Product?.Name ?? "Produk"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.Quantity} × {formatRupiah(item.Product?.Price ?? 0)}
                </div>
              </div>
              <div className="text-sm font-medium tabular-nums">
                {formatRupiah(Number(item.Product?.Price ?? 0) * item.Quantity)}
              </div>
            </div>
          ))}
        </div>
        </section>
      </div>

      <aside className="h-fit rounded-xl border bg-card p-7 lg:sticky lg:top-24">
        <h2 className="mb-5.5 text-[17px] font-bold">Ringkasan</h2>

        <div className="mb-5 grid gap-2">
          <label htmlFor="coupon" className="text-[13px] text-muted-foreground">
            Kode kupon (opsional)
          </label>
          <Input
            id="coupon"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="DISKON10"
            className="uppercase"
          />
        </div>

        <div className="mb-5 flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="tabular-nums">{formatRupiah(subtotal)}</span>
        </div>

        <div className="mb-6 flex justify-between border-t pt-4.5">
          <span className="font-bold">Total</span>
          <span className="text-lg font-bold tabular-nums">
            {formatRupiah(subtotal)}
          </span>
        </div>

        <p className="mb-5 text-xs text-muted-foreground">
          Diskon kupon dihitung saat pesanan dibuat.
        </p>

        <Button
          className="h-11 w-full"
          disabled={isPending || !addressId}
          onClick={() =>
            submitOrder({
              addressId,
              couponCode: couponCode || undefined,
            })
          }
        >
          {isPending ? "Memproses…" : "Buat Pesanan"}
        </Button>

        {!addressId && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Pilih alamat pengiriman terlebih dahulu.
          </p>
        )}
      </aside>
    </div>
  );
}
