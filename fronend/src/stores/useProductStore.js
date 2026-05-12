import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  // ✅ CREATE PRODUCT
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);

      set((state) => ({
        products: [...state.products, res.data], // backend returns product
        loading: false,
      }));

      toast.success("Product created successfully!");
      return res.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create product"
      );
      set({ loading: false });
    }
  },

  // ✅ FETCH ALL
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");

      set({
        products: res.data.products, // backend returns { products }
        loading: false,
      });
    } catch (error) {
      toast.error("Failed to fetch products");
      set({ loading: false });
    }
  },

  // ✅ CATEGORY
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/category/${category}`);

      set({
        products: res.data.products,
        loading: false,
      });
    } catch (error) {
      toast.error("Failed to fetch products");
      set({ loading: false });
    }
  },

  // ✅ FEATURED
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products/featured");

      set({
        products: res.data, // backend returns array
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
    }
  },
}));