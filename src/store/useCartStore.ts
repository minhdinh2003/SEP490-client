"use client";
import http, { HttpError } from "@/http/http";
import { handleErrorHttp } from "@/utils/handleError";
import { error } from "console";
import { toast } from "react-toastify";
import { create } from "zustand";

const useCartStore = create((set:any, get:any) => ({
  cart: [],
  product: {},
  openModal: false,
  total:0,
  getListCart: async () => {
    try {
      const res = await http.get<any>("Cart");
      if (res?.payload?.Success) {
        set({
          cart: res?.payload?.Data?.CartItems|| [],
        });
      }
    } catch (error) {
      throw error;
    }
  },

  addItemToCart: async(body: any) => {
    try {
        const res = await http.post<any>("Cart/addProductToCart",body);
        if (res?.payload?.Success) {
           await get().getListCart()
        }
      } catch (error) {
       throw error;
      
      }
  },
  removeItemFromCart:async (cartItemID: any) => {
    try {
        const res = await http.delete<any>("Cart/cartItem?cartItemID=" + cartItemID,{
           
        });
        if (res?.payload?.Success) {
           await get().getListCart()
        }
      } catch (error) {
       throw error;
      
      }
  },
  updateCart: async(body:any) => {
    try {
        const res = await http.post<any>("Cart/updateCartItem",body);
        if (res?.payload?.Success) {
           await get().getListCart()
        }
      } catch (error) {
       throw error;
      
      }
  },
  
}));

export default useCartStore;
