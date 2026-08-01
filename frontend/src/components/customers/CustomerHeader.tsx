import { Plus, Search } from "lucide-react";

interface CustomerHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddCustomer: () => void;
}

export default function CustomerHeader({
  search,
  onSearchChange,
  onAddCustomer,
}: CustomerHeaderProps) {
  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Customers
          </h1>

          <p className="mt-2 text-text-secondary">
            Manage customers and their purchase history.
          </p>
        </div>

        <button
          onClick={onAddCustomer}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-white"
        >
          <Plus className="h-5 w-5" />
          Add Customer
        </button>

      </div>

      <div className="relative">

        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search customer..."
          className="w-full rounded-xl border border-border py-3 pl-12 pr-4"
        />

      </div>

    </div>
  );
}