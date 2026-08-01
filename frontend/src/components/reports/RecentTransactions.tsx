import { recentTransactions } from "../../constants/reportsData";

export default function RecentTransactions() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-6 text-xl font-semibold">
        Recent Transactions
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="border-b">

            <tr>

              <th className="py-3 text-left">
                Customer
              </th>

              <th className="py-3 text-left">
                Amount
              </th>

              <th className="py-3 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {recentTransactions.map((transaction) => (

              <tr
                key={transaction.id}
                className="border-b"
              >

                <td className="py-4">
                  {transaction.customer}
                </td>

                <td>
                  ₹{transaction.amount}
                </td>

                <td>

                  {transaction.status === "Paid" ? (

                    <span className="rounded-full bg-green-100 px-3 py-1 text-green-600">
                      Paid
                    </span>

                  ) : (

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-600">
                      Pending
                    </span>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}