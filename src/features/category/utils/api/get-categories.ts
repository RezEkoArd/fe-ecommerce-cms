import { apiClient } from "@/lib/api-client";
import type { Category } from "@/types/api";

export async function getCategories(): Promise<Category[]> {
  return apiClient.get("/categories");
}
