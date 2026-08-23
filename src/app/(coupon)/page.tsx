import { AdminHeader } from "@/components/shared/admin-header";
import { CouponTable } from "@/features/coupon/components/coupon-table";

export default function CouponsPage() {
  return (
    <>
      <AdminHeader title="Kupon" />
      <div className="flex-1 p-9">
        <CouponTable />
      </div>
    </>
  );
}