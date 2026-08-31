import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Customer, PaymentStatus } from "../../types/customer";

interface CustomerFormProps {
  open: boolean;
  customer?: Customer | null;
  onClose: () => void;
  onSave: (customer: Customer) => void;
}

const emptyForm: Customer = {
  id: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  totalPurchase: 0,
  outstanding: 0,
  paymentStatus: "paid",
};

export default function CustomerForm({ open, customer, onClose, onSave }: CustomerFormProps) {
  const [form, setForm] = useState<Customer>(emptyForm);

  useEffect(() => {
    if (!open) return;
    if (customer) {
      setForm({
        ...emptyForm,
        ...customer,
        totalPurchase: Number(customer.totalPurchase) || 0,
        outstanding: Number(customer.outstanding) || 0,
        paymentStatus: customer.paymentStatus || "paid",
      });
    } else {
      setForm({ ...emptyForm, id: "" });
    }
  }, [open, customer]);

  if (!open) return null;

  const updateField = (key: keyof Customer, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert("Please enter customer name.");
      return;
    }
    if (!form.phone.trim()) {
      alert("Please enter customer phone number.");
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: (form.email ?? "").trim(),
      address: (form.address ?? "").trim(),
      totalPurchase: Number(form.totalPurchase) || 0,
      outstanding: Number(form.outstanding) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{customer ? "Edit Customer" : "Add Customer"}</h2>
          <button type="button" onClick={handleClose} className="rounded-lg p-2 hover:bg-gray-100">
            <X />
          </button>
        </div>

        <div className="space-y-4">
          <input placeholder="Customer Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-primary" />
          <input placeholder="Phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-primary" />
          <input type="email" placeholder="Email" value={form.email ?? ""} onChange={(e) => updateField("email", e.target.value)} className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-primary" />
          <input placeholder="Address" value={form.address ?? ""} onChange={(e) => updateField("address", e.target.value)} className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-primary" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Total Purchase</label>
              <input type="number" min="0" placeholder="0" value={form.totalPurchase === 0 ? "" : form.totalPurchase} onChange={(e) => updateField("totalPurchase", e.target.value === "" ? 0 : Number(e.target.value))} className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Outstanding Amount</label>
              <input type="number" min="0" placeholder="0" value={form.outstanding === 0 ? "" : form.outstanding} onChange={(e) => updateField("outstanding", e.target.value === "" ? 0 : Number(e.target.value))} className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-primary" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Payment Status</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                ["paid", "Paid"],
                ["pending", "Pending"],
                ["cancelled", "Cancelled"],
              ] as [PaymentStatus, string][]).map(([value, label]) => (
                <button key={value} type="button" onClick={() => updateField("paymentStatus", value)} className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${form.paymentStatus === value ? "border-primary bg-primary text-white" : "border-gray-300 bg-white hover:bg-gray-50"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={handleClose} className="rounded-xl border border-gray-300 px-5 py-2 font-medium hover:bg-gray-50">Cancel</button>
            <button type="button" onClick={handleSave} className="rounded-xl bg-primary px-5 py-2 font-semibold text-white hover:bg-primary-dark">Save Customer</button>
          </div>
        </div>
      </div>
    </div>
  );
}
