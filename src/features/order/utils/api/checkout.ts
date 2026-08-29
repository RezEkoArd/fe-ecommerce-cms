import { apiClient } from "@/lib/api-client";
import type { Order } from "../../types/api";

export async function checkout(couponCode?: string): Promise<Order> {
  // Backend menghitung ulang subtotal, diskon, dan total dari isi keranjang.
  return apiClient.post("/orders", {
    ...(couponCode ? { coupon_code: couponCode } : {}),
  });
}
