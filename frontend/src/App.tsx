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
import SettingsPage from "./pages/settings/SettingsPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

import ProtectedRoute from "./components/auth/ProtectedRoute";

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

      {/* ================= AUTH ================= */}

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />

      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />

      {/* ================= DEFAULT ================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* ================= PROTECTED ================= */}

      <Route
        path="/dashboard"
        element={
          <Protected>
            <DashboardPage />
          </Protected>
        }
      />

      <Route
        path="/inventory"
        element={
          <Protected>
            <InventoryPage />
          </Protected>
        }
      />

      <Route
        path="/billing"
        element={
          <Protected>
            <BillingPage />
          </Protected>
        }
      />

      <Route
        path="/customers"
        element={
          <Protected>
            <CustomersPage />
          </Protected>
        }
      />

      <Route
        path="/suppliers"
        element={
          <Protected>
            <SuppliersPage />
          </Protected>
        }
      />

      <Route
        path="/reports"
        element={
          <Protected>
            <ReportsPage />
          </Protected>
        }
      />

      <Route
        path="/ai"
        element={
          <Protected>
            <AIPage />
          </Protected>
        }
      />

      <Route
        path="/settings"
        element={
          <Protected>
            <SettingsPage />
          </Protected>
        }
      />

      {/* ================= FALLBACK ================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
}