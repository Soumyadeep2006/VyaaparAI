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
  const purchase =
    Number(customer.totalPurchase) || 0;

  const outstanding =
    Number(customer.outstanding) || 0;

  const status =
    customer.paymentStatus || "pending";

  const statusConfig = {
    paid: {
      label: "Paid",
      className:
        "bg-green-100 text-green-700",
    },
    pending: {
      label: "Pending",
      className:
        "bg-yellow-100 text-yellow-700",
    },
    cancelled: {
      label: "Cancelled",
      className:
        "bg-gray-100 text-gray-700",
    },
  };

  const currentStatus =
    statusConfig[status];

  return (
    <tr className="border-t border-gray-100">

      <td className="px-4 py-4 font-medium">
        {customer.name}
      </td>

      <td className="px-4 py-4">
        {customer.phone}
      </td>

      <td className="px-4 py-4">
        ₹{purchase.toLocaleString("en-IN")}
      </td>

      <td className="px-4 py-4">
        {outstanding > 0 ? (
          <span className="font-medium text-red-600">
            ₹{outstanding.toLocaleString("en-IN")}
          </span>
        ) : (
          <span className="text-gray-500">
            ₹0
          </span>
        )}
      </td>

      <td className="px-4 py-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${currentStatus.className}`}
        >
          {currentStatus.label}
        </span>
      </td>

      <td className="px-4 py-4">
        <div className="flex gap-3">

          <button
            type="button"
            onClick={() => onEdit(customer)}
            title="Edit customer"
          >
            <Pencil className="h-4 w-4 text-blue-600" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(customer)}
            title="Delete customer"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>

        </div>
      </td>

    </tr>
  );
}