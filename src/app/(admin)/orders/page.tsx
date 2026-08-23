import { AdminHeader } from "@/components/shared/admin-header";
import { OrderTable } from "@/features/order/components/order-table";

export default function OrdersPage() {
  return (
    <>
      <AdminHeader title="Pesanan" />
      <div className="flex-1 p-9">
        <OrderTable />
      </div>
    </>
  );
}
