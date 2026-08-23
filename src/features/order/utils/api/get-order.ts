import { apiClient } from "@/lib/api-client";
import { Order } from "../../types/api";

export async function getOrder(id: string): Promise<Order> {
    return apiClient.get(`/admin/orders/${id}`);
}
