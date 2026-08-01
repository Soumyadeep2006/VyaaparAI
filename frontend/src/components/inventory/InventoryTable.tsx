import type { Product } from "../../types/product";
import ProductRow from "./ProductRow";

interface InventoryTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function InventoryTable({
  products,
  onEdit,
  onDelete,
}: InventoryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-surface-2">
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                Product
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                SKU
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                Category
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                Price
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                Stock
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-text-secondary"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
