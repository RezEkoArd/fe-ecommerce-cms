import { CartList } from "@/features/cart/components/cart-list";

export const metadata = {
  title: "Keranjang — ichiba 市場",
};

export default function KeranjangPage() {
  return (
    <div className="mx-auto max-w-270 px-10 pb-30 pt-12">
      <h1 className="mb-10 text-[34px] font-bold">Keranjang</h1>
      <CartList />
    </div>
  );
}
