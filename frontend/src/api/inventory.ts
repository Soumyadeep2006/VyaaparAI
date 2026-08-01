import api from "./axios";

const mapProduct = (product: any) => ({
  ...product,

  id: product.id,

  stock: product.quantity,

  sku: product.sku ?? "N/A",
});

export const getProducts = async () => {
  const res = await api.get("/api/inventory/");

  return res.data.map(mapProduct);
};

export const getProduct = async (id: string) => {
  const res = await api.get(`/api/inventory/${id}`);

  return mapProduct(res.data);
};

export const addProduct = async (data: any) => {
  const payload = {
    name: data.name,
    category: data.category,
    price: data.price,
    quantity: data.stock,
  };

  const res = await api.post("/api/inventory/", payload);

  return mapProduct(res.data);
};

export const updateProduct = async (
  id: string,
  data: any
) => {
  const payload = {
    name: data.name,
    category: data.category,
    price: data.price,
    quantity: data.stock,
  };

  const res = await api.put(`/api/inventory/${id}`, payload);

  return mapProduct(res.data);
};

export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/api/inventory/${id}`);

  return res.data;
};

export const searchProducts = async (query: string) => {
  const res = await api.get(
    `/api/inventory/search?query=${query}`
  );

  return res.data.map(mapProduct);
};

export const lowStockProducts = async () => {
  const res = await api.get("/api/inventory/low-stock");

  return res.data.map(mapProduct);
};