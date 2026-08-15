// Bentuk data dari backend Go. Perhatikan: field PascalCase,
// dan Price berupa string (bukan number) karena tipe decimal di DB.

export type Category = {
  ID: string;
  Name: string;
  Slug: string;
  CreatedAt: string;
};

export type ProductImage = {
  ID: string;
  URL: string;
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
