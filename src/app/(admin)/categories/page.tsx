import { AdminHeader } from "@/components/shared/admin-header";
import { CategoryTable } from "@/features/category/components/category-table";

export default function CategoriesPage() {
  return (
    <>
      <AdminHeader title="Kategori" />
      <div className="flex-1 p-9">
        <CategoryTable />
      </div>
    </>
  );
} 
