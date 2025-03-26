"use client";
import http from "@/http/http";
import useAuthStore from "@/store/useAuthStore";
import { dateFormat4 } from "@/utils/helpers";
import {
  faBook,
  faCoins,
  faGavel,
  faReceipt,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import TransactionService from "@/http/transactionService";
import { IPagingParam } from "@/contains/paging";
import { ServiceResponse } from "@/type/service.response";

const TYPE_TRANSACTION: any = {
  Coin: (
    <div>
      {" "}
      <FontAwesomeIcon
        icon={faCoins}
        className="text-xl text-yellow-500"
      />{" "}
      Coin
    </div>
  ),
  "Đơn hàng": (
    <div>
      {" "}
      <FontAwesomeIcon
        icon={faReceipt}
        className="mr-1 text-xl text-purple-500"
      />{" "}
      Đơn hàng
    </div>
  ),
  "Sản phẩm riêng": (
    <div>
      <FontAwesomeIcon icon={faBook} className="mr-1 text-xl text-blue-500" />
      Sản phẩm riêng{" "}
    </div>
  ),
  "Đấu giá": (
    <div>
      <FontAwesomeIcon icon={faGavel} className="mr-1 text-xl text-green-500" />
      Đấu giá
    </div>
  ),
  "Giỏ hàng": (
    <div>
      <FontAwesomeIcon
        icon={faShoppingCart}
        className="mr-1 text-xl text-red-500"
      />{" "}
      Giỏ hàng
    </div>
  ),
  "Bank": (
    <div>
      <FontAwesomeIcon
        icon={faShoppingCart}
        className="mr-1 text-xl text-red-500"
      />{" "}
      Sản phẩm 
    </div>
  ),
};

const TransactionTable = () => {
  const [list, setList] = useState([]);
  const userStorage: any = useAuthStore();

  const getList = async () => {
    try {
      const param: IPagingParam = {
        pageSize: 1000,
        pageNumber: 1,
        conditions: [],
        searchKey: "",
        searchFields: [],
        includeReferences: {},
      };
      const res = await TransactionService.getPaging<ServiceResponse>(param);
      setList(res.data?.data);
    } catch (error) {}
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="container p-4 mx-auto">
      {list?.length > 0 ? (
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="text-left border-b">
              <th className="p-4 w-[20%]">LOẠI GIAO DỊCH</th>
              <th className="p-4 w-[20%]">PHƯƠNG THỨC </th>
              <th className="p-4 w-[20%]">NGÀY GIAO DỊCH</th>
              <th className="p-4 w-[40%]">MÔ TẢ</th>
            </tr>
          </thead>
          <tbody>
            {(list as any).map((transaction: any, index: any) => (
              <tr key={index} className="border-b">
                <td className="p-4">
                  <div className="flex items-center">
                    {TYPE_TRANSACTION[transaction.object as string]}
                  </div>
                </td>
                <td className="p-4">
                  {transaction.PaymentMethod == 1 ? "Tiền mặt" : "PayOS"}
                </td>
                <td className="p-4">{dateFormat4(transaction.createdAt)}</td>
                <td className="p-4">{transaction.description}</td>
                {/* <td className="p-4">{transaction.activity}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-500">
          Chưa có lịch sử giao dịch
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
