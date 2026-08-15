import { AdminHeader } from "@/components/shared/admin-header";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { RecentProducts } from "@/features/dashboard/components/recent-products";

export default function DashboardPage() {
  return (
    <>
      <AdminHeader title="Ringkasan" />
      <div className="flex-1 p-9">
        <DashboardStats />
        <div className="mt-7">
          <RecentProducts />
        </div>
      </div>
    </>
  );
}
