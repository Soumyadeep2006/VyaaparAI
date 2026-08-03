import { useBilling } from "../../hooks/useBilling";

interface Invoice {
  id?: string;
  _id?: string;
  customer?: string;
  customer_name?: string;
  total?: number;
  status?: string;
}

export default function RecentOrders() {
  const { data, isLoading, isError } = useBilling();

  const invoices: Invoice[] = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-text-primary">
          Recent Orders
        </h2>

        <p className="mt-2 text-sm text-text-secondary">
          Loading orders...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-surface p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-text-primary">
          Recent Orders
        </h2>

        <p className="mt-2 text-sm text-red-600">
          Unable to load orders.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary">
          Recent Orders
        </h2>

        <p className="text-sm text-text-secondary">
          Latest customer orders
        </p>
      </div>

      {invoices.length === 0 ? (
        <div className="py-10 text-center text-text-secondary">
          No orders found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 text-left text-sm font-semibold text-text-secondary">
                  Order
                </th>

                <th className="py-3 text-left text-sm font-semibold text-text-secondary">
                  Customer
                </th>

                <th className="py-3 text-left text-sm font-semibold text-text-secondary">
                  Amount
                </th>

                <th className="py-3 text-left text-sm font-semibold text-text-secondary">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {invoices.slice(0, 5).map((invoice, index) => {
                const orderId =
                  invoice.id ??
                  invoice._id ??
                  `#${1001 + index}`;

                const customer =
                  invoice.customer ??
                  invoice.customer_name ??
                  "Unknown Customer";

                const amount = Number(invoice.total ?? 0);

                const status =
                  invoice.status ?? "Pending";

                return (
                  <tr
                    key={orderId}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-4 font-medium text-text-primary">
                      #{orderId.toString().replace("#", "")}
                    </td>

                    <td className="py-4 text-text-primary">
                      {customer}
                    </td>

                    <td className="py-4 font-medium text-text-primary">
                      ₹{amount.toLocaleString("en-IN")}
                    </td>

                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          status === "Paid"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : status === "Cancelled"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}