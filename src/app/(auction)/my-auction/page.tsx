"use client";
import ModalQuickView from "@/components/ModalQuickView";
import { STATUS_PRODUCT } from "@/contains/contants";
import { useGetData } from "@/hooks/useGetData";
import http from "@/http/http";
import NcModal from "@/shared/NcModal/NcModal";
import { handleErrorHttp } from "@/utils/handleError";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreateAuction from "../auction-create/page";
import useAuthStore from "@/store/useAuthStore";
import {
  AuctionStatus,
  dateFormat3,
  formatPriceVND,
  getStatusColor,
  getStatusText,
} from "@/utils/helpers";
import Status from "@/shared/Status/Status";
import { ButtonIcon } from "@/shared/Button/CustomButton";
import { useRouter } from "next/navigation";

export interface DataCreateProduct {
  name: string;
  description: string;
  price: string | number;
  listImage?: string[];
}
const MyProduct = () => {
  const [reget, setReget] = useState(1);
  // const { data: listauction } = useGetData("Auction/paging", [reget]);
  const [showModalQuickView, setShowModalQuickView] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const userStore: any = useAuthStore();
  const router = useRouter()
  // Delete
  const handleDelete = async (id: any) => {
    try {
      const res = await http.delete("Auction?id=" + id);
      if (res?.payload?.Success) {
        toast.success("Đã xóa");
        getAuList();
      }
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  const [list, setList] = useState<any>([]);
  const getAuList = async () => {
    try {
      const res: any = await http.post("/Auction/paging", {
        PageSize: 1000,
        PageNumber: 1,
        Filter: ` UserID = ${userStore?.user?.UserID} `,
        SortOrder: "ModifiedDate desc ",
        SearchKey: "",
      });
      setList(res?.payload.Data?.Data);
      console.log(res);
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  useEffect(() => {
    getAuList();
  }, []);
  const renderListTable = () =>
    (list as any)?.reverse()?.map((auction: any, index: number) => (
      <tr key={index}>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3 min-w-[200px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
              {auction?.Title || auction?.Name}
            </p>
          </div>
        </td>
        <td className="p-4 border-b border-blue-gray-50 ">
          <p className="  min-w-[200px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
            {formatPriceVND(auction?.Price)}
          </p>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <p className="  min-w-[100px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
            {formatPriceVND(auction?.Increment)}
          </p>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <p className="   min-w-[100px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
            {dateFormat3(auction?.AuctionStartTime)}
          </p>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <p className="   min-w-[100px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
            {dateFormat3(auction?.AuctionEndTime)}
          </p>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <div className="w-max">
            <Status
              color={getStatusColor(auction.Status)}
              text={getStatusText(auction.Status)}
            />
          </div>
        </td>
        <td className=" min-w-[100px] p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3">
          {(auction?.Status == AuctionStatus.Pending ||
            auction.Status == AuctionStatus.Reject) && (
            <div className="flex gap-3">
              <ButtonIcon
                onClick={() => {
                  setCurrentProduct(auction);
                }}
                svg={"/edit.svg"}
                tooltip="Cập nhật"
              />
              <ButtonIcon
                onClick={() => handleDelete(auction?.AuctionItemID)}
                svg={"/delete.svg"}
                tooltip="Xóa"
              />
            </div>
          )}
           <ButtonIcon
                onClick={() => router.push(`/view-auction/${auction?.AuctionItemID}`)}
                svg={"/view.svg"}
                tooltip="Xem chi tiết"
              />
          </div>
        </td>
      </tr>
    ));
  return (
    <div className="nc-CartPage">
      <main className=" ">
        {(list as any)?.length > 0 ? (
          <div className="flex  bg-white">
            <div className="px-0 w-full">
              <table className="w-full min-w-full table-auto text-left">
                <thead>
                  <tr>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Tên sản phẩm
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Giá
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Bước giá
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Thời gian bắt đầu
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Thời gian kết thúc
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Trạng thái
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Hành động
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>{renderListTable()}</tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center text-[gray] pt-[100px]">
            Chưa có sản phẩm nào
          </div>
        )}
      </main>
      <ModalQuickView
        id={currentProduct?.ProductID}
        show={showModalQuickView}
        onCloseModalQuickView={() => {
          setShowModalQuickView(false);
          setCurrentProduct(null);
        }}
      />
      {currentProduct && (
        <NcModal
          isOpenProp={currentProduct}
          onCloseModal={() => setCurrentProduct(null)}
          renderContent={() => (
            <CreateAuction
              callback={() => {
                getAuList();
                setCurrentProduct(null);
              }}
              editItem={currentProduct}
            />
          )}
          modalTitle="Sửa  sản phẩm"
        />
      )}
    </div>
  );
};

export default MyProduct;
