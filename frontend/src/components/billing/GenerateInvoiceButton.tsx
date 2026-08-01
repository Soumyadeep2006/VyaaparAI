interface GenerateInvoiceButtonProps {
  onGenerate: () => void;
}

export default function GenerateInvoiceButton({
  onGenerate,
}: GenerateInvoiceButtonProps) {
  return (
    <button
      onClick={onGenerate}
      className="w-full rounded-2xl bg-primary py-4 text-lg font-semibold text-white transition hover:opacity-90"
    >
      Generate Invoice
    </button>
  );
}