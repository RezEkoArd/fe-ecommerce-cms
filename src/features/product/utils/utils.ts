// Backend menerima price sebagai string, dan category_id kosong

import { ProductOutput } from "../schema/product-schema";

// harus dihilangkan — binding `omitempty,uuid` menolak string kosong.
export function toPayload(input: ProductOutput) {
    return {
        name: input.name,
        description: input.description || "",
        price: String(input.price),
        stock: input.stock,
        ...(input.category_id ? { category_id: input.category_id} : {}),
    };
}