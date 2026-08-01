import CustomerRow from "./CustomerRow";
import type { Customer } from "../../types/customer";

interface Props {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export default function CustomerTable({
  customers,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow">

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="px-4 py-3 text-left">
              Name
            </th>

            <th className="px-4 py-3 text-left">
              Phone
            </th>

            <th className="px-4 py-3 text-left">
              Purchase
            </th>

            <th className="px-4 py-3 text-left">
              Outstanding
            </th>

            <th className="px-4 py-3 text-left">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {customers.map((customer) => (
            <CustomerRow
              key={customer.id}
              customer={customer}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}

        </tbody>

      </table>

    </div>
  );
}