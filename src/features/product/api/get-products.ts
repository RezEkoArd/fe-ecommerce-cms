import { apiClient } from "@/lib/api-client";
import type { ListParams, Paginated, Product } from "@/types/api";

export async function getProducts(
  params: ListParams = {},
): Promise<Paginated<Product>> {
  return apiClient.get("/products", { params });
}
