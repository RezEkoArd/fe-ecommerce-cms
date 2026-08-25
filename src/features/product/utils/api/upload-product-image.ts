import axios from "axios";

import { apiClient } from "@/lib/api-client";
import type { PresignedUpload, ProductImage } from "@/types/api";

// Batas ukuran & tipe — sejalan dengan yang wajar untuk gambar katalog.
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

async function presignProductImage(
  productId: string,
  filename: string,
): Promise<PresignedUpload> {
  return apiClient.post(`/products/${productId}/images/presign`, { filename });
}

async function confirmProductImage(
  productId: string,
  objectKey: string,
): Promise<ProductImage> {
  return apiClient.post(`/products/${productId}/images`, {
    object_key: objectKey,
  });
}

/**
 * Upload satu gambar dalam tiga langkah:
 *   1. minta presigned URL ke backend
 *   2. PUT file langsung ke MinIO
 *   3. konfirmasi ke backend agar tercatat di DB
 */
export async function uploadProductImage(
  productId: string,
  file: File,
): Promise<ProductImage> {
  const presigned = await presignProductImage(productId, file.name);

  // PUT ke MinIO memakai axios polos — apiClient akan menyisipkan
  // Bearer token dan meng-unwrap envelope, keduanya salah untuk host ini.
  await axios.put(presigned.upload_url, file, {
    headers: { "Content-Type": file.type },
  });

  return confirmProductImage(productId, presigned.object_key);
}

export async function deleteProductImage(
  productId: string,
  imageId: string,
): Promise<null> {
  return apiClient.delete(`/products/${productId}/images/${imageId}`);
}
