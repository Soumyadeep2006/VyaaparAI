import { useEffect, useMemo, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getCustomers } from "../../api/customers";
import { getProducts } from "../../api/inventory";
import type { Customer } from "../../types/customer";
import type { Product } from "../../types/product";
import type { InvoiceStatus, PaymentMethod } from "../../types/invoice";

interface FormItem {
  productId: string;
  product: string;
  quantity: string;
  price: string;
}

interface InvoiceFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    customer: string;
    customer_id: string;
    items: {
      product: string;
      product_id: string;
      quantity: number;
      price: number;
    }[];
    total: number;
    status: InvoiceStatus;
    payment_method: PaymentMethod;
  }) => void;
}

const emptyItem = (): FormItem => ({
  productId: "",
  product: "",
  quantity: "1",
  price: "",
});

export default function InvoiceForm({ open, onClose, onSave }: InvoiceFormProps) {
  const { data: customers = [], isLoading: loadingCustomers } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: getCustomers,
    enabled: open,
  });

  const { data: products = [], isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ["inventory"],
    queryFn: getProducts,
    enabled: open,
  });

  const [customerId, setCustomerId] = useState("");
  const [status, setStatus] = useState<InvoiceStatus>("Paid");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [items, setItems] = useState<FormItem[]>([emptyItem()]);

  useEffect(() => {
    if (open) {
      setCustomerId("");
      setStatus("Paid");
      setPaymentMethod("Cash");
      setItems([emptyItem()]);
    }
  }, [open]);

  const selectedCustomer = customers.find((customer) => String(customer.id) === customerId);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0),
    [items]
  );

  if (!open) return null;

  const addItem = () => setItems((current) => [...current, emptyItem()]);

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems((current) => current.filter((_, i) => i !== index));
  };

  const selectProduct = (index: number, productId: string) => {
    const product = products.find((item) => String(item.id) === productId);
    setItems((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              productId,
              product: product?.name ?? "",
              price: product ? String(product.price) : "",
            }
          : item
      )
    );
  };

  const updateItem = (index: number, field: "quantity", value: string) => {
    setItems((current) =>
      current.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = () => {
    if (!customerId || !selectedCustomer) {
      alert("Please select a customer.");
      return;
    }

    if (items.some((item) => !item.productId)) {
      alert("Please select a product for every item.");
      return;
    }

    for (const item of items) {
      const product = products.find((p) => String(p.id) === item.productId);
      const quantity = Number(item.quantity);
      if (!product || quantity <= 0 || !Number.isInteger(quantity)) {
        alert("Please enter valid quantities.");
        return;
      }
      if (quantity > product.stock) {
        alert(`${product.name} has only ${product.stock} unit(s) available.`);
        return;
      }
    }

    onSave({
      customer: selectedCustomer.name,
      customer_id: String(selectedCustomer.id),
      items: items.map((item) => ({
        product: item.product,
        product_id: item.productId,
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
      total,
      status,
      payment_method: paymentMethod,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Invoice</h2>
            <p className="mt-1 text-sm text-gray-500">Select real customers and products from your business data.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-gray-700">Customer</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            disabled={loadingCustomers}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-[#2B6F79]"
          >
            <option value="">{loadingCustomers ? "Loading customers..." : "Select customer"}</option>
            {customers.map((customer) => (
              <option key={customer.id} value={String(customer.id)}>
                {customer.name} — {customer.phone}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Products</h3>
          <span className="text-sm text-gray-500">{loadingProducts ? "Loading..." : `${products.length} available`}</span>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => {
            const selectedProduct = products.find((p) => String(p.id) === item.productId);
            return (
              <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">Product {index + 1}</p>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(index)} className="flex items-center gap-1 text-sm text-red-600">
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Product</label>
                    <select
                      value={item.productId}
                      onChange={(e) => selectProduct(index, e.target.value)}
                      disabled={loadingProducts}
                      className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-[#2B6F79]"
                    >
                      <option value="">{loadingProducts ? "Loading products..." : "Select product"}</option>
                      {products.map((product) => (
                        <option key={product.id} value={String(product.id)} disabled={product.stock <= 0}>
                          {product.name} — ₹{product.price} — Stock {product.stock}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Quantity</label>
                    <input
                      type="number" min="1" max={selectedProduct?.stock ?? undefined} step="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-[#2B6F79]"
                    />
                    {selectedProduct && <p className="mt-1 text-xs text-gray-500">Available: {selectedProduct.stock}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Price (₹)</label>
                    <input
                      type="text" value={item.price ? `₹${Number(item.price).toLocaleString("en-IN")}` : "—"}
                      readOnly
                      className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-gray-700"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button type="button" onClick={addItem} className="mt-5 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Add Product
        </button>

        <div className="mt-6 grid gap-4 border-t border-gray-300 pt-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="w-full rounded-lg border border-gray-300 p-3">
              <option>Cash</option><option>UPI</option><option>Card</option><option>Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Payment Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as InvoiceStatus)} className="w-full rounded-lg border border-gray-300 p-3">
              <option>Paid</option><option>Pending</option><option>Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-gray-300 pt-5">
          <span className="text-lg font-semibold text-gray-700">Invoice Total</span>
          <span className="text-2xl font-bold text-gray-900">₹{total.toLocaleString("en-IN")}</span>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
          <button type="button" onClick={handleSave} className="rounded-lg bg-[#2B6F79] px-5 py-2.5 font-medium text-white hover:bg-[#22585F]">Save Invoice</button>
        </div>
      </div>
    </div>
  );
}
