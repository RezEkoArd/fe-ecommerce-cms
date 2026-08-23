import { apiClient } from "@/lib/api-client";

export async function deleteCoupon(id: string): Promise<null> {
    return apiClient.delete(`/coupons/${id}`);
}
