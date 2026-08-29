import { apiClient } from "@/lib/api-client";
import type { RegisterInput } from "../schema/register-schema";

export type RegisterResponse = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
};

export async function register(input: RegisterInput): Promise<RegisterResponse> {
  // confirmPassword tidak dikirim — hanya untuk validasi di form.
  return apiClient.post("/auth/register", {
    name: input.name,
    email: input.email,
    password: input.password,
  });
}
