import { apiClient } from "@/lib/api-client";
import { Order } from "../../types/api";

export async function getOrders(): Promise<Order[]> {
    return apiClient.get("/admin/orders");
}