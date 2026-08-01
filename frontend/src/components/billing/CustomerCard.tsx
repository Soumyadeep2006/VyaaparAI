import { customers } from "../../constants/customers";

interface Props {
  customerId: number;
  onChange: (id: number) => void;
}

export default function CustomerCard({
  customerId,
  onChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">

      <h2 className="mb-4 text-xl font-semibold">
        Customer
      </h2>

      <select
        value={customerId}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="w-full rounded-xl border border-border p-3"
      >
        {customers.map((customer) => (
          <option
            key={customer.id}
            value={customer.id}
          >
            {customer.name}
          </option>
        ))}
      </select>

    </div>
  );
}