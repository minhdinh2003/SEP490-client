"use client";

import PaymentMethod from "@/app/checkout/PaymentMethod";
import ShippingAddress from "@/app/checkout/ShippingAddress";
import NcInputNumber from "@/components/NcInputNumber";
import Prices from "@/components/Prices";
import http from "@/http/http";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import useCheckoutStore from "@/store/useCheckoutStorage";
import { handleErrorHttp } from "@/utils/handleError";
import { formatPriceVND, getUrlImage } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CheckoutAuction = () => {
  const query = useSearchParams();
  const isFromCart = query.get("fromCart") == "true";
  const [detail, setDetail] = useState<any>({});
  const { id } = useParams();

  const checkoutStore: any = useCheckoutStore();
  const router = useRouter();
  const [tabActive, setTabActive] = useState<
    "ContactInfo" | "ShippingAddress" | "PaymentMethod"
  >("ShippingAddress");

  const handleScrollToEl = (id: string) => {
    const element = document.getElementById(id);
    setTimeout(() => {
      element?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const [AddressId, setAddressId] = useState(null);

  const [method, setMethod] = useState("0");

  const product = {
    Images: detail?.ImageUrl,
    Price: Number(detail?.AuctionResult?.WinningBidAmount) - Number(Math.floor(detail?.Price * 10/100)),
    ProductName: detail?.Title,
    Quantity: 1,
  };
  const renderProduct = (item: any, index: any) => {
    const { Images: image, Price: price, ProductName: name, Quantity } = item;
    const imageFinal = getUrlImage(image);
    return (
      <div key={index} className="relative flex py-7 first:pt-0 last:pb-0">
        <div className="relative h-36 w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={imageFinal.mainImage}
            fill
            alt={name}
            className="h-full w-full object-contain object-center"
            sizes="150px"
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
                  x{Quantity}
                </div>
              </div>

              <div className="hidden flex-1 sm:flex justify-end">
                <Prices price={price} className="mt-0.5" />
              </div>
            </div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-sm">
            <div className=" invisible hidden sm:block text-center relative">
              <NcInputNumber className="relative z-10" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLeft = () => {
    return (
      <div className="space-y-8">
        <div id="ContactInfo" className="scroll-mt-24"></div>

        <div id="ShippingAddress" className="scroll-mt-24">
          <ShippingAddress
            AddressId={AddressId}
            setAddressId={setAddressId}
            isActive={tabActive === "ShippingAddress"}
            onOpenActive={() => {
              setTabActive("ShippingAddress");
              handleScrollToEl("ShippingAddress");
            }}
            onCloseActive={() => {
              setTabActive("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
          />
        </div>

        <div id="PaymentMethod" className="scroll-mt-24">
          <PaymentMethod
          isNoCash
            method={method}
            setMethod={setMethod}
            isActive={tabActive === "PaymentMethod"}
            onOpenActive={() => {
              setTabActive("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
            onCloseActive={() => setTabActive("PaymentMethod")}
          />
        </div>
      </div>
    );
  };

  
  // CHECK OUT
  const handleCheckout = async () => {
    if (!AddressId) {
      toast.error("vui lòng chọn địa chỉ giao hàng");
      return;
    }
    try {
      const body = {
        AuctionItemID:id,
        AddressID: AddressId,
        BankCode: "",
        Lang: "vn",
        DepositAmount: Number(product?.Price) ,
        PaymentMethod: Number(method),
      };
      const res = await http.post("Auction/PayAuction", body);
      if (res.payload.Success) {
        checkoutStore.clearListCheckout();
        if (method === "0") {
         if(typeof window !== 'undefined'){
          window.location.href = res.payload.Data;
         }
        } else {
          toast.success("Thanh toán thành công");
          router.push("/account-order");
        }
      }
    } catch (error: any) {
      handleErrorHttp(error.payload);
    }
  };

  const listProductCheckout = isFromCart
    ? checkoutStore.listCheckout
    : checkoutStore.productCheckout;
  const totalprice = listProductCheckout.reduce((total: number, item: any) => {
    return (total += item.Quantity * item.Price);
  }, 0);

  //
  const getDetail = async () => {
    try {
      const res: any = await http.get(`Auction/${id}`);
      setDetail(res?.payload.Data);
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  useEffect(() => {
    getDetail();
  }, [id]);
  return (
    <div className="nc-CheckoutPage">
      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
            Thanh toán
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

        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">{renderLeft()}</div>

          <div className="flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:lg:mx-14 2xl:mx-16 "></div>

          <div className="w-full lg:w-[36%] ">
            <h3 className="text-lg font-semibold">Danh sách đơn hàng</h3>
            <div className="mt-8 divide-y divide-slate-200/70 dark:divide-slate-700 ">
              {[product].map(renderProduct)}
            </div>

            <div className="mt-10 pt-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-slate-700 ">
              <div className="mt-4 flex justify-between py-2.5">
                <span>Tổng giá đơn hàng</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {formatPriceVND(product?.Price)}
                </span>
              </div>
              

              <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                <span>Tổng</span>
                <span> {formatPriceVND(product?.Price)}</span>
              </div>
            </div>
            <ButtonPrimary
              onClick={() => handleCheckout()}
              className="mt-8 w-full"
            >
              Thanh toán
            </ButtonPrimary>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutAuction;
