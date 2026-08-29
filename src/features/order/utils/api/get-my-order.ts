import { apiClient } from "@/lib/api-client";
import type { Order } from "../../types/api";

export async function getMyOrders(): Promise<Order[]> {
  return apiClient.get("/orders");
}
