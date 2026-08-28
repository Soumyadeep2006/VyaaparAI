import { useMemo, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import CustomerHeader from "../../components/customers/CustomerHeader";
import CustomerStats from "../../components/customers/CustomerStats";
import CustomerTable from "../../components/customers/CustomerTable";
import CustomerForm from "../../components/customers/CustomerForm";
import DeleteCustomerModal from "../../components/customers/DeleteCustomerModal";

import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "../../hooks/useCustomers";

import type { Customer } from "../../types/customer";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const {
    data: customers = [],
    isLoading,
    isError,
  } = useCustomers();

  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const filteredCustomers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      (customer.email ?? "").toLowerCase().includes(query)
    );
  }, [customers, search]);

  const handleSaveCustomer = async (customer: Customer) => {
    try {
      if (editingCustomer) {
        await updateMutation.mutateAsync({
          id: String(customer.id),
          data: customer,
        });
      } else {
        const { id, ...data } = customer;
        await createMutation.mutateAsync(data);
      }

      setShowForm(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error("Customer save error:", error);
      alert("Failed to save customer.");
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      await deleteMutation.mutateAsync(
        String(selectedCustomer.id)
      );

      setSelectedCustomer(null);
      setShowDelete(false);
    } catch (error) {
      console.error("Customer delete error:", error);
      alert("Failed to delete customer.");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          Loading customers...
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          Unable to load customers.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <CustomerHeader
          search={search}
          onSearchChange={setSearch}
          onAddCustomer={() => {
            setEditingCustomer(null);
            setShowForm(true);
          }}
        />

        <CustomerStats customers={filteredCustomers} />

        <CustomerTable
          customers={filteredCustomers}
          onEdit={(customer) => {
            setEditingCustomer(customer);
            setShowForm(true);
          }}
          onDelete={(customer) => {
            setSelectedCustomer(customer);
            setShowDelete(true);
          }}
        />

        <CustomerForm
          open={showForm}
          customer={editingCustomer}
          onClose={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
          onSave={handleSaveCustomer}
        />

        <DeleteCustomerModal
          open={showDelete}
          customerName={selectedCustomer?.name ?? ""}
          onCancel={() => {
            setShowDelete(false);
            setSelectedCustomer(null);
          }}
          onDelete={handleDeleteCustomer}
        />

      </div>
    </DashboardLayout>
  );
}