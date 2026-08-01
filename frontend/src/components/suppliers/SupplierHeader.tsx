import { Plus, Search } from "lucide-react";

interface SupplierHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddSupplier: () => void;
}

export default function SupplierHeader({
  search,
  onSearchChange,
  onAddSupplier,
}: SupplierHeaderProps) {
  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Suppliers
          </h1>

          <p className="mt-2 text-text-secondary">
            Manage supplier records and purchase history.
          </p>
        </div>

        <button
          onClick={onAddSupplier}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-white"
        >
          <Plus className="h-5 w-5" />
          Add Supplier
        </button>

      </div>

      <div className="relative">

        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search supplier..."
          className="w-full rounded-xl border border-border py-3 pl-12 pr-4"
        />

      </div>

    </div>
  );
}