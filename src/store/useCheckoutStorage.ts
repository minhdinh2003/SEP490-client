import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCheckoutStore = create(
  persist(
    (set) => ({
      listCheckout: [],
      productCheckout: [],

      setListCheckout: (items: any) => set({ listCheckout: items }),
      setProductCheckout: (items: any) => set({ productCheckout: items }),
      clearListCheckout: () => set({ listCheckout: [], productCheckout: [] }),
    }),
    {
      name: "checkout-storage", // Tên khóa trong localStorage
      getStorage: () => localStorage, // Sử dụng localStorage
    }
  )
);

export default useCheckoutStore;
