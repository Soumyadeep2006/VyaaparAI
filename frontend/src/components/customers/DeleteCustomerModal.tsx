import { X } from "lucide-react";

interface Props {
  open: boolean;
  customerName: string;
  onDelete: () => void;
  onCancel: () => void;
}

export default function DeleteCustomerModal({
  open,
  customerName,
  onDelete,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-2xl bg-white p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-xl font-bold">
            Delete Customer
          </h2>

          <button onClick={onCancel}>
            <X />
          </button>

        </div>

        <p className="mt-6">
          Delete <strong>{customerName}</strong>?
        </p>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="rounded-xl border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="rounded-xl bg-red-600 px-5 py-2 text-white"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}