"use client";

import { Popover, Transition } from "@/app/headlessui";
import Prices from "@/components/Prices";
import { Product, PRODUCTS } from "@/data/data";
import { Fragment } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Image from "next/image";
import Link from "next/link";
import useCartStore from "@/store/useCartStore";
import { handleErrorHttp } from "@/utils/handleError";
import useCheckoutStore from "@/store/useCheckoutStorage";
import { useRouter } from "next/navigation";
import { formatCoin, getUrlImage } from "@/utils/helpers";
import useAuthStore from "@/store/useAuthStore";

export default function CoinComponent() {
    const authStore:any = useAuthStore();
  const router = useRouter()
  const cartStore = useCartStore();
  const { cart, removeItemFromCart, updateCart } = cartStore;
  const checkoutStore: any = useCheckoutStore();
  const handleDeleteCart = async (id: number | string) => {
    try {
      cartStore.removeItemFromCart(id);
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  const totalPriceCart = cartStore?.cart.reduce((total: number, item: any) => {
    return (total += item.Price * item.Quantity);
  }, 0);
 

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`
                ${open ? "" : "text-opacity-90"}
                 group w-10 h-10 sm:w-12 sm:h-12 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative`}
          >
            {authStore?.user?.Coin?.Amount > 0 && (
              <div className="p-1 flex items-center justify-center bg-primary-500 absolute top-[4px] right-1 rounded-full text-[10px] leading-none text-white font-medium">
                <span className="mt-[1px]">{formatCoin(authStore?.user?.Coin?.Amount)}</span>
              </div>
            )}
             <Image className="ml-1"  width={22} height={22} alt="" src={"/coin.svg"} />

            <Link className="block md:hidden absolute inset-0" href={"/cart"} />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="hidden md:block absolute z-10 w-screen max-w-xs sm:max-w-md px-4 mt-3.5 -right-28 sm:right-0 sm:px-0">
             
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
