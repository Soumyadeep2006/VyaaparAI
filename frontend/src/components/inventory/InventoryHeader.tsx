import { Plus, Search } from "lucide-react";

interface InventoryHeaderProps {
  onAddProduct: () => void;

  search: string;
  onSearchChange: (value: string) => void;

  category: string;
  categories: string[];
  onCategoryChange: (value: string) => void;
}

export default function InventoryHeader({
  onAddProduct,
  search,
  onSearchChange,
  category,
  categories,
  onCategoryChange,
}: InventoryHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Inventory
          </h1>

          <p className="mt-2 text-text-secondary">
            Manage products, stock levels and categories.
          </p>
        </div>

        <button
          onClick={onAddProduct}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 text-white font-semibold shadow-md transition"
        >
          <Plus className="h-5 w-5" />
           <span>Add Product</span>
        </button>

      </div>

      {/* Search & Filter */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* Search */}
        <div className="relative">

          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search by product, SKU or category..."
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            className="w-full rounded-xl border border-border bg-white py-3 pl-12 pr-4 outline-none transition focus:border-primary"
          />

        </div>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) =>
            onCategoryChange(e.target.value)
          }
          className="rounded-xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary"
        >
          {categories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

      </div>
    </div>
  );
}