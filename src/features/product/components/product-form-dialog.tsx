"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form";
import {  useCreateProduct, useUpdateProduct } from "../hooks/use-products";
import type { Product } from "@/types/api";

type ProductFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
};

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
}: ProductFormDialogProps) {
  const isEdit = !!product;
  const create = useCreateProduct();
  const update = useUpdateProduct(product?.ID ?? "");
  const mutation = isEdit ? update : create;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui informasi produk."
              : "Lengkapi informasi produk baru."}
          </DialogDescription>
        </DialogHeader>

        {/* key memaksa form dibuat ulang saat produk berganti,
            supaya defaultValues ikut tersegarkan. */}
        <ProductForm
          key={product?.ID ?? "new"}
          product={product}
          isPending={mutation.isPending}
          onSubmit={(values) =>
            mutation.mutate(values, { onSuccess: () => onOpenChange(false) })
          }
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
