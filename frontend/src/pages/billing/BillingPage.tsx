import { useState } from "react";

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
  items: InvoiceItem[];
  total: number;
}

export default function BillingPage() {
  const {
    data: invoices = [],
    refetch,
  } = useBilling();

  const [showForm, setShowForm] = useState(false);

  const handleSaveInvoice = async (data: InvoiceData) => {
    try {
      await createInvoice(data);

      await refetch();

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
          onRefresh={refetch}
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