"use client";

import Link from "next/link";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "../hooks/use-cart";
import { calculateCartTotal } from "../utils/cart-total";
import { formatRupiah } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export function CartList() {
  const user = useAuthStore((s) => s.user);
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const [listRef] = useAutoAnimate<HTMLDivElement>();

  if (!user) {
    return (
      <EmptyState
        title="Masuk untuk melihat keranjang"
        message="Keranjang tersimpan di akunmu."
        actionHref="/masuk?redirect=/keranjang"
        actionLabel="Masuk"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-5">
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }

  const items = cart?.Items ?? [];

  if (!items.length) {
    return (
      <EmptyState
        title="Keranjang masih kosong"
        message="Belum ada produk yang ditambahkan."
        actionHref="/produk"
        actionLabel="Mulai belanja"
      />
    );
  }

  const { subtotal } = calculateCartTotal(cart);

  return (
    <div className="grid gap-14 lg:grid-cols-[1fr_340px]">
      <div ref={listRef}>
        {items.map((item) => {
          const price = Number(item.Product?.Price ?? 0);
          const stock = item.Product?.Stock ?? 0;

          return (
            <div
              key={item.ID}
              className="flex items-center gap-5 border-b py-5.5"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1 font-medium">
                  {item.Product?.Name ?? "Produk tidak tersedia"}
                </div>
                <div className="mb-2 text-[13px] text-muted-foreground">
                  {formatRupiah(price)}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem.mutate(item.ProductID)}
                  disabled={removeItem.isPending}
                  className="inline-flex items-center gap-1.5 text-[13px] text-destructive hover:underline disabled:opacity-50"
                >
                  <Trash2 className="size-3.5" />
                  Hapus
                </button>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="font-medium tabular-nums">
                  {formatRupiah(price * item.Quantity)}
                </div>
                <div className="flex items-center rounded-lg border">
                  <button
                    type="button"
                    onClick={() =>
                      updateItem.mutate({
                        productId: item.ProductID,
                        quantity: item.Quantity - 1,
                      })
                    }
                    disabled={item.Quantity <= 1 || updateItem.isPending}
                    aria-label="Kurangi jumlah"
                    className="flex size-9 items-center justify-center text-muted-foreground disabled:opacity-40"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm tabular-nums">
                    {item.Quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateItem.mutate({
                        productId: item.ProductID,
                        quantity: item.Quantity + 1,
                      })
                    }
                    disabled={item.Quantity >= stock || updateItem.isPending}
                    aria-label="Tambah jumlah"
                    className="flex size-9 items-center justify-center text-muted-foreground disabled:opacity-40"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <Link
          href="/produk"
          className="mt-6 inline-block text-sm text-primary hover:underline"
        >
          ← Lanjut belanja
        </Link>
      </div>

      <aside className="h-fit rounded-xl border bg-card p-7 lg:sticky lg:top-24">
        <h2 className="mb-5.5 text-[17px] font-bold">Ringkasan</h2>
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
        {/* <Button asChild className="h-11 w-full">
          <Link href="/checkout">Lanjut ke Checkout</Link>
        </Button> */}
        <Button render={<Link href="/checkout" />} nativeButton={false} className="h-11 w-full">
          Lanjut ke Checkout
        </Button>
      </aside>
    </div>
  );
}

function EmptyState({
  title,
  message,
  actionHref,
  actionLabel,
}: {
  title: string;
  message: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="py-20 text-center">
      <div className="mb-4 text-4xl text-primary opacity-40">空</div>
      <h2 className="mb-2 text-lg font-medium">{title}</h2>
      <p className="mb-6 text-sm text-muted-foreground">{message}</p>
      {/* <Button asChild>
        <Link href={actionHref}>{actionLabel}</Link>
      </Button> */}
      <Button render={<Link href={actionHref} />} nativeButton={false}>{actionLabel}</Button>
    </div>
  );
}
