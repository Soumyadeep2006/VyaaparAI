import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface DeleteProductModalProps {
  open: boolean;
  productName: string;
  onCancel: () => void;
  onDelete: () => void;
}

export default function DeleteProductModal({
  open,
  productName,
  onCancel,
  onDelete,
}: DeleteProductModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>

            <h2 className="text-center text-2xl font-bold">
              Delete Product
            </h2>

            <p className="mt-3 text-center text-text-secondary">
              Are you sure you want to delete
            </p>

            <p className="mt-2 text-center font-semibold text-text-primary">
              "{productName}"
            </p>

            <p className="mt-4 text-center text-sm text-red-500">
              This action cannot be undone.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 rounded-xl border border-border py-3 font-medium transition hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={onDelete}
                className="flex-1 rounded-xl bg-red-600 py-3 font-medium text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}