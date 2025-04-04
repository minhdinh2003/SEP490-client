"use client";
import Prices from "@/components/Prices";
import { PAYMENT_METHOD, SHIPING_STATUS } from "@/contains/contants";
import WithHydration from "@/HOC/withHydration";
import http from "@/http/http";
import useAuthStore from "@/store/useAuthStore";
import { handleErrorHttp } from "@/utils/handleError";
import {
  dateFormat2,
  getUrlImage,
  StatusOrder,
  StatusOrderDetails,
} from "@/utils/helpers";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import "./ProgressBar.scss";

const ProgressBar = ({
  orderNo,
  expectedArrival,
  trackingNumber,
  status = 6,
}: any) => {
  const statuses = ["Chờ xử lý", "Đã gửi hàng", "Đã nhận hàng"];

  const getStatusIndex = (status: any) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "PROCESSING":
        return 1;
      case "SHIPPED":
        return 2;
      default:
        return 0;
    }
  };

  const currentStatusIndex = getStatusIndex(status);

  return (
    <div className="progress-bar-container">
      <div className="header">
        <div className="order-no">ID #{orderNo}</div>
      </div>
      <div className="progress-bar">
        {statuses.map((status, index) => (
          <div
            key={index}
            className={`progress-step ${index <= currentStatusIndex ? "active" : ""
              } ${index <= currentStatusIndex - 1 ? "active-line" : ""}`}
          >
            <div className="icon-container">
              <div className="icon icon-line">
                {index <= currentStatusIndex && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="check-icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M20.292 5.708a1 1 0 00-1.414 0l-8.001 8.001-4.294-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l9-9a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="status-label">{status}</div>
            {index < statuses.length - 1 && (
              <div className="progress-line"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderDetail = ({ }) => {
  const [reget, setReget] = useState(1);
  const router = useRouter();
  const { id } = useParams();
  const userStorage: any = useAuthStore();
  const [order, setOrder] = useState<any>();

  const getOrder = async () => {
    try {
      const res = await http.post(`order/${id}/reference`, {
        orderItems: {
          include: {
            product: true
          }
        },
        Request: true
      });
      setOrder(res.payload.data);
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  useEffect(() => {
    if (id) {
      getOrder();
    }
  }, [id]);

  const renderProductItem = (item: any, index: number) => {
    const { product } = item;
    return (
      <div className="pb-10 border-b pt-5 last:border-b-0">
        {
          product?.productCode && <div
          onClick={() => router.push(`/product-code/${product?.productCode}`)}
          className="mb-5 text-gray-500"
        >
          Mã định danh :
          <span className="cursor-pointer text-green-500 font-bold">
            {" "}
            {product?.productCode}
          </span>
        </div>
        }
        <div key={index} className="flex ">
          <div className="relative h-24 w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <Image
              fill
              sizes="100px"
              src={getUrlImage(product?.listImage).mainImage}
              alt={product?.name}
              className="h-full w-full object-cover object-center"
            />
          </div>

          <div className="ml-4 flex flex-1 flex-col">
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
            <div className="flex flex-1 items-end justify-between text-sm">
              <p className="text-gray-500 dark:text-slate-400 flex items-center">
                <span className="inline-block ">x</span>
                <span className="ml-2">{item?.quantity}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderProductRequest = (data: any) => {
    return (
      <div className="pb-10 border-b pt-5 last:border-b-0">

        <div key={1} className="flex ">
          <div className="relative h-24 w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <Image
              fill
              sizes="100px"
              src={getUrlImage(data?.imageRepairs).mainImage}
              alt={data.description}
              className="h-full w-full object-cover object-center"
            />
          </div>

          <div className="ml-4 flex flex-1 flex-col">
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
            <div className="flex flex-1 items-end justify-between text-sm">
              <p className="text-gray-500 dark:text-slate-400 flex items-center">
                <span className="inline-block ">x</span>
                <span className="ml-2">1</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAddress = (order: any) => {
    return (
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 sm:p-8 flex flex-col gap-3">
        <h3 className="text-lg font-semibold mb-4">Thông tin giao hàng</h3>
        <p>
          <strong>Họ tên:</strong> {order.fullName}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {order.address}
        </p>

        <p>
          <strong>Số điện thoại:</strong> {order.phoneNumber}
        </p>
      </div>
    );
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      <h2 className="text-2xl sm:text-3xl font-semibold">Chi tiết đơn hàng</h2>
      {order?.status == StatusOrder.CANCELLED ? (
        <div>
          <div className="progress-bar-container">

            <div className="text-red-500">
              ĐÃ HỦY ĐƠN HÀNG
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-10">
          <ProgressBar
            status={order?.status}
            orderNo={order?.id}
          />
        </div>
      )}
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden z-0">
        <div className="p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <p
              style={{
                color: StatusOrderDetails[order?.status as StatusOrder].color,
              }}
                className="capitalize"
              >
                {StatusOrderDetails[order?.status as StatusOrder]?.text}
              </p>

              <p className="text-lg font-semibold">{order?.orderNo}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
                <span>{dateFormat2(order?.createdAt)}</span>
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
                {PAYMENT_METHOD[order?.paymentMethod]}
              </p>
            </div>

          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 p-2 sm:p-8 sm:pt-0 sm:pb-0 divide-y divide-y-slate-200 dark:divide-slate-700">
          {order?.Request ? renderProductRequest(order.Request) : order?.orderItems?.map(renderProductItem)}
        </div>
      </div>

      {renderAddress(order)}
    </div>
  );
};

export default WithHydration(OrderDetail);
