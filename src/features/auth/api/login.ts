import { apiClient } from "@/lib/api-client";
import { LoginInput } from "../schema/login-schema";

export type LoginResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export async function login(payload: LoginInput): Promise<LoginResponse> {
    return apiClient.post("/auth/login", payload);
} 