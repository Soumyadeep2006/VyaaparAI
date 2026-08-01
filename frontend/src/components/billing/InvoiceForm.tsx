import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface ProductItem {
  product: string;
  quantity: number;
  price: number;
}

interface FormItem {
  product: string;
  quantity: string;
  price: string;
}

interface InvoiceFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    customer: string;
    items: ProductItem[];
    total: number;
  }) => void;
}

export default function InvoiceForm({
  open,
  onClose,
  onSave,
}: InvoiceFormProps) {
  const [customer, setCustomer] = useState("");

  const [items, setItems] = useState<FormItem[]>([
    {
      product: "",
      quantity: "1",
      price: "",
    },
  ]);

  if (!open) return null;

  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        product: "",
        quantity: "1",
        price: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;

    setItems((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  const updateItem = (
    index: number,
    field: keyof FormItem,
    value: string
  ) => {
    setItems((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const total = items.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;

    return sum + quantity * price;
  }, 0);

  const handleSave = () => {
    if (!customer.trim()) {
      alert("Please enter customer name.");
      return;
    }

    const invalidProduct = items.some((item) => {
      const quantity = Number(item.quantity);
      const price = Number(item.price);

      return (
        !item.product.trim() ||
        !item.quantity ||
        quantity <= 0 ||
        !item.price ||
        price < 0
      );
    });

    if (invalidProduct) {
      alert(
        "Please enter valid Product, Quantity and Price for all items."
      );
      return;
    }

    const invoiceItems: ProductItem[] = items.map((item) => ({
      product: item.product.trim(),
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));

    onSave({
      customer: customer.trim(),
      items: invoiceItems,
      total,
    });

    setCustomer("");

    setItems([
      {
        product: "",
        quantity: "1",
        price: "",
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Create Invoice
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add customer and product details
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-6 w-6" />
          </button>

        </div>

        {/* Customer */}
        <div className="mb-6">

          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Customer Name
          </label>

          <input
            type="text"
            
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none focus:border-[#2B6F79] focus:ring-2 focus:ring-[#2B6F79]/10"
          />

        </div>

        {/* Products */}
        <div className="mb-3">

          <h3 className="text-lg font-semibold text-gray-900">
            Products
          </h3>

        </div>

        <div className="space-y-4">

          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >

              <div className="mb-3 flex items-center justify-between">

                <p className="text-sm font-semibold text-gray-700">
                  Product {index + 1}
                </p>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                )}

              </div>

              <div className="grid gap-4 md:grid-cols-3">

                {/* Product */}
                <div>

                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Product Name
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Basmati Rice"
                    value={item.product}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "product",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-[#2B6F79]"
                  />

                </div>

                {/* Quantity */}
                <div>

                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 2"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "quantity",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-[#2B6F79]"
                  />

                </div>

                {/* Price */}
                <div>

                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 100"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "price",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-[#2B6F79]"
                  />

                </div>

              </div>

            </div>
          ))}

        </div>

        {/* Add Product */}
        <button
          type="button"
          onClick={addItem}
          className="mt-5 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>

        {/* Total */}
        <div className="mt-6 border-t border-gray-300 pt-5">

          <div className="flex items-center justify-between">

            <span className="text-lg font-semibold text-gray-700">
              Invoice Total
            </span>

            <span className="text-2xl font-bold text-gray-900">
              ₹{total.toLocaleString("en-IN")}
            </span>

          </div>

        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-[#2B6F79] px-5 py-2.5 font-medium text-white hover:bg-[#22585F]"
          >
            Save Invoice
          </button>

        </div>

      </div>

    </div>
  );
}