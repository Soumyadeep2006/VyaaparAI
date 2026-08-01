import { useState } from "react";
import { Eye, X, CheckCircle2, Clock3, Ban } from "lucide-react";
import type { Invoice } from "../../types/invoice";
import { updateInvoiceStatus } from "../../api/billing";

interface InvoiceTableProps {
  invoices: Invoice[];
  onRefresh?: () => void;
}

type InvoiceStatus = "Pending" | "Paid" | "Cancelled";

export default function InvoiceTable({
  invoices,
  onRefresh,
}: InvoiceTableProps) {
  const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice | null>(null);

  const [updating, setUpdating] = useState(false);

  const getInvoiceId = (invoice: Invoice) => {
    return invoice.id || invoice._id || "";
  };

  const getStatusClass = (status: InvoiceStatus) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400";

      case "Cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";

      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400";
    }
  };

  const getStatusIcon = (status: InvoiceStatus) => {
    if (status === "Paid") {
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    }

    if (status === "Cancelled") {
      return <Ban className="h-3.5 w-3.5" />;
    }

    return <Clock3 className="h-3.5 w-3.5" />;
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN");
  };

  const handleStatusChange = async (
    status: InvoiceStatus
  ) => {
    if (!selectedInvoice) return;

    const invoiceId = getInvoiceId(selectedInvoice);

    if (!invoiceId) {
      alert("Invoice ID not found.");
      return;
    }

    try {
      setUpdating(true);

      const updatedInvoice = await updateInvoiceStatus(
        invoiceId,
        status
      );

      setSelectedInvoice({
        ...selectedInvoice,
        ...updatedInvoice,
        status,
      });

      onRefresh?.();
    } catch (error) {
      console.error("Status update error:", error);

      alert("Unable to update invoice status.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      {/* ================= INVOICE TABLE ================= */}

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            {/* HEADER */}

            <thead className="border-b border-border bg-surface-2">

              <tr className="text-left">

                <th className="px-6 py-4 text-sm font-semibold text-text">
                  Invoice ID
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-text">
                  Customer
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-text">
                  Total
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-text">
                  Status
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-text">
                  Date
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-text">
                  Action
                </th>

              </tr>

            </thead>

            {/* BODY */}

            <tbody>

              {invoices.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-text-secondary"
                  >
                    No invoices found.
                  </td>

                </tr>

              ) : (

                invoices.map((invoice) => {

                  const status: InvoiceStatus =
                    invoice.status || "Pending";

                  return (

                    <tr
                      key={getInvoiceId(invoice)}
                      className="
                        border-b border-border
                        last:border-0
                        transition-colors
                        hover:bg-surface-2
                      "
                    >

                      {/* Invoice ID */}

                      <td className="px-6 py-5 text-sm font-medium text-text">
                        {getInvoiceId(invoice)}
                      </td>

                      {/* Customer */}

                      <td className="px-6 py-5 text-sm text-text-secondary">
                        {invoice.customer}
                      </td>

                      {/* Total */}

                      <td className="px-6 py-5 font-semibold text-text">
                        ₹
                        {invoice.total.toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                            status
                          )}`}
                        >

                          {getStatusIcon(status)}

                          {status}

                        </span>

                      </td>

                      {/* DATE */}

                      <td className="px-6 py-5 text-sm text-text-secondary">
                        {formatDate(
                          invoice.created_at
                        )}
                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-5">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedInvoice(invoice)
                          }
                          className="
                            flex items-center gap-2
                            rounded-lg
                            border border-border
                            bg-surface
                            px-4 py-2
                            text-sm font-medium
                            text-text
                            transition
                            hover:bg-surface-2
                            hover:border-primary
                          "
                        >

                          <Eye className="h-4 w-4" />

                          View

                        </button>

                      </td>

                    </tr>

                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= INVOICE MODAL ================= */}

      {selectedInvoice && (

        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
          "
        >

          <div
            className="
              max-h-[90vh]
              w-full max-w-2xl
              overflow-y-auto
              rounded-2xl
              border border-border
              bg-surface
              p-6
              text-text
              shadow-xl
            "
          >

            {/* HEADER */}

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-text">
                  Invoice Details
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  Invoice ID:{" "}
                  {getInvoiceId(selectedInvoice)}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedInvoice(null)
                }
                className="
                  rounded-lg
                  p-2
                  text-text-secondary
                  transition
                  hover:bg-surface-2
                  hover:text-text
                "
              >

                <X className="h-6 w-6" />

              </button>

            </div>

            {/* CUSTOMER */}

            <div
              className="
                mb-6
                rounded-xl
                border border-border
                bg-surface-2
                p-4
              "
            >

              <p className="text-sm text-text-secondary">
                Customer
              </p>

              <p className="mt-1 text-lg font-semibold text-text">
                {selectedInvoice.customer}
              </p>

            </div>

            {/* PAYMENT STATUS */}

            <div className="mb-6">

              <label className="mb-2 block text-sm font-semibold text-text">
                Payment Status
              </label>

              <div className="grid grid-cols-3 gap-3">

                {/* PENDING */}

                <button
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    handleStatusChange("Pending")
                  }
                  className={`
                    flex items-center justify-center gap-2
                    rounded-xl
                    border
                    px-3 py-3
                    text-sm font-semibold
                    transition
                    ${
                      selectedInvoice.status === "Pending" ||
                      !selectedInvoice.status
                        ? "border-yellow-500 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                        : "border-border bg-surface text-text-secondary hover:bg-surface-2"
                    }
                  `}
                >

                  <Clock3 className="h-4 w-4" />

                  Pending

                </button>

                {/* PAID */}

                <button
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    handleStatusChange("Paid")
                  }
                  className={`
                    flex items-center justify-center gap-2
                    rounded-xl
                    border
                    px-3 py-3
                    text-sm font-semibold
                    transition
                    ${
                      selectedInvoice.status === "Paid"
                        ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400"
                        : "border-border bg-surface text-text-secondary hover:bg-surface-2"
                    }
                  `}
                >

                  <CheckCircle2 className="h-4 w-4" />

                  Paid

                </button>

                {/* CANCELLED */}

                <button
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    handleStatusChange("Cancelled")
                  }
                  className={`
                    flex items-center justify-center gap-2
                    rounded-xl
                    border
                    px-3 py-3
                    text-sm font-semibold
                    transition
                    ${
                      selectedInvoice.status === "Cancelled"
                        ? "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400"
                        : "border-border bg-surface text-text-secondary hover:bg-surface-2"
                    }
                  `}
                >

                  <Ban className="h-4 w-4" />

                  Cancelled

                </button>

              </div>

              {updating && (
                <p className="mt-2 text-sm text-text-secondary">
                  Updating payment status...
                </p>
              )}

            </div>

            {/* PRODUCTS */}

            <div className="overflow-hidden rounded-xl border border-border">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[500px]">

                  <thead className="bg-surface-2">

                    <tr>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-text">
                        Product
                      </th>

                      <th className="px-4 py-3 text-center text-sm font-semibold text-text">
                        Qty
                      </th>

                      <th className="px-4 py-3 text-right text-sm font-semibold text-text">
                        Price
                      </th>

                      <th className="px-4 py-3 text-right text-sm font-semibold text-text">
                        Amount
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {selectedInvoice.items?.map(
                      (item, index) => (

                        <tr
                          key={index}
                          className="
                            border-t border-border
                            transition-colors
                            hover:bg-surface-2
                          "
                        >

                          <td className="px-4 py-4 text-sm text-text">
                            {item.product ||
                              item.productId ||
                              "Unknown product"}
                          </td>

                          <td className="px-4 py-4 text-center text-sm text-text-secondary">
                            {item.quantity}
                          </td>

                          <td className="px-4 py-4 text-right text-sm text-text-secondary">
                            ₹
                            {item.price.toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td className="px-4 py-4 text-right text-sm font-medium text-text">
                            ₹
                            {(
                              item.quantity *
                              item.price
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* TOTAL */}

            <div
              className="
                mt-6
                flex items-center justify-between
                border-t border-border
                pt-5
              "
            >

              <span className="text-lg font-semibold text-text-secondary">
                Invoice Total
              </span>

              <span className="text-2xl font-bold text-text">
                ₹
                {selectedInvoice.total.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            {/* CLOSE */}

            <div className="mt-6 flex justify-end">

              <button
                type="button"
                onClick={() =>
                  setSelectedInvoice(null)
                }
                className="
                  rounded-xl
                  bg-primary
                  px-5 py-2.5
                  font-medium
                  text-white
                  transition
                  hover:bg-primary-dark
                "
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}