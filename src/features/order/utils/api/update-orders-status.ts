import { apiClient } from "@/lib/api-client";
import { OrderStatus } from "../../types/api";

export async function updateOrderStatus(
    id: string,
    status: OrderStatus,
): Promise<null> {
    return apiClient.patch(`/admin/orders/${id}/status`, {status});
}

