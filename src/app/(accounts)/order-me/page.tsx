"use client";
import Prices from "@/components/Prices";
import { PAYMENT_METHOD } from "@/contains/contants";
import WithHydration from "@/HOC/withHydration";
import http from "@/http/http";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import useAuthStore from "@/store/useAuthStore";
import { handleErrorHttp } from "@/utils/handleError";
import {
  dateFormat2,
  getUrlImage,
  StatusOrderDetails,
  StatusOrder,
  ShippingStatusDetails,
} from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TabOrder from "../account-order/TabOrder";
import OrderService from "@/http/orderService";
import { IPagingParam } from "@/contains/paging";
import { ServiceResponse } from "@/type/service.response";
import Select from "@/shared/Select/Select";

const AccountOrder = () => {
  const query = useSearchParams();

  const tab = !isNaN(query.get("tab") as any) ? Number(query.get("tab")) : 0;

  const [activeTab, setActiveTab] = useState(tab);
  const [reget, setReget] = useState(1);
  const router = useRouter();
  const brand = query.get("brand");
  const userStore: any = useAuthStore();
  // let { data: listOrder } = useGetData("Order/all",[reget]) as any;
  const [listOrder, setListOrder] = useState([]);
  const [listAll, setListAll] = useState([]);

  const getListOrder = async () => {
    const isRepair = !activeTab;
    const param: IPagingParam = {
      pageSize: 1000,
      pageNumber: 1,
      conditions: [
        {
          key: "userId",
          condition: "equal",
          value: userStore.user.id,
        },
        {
          key: "isRepair",
          condition: "equal",
          value: !isRepair,
        },
      ],
      searchKey: "",
      searchFields: [],
      includeReferences: {
        orderItems: {
          include: {
            product: true,
          },
        },
        Request: !isRepair,
      },
      sortOrder: "updatedAt desc",
    };
    const response = await OrderService.getPaging<ServiceResponse>(param);
    setListOrder(response.data.data);
    setListAll(response.data.data);
  };
  useEffect(() => {
    getListOrder();
  }, [activeTab]);
  const finalList = listOrder?.slice() || [];
  const renderProductItem = (item: any, index: number, status?: any) => {
    const { product } = item;
    return (
      <div className="pt-5 pb-10 border-b last:border-b-0">
        {product?.ProductCode && (
          <div
            onClick={() => router.push(`/product-code/${product?.ProductCode}`)}
            className="mb-5 text-gray-500"
          >
            Mã định danh :
            <span className="font-bold text-green-500 cursor-pointer">
              {" "}
              {product?.ProductCode}
            </span>
          </div>
        )}
        <div key={index} className="flex ">
          <div className="relative flex-shrink-0 w-16 h-24 overflow-hidden sm:w-20 rounded-xl bg-slate-100">
            <Image
              fill
              sizes="100px"
              src={getUrlImage(product?.listImage).mainImage}
              alt={product?.name}
              className="object-cover object-center w-full h-full"
            />
          </div>

          <div className="flex flex-col flex-1 ml-4">
            <div>
              <div className="flex justify-between ">
                <div>
                  <h3 className="text-base font-medium line-clamp-1">
                    {product?.name}
                  </h3>
                </div>
                <Prices price={item?.price} className="mt-0.5 ml-2" />
              </div>
            </div>
            <div className="flex items-end justify-between flex-1 text-sm">
              <p className="flex items-center text-gray-500 dark:text-slate-400">
                <span className="inline-block ">x</span>
                <span className="ml-2">{item?.quantity}</span>
              </p>
              {item?.status == StatusOrder.DELIVERED && (
                <div className="flex">
                  <Link href={`/product-detail/${product?.id}`}>
                    <button
                      type="button"
                      className="font-medium text-indigo-600 dark:text-primary-500 "
                    >
                      Đánh giá
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderItemRequest = (data: any) => {
    return (
      <div className="pt-5 pb-10 border-b last:border-b-0">
        <div key={1} className="flex ">
          <div className="relative flex-shrink-0 w-16 h-24 overflow-hidden sm:w-20 rounded-xl bg-slate-100">
            <Image
              fill
              sizes="100px"
              src={getUrlImage(data?.imageRepairs).mainImage}
              alt={data?.description}
              className="object-cover object-center w-full h-full"
            />
          </div>

          <div className="flex flex-col flex-1 ml-4">
            <div>
              <div className="flex justify-between ">
                <div>
                  <h3 className="text-base font-medium line-clamp-1">
                    {data?.description}
                  </h3>
                </div>
                <Prices price={data?.price} className="mt-0.5 ml-2" />
              </div>
            </div>
            <div className="flex items-end justify-between flex-1 text-sm">
              <p className="flex items-center text-gray-500 dark:text-slate-400">
                <span className="inline-block ">x</span>
                <span className="ml-2">1</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const changeStatus = async (orderId: any, status: any) => {
    try {
      await http.put(`order/status?orderId=${orderId}&status=${status}`, {});
      setReget(reget + 1);
      getListOrder();
      switch (status) {
        case "PROCESSING":
          toast.success("Đã chuyển đơn hàng");
          break
        case "SHIPPED":
          toast.success("Đã giao hàng");
          break;
        case "CANCELLED":
          toast.success("Đã hủy đơn hàng");
          break;
        default:
          toast.success("Đã chuyển trạng thái đơn hàng");
          break;
      }
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  const getStatus = function (status: string) {
    if (!status) {
      status = StatusOrder.PENDING;
    }
    return StatusOrderDetails[status as StatusOrder].text;
  };


  useEffect(() => {
    setListOrder(listAll);
  }, [activeTab, listAll]);
  const renderOrder = () => {
    return finalList?.map((order: any, index: number) => (
      <div
        key={index}
        className="z-0 overflow-hidden border rounded-lg border-slate-200 dark:border-slate-700"
      >
        <div className="flex flex-col p-4 sm:flex-row sm:justify-between sm:items-center sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div>
            <p
              style={{
                color: StatusOrderDetails[order?.status as StatusOrder].color,
              }}
              className="capitalize "
            >
              {getStatus(order?.status)}
            </p>

            <p className="text-lg font-semibold">{order?.OrderNo}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span>{dateFormat2(order?.createdAt)}</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              {PAYMENT_METHOD[order?.paymentMethod]}
            </p>
          </div>
          <div className="flex flex-col gap-3 mt-3 sm:mt-0">
            <ButtonSecondary
              onClick={() => {
                router.push(`/account-order/${order?.id}`);
              }}
              sizeClass="py-2.5 px-4 sm:px-6"
              fontSize="text-sm font-medium"
            >
              Xem đơn hàng
            </ButtonSecondary>
            {order?.status == StatusOrder.PENDING && (
              <ButtonPrimary
                onClick={() => changeStatus(order?.id, "PROCESSING")}
                sizeClass="py-2.5 px-4 sm:px-6"
                fontSize="text-sm font-medium"
              >
                Vân chuyển đơn hàng
              </ButtonPrimary>
            )}
          </div>
        </div>
        <div className="p-2 border-t divide-y border-slate-200 dark:border-slate-700 sm:p-8 sm:pt-0 sm:pb-0 divide-y-slate-200 dark:divide-slate-700">
          {order?.orderItems
            ?.map((i: any) => ({
              ...i,
              status: order?.ShippingStatus,
            }))
            ?.map(renderProductItem)}
        </div>
      </div>
    ));
  };
  const renderOrderRequest = () => {
    return finalList?.map((order: any, index: number) => (
      <div
        key={index}
        className="z-0 overflow-hidden border rounded-lg border-slate-200 dark:border-slate-700"
      >
        <div className="flex flex-col p-4 sm:flex-row sm:justify-between sm:items-center sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div>
            <p
              style={{
                color: StatusOrderDetails[order?.status as StatusOrder].color,
              }}
              className="capitalize "
            >
              {getStatus(order?.status)}
            </p>

            <p className="text-lg font-semibold">{order?.OrderNo}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span>{dateFormat2(order?.createdAt)}</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              {PAYMENT_METHOD[order?.paymentMethod]}
            </p>
          </div>
          <div className="flex flex-col gap-3 mt-3 sm:mt-0">
            <ButtonSecondary
              onClick={() => {
                router.push(`/account-order/${order?.id}`);
              }}
              sizeClass="py-2.5 px-4 sm:px-6"
              fontSize="text-sm font-medium"
            >
              Xem đơn hàng
            </ButtonSecondary>
            {order?.status == StatusOrder.PROCESSING && (
              <ButtonPrimary
                onClick={() => changeStatus(order?.id, "SHIPPED")}
                sizeClass="py-2.5 px-4 sm:px-6"
                fontSize="text-sm font-medium"
              >
                Đã nhận được hàng
              </ButtonPrimary>
            )}
            {order?.status == StatusOrder.PENDING && (
              <ButtonPrimary
                onClick={() => changeStatus(order?.id, "CANCELLED")}
                sizeClass="py-2.5 px-4 sm:px-6"
                fontSize="text-sm font-medium"
              >
                Hủy đơn
              </ButtonPrimary>
            )}
          </div>
        </div>
        <div className="p-2 border-t divide-y border-slate-200 dark:border-slate-700 sm:p-8 sm:pt-0 sm:pb-0 divide-y-slate-200 dark:divide-slate-700">
          {renderItemRequest(order.Request)}
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* HEADING */}
      <h2 className="text-2xl font-semibold sm:text-3xl">Đơn hàng đã đặt</h2>
      <TabOrder activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab ? renderOrderRequest() : renderOrder()}
    </div>
  );
};

export default WithHydration(AccountOrder);
