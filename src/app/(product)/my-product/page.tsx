"use client";
import ModalQuickView from "@/components/ModalQuickView";
import { STATUS_PRODUCT } from "@/contains/contants";
import { useGetData } from "@/hooks/useGetData";
import http from "@/http/http";
import NcModal from "@/shared/NcModal/NcModal";
import { handleErrorHttp } from "@/utils/handleError";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import UploadProduct from "../create-promotion/page";
import Status from "@/shared/Status/Status";
import { formatPriceVND } from "@/utils/helpers";

export interface DataCreateProduct {
  name: string;
  description: string;
  price: string | number;
  listImage?: string[];
}
const MyProduct = () => {
  const [reget, setReget] = useState(1);
  const { data: listproduct } = useGetData("Product/owner", [reget]);
  const [showModalQuickView, setShowModalQuickView] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [currentProductView, setCurrentProductView] = useState<any>(null);

  // Delete
  const handleDelete = async (id: any) => {
    try {
      const res = await http.delete("Product?id=" + id);
      if (res?.payload?.Success) {
        toast.success("Đã xóa");
        setReget(reget + 1);
      }
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  const reversedList = (listproduct as any)?.slice().reverse()?.filter((i: any) => i.ProductType == 0);

  const renderListTable = () =>
    reversedList?.map((product: any, index: number) => (
      <tr key={index}>
        <td key={index} className="p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3 min-w-[300px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
              {product?.Name}
            </p>
          </div>
        </td>
        <td className="p-4 border-b border-blue-gray-50 ">
          <p className="  min-w-[200px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
            {formatPriceVND(product?.Price)}
          </p>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <p className="  min-w-[100px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
            {product?.Stock}
          </p>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <p className="   min-w-[100px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
            {product?.Categories[0]?.Category?.Name            }
          </p>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <Status
            text={
              product?.Status == 1
                ? "Đã từ chối"
                : product?.IsApproved
                ? "Đã xác nhận"
                : "Chưa xác nhận"
            }
            color={
              product?.Status == 1
                ? "gray"
                : product?.IsApproved
                ? "blue"
                : "red"
            }
          />
        
        </td>
        <td className=" min-w-[100px] p-4 border-b border-blue-gray-50">
          <div className="flex gap-3">
            <Image
              onClick={() => {
                setCurrentProductView(product);
                setShowModalQuickView(true);
              }}
              className="cursor-pointer"
              alt=""
              width={20}
              height={20}
              src={"/view.svg"}
            />
            <Image
              onClick={() => {
                setCurrentProduct(product);
              }}
              className="cursor-pointer"
              alt=""
              width={20}
              height={20}
              src={"/edit.svg"}
            />
            <Image
              onClick={() => handleDelete(product?.ProductID)}
              className="cursor-pointer"
              alt=""
              width={20}
              height={20}
              src={"/delete.svg"}
            />
          </div>
        </td>
      </tr>
    ));
  return (
    <div className="nc-CartPage">
      <main className="py-16 lg:pb-28 lg:pt-20  ">
        {(listproduct as any)?.length > 0 ? (
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
                        Số lượng
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Danh mục
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
        id={currentProductView?.ProductID}
        show={showModalQuickView}
        onCloseModalQuickView={() => {
          setShowModalQuickView(false);
          setCurrentProductView(null);
        }}
      />
      {currentProduct && (
        <NcModal
          isOpenProp={currentProduct}
          onCloseModal={() => setCurrentProduct(null)}
          renderContent={() => (
            <UploadProduct
              callback={() => {
                setReget(reget + 1);
                setCurrentProduct(null);
              }}
              editItem={currentProduct}
            />
          )}
          modalTitle="Sửa  sản phẩm "
        />
      )}
    </div>
  );
};

export default MyProduct;
