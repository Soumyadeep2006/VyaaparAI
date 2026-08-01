import {
  IndianRupee,
  TrendingUp,
  ShoppingCart,
  Wallet,
} from "lucide-react";

export default function ReportsStats() {
  const stats = [
    {
      title: "Revenue",
      value: "₹3,59,000",
      icon: IndianRupee,
      color: "bg-green-500",
    },
    {
      title: "Profit",
      value: "₹1,12,000",
      icon: TrendingUp,
      color: "bg-blue-500",
    },
    {
      title: "Orders",
      value: "1,245",
      icon: ShoppingCart,
      color: "bg-orange-500",
    },
    {
      title: "Expenses",
      value: "₹2,47,000",
      icon: Wallet,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-2xl bg-white p-6 shadow"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {item.value}
                </h2>

              </div>

              <div
                className={`rounded-xl p-3 text-white ${item.color}`}
              >
                <Icon size={26} />
              </div>

            </div>
          </div>
        );
      })}

    </div>
  );
}