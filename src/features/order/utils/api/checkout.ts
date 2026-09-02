import { apiClient } from "@/lib/api-client";
import type { Order } from "../../types/api";

export async function checkout(
  addressId: string,
  couponCode?: string,
): Promise<Order> {
  // Backend menghitung ulang subtotal, diskon, dan total dari isi keranjang,
  // lalu menyalin alamat ke pesanan sebagai snapshot.
  return apiClient.post("/orders", {
    address_id: addressId,
    ...(couponCode ? { coupon_code: couponCode } : {}),
  });
}
