import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type {
  Supplier,
  PaymentStatus,
} from "../../types/supplier";

interface SupplierFormProps {
  open: boolean;
  supplier?: Supplier | null;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
}

const emptyForm: Supplier = {
  id: "",
  name: "",
  company: "",
  phone: "",
  email: "",
  address: "",
  totalPurchase: 0,
  pendingPayment: 0,
  paymentStatus: "paid",
};

export default function SupplierForm({
  open,
  supplier,
  onClose,
  onSave,
}: SupplierFormProps) {
  const [form, setForm] = useState<Supplier>(emptyForm);

  useEffect(() => {
    if (!open) return;

    if (supplier) {
      setForm({
        ...emptyForm,
        ...supplier,
        totalPurchase: Number(supplier.totalPurchase) || 0,
        pendingPayment: Number(supplier.pendingPayment) || 0,
      });
    } else {
      setForm({
        ...emptyForm,
        id: "",
      });
    }
  }, [open, supplier]);

  if (!open) return null;

  const updateField = (
    key: keyof Supplier,
    value: string | number | PaymentStatus
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert("Please enter supplier name.");
      return;
    }

    if (!form.company.trim()) {
      alert("Please enter company name.");
      return;
    }

    const finalForm: Supplier = {
      ...form,
      totalPurchase: Number(form.totalPurchase) || 0,
      pendingPayment: Number(form.pendingPayment) || 0,
    };

    onSave(finalForm);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {supplier ? "Edit Supplier" : "Add Supplier"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X />
          </button>
        </div>

        <div className="space-y-4">

          <input
            placeholder="Supplier Name"
            value={form.name}
            onChange={(e) =>
              updateField("name", e.target.value)
            }
            className="w-full rounded-xl border p-3"
          />

          <input
            placeholder="Company Name"
            value={form.company}
            onChange={(e) =>
              updateField("company", e.target.value)
            }
            className="w-full rounded-xl border p-3"
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              updateField("phone", e.target.value)
            }
            className="w-full rounded-xl border p-3"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              updateField("email", e.target.value)
            }
            className="w-full rounded-xl border p-3"
          />

          <input
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              updateField("address", e.target.value)
            }
            className="w-full rounded-xl border p-3"
          />

          <div className="grid grid-cols-2 gap-4">

            <input
              type="number"
              min="0"
              placeholder="Total Purchase"
              value={form.totalPurchase || ""}
              onChange={(e) =>
                updateField(
                  "totalPurchase",
                  e.target.value === ""
                    ? 0
                    : Number(e.target.value)
                )
              }
              className="rounded-xl border p-3"
            />

            <input
              type="number"
              min="0"
              placeholder="Pending Payment"
              value={form.pendingPayment || ""}
              onChange={(e) =>
                updateField(
                  "pendingPayment",
                  e.target.value === ""
                    ? 0
                    : Number(e.target.value)
                )
              }
              className="rounded-xl border p-3"
            />

          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Payment Status
            </label>

            <select
              value={form.paymentStatus}
              onChange={(e) =>
                updateField(
                  "paymentStatus",
                  e.target.value as PaymentStatus
                )
              }
              className="w-full rounded-xl border p-3"
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-primary px-5 py-2 font-medium text-white"
            >
              Save
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}