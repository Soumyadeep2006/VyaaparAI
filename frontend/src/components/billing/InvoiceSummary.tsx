interface InvoiceSummaryProps {
  subtotal: number;
  gst: number;
}

export default function InvoiceSummary({
  subtotal,
  gst,
}: InvoiceSummaryProps) {
  const gstAmount = subtotal * gst / 100;

  const grandTotal = subtotal + gstAmount;

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">

      <h2 className="mb-5 text-xl font-semibold">
        Invoice Summary
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>GST ({gst}%)</span>
          <span>₹{gstAmount.toFixed(2)}</span>
        </div>

        <div className="border-t pt-4 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>

      </div>

    </div>
  );
}