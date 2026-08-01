import {
  Package,
  AlertTriangle,
  IndianRupee,
} from "lucide-react";

import type { Product } from "../../types/product";

interface InventoryStatsProps {
  products: Product[];
}

export default function InventoryStats({
  products,
}: InventoryStatsProps) {
  const totalProducts = products.length;

  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= 10
  ).length;

  const outOfStock = products.filter(
    (product) => product.stock === 0
  ).length;

  const inventoryValue = products.reduce(
    (total, product) =>
      total + Number(product.price || 0) * Number(product.stock || 0),
    0
  );

  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toLocaleString("en-IN"),
      icon: Package,
    },
    {
      title: "Low Stock",
      value: lowStock.toLocaleString("en-IN"),
      icon: AlertTriangle,
    },
    {
      title: "Out of Stock",
      value: outOfStock.toLocaleString("en-IN"),
      icon: Package,
    },
    {
      title: "Inventory Value",
      value: `₹${inventoryValue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  {stat.title}
                </p>

                <h3 className="mt-2 text-2xl font-bold text-text-primary">
                  {stat.value}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-primary">
                <Icon size={22} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
