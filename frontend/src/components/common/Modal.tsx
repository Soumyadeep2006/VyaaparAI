import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  children: ReactNode;
}

export default function Modal({
  open,
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 text-text-primary shadow-xl">
        {children}
      </div>
    </div>
  );
}