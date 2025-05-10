import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCheckoutStore = create(
  persist(
    (set) => ({
      listCheckout: [],
      productCheckout: [],
      requestCheckout: [],

      setListCheckout: (items: any) => set({ listCheckout: items }),
      setProductCheckout: (items: any) => set({ productCheckout: items }),
      setRequestCheckout:  (items: any) => set({ requestCheckout: items }),
      clearListCheckout: () => set({ listCheckout: [], productCheckout: [], requestCheckout: [] }),
    }),
    {
      name: "checkout-storage", // Tên khóa trong localStorage
      getStorage: () => localStorage, // Sử dụng localStorage
    }
  )
);

export default useCheckoutStore;
