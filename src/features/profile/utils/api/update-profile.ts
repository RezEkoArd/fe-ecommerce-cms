import { apiClient } from "@/lib/api-client";
import type { ProfileInput } from "../../schema/profile-schema";
import type { Profile } from "../../types/api";

export async function updateProfile(input: ProfileInput): Promise<Profile> {
    return apiClient.put("/me", input);
}
