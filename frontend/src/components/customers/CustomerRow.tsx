import { Pencil, Trash2 } from "lucide-react";
import type { Customer } from "../../types/customer";

interface Props {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export default function CustomerRow({
  customer,
  onEdit,
  onDelete,
}: Props) {
  return (
    <tr>

      <td className="px-4 py-3">
        {customer.name}
      </td>

      <td className="px-4 py-3">
        {customer.phone}
      </td>

      <td className="px-4 py-3">
        ₹{customer.totalPurchase}
      </td>

      <td className="px-4 py-3">

        {customer.outstanding > 0 ? (
          <span className="rounded-full bg-red-100 px-3 py-1 text-red-600">
            ₹{customer.outstanding}
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-3 py-1 text-green-600">
            Paid
          </span>
        )}

      </td>

      <td className="px-4 py-3">

        <div className="flex gap-2">

          <button onClick={() => onEdit(customer)}>
            <Pencil className="h-4 w-4 text-blue-600" />
          </button>

          <button onClick={() => onDelete(customer)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>

        </div>

      </td>

    </tr>
  );
}