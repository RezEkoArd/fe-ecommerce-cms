import type { Cart } from "../types/api";

export function calculateCartTotal(cart: Cart | undefined) {
  const items = cart?.Items ?? [];

  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.Product?.Price ?? 0);
    return sum + price * item.Quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.Quantity, 0);

  // Backend menghitung ulang total saat checkout — ini hanya untuk tampilan.
  return { subtotal, itemCount, total: subtotal };
}
