import {
  Bot,
  MessageSquare,
  Sparkles,
  Brain,
} from "lucide-react";

const stats = [
  {
    title: "Queries Today",
    value: "42",
    icon: MessageSquare,
  },
  {
    title: "Insights Generated",
    value: "18",
    icon: Sparkles,
  },
  {
    title: "Predictions",
    value: "7",
    icon: Brain,
  },
  {
    title: "AI Status",
    value: "Online",
    icon: Bot,
  },
];

export default function AIStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {item.value}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2B6F79]/10">
                <Icon
                  size={26}
                  className="text-[#2B6F79]"
                />
              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
}