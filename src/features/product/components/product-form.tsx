"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ProductImageManager,
  ProductImageManagerPlaceholder,
} from "./product-image-manager";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/features/category/hooks/use-categories";
import {
  productSchema,
  type ProductInput,
  type ProductOutput,
} from "../schema/product-schema";
import type { Product } from "@/types/api";

type ProductFormProps = {
  product?: Product;
  isPending: boolean;
  onSubmit: (values: ProductOutput) => void;
  onCancel: () => void;
};

export function ProductForm({
  product,
  isPending,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const { data: categories } = useCategories();

  const form = useForm<ProductInput, unknown, ProductOutput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.Name ?? "",
      description: product?.Description ?? "",
      price: product ? Number(product.Price) : 0,
      stock: product?.Stock ?? 0,
      category_id: product?.CategoryID ?? "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama produk</FormLabel>
              <FormControl>
                <Input placeholder="Kemeja Linen Kaze" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Deskripsi singkat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={1000}
                    {...field}
                    value={String(field.value ?? "")}
                  />
                </FormControl>
                <FormDescription>Dalam rupiah, tanpa titik.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stok</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    {...field}
                    value={String(field.value ?? "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">— Tanpa kategori —</option>
                  {categories?.map((c) => (
                    <option key={c.ID} value={c.ID}>
                      {c.Name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gambar butuh ID produk, jadi hanya tersedia saat edit. */}
        <div className="border-t pt-4">
          {product ? (
            <ProductImageManager
              productId={product.ID}
              images={product.Images}
            />
          ) : (
            <ProductImageManagerPlaceholder />
          )}
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Menyimpan…" : product ? "Simpan" : "Tambah"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
