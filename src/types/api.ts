// Bentuk data dari backend Go. Perhatikan: field PascalCase,
// dan Price berupa string (bukan number) karena tipe decimal di DB.

export type Category = {
  ID: string;
  Name: string;
  Slug: string;
  /** URL gambar sampul kategori. Boleh string kosong. */
  ImageURL: string;
  CreatedAt: string;
  // Hanya terisi pada endpoint list.
  ProductCount?: number;
};

export type ProductImage = {
  ID: string;
  ProductID: string;
  URL: string;
  IsPrimary: boolean;
  CreatedAt: string;
};

// Jawaban POST /products/:id/images/presign
export type PresignedUpload = {
  upload_url: string;
  object_key: string;
  public_url: string;
};

export type Product = {
  ID: string;
  Name: string;
  Slug: string;
  Description: string;
  Price: string;
  Stock: number;
  CategoryID: string;
  CreatedAt: string;
  UpdatedAt: string;
  Category: Category | null;
  Images: ProductImage[] | null;
};

// Endpoint list membungkus lagi: data.items[] + pagination.
export type Paginated<T> = {
  items: T[];
  limit: number;
  offset: number;
  total: number;
};

export type ListParams = {
  limit?: number;
  offset?: number;
};

export type ProductParams = ListParams & {
  search?: string;
  category_id?: string;
};
