import { CheckoutSummary } from "@/features/order/components/checkout-summary";

export const metadata = { title: "Checkout — ichiba 市場" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-270 px-10 pb-30 pt-12">
      <h1 className="mb-10 text-[34px] font-bold">Checkout</h1>
      <CheckoutSummary />
    </div>
  );
}
