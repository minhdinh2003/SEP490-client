"use client";
import http from "@/http/http";
import useAuthStore from "@/store/useAuthStore";
import { dateFormat4 } from "@/utils/helpers";
import {
  faTicketAlt,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import VoucherService from "@/http/voucherService"; // Giả sử bạn có service này để lấy danh sách voucher
import { ServiceResponse } from "@/type/service.response";
import voucherService from "@/http/voucherService";
import { IPagingParam } from "@/contains/paging";

const STATUS_COLORS: any = {
  USED: "text-green-500", // Đã sử dụng
  EXPIRED: "text-red-500", // Hết hạn
  VALID: "text-blue-500", // Còn hiệu lực
};

const VoucherTable = () => {
  const [list, setList] = useState<any[]>([]);
  const userStorage: any = useAuthStore();

  const getList = async () => {
    try {
      const param: IPagingParam = {
        pageSize: 1000,
        pageNumber: 1,
        conditions: [
          {
            key: "userId",
            condition: "equal",
            value: userStorage?.user?.id,
          },
        ],
        searchKey: "",
        searchFields: [],
        includeReferences: {
          promotion: true
        },
        sortOrder: "updatedAt desc"
      };
      const res = await voucherService.getPaging<ServiceResponse>(param);
      setList(res.data?.data);
    } catch (error) {}
  };

  useEffect(() => {
    getList();
  }, []);

  // Hàm xác định trạng thái của voucher
  const getVoucherStatus = (voucher: any): string => {
    const now = new Date();
    if (voucher.usedCount > 0) return "USED"; // Đã sử dụng
    if (new Date(voucher.validTo) < now) return "EXPIRED"; // Hết hạn
    return "VALID"; // Còn hiệu lực
  };

  return (
    <div className="container p-4 mx-auto">
      {list?.length > 0 ? (
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="text-left border-b">
              <th className="p-4 w-[20%]">MÃ VOUCHER</th>
              <th className="p-4 w-[20%]">GIÁ TRỊ GIẢM GIÁ</th>
              <th className="p-4 w-[20%]">NGÀY HIỆU LỰC</th>
              <th className="p-4 w-[20%]">TRẠNG THÁI</th>
              <th className="p-4 w-[20%]">MÔ TẢ</th>
            </tr>
          </thead>
          <tbody>
            {list.map((voucher: any, index: number) => {
              const status = getVoucherStatus(voucher);
              return (
                <tr key={index} className="border-b">
                  <td className="p-4">
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon={faTicketAlt}
                        className="mr-2 text-xl text-gray-500"
                      />
                      {voucher.code}
                    </div>
                  </td>
                  <td className="p-4">
                    {voucher.discount.toLocaleString()}{" "}
                    {voucher.promotion.discountType === "PERCENTAGE"
                      ? "%"
                      : "đ"}
                  </td>
                  <td className="p-4">
                    {dateFormat4(voucher.validFrom)} -{" "}
                    {dateFormat4(voucher.validTo)}
                  </td>
                  <td className="p-4">
                    <div
                      className={`flex items-center ${STATUS_COLORS[status]}`}
                    >
                      {status === "USED" && (
                        <>
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="mr-1"
                          />
                          Đã sử dụng
                        </>
                      )}
                      {status === "EXPIRED" && (
                        <>
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                            className="mr-1"
                          />
                          Hết hạn
                        </>
                      )}
                      {status === "VALID" && (
                        <>
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="mr-1"
                          />
                          Còn hiệu lực
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-4">{voucher.promotion.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-500">Chưa có voucher nào</div>
      )}
    </div>
  );
};

export default VoucherTable;