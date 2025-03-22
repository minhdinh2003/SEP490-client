"use client";
import { persist } from "zustand/middleware";
import UserService from "@/http/userService";
import { create } from "zustand";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLogin: false,
      getInfoUser: async (user: any) => {
        if (user) {
          set({ user, isLogin: true });
          return;
        }

        // call api user
        const result = await UserService.getCurrentUser();

        set({
          user: result.data,
          isLogin: true
        });
      },
      logout: async () => {
      
        set({isLogin: false });
       
    }
    }),
  

    {
      name: "auth-storage", // Tên khóa trong localStorage
      getStorage: () => localStorage, // Sử dụng localStorage
    }
  )
);

export default useAuthStore;
