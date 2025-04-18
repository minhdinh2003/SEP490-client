"use client";
import { NoSymbolIcon, CheckIcon } from "@heroicons/react/24/outline";
import NcInputNumber from "@/components/NcInputNumber";
import Prices from "@/components/Prices";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import useCartStore from "@/store/useCartStore";
import React from "react";
import { handleErrorHttp } from "@/utils/handleError";
import useCheckoutStore from "@/store/useCheckoutStorage";
import { useRouter } from "next/navigation";
import { formatPriceVND, getUrlImage } from "@/utils/helpers";
import { Avatar, Button } from "antd";

const CartPage = () => {
  const cartStore = useCartStore();
  const { cart, removeItemFromCart, updateCart } = cartStore;
  console.log(cart);
  const checkoutStore: any = useCheckoutStore();
  const router = useRouter();

  function groupByCreatorID(data: any) {
    const groupedData: any = {};

    data.forEach((item: any) => {
      if (!groupedData[item.CreatorID]) {
        groupedData[item.CreatorID] = [];
      }
      groupedData[item.CreatorID].push(item);
    });

    return groupedData;
  }

  // GROUP BY  CREATOR ID

  const listCartGroupByCreatorId = groupByCreatorID(cart);

  const renderStatusInstock = () => {
    return (
      <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <CheckIcon className="w-3.5 h-3.5" />
        <span className="ml-1 leading-none">In Stock</span>
      </div>
    );
  };
  const handleDeleteCart = async (id: number | string) => {
    try {
      cartStore.removeItemFromCart(id);
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  const changeQuantity = async (quantity: number, cartId: number | string) => {
    if (quantity <= 0) {
      return;
    }
    try {
      await updateCart({
        CartItemID: cartId,
        Quantity: quantity,
      });
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  const renderProduct = (item: any, index: number) => {
    const {
      Images: image,
      Price: price,
      ProductName: name,
      CartItemID,
      Quantity,
    } = item;
    const imageFinal = getUrlImage(image);

    return (
      <div
        key={index}
        className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0"
      >
        <div className="relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            fill
            src={imageFinal.mainImage}
            alt={name}
            sizes="300px"
            className="h-full w-full object-contain object-center"
          />
          <div className="absolute inset-0"></div>
        </div>

        <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div className="flex-[1.5] ">
                <h3 className="text-base font-semibold">
                  <div>{name}</div>
                </h3>
                <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-1.5"></div>
                  <span className="mx-4 border-l border-slate-200 dark:border-slate-700 "></span>
                  <div className="flex items-center space-x-1.5"></div>
                </div>
              </div>

              <div className="hidden sm:block text-center relative">
                <NcInputNumber
                  onClickDecrement={() =>
                    changeQuantity(Quantity - 1, CartItemID)
                  }
                  onClickIncrement={() =>
                    changeQuantity(Quantity + 1, CartItemID)
                  }
                  defaultValue={Quantity}
                  className="relative z-10"
                />
              </div>

              <div className="hidden flex-1 sm:flex justify-end">
                <Prices price={price} className="mt-0.5" />
              </div>
            </div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-sm">
            {renderStatusInstock()}

            <span
              onClick={() => handleDeleteCart(CartItemID)}
              className="relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm cursor-pointer "
            >
              <span>Xóa</span>
            </span>
          </div>
        </div>
      </div>
    );
  };
  const totalPriceCart = cart?.reduce((total: number, item: any) => {
    return (total += item.Price * item.Quantity);
  }, 0);
  return cart?.length > 0 ? (
    <div className="nc-CartPage">
      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-12 sm:mb-10">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
            Giỏ hàng
          </h2>
          <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400">
            <Link href={"/"} className="">
              Trang chủ
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <Link href={"/collection"} className="">
              Sản phẩm
            </Link>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700 my-10 xl:my-12" />

        <div className="flex flex-col lg:flex-row items-center justify-center">
          <div className="w-full lg:w-[80%] xl:w-[75%]  ">
            {Object.values(listCartGroupByCreatorId)?.map(
              (listCartByCreatorId: any) => {
                console.log(listCartByCreatorId);
                const totalPriceCart = listCartByCreatorId?.reduce(
                  (total: number, item: any) => {
                    return (total += item.Price * 1);
                  },
                  0
                );
                const avatar = listCartByCreatorId[0]?.CreatorAvatar || "/avt.svg";
                const creatorName = listCartByCreatorId[0]?.CreatorName || "";
                const creatorId = listCartByCreatorId[0]?.CreatorID || "";
                return (
                  <div className="pb-5 border-b mb-10">
                    <div className="flex items-center gap-2 border-b pb-4">
                      <Avatar src={avatar} />
                      <span className="font-bold">{creatorName}</span>
                    </div>

                    {listCartByCreatorId?.map(renderProduct)}
                    <div className="flex items-center justify-between">
                      <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                        <span>Tổng : </span>
                        <span>{formatPriceVND(totalPriceCart)}</span>
                      </div>
                      <ButtonPrimary
                        onClick={() => {
                          checkoutStore.setListCheckout(listCartByCreatorId);
                          router.push("/checkout?fromCart=true");
                        }}
                      >
                        Thanh toán
                      </ButtonPrimary>
                    </div>
                  </div>
                );
              }
            )}
          </div>
         
        </div>
      </main>
    </div>
  ) : (
    <div className="flex flex-col  justify-center items-center h-[400px] text-[20px]">
      Giỏ hàng trống
      <Link href={"/collection"}>
        <ButtonPrimary className="mt-5 text-sm">Đi tới cửa hàng</ButtonPrimary>
      </Link>
    </div>
  );
};

export default CartPage;
