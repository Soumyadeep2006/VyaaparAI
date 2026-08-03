import { useQuery } from "@tanstack/react-query";

import api from "../../api/axios";
import Card from "../common/Card";
import Badge from "../common/Badge";

interface Product {
  id: string;
  name: string;
  quantity: number;
}

async function getLowStock(): Promise<Product[]> {
  const response = await api.get("/api/inventory/low-stock");

  return Array.isArray(response.data)
    ? response.data
    : [];
}

export default function LowStock() {
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["low-stock"],
    queryFn: getLowStock,
  });

  return (
    <Card>
      <h2 className="mb-5 text-lg font-semibold text-text-primary">
        Low Stock Alerts
      </h2>

      {isLoading && (
        <p className="text-sm text-text-secondary">
          Loading stock...
        </p>
      )}

      {isError && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Unable to load stock data.
        </p>
      )}

      {!isLoading &&
        !isError &&
        products.length === 0 && (
          <p className="text-sm text-text-secondary">
            No low-stock products.
          </p>
        )}

      {!isLoading &&
        !isError &&
        products.length > 0 && (
          <div className="space-y-4">
            {products.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-border bg-surface-2 p-4"
              >
                <div>
                  <p className="font-medium text-text-primary">
                    {item.name}
                  </p>

                  <p className="text-sm text-text-secondary">
                    {item.quantity} units left
                  </p>
                </div>

                <Badge color="red">
                  Low
                </Badge>
              </div>
            ))}
          </div>
        )}
    </Card>
  );
}