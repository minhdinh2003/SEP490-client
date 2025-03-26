"use client";
import Prices from "@/components/Prices";
import { PAYMENT_METHOD, SHIPING_STATUS } from "@/contains/contants";
import { PRODUCTS } from "@/data/data";
import WithHydration from "@/HOC/withHydration";
import { useGetData } from "@/hooks/useGetData";
import http from "@/http/http";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Select from "@/shared/Select/Select";
import useAuthStore from "@/store/useAuthStore";
import { handleErrorHttp } from "@/utils/handleError";
import {
  dateFormat2,
  getShippingStatusColor,
  getUrlImage,
  ShippingStatus,
  ShippingStatusDetails,
} from "@/utils/helpers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import TabOrder from "../account-order/TabOrder";

const OrderMe = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const [reget, setReget] = useState(1);
  let { data: listOrder } = useGetData("Order/Creator?statusOrder=-1", [
    reget,
  ]) as any;
  const { data: listOrderAll } = useGetData("Order/Creator?statusOrder=-1", [
    reget,
  ]) as any;
  listOrder = listOrderAll.filter((i: any) => {
    const type = i.OrderItems[0]?.Product?.ProductType;
    return type == activeTab;
  });

  const userStorage: any = useAuthStore();
  const renderProductItem = (product: any, index: number) => {
    const { Product } = product;
    return (
      <div className="pb-10 border-b pt-5 last:border-b-0">
        {
          Product?.ProductCode && <div
          onClick={() => router.push(`/product-code/${Product?.ProductCode}`)}
          className="mb-5 text-gray-500"
        >
          Mã định danh :
          <span className="cursor-pointer text-green-500 font-bold">
            {" "}
            {Product?.ProductCode}
          </span>
        </div>
        }
        <div key={index} className="flex ">
          <div className="relative h-24 w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <Image
              fill
              sizes="100px"
              src={getUrlImage(Product?.Images).mainImage}
              alt={Product?.Name}
              className="h-full w-full object-cover object-center"
            />
          </div>

          <div className="ml-4 flex flex-1 flex-col">
            <div>
              <div className="flex justify-between ">
                <div>
                  <h3 className="text-base font-medium line-clamp-1">
                    {Product?.Name}
                  </h3>
                </div>
                <Prices price={product?.Price} className="mt-0.5 ml-2" />
              </div>
            </div>
            <div className="flex flex-1 items-end justify-between text-sm">
              <p className="text-gray-500 dark:text-slate-400 flex items-center">
                <span className="inline-block ">x</span>
                <span className="ml-2">{product?.Quantity}</span>
              </p>

            </div>
          </div>
        </div>
      </div>
    );
  };

  //
  const changeStatus = async (key: Number, orderId: any) => {
    try {
      await http.put("Order/ShippingStatus", {
        OrderID: orderId,
        ShippingStatus: key,
      });
      toast.success("Đã thay đổi trạng thái đơn hàng");
      setReget(reget + 1);
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  const renderOrder = () => {
    return listOrder?.map((order: any, index: number) => (
      <div
        key={index}
        className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden z-0"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div>
            <p
              style={{
                color: getShippingStatusColor(order?.ShippingStatus),
              }}
              className=" capitalize"
            >
              {ShippingStatusDetails[order?.ShippingStatus]?.text}
            </p>

            <p className="text-lg font-semibold">{order?.OrderNo}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span>{dateFormat2(order?.CreatedDate)}</span>
              <span className="mx-2">·</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              {PAYMENT_METHOD[order?.PaymentMethod]}
            </p>
          </div>
          <div className="mt-3 sm:mt-0 ">
            <ButtonSecondary
              className="mb-4"
              onClick={() => router.push(`/account-order/${order?.OrderID}`)}
              sizeClass="py-2.5 px-4 sm:px-6"
              fontSize="text-sm font-medium"
            >
              Xem đơn hàng
            </ButtonSecondary>
            {(order?.ShippingStatus == ShippingStatus.Pending  || order?.ShippingStatus == ShippingStatus.Shipped )&& 
            <Select
              onChange={(e: any) =>
                changeStatus(e.target.value, order?.OrderID)
              }
              defaultValue={order.ShippingStatus}
            >
              {Object.values(ShippingStatus)
                .filter((i) => i !== 6 && i !== 7)
                .map((key: any) => (
                  <option key={key} value={key}>
                    {ShippingStatusDetails[Number(key)]?.text}
                  </option>
                ))}
            </Select>
  }
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 p-2 sm:p-8 sm:pt-0 sm:pb-0 divide-y divide-y-slate-200 dark:divide-slate-700">
          {order?.OrderItems?.map(renderProductItem)}
        </div>
      </div>
    ));
  };
  // useEffect(() => {
  //   listOrder = (listOrderAll.filter((i:any) => {
  //     const type = i.OrderItems[0]?.Product?.ProductType;
  //     return type == activeTab
  //   }))
  // },[activeTab,listOrderAll])
  return (
    <div className="space-y-10 sm:space-y-12">
      {/* HEADING */}
      <h2 className="text-2xl sm:text-3xl font-semibold">
        Đơn hàng đã được đặt
      </h2>
      <TabOrder activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderOrder()}
    </div>
  );
};

export default WithHydration(OrderMe);
