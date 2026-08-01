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
  return (
    <tr>

      <td className="px-4 py-3">
        {supplier.name}
      </td>

      <td className="px-4 py-3">
        {supplier.phone}
      </td>

      <td className="px-4 py-3">
        ₹{supplier.totalPurchase.toLocaleString()}
      </td>

      <td className="px-4 py-3">

        {supplier.pendingPayment > 0 ? (
          <span className="rounded-full bg-red-100 px-3 py-1 text-red-600">
            ₹{supplier.pendingPayment.toLocaleString()}
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-3 py-1 text-green-600">
            Paid
          </span>
        )}

      </td>

      <td className="px-4 py-3">

        <div className="flex gap-2">

          <button onClick={() => onEdit(supplier)}>
            <Pencil className="h-4 w-4 text-blue-600" />
          </button>

          <button onClick={() => onDelete(supplier)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>

        </div>

      </td>

    </tr>
  );
}