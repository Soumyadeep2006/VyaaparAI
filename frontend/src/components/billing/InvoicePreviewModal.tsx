import { useState } from "react";
import { X } from "lucide-react";

interface ProductItem {
  product: string;
  quantity: number;
  price: number;
}

interface InvoiceFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function InvoiceForm({
  open,
  onClose,
  onSave,
}: InvoiceFormProps) {
  const [customer, setCustomer] = useState("");

  const [items, setItems] = useState<ProductItem[]>([
    {
      product: "",
      quantity: 1,
      price: 0,
    },
  ]);

  if (!open) return null;

  const addItem = () => {
    setItems([
      ...items,
      {
        product: "",
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const updateItem = (
  index: number,
  field: keyof ProductItem,
  value: string | number
) => {
  setItems((prev) =>
    prev.map((item, i) =>
      i === index
        ? {
            ...item,
            [field]: value,
          }
        : item
    )
  );
};

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            Create Invoice
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <input
          placeholder="Customer Name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="mb-6 w-full rounded-lg border border-gray-300 p-3"
        />

        <div className="space-y-4">

          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4"
            >
              <input
                placeholder="Product"
                value={item.product}
                onChange={(e) =>
                  updateItem(
                    index,
                    "product",
                    e.target.value
                  )
                }
                className="rounded-lg border border-gray-300 p-3"
              />

              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(
                    index,
                    "quantity",
                    Number(e.target.value)
                  )
                }
                className="rounded-lg border border-gray-300 p-3"
              />

              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) =>
                  updateItem(
                    index,
                    "price",
                    Number(e.target.value)
                  )
                }
                className="rounded-lg border border-gray-300 p-3"
              />
            </div>
          ))}

        </div>

        <button
          onClick={addItem}
          className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          + Add Product
        </button>

        <div className="mt-6 border-t pt-4">

          <h3 className="text-xl font-bold">
            Total : ₹{total}
          </h3>

        </div>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSave({
                customer,
                items,
                total,
              })
            }
            className="rounded-lg bg-[#2B6F79] px-5 py-2 text-white"
          >
            Save Invoice
          </button>

        </div>

      </div>

    </div>
  );
}