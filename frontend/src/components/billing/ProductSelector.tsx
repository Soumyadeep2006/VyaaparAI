import { Plus } from "lucide-react";
import type { Product } from "../../types/product";

interface ProductSelectorProps {
  products: Product[];
  onAdd: (product: Product) => void;
}

export default function ProductSelector({
  products,
  onAdd,
}: ProductSelectorProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Available Products
      </h2>

      <div className="space-y-3">

        {products.map((product) => (

          <div
            key={product.id}
            className="flex items-center justify-between rounded-xl border border-border p-4"
          >

            <div>

              <h3 className="font-semibold">
                {product.name}
              </h3>

              <p className="text-sm text-gray-500">
                ₹{product.price}
              </p>

            </div>

            <button
              onClick={() => onAdd(product)}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>

          </div>

        ))}

      </div>
    </div>
  );
}