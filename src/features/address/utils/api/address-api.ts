import { apiClient } from "@/lib/api-client";
import type { AddressInput } from "../../schema/address-schema";
import type { Address } from "../../types/api";

export async function getAddresses(): Promise<Address[]> {
    return apiClient.get("/addresses");
}

export async function createAddress(input: AddressInput): Promise<Address> {
    return apiClient.post("/addresses", input);
}

export async function updateAddress(
    id: string,
    input: AddressInput,
): Promise<Address> {
    return apiClient.put(`/addresses/${id}`, input);
}

export async function deleteAddress(id: string): Promise<null> {
    return apiClient.delete(`/addresses/${id}`);
}

export async function setPrimaryAddress(id: string): Promise<null> {
    return apiClient.put(`/addresses/${id}/primary`);
}
