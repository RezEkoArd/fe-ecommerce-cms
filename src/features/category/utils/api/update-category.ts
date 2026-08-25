import { apiClient } from "@/lib/api-client";
import type { CategoryInput } from "../../schema/category-schema";
import type { Category } from "@/types/api";

export async function updateCategory(
    id: string,
    input: CategoryInput,
): Promise<Category> {
    return apiClient.put(`/categories/${id}`, input);
}
