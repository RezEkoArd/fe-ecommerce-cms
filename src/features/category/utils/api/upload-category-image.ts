import axios from "axios";

import { apiClient } from "@/lib/api-client";
import type { PresignedUpload } from "@/types/api";

// Kategori tampil kecil di kartu — 2 MB sudah lebih dari cukup.
export const MAX_CATEGORY_IMAGE_SIZE = 2 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

async function presignCategoryImage(filename: string): Promise<PresignedUpload> {
    return apiClient.post("/categories/images/presign", { filename });
}

/**
 * Upload gambar kategori, kembalikan URL publiknya.
 * Berbeda dari gambar produk: tidak ada langkah konfirmasi ke DB —
 * URL disimpan bersama form kategori.
 */
export async function uploadCategoryImage(file: File): Promise<string> {
    const presigned = await presignCategoryImage(file.name);

    // PUT ke MinIO memakai axios polos — apiClient akan menyisipkan
    // Bearer token dan meng-unwrap envelope, keduanya salah untuk host ini.
    await axios.put(presigned.upload_url, file, {
        headers: { "Content-Type": file.type },
    });

    return presigned.public_url;
}
