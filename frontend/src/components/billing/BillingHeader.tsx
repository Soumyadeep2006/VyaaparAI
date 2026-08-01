import { Plus } from "lucide-react";

interface Props {
  onAdd: () => void;
}

export default function BillingHeader({
  onAdd,
}: Props) {
  return (
    <div className="flex items-center justify-between">

      <div>

        <h1 className="text-4xl font-bold text-gray-900">
          Billing
        </h1>

        <p className="text-gray-500 mt-2">
          Create and manage invoices
        </p>

      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 rounded-lg bg-[#2B6F79] px-5 py-3 font-semibold text-white hover:bg-[#22585F]"
      >
        <Plus size={18} />
        New Invoice
      </button>

    </div>
  );
}