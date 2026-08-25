import { apiClient } from "@/lib/api-client";

export async function deleteCategory(id: string): Promise<null> {
    return apiClient.delete(`/categories/${id}`);
}
