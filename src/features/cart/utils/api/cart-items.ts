import { apiClient } from "@/lib/api-client";
import type { CartItem } from "../../types/api";

export async function addCartItem(
  productId: string,
  quantity: number,
): Promise<CartItem> {
  return apiClient.post("/cart/items", {
    product_id: productId,
    quantity,
  });
}

// Perhatikan: endpoint memakai productId, bukan id cart item.
export async function updateCartItem(
  productId: string,
  quantity: number,
): Promise<CartItem> {
  return apiClient.put(`/cart/items/${productId}`, { quantity });
}

export async function removeCartItem(productId: string): Promise<null> {
  return apiClient.delete(`/cart/items/${productId}`);
}
