import { apiClient } from "@/lib/api-client";
import type { Cart } from "../../types/api";

export async function getCart(): Promise<Cart> {
  return apiClient.get("/cart");
}
