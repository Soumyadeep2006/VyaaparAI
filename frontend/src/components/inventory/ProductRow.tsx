import { Pencil, Trash2 } from "lucide-react";
import type { Product } from "../../types/product";

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductRow({
  product,
  onEdit,
  onDelete,
}: ProductRowProps) {
  return (
    <tr className="border-b border-border transition-colors hover:bg-surface-2">

      {/* Product */}
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-text-primary">
            {product.name}
          </p>

          <p className="mt-1 text-xs text-text-secondary">
            Product
          </p>
        </div>
      </td>

      {/* SKU */}
      <td className="px-6 py-4">
        <span className="text-sm text-text-secondary">
          {product.sku || "N/A"}
        </span>
      </td>

      {/* Category */}
      <td className="px-6 py-4">
        <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-text-secondary">
          {product.category || "Uncategorized"}
        </span>
      </td>

      {/* Price */}
      <td className="px-6 py-4">
        <span className="font-semibold text-text-primary">
          ₹{Number(product.price || 0).toLocaleString("en-IN")}
        </span>
      </td>

      {/* Stock */}
      <td className="px-6 py-4">
        {product.stock === 0 ? (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
            Out of Stock
          </span>
        ) : product.stock <= 10 ? (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            Low Stock ({product.stock})
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {product.stock} in stock
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">

          <button
            type="button"
            onClick={() => onEdit(product)}
            aria-label={`Edit ${product.name}`}
            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(product)}
            aria-label={`Delete ${product.name}`}
            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <Trash2 className="h-4 w-4" />
          </button>

        </div>
      </td>

    </tr>
  );
}