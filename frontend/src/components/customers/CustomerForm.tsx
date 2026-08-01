import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Customer } from "../../types/customer";

interface CustomerFormProps {
  open: boolean;
  customer?: Customer | null;
  onClose: () => void;
  onSave: (customer: Customer) => void;
}

export default function CustomerForm({
  open,
  customer,
  onClose,
  onSave,
}: CustomerFormProps) {
  const [form, setForm] = useState<Customer>({
    id: 0,
    name: "",
    phone: "",
    email: "",
    address: "",
    totalPurchase: 0,
    outstanding: 0,
  });

  useEffect(() => {
    if (customer) {
      setForm(customer);
    } else {
      setForm({
        id: Date.now(),
        name: "",
        phone: "",
        email: "",
        address: "",
        totalPurchase: 0,
        outstanding: 0,
      });
    }
  }, [customer]);

  if (!open) return null;

  const updateField = (
    key: keyof Customer,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-xl rounded-2xl bg-white p-6">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {customer ? "Edit Customer" : "Add Customer"}
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-4">

          <input
            placeholder="Customer Name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            placeholder="Address"
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <div className="grid grid-cols-2 gap-4">

            <input
              type="number"
              placeholder="Purchase"
              value={form.totalPurchase}
              onChange={(e) =>
                updateField("totalPurchase", Number(e.target.value))
              }
              className="rounded-xl border p-3"
            />

            <input
              type="number"
              placeholder="Outstanding"
              value={form.outstanding}
              onChange={(e) =>
                updateField("outstanding", Number(e.target.value))
              }
              className="rounded-xl border p-3"
            />

          </div>

          <div className="flex justify-end gap-3">

            <button
              onClick={onClose}
              className="rounded-xl border px-5 py-2"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onSave(form);
                onClose();
              }}
              className="rounded-xl bg-primary px-5 py-2 text-white"
            >
              Save
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}