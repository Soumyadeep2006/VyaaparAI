import type { ComponentType } from "react";

interface KPIcardProps {
  title: string;
  value: string;
  change: string;
  icon: ComponentType<{ className?: string }>;
}

export default function KPIcard({
  title,
  value,
  change,
  icon: Icon,
}: KPIcardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-text-secondary">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-text-primary">
            {value}
          </h2>

          <p className="mt-3 text-sm font-semibold text-green-600">
            {change}
          </p>
        </div>

        <div className="rounded-xl bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>

      </div>

    </div>
  );
}