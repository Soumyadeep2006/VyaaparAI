import type { ReactNode } from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardPage from "./pages/dashboard/DashboardPage";
import InventoryPage from "./pages/inventory/InventoryPage";
import BillingPage from "./pages/billing/BillingPage";
import CustomersPage from "./pages/customers/CustomersPage";
import SuppliersPage from "./pages/suppliers/SuppliersPage";
import ReportsPage from "./pages/reports/ReportsPage";
import AIPage from "./pages/ai/AIPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import SettingsPage from "./pages/settings/SettingsPage";
function Protected({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>

      {/* Authentication */}
      <Route
        path="/login"
        element={<LoginPage />}
      />
      <Route
        path="/register"
        element={<RegisterPage />}
      />
      {/* Default */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <Protected>
            <DashboardPage />
          </Protected>
        }
      />

      {/* Inventory */}
      <Route
        path="/inventory"
        element={
          <Protected>
            <InventoryPage />
          </Protected>
        }
      />

      {/* Billing */}
      <Route
        path="/billing"
        element={
          <Protected>
            <BillingPage />
          </Protected>
        }
      />

      {/* Customers */}
      <Route
        path="/customers"
        element={
          <Protected>
            <CustomersPage />
          </Protected>
        }
      />

      {/* Suppliers */}
      <Route
        path="/suppliers"
        element={
          <Protected>
            <SuppliersPage />
          </Protected>
        }
      />

      {/* Reports */}
      <Route
        path="/reports"
        element={
          <Protected>
            <ReportsPage />
          </Protected>
        }
      />

      {/* AI */}
      <Route
        path="/ai"
        element={
          <Protected>
            <AIPage />
          </Protected>
        }
      />
      {/* Settings */}
      <Route
        path="/settings"
        element={
          <Protected>
            <SettingsPage />
          </Protected>
        }
      />
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
}