import type { Customer } from "../../types/customer";

interface Props {
  customers: Customer[];
}

export default function CustomerStats({
  customers,
}: Props) {

  const totalPurchase = customers.reduce(
    (sum, c) => sum + c.totalPurchase,
    0
  );

  const outstanding = customers.reduce(
    (sum, c) => sum + c.outstanding,
    0
  );

  return (
    <div className="grid gap-6 md:grid-cols-3">

      <div className="rounded-2xl bg-white p-6 shadow">

        <p>Total Customers</p>

        <h2 className="mt-2 text-3xl font-bold">
          {customers.length}
        </h2>

      </div>

      <div className="rounded-2xl bg-white p-6 shadow">

        <p>Total Sales</p>

        <h2 className="mt-2 text-3xl font-bold">
          ₹{totalPurchase.toLocaleString()}
        </h2>

      </div>

      <div className="rounded-2xl bg-white p-6 shadow">

        <p>Outstanding</p>

        <h2 className="mt-2 text-3xl font-bold text-red-500">
          ₹{outstanding.toLocaleString()}
        </h2>

      </div>

    </div>
  );
}