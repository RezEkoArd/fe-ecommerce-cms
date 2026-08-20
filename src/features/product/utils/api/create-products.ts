import { Product } from "@/types/api";
import { ProductOutput } from "../../schema/product-schema";
import { apiClient } from "@/lib/api-client";
import { toPayload } from "../utils";

export function createProduct(input: ProductOutput): Promise<Product> {
    return apiClient.post("/products", toPayload(input))
}

