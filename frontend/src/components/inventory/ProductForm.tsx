import { useEffect } from "react";
import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

import type { Product } from "../../types/product";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  sku: z.string().min(2, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  price: z
    .number({
      error: "Price is required",
    })
    .min(1, "Price must be greater than 0"),
  stock: z
    .number({
      error: "Stock is required",
    })
    .min(0, "Stock cannot be negative"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  open: boolean;
  product?: Product | null;
  onClose: () => void;
  onSubmit: SubmitHandler<ProductFormData>;
}

export default function ProductForm({
  open,
  product,
  onClose,
  onSubmit,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      price: 0,
      stock: 0,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        stock: product.stock,
      });
    } else {
      reset({
        name: "",
        sku: "",
        category: "",
        price: 0,
        stock: 0,
      });
    }
  }, [product, reset]);

  if (!open) return null;

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("SAVE BUTTON CLICKED");
          handleSubmit(onSubmit)(e);
        }}
        className="space-y-5"
      >

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Product Name
          </label>

          <input
            {...register("name")}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.name?.message}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            SKU
          </label>

          <input
            {...register("sku")}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.sku?.message}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Category
          </label>

          <input
            {...register("category")}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.category?.message}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Price
            </label>

            <input
              type="number"
              {...register("price", {
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            />

            <p className="mt-1 text-sm text-red-500">
              {errors.price?.message}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Stock
            </label>

            <input
              type="number"
              {...register("stock", {
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            />

            <p className="mt-1 text-sm text-red-500">
              {errors.stock?.message}
            </p>
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-500 hover:bg-gray-600 px-5 py-2 text-white font-semibold"

          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 text-white font-semibold"
          >
            {product ? "Update Product" : "Save Product"}
          </button>

        </div>

      </form>

    </div>
  </div>
  );
}