import {
Routes,
Route,
Navigate,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

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

import NotFoundPage from "./pages/NotFoundPage";

function ProtectedRoute({
children,
}: {
children: React.ReactNode;
}) {
const { isAuthenticated } = useAuth();

if (!isAuthenticated) {
return <Navigate to="/login" replace />;
}

return <>{children}</>;
}

export default function App() {
return ( <Routes>

```
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
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/inventory"
    element={
      <ProtectedRoute>
        <InventoryPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/billing"
    element={
      <ProtectedRoute>
        <BillingPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/customers"
    element={
      <ProtectedRoute>
        <CustomersPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/suppliers"
    element={
      <ProtectedRoute>
        <SuppliersPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/reports"
    element={
      <ProtectedRoute>
        <ReportsPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/ai"
    element={
      <ProtectedRoute>
        <AIPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/settings"
    element={
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    }
  />


  {/* ================= 404 ================= */}

  <Route
    path="*"
    element={<NotFoundPage />}
  />

</Routes>


);
}
