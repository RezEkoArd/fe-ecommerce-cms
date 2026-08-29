import { MyOrders } from "@/features/order/components/my-orders";

export const metadata = { title: "Pesanan Saya — ichiba 市場" };

export default function PesananPage() {
  return (
    <div className="mx-auto max-w-225 px-10 pb-30 pt-12">
      <h1 className="mb-8 text-[34px] font-bold">Pesanan Saya</h1>
      <MyOrders />
    </div>
  );
}
