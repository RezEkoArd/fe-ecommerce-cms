import { apiClient } from "@/lib/api-client";
import type { Profile } from "../../types/api";

export async function getProfile(): Promise<Profile> {
    return apiClient.get("/me");
}
