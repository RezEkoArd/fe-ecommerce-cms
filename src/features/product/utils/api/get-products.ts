import { Paginated, Product } from "@/types/api";
import { apiClient } from "@/lib/api-client";
import { ProductParams } from "../../types/api";

export async function getProducts(
    params:  ProductParams = {},
): Promise<Paginated<Product>> {
    return apiClient.get("/products", { params })
}