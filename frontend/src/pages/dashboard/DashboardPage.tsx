import DashboardLayout from "../../components/layout/DashboardLayout";
import KPIcard from "../../components/dashboard/KPIcard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import RecentOrders from "../../components/dashboard/RecentOrders";
import LowStock from "../../components/dashboard/LowStock";
import AIInsight from "../../components/dashboard/AIInsight";
import QuickActions from "../../components/dashboard/QuickActions";

import {
  ShoppingCart,
  Users,
  Package,
  IndianRupee,
} from "lucide-react";

import { useDashboard } from "../../hooks/useDashboard";

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-text-secondary">
            Loading dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-border bg-surface p-6 text-red-600 dark:text-red-400">
          Unable to load dashboard data.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-text-primary">
            Dashboard
          </h1>

          <p className="mt-2 text-text-secondary">
            Welcome back 👋
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <KPIcard
            title="Revenue"
            value={`₹${Number(data?.revenue ?? 0).toLocaleString("en-IN")}`}
            change="+12.5%"
            icon={IndianRupee}
          />

          <KPIcard
            title="Orders"
            value={String(data?.orders ?? 0)}
            change="+8.1%"
            icon={ShoppingCart}
          />

          <KPIcard
            title="Customers"
            value={String(data?.customers ?? 0)}
            change="+5.7%"
            icon={Users}
          />

          <KPIcard
            title="Products"
            value={String(data?.products ?? 0)}
            change="+3.2%"
            icon={Package}
          />
        </div>

        {/* Revenue + Low Stock */}
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RevenueChart />
          </div>

          <LowStock />
        </div>

        {/* Recent Orders + AI */}
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RecentOrders />
          </div>

          <AIInsight />
        </div>

        {/* Quick Actions */}
        <QuickActions />

      </div>
    </DashboardLayout>
  );
}