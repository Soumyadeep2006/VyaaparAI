import type { Supplier } from "../../types/supplier";

interface SupplierStatsProps {
  suppliers: Supplier[];
}

export default function SupplierStats({
  suppliers,
}: SupplierStatsProps) {

  const totalPurchase = suppliers.reduce(
    (sum, supplier) => sum + supplier.totalPurchase,
    0
  );

  const pending = suppliers.reduce(
    (sum, supplier) => sum + supplier.pendingPayment,
    0
  );

  return (
    <div className="grid gap-6 md:grid-cols-3">

      <div className="rounded-2xl bg-white p-6 shadow">

        <p>Total Suppliers</p>

        <h2 className="mt-2 text-3xl font-bold">
          {suppliers.length}
        </h2>

      </div>

      <div className="rounded-2xl bg-white p-6 shadow">

        <p>Total Purchases</p>

        <h2 className="mt-2 text-3xl font-bold">
          ₹{totalPurchase.toLocaleString()}
        </h2>

      </div>

      <div className="rounded-2xl bg-white p-6 shadow">

        <p>Pending Payment</p>

        <h2 className="mt-2 text-3xl font-bold text-red-500">
          ₹{pending.toLocaleString()}
        </h2>

      </div>

    </div>
  );
}