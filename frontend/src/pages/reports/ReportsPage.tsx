import DashboardLayout from "../../components/layout/DashboardLayout";

import ReportsHeader from "../../components/reports/ReportsHeader";
import ReportsStats from "../../components/reports/ReportsStats";
import RevenueChart from "../../components/reports/RevenueChart";
import ProfitChart from "../../components/reports/ProfitChart";
import SalesByCategory from "../../components/reports/SalesByCategory";
import TopProducts from "../../components/reports/TopProducts";
import RecentTransactions from "../../components/reports/RecentTransactions";

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        <ReportsHeader />

        <ReportsStats />

        <RevenueChart />

        <div className="grid gap-6 lg:grid-cols-2">

          <ProfitChart />

          <SalesByCategory />

        </div>

        <div className="grid gap-6 xl:grid-cols-2">

          <TopProducts />

          <RecentTransactions />

        </div>

      </div>
    </DashboardLayout>
  );
}