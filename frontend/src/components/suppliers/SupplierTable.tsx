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
    <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow">

      <table className="w-full min-w-[800px]">

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
              Pending Amount
            </th>

            <th className="px-4 py-3 text-left">
              Status
            </th>

            <th className="px-4 py-3 text-left">
              Actions
            </th>

          </tr>
        </thead>

        <tbody>
          {suppliers.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-8 text-center text-gray-500"
              >
                No suppliers found.
              </td>
            </tr>
          ) : (
            suppliers.map((supplier) => (
              <SupplierRow
                key={supplier.id}
                supplier={supplier}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>

      </table>

    </div>
  );
}