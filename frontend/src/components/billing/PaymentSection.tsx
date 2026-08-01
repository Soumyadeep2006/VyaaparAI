interface PaymentSectionProps {
  payment: string;
  onChange: (value: string) => void;
}

export default function PaymentSection({
  payment,
  onChange,
}: PaymentSectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">

      <h2 className="mb-5 text-xl font-semibold">
        Payment Method
      </h2>

      <select
        value={payment}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border p-3"
      >
        <option>Cash</option>
        <option>UPI</option>
        <option>Card</option>
        <option>Bank Transfer</option>
      </select>

    </div>
  );
}