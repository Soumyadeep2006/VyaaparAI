import { useMemo, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import InventoryHeader from "../../components/inventory/InventoryHeader";
import InventoryStats from "../../components/inventory/InventoryStats";
import InventoryTable from "../../components/inventory/InventoryTable";
import ProductForm from "../../components/inventory/ProductForm";
import DeleteProductModal from "../../components/inventory/DeleteProductModal";

import type { Product } from "../../types/product";

import { useInventory } from "../../hooks/useInventory";

import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../api/inventory";

export default function InventoryPage() {
  const {
    data: products = [],
    refetch,
  } = useInventory();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const categories = useMemo<string[]>(() => {
    // Ensure the resulting array is typed as string[] to satisfy TypeScript
    const unique = Array.from(
      new Set(products.map((p: Product) => p.category))
    ) as string[];

    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        product.sku
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        product.category
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const handleSaveProduct = async (data: {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
}) => {
  try {
    console.log("Submitting:", data);

    if (editingProduct) {
      await updateProduct(editingProduct.id.toString(), data);
      alert("Product Updated Successfully");
    } else {
      await addProduct(data);
      alert("Product Added Successfully");
    }

    await refetch();

    setEditingProduct(null);
    setShowForm(false);
  } catch (error) {
    console.error(error);
    alert("Failed to save product.");
  }
};

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await deleteProduct(
        selectedProduct.id.toString()
      );

      await refetch();

      setSelectedProduct(null);
      setShowDelete(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <InventoryHeader
          onAddProduct={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          search={search}
          onSearchChange={setSearch}
          category={category}
          categories={categories}
          onCategoryChange={setCategory}
        />

        <InventoryStats
          products={filteredProducts}
        />

        <InventoryTable
          products={filteredProducts}
          onEdit={(product) => {
            setEditingProduct(product);
            setShowForm(true);
          }}
          onDelete={(product) => {
            setSelectedProduct(product);
            setShowDelete(true);
          }}
        />

        <ProductForm
          open={showForm}
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null);
            setShowForm(false);
          }}
          onSubmit={handleSaveProduct}
        />

        <DeleteProductModal
          open={showDelete}
          productName={selectedProduct?.name ?? ""}
          onCancel={() => {
            setSelectedProduct(null);
            setShowDelete(false);
          }}
          onDelete={handleDeleteProduct}
        />
      </div>
    </DashboardLayout>
  );
}