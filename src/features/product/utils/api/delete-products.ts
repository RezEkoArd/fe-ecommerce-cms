import { apiClient } from "@/lib/api-client";

export async function deleteProduct(id: string): Promise<null> {
    return apiClient.delete(`/products/${id}`);
}