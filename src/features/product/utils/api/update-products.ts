import { apiClient } from "@/lib/api-client";
import { Product } from "@/types/api";
import { ProductOutput } from "../../schema/product-schema";
import { toPayload } from "../utils";


export async function updateProduct(
    id: string,
    input: ProductOutput,
): Promise<Product> {
    return apiClient.put(`/products/${id}`, toPayload(input))
}