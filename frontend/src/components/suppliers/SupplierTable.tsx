import SupplierRow from "./SupplierRow";
import type { Supplier } from "../../types/supplier";

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export default function SupplierTable({
  suppliers,
  onEdit,
  onDelete,
}: SupplierTableProps) {
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
              Pending
            </th>

            <th className="px-4 py-3 text-left">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {suppliers.map((supplier) => (
            <SupplierRow
              key={supplier.id}
              supplier={supplier}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}

        </tbody>

      </table>

    </div>
  );
}