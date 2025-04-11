"use client";

import NcInputNumber from "@/components/NcInputNumber";
import Prices from "@/components/Prices";
import { useState } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import PaymentMethod from "./PaymentMethod";
import ShippingAddress from "./ShippingAddress";
import Image from "next/image";
import Link from "next/link";
import useCheckoutStore from "@/store/useCheckoutStorage";
import toast from "react-hot-toast";
import { handleErrorHttp } from "@/utils/handleError";
import http from "@/http/http";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPriceVND, getUrlImage } from "@/utils/helpers";
import useAuthStore from "@/store/useAuthStore";
import WithHydration from "@/HOC/withHydration";

const CheckoutPage = () => {
  const userStore = useAuthStore() as any;
  const user: any = userStore?.user;
  const query = useSearchParams();
  const isFromRequest = query.get("fromRequest") == "true";
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

  // Trạng thái cho mã voucher và tổng tiền sau khi giảm giá
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [discountedTotal, setDiscountedTotal] = useState<number | null>(null);

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

  const getAddressString = () => {
    return `${user?.province}, ${user?.district}, ${user.ward}, ${user.addressLine1}, ${user?.addressLine2}`;
  };

  // Hàm xử lý áp dụng mã voucher
  const applyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error("Vui lòng nhập mã voucher");
      return;
    }
    const listProductCheckout = isFromRequest
      ? checkoutStore.requestCheckout
      : checkoutStore.productCheckout;
    var request = listProductCheckout[0];
    try {
      const body = {
        voucherCode: voucherCode,
        quantity: 1,
        productId: parseInt(request.ProductID),
      };

      const res = await http.post("voucher/apply", body);

      if (res.payload.success) {
        const discountedAmount = res.payload.data.discountedPrice;
        setDiscountedTotal(discountedAmount);
        toast.success("Áp dụng mã voucher thành công");
      } else {
        toast.error("Mã voucher không hợp lệ");
      }
    } catch (error: any) {
      handleErrorHttp(error.payload);
      toast.error("Có lỗi xảy ra khi áp dụng mã voucher");
    }
  };

  // CHECK OUT FROM CART
  const checkoutFromCart = async () => {
    try {
      var request = checkoutStore.requestCheckout[0];
      const body = {
        requestId: Number(request.ProductID),
        paymentMethod: Number(method),
        fullName: user?.fullName,
        address: getAddressString(),
        phoneNumber: user?.phoneNumber,
        voucherCode: voucherCode,
      };

      const res = await http.post("order/createOrderRepair", body);
      return res;
    } catch (error: any) {
      throw error;
    }
  };

  // CHECKOUT FROM PRODUCT DETAIL PAGE
  const checkoutProductNow = async () => {
    try {
      const body = {
        orderItems: checkoutStore.productCheckout.map((i: any) => ({
          productId: Number(i.ProductID),
          quantity: i.Quantity,
          paymentMethod: Number(method),
        })),
        fullName: user?.fullName,
        address: getAddressString(),
        phoneNumber: user?.phoneNumber,
        voucherCode: voucherCode, // Thêm mã voucher vào body
      };

      const res = await http.post("order/createOrder", body);
      return res;
    } catch (error: any) {
      throw error;
    }
  };

  const handleCheckout = async () => {
    if (!getAddressString()) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    try {
      const res = isFromRequest
        ? await checkoutFromCart()
        : await checkoutProductNow();

      if (res.payload.success) {
        checkoutStore.clearListCheckout();
        if (method === "0") {
          if (typeof window !== "undefined") {
            window.location.href = res.payload.data;
          }
        } else {
          toast.success("Thanh toán thành công");
          router.push("/account-order");
          userStore.getInfoUser();
        }
      } else {
        toast.error(res.payload.devMessage);
      }
    } catch (error: any) {
      handleErrorHttp(error.payload);
    }
  };

  const listProductCheckout = isFromRequest
    ? checkoutStore.requestCheckout
    : checkoutStore.productCheckout;

  const totalprice = listProductCheckout.reduce((total: number, item: any) => {
    return (total += 1 * item.Price);
  }, 0);

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
            <h3 className="text-lg font-semibold">
              {isFromRequest ? "Sản phẩm sửa chữa" : "Danh sách đơn hàng"}
            </h3>
            <div className="mt-8 divide-y divide-slate-200/70 dark:divide-slate-700 ">
              {listProductCheckout.map(renderProduct)}
            </div>

            {!isFromRequest && (
              <div className="mt-6 flex items-center space-x-4">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Nhập mã voucher"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={applyVoucher}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-500 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            )}

            <div className="mt-10 pt-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-slate-700 ">
              <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                <span>Tổng</span>
                <span>{formatPriceVND(totalprice)}</span>
              </div>
              {discountedTotal !== null && (
                <div className="flex justify-between font-semibold text-green-600 text-base pt-2">
                  <span>Tổng sau khi giảm giá</span>
                  <span>{formatPriceVND(discountedTotal)}</span>
                </div>
              )}
            </div>

            <ButtonPrimary
              onClick={() => handleCheckout()}
              className="mt-8 w-full"
            >
              Đặt hàng
            </ButtonPrimary>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WithHydration(CheckoutPage);
