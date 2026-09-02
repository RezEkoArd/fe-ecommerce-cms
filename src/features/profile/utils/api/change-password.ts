import { apiClient } from "@/lib/api-client";
import type { PasswordInput } from "../../schema/profile-schema";

export async function changePassword(input: PasswordInput): Promise<null> {
    // confirm_password hanya untuk validasi di form — tidak dikirim.
    return apiClient.put("/me/password", {
        current_password: input.current_password,
        new_password: input.new_password,
    });
}
