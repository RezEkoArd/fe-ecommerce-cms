import { ListParams } from "@/types/api";

export type ProductParams = ListParams & {
    search?: string;
    category_id?: string;
}

