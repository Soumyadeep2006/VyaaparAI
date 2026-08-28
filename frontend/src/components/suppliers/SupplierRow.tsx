import { Pencil, Trash2 } from "lucide-react";
import type { Supplier } from "../../types/supplier";

interface SupplierRowProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export default function SupplierRow({
  supplier,
  onEdit,
  onDelete,
}: SupplierRowProps) {
  const totalPurchase = Number(supplier.totalPurchase) || 0;
  const pendingPayment = Number(supplier.pendingPayment) || 0;

  const status = supplier.paymentStatus || (
    pendingPayment > 0 ? "pending" : "paid"
  );

  return (
    <tr className="border-t border-border">

      <td className="px-4 py-3">
        {supplier.name}
      </td>

      <td className="px-4 py-3">
        {supplier.phone}
      </td>

      <td className="px-4 py-3">
        ₹{totalPurchase.toLocaleString("en-IN")}
      </td>

      <td className="px-4 py-3">
        {pendingPayment > 0 ? (
          <span className="font-medium text-red-600">
            ₹{pendingPayment.toLocaleString("en-IN")}
          </span>
        ) : (
          <span className="text-gray-500">
            ₹0
          </span>
        )}
      </td>

      <td className="px-4 py-3">
        {status === "paid" && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            Paid
          </span>
        )}

        {status === "pending" && (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            Pending
          </span>
        )}

        {status === "cancelled" && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            Cancelled
          </span>
        )}
      </td>

      <td className="px-4 py-3">
        <div className="flex gap-2">

          <button
            type="button"
            onClick={() => onEdit(supplier)}
            title="Edit supplier"
          >
            <Pencil className="h-4 w-4 text-blue-600" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(supplier)}
            title="Delete supplier"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>

        </div>
      </td>

    </tr>
  );
}