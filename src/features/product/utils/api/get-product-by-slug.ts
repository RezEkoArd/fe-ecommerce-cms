import { apiClient } from "@/lib/api-client";
import type { Product } from "@/types/api";

// Endpoint publik — tidak butuh token.
export async function getProductBySlug(slug: string): Promise<Product> {
    return apiClient.get(`/products/${slug}`);
}
