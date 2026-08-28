import { useQuery } from "@tanstack/react-query";

import api from "../../api/axios";
import Card from "../common/Card";
import Badge from "../common/Badge";

interface Product {
  id: string;
  name: string;
  quantity: number;
  category?: string;
  price?: number;
}

async function getLowStock(): Promise<Product[]> {
  const response = await api.get<Product[]>(
    "/api/inventory/low-stock"
  );

  if (!Array.isArray(response.data)) {
    return [];
  }

  return response.data;
}

export default function LowStock() {
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery<Product[]>({
    queryKey: ["low-stock"],
    queryFn: getLowStock,
    staleTime: 0,
    refetchOnMount: "always",
  });

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          Low Stock Alerts
        </h2>

        {products.length > 0 && (
          <Badge color="red">
            {products.length} Alert
            {products.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="py-6 text-center">
          <p className="text-sm text-text-secondary">
            Loading stock...
          </p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Unable to load stock data.
          </p>

          {import.meta.env.DEV && (
            <p className="mt-1 break-all text-xs text-red-500">
              {error instanceof Error
                ? error.message
                : "Unknown error"}
            </p>
          )}
        </div>
      )}

      {/* No low stock */}
      {!isLoading &&
        !isError &&
        products.length === 0 && (
          <div className="py-6 text-center">
            <p className="text-sm font-medium text-text-primary">
              All products are sufficiently stocked.
            </p>

            <p className="mt-1 text-xs text-text-secondary">
              No products have less than 10 units.
            </p>
          </div>
        )}

      {/* Low stock products */}
      {!isLoading &&
        !isError &&
        products.length > 0 && (
          <div className="space-y-3">
            {products.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-border bg-surface-2 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-text-primary">
                    {item.name}
                  </p>

                  {item.category && (
                    <p className="mt-1 text-xs text-text-secondary">
                      {item.category}
                    </p>
                  )}

                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    Only {item.quantity}{" "}
                    {item.quantity === 1 ? "unit" : "units"} left
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
