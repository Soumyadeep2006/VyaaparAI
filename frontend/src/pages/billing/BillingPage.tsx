import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import DashboardLayout from "../../components/layout/DashboardLayout";
import BillingHeader from "../../components/billing/BillingHeader";
import InvoiceTable from "../../components/billing/InvoiceTable";
import InvoiceForm from "../../components/billing/InvoiceForm";

import { useBilling } from "../../hooks/useBilling";
import { createInvoice } from "../../api/billing";

interface InvoiceItem {
  product: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  customer: string;
  customer_id: string;
  items: (InvoiceItem & { product_id: string })[];
  total: number;
  status: "Pending" | "Paid" | "Cancelled";
  payment_method: "Cash" | "UPI" | "Card" | "Bank Transfer";
}

export default function BillingPage() {
  const {
    data: invoices = [],
    refetch,
  } = useBilling();

  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const refreshBillingData = async () => {
    await refetch();
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["customers"] }),
      queryClient.invalidateQueries({ queryKey: ["inventory"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      queryClient.invalidateQueries({ queryKey: ["reports"] }),
    ]);
  };

  const handleSaveInvoice = async (data: InvoiceData) => {
    try {
      await createInvoice(data);

      await refreshBillingData();

      setShowForm(false);
    } catch (error) {
      console.error("Invoice Error:", error);
      alert("Failed to create invoice.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <BillingHeader
          onAdd={() => setShowForm(true)}
        />

        {/* Invoice List */}
        <InvoiceTable
          invoices={invoices}
          onRefresh={refreshBillingData}
        />

        {/* Create Invoice Modal */}
        <InvoiceForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSaveInvoice}
        />

      </div>
    </DashboardLayout>
  );
}