"use client";
import http, { HttpError } from "@/http/http";
import { create } from "zustand";
import WhiteListService from "@/http/whiteListService";
import { ServiceResponse } from "@/type/service.response";
import { IPagingParam } from "@/contains/paging";
import useAuthStore from "./useAuthStore";
const useCartStore = create((set: any, get: any) => ({
  cart: [],
  product: {},
  openModal: false,
  total: 0,
  getListCart: async (userId: any) => {
    try {
      const param: IPagingParam = {
        pageSize: 1000,
        pageNumber: 1,
        conditions: [{
          key: "userId",
          condition: "equal",
          value: userId,
        }],
        searchKey: "",
        searchFields: [],
        includeReferences: {
          product: true,
        },
        sortOrder: "updatedAt asc",
      };
      const res = await WhiteListService.getPaging<ServiceResponse>(param);
      if (res?.success) {
        set({
          cart: res.data.data || [],
        });
      }
    } catch (error) {
      throw error;
    }
  },

  addItemToCart: async (body: any) => {
    try {
      const res = await WhiteListService.post<ServiceResponse>("", body);
      if (res?.success) {
        await get().getListCart(body.userId);
      }
    } catch (error) {
      throw error;

    }
  },
  removeItemFromCart: async (id: any, userId: any) => {
    try {
      const res = await WhiteListService.deleteById<ServiceResponse>(id);
      if (res?.success) {
        await get().getListCart(userId)
      }
    } catch (error) {
      throw error;

    }
  },

}));

export default useCartStore;
