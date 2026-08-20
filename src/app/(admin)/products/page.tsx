import { AdminHeader } from "@/components/shared/admin-header";
import { ProductTable } from "@/features/product/components/product-table";

export default function ProductsPage() {
  return (
    <>
      <AdminHeader title="Produk" />
      <div className="flex-1 p-9">
        <ProductTable />
      </div>
    </>
  );
}
