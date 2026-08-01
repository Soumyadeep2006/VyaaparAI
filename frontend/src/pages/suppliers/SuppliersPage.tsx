import { useMemo, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import SupplierHeader from "../../components/suppliers/SupplierHeader";
import SupplierStats from "../../components/suppliers/SupplierStats";
import SupplierTable from "../../components/suppliers/SupplierTable";
import SupplierForm from "../../components/suppliers/SupplierForm";
import DeleteSupplierModal from "../../components/suppliers/DeleteSupplierModal";

import {
  useSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from "../../hooks/useSuppliers";

import type { Supplier } from "../../types/supplier";

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [editingSupplier, setEditingSupplier] =
    useState<Supplier | null>(null);

  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier | null>(null);

  const {
    data: suppliers = [],
    isLoading,
    isError,
  } = useSuppliers();

  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();

  const filteredSuppliers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(query) ||
        supplier.phone.includes(query) ||
        supplier.email.toLowerCase().includes(query)
    );
  }, [suppliers, search]);

  const handleSaveSupplier = async (supplier: Supplier) => {
    try {
      if (editingSupplier) {
        await updateMutation.mutateAsync({
          id: String(supplier.id),
          data: supplier,
        });
      } else {
        const { id, ...data } = supplier;
        await createMutation.mutateAsync(data);
      }

      setShowForm(false);
      setEditingSupplier(null);
    } catch (error) {
      console.error("Supplier save error:", error);
      alert("Failed to save supplier.");
    }
  };

  const handleDeleteSupplier = async () => {
    if (!selectedSupplier) return;

    try {
      await deleteMutation.mutateAsync(
        String(selectedSupplier.id)
      );

      setSelectedSupplier(null);
      setShowDelete(false);
    } catch (error) {
      console.error("Supplier delete error:", error);
      alert("Failed to delete supplier.");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          Loading suppliers...
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          Unable to load suppliers.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <SupplierHeader
          search={search}
          onSearchChange={setSearch}
          onAddSupplier={() => {
            setEditingSupplier(null);
            setShowForm(true);
          }}
        />

        <SupplierStats suppliers={filteredSuppliers} />

        <SupplierTable
          suppliers={filteredSuppliers}
          onEdit={(supplier) => {
            setEditingSupplier(supplier);
            setShowForm(true);
          }}
          onDelete={(supplier) => {
            setSelectedSupplier(supplier);
            setShowDelete(true);
          }}
        />

        <SupplierForm
          open={showForm}
          supplier={editingSupplier}
          onClose={() => {
            setShowForm(false);
            setEditingSupplier(null);
          }}
          onSave={handleSaveSupplier}
        />

        <DeleteSupplierModal
          open={showDelete}
          supplierName={selectedSupplier?.name ?? ""}
          onCancel={() => {
            setShowDelete(false);
            setSelectedSupplier(null);
          }}
          onDelete={handleDeleteSupplier}
        />

      </div>
    </DashboardLayout>
  );
}