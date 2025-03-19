"use client";
import ModalMessage from "@/components/ModalMessage";
import { useGetData } from "@/hooks/useGetData";
import http from "@/http/http";
import { ButtonIcon } from "@/shared/Button/CustomButton";
import NcModal from "@/shared/NcModal/NcModal";
import Status from "@/shared/Status/Status";
import useAuthStore from "@/store/useAuthStore";
import useMessageStore from "@/store/useMessStore";
import { handleErrorHttp } from "@/utils/handleError";
import {
  dateFormat3,
  formatPriceVND,
  getRequestProductStatusColor,
  getRequestProductStatusText,
  getUrlImage,
  RequestProductStatus,
} from "@/utils/helpers";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ListWork from "../component/WorkDetail";
import CoverflowSlider from "@/components/slider/SliderImage";
import { ListImageRequest } from "./ListImageRequest";
import { message } from "antd";
import ListWorkOfRequest from "../component/ListWork";

const Myrequest = ({ idRequest, callback = () => {} }: any) => {
  const messStore: any = useMessageStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moneyCheckout, setMoneyCheckout] = useState(0);
  const [moneyDatcoc, setMoneyDatcoc] = useState(0);
  const [isDatcoc, setIsDatcoc] = useState(false);
  const [isThanhToan, setIsThanhToan] = useState(false);

  const [payment, setPayment] = useState<any>("");

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIdMess("");
    messStore?.setMessages([]);
    messStore?.setIdRoom?.(null);
  };

  const [openWork, setOpenModalWork] = useState(false);
  const [idWork, setIdWork] = useState("");
  const [images, setImages] = useState("");
  const [idMess, setIdMess] = useState("");
  const [reget, setReget] = useState(1);
  const router = useRouter()
  // image
  const [openImage, setOpenImage] = useState(false);
  const [idImage, setIdImage] = useState(null);
  const [listCategory, setListCategory] = useState<any>([]);
  useGetData("Category/all", [], setListCategory);
  const userStore: any = useAuthStore();
  //   const { data: listRequest } = useGetData("Policy/owner", [reget]);
  const [listRequest, setListRequest] = useState<any>([]);
  const [currentPolicy, setCurrentPolicy] = useState<any>(null);

  const handleDelete = async (id: any) => {
    try {
      const res = await http.delete("ProductRequest/request?id=" + id);
      if (res?.payload?.Success) {
        toast.success("Đã xóa");
        getListRequest();
      }
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  //
  const getListRequest = async () => {
    try {
      const res = await http.post("productRequest/all", {
        Filter: ` RequestUserID = ${userStore?.user?.UserID} `, // where theem status của request
        IncludeProperties: "",
      });
      console.log(res.payload.Data);
      setListRequest(res.payload.Data);
    } catch (error: any) {
      // handleErrorHttp(error?.payload)
    }
  };
  useEffect(() => {
    getListRequest();
  }, []);

  const getCategoryName = (categories: any) => {
    const arrCate = categories?.split(";");
    if (arrCate?.length === 0) {
      return "";
    }
    return listCategory
      ?.filter((i: any) => arrCate?.includes(i?.CategoryID?.toString()))
      .map((i: any) => i.Name)
      .join(", ");
  };

  const reversedList = (listRequest as any)?.slice().reverse();

  // REJECct
  const handleReject = async (id: any) => {
    try {
      await http.put(`productRequest/cancel?requestID=${id}`, {});
      toast.success("Đã hủy yêu cầu");
      getListRequest();
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  // Approve
  const handleCheckout = async (
    id: any,
    idWork: any,
    isDone: any,
    money: any,
    AddressID: any,
    callback = () => {},
    isThanhToan = false
  ) => {
    try {
      const res = await http.post(`productRequest/depositMoney`, {
        ProductRequestID: id,
        Money: money,
        Lang: "vn",
        BankCode: "",
        IsDone: isDone,
        WorkID: idWork,
        AddressID: AddressID,
        OrderID: 0,
        PaymentMethod: payment,
      });
      if (payment == 0) {
        window.location.href = res?.payload?.Data;
      } else {
        toast.success("Đã thanh toán");
        callback();
        userStore?.getInfoUser()
        if(isThanhToan){
          router.push("/account-order?tab=2")
        }
      }
      setPayment("");
     
    } catch (error: any) {
      handleErrorHttp(error?.payload);
      
    }
  };
  const renderListTable = () =>
    finalList?.map((request: any, index: number) => (
      <tr
        key={index}
        className={`${
          request?.ProductRequestID == idNoty ? "bg-green-200" : ""
        }`}
      >
        <td key={index} className="p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3 min-w-[30px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
              {request.ProductRequestID}
            </p>
          </div>
        </td>
        <td key={index} className="p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3 min-w-[100px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
              {request?.CreatorUser?.FirstName +
                " " +
                request?.CreatorUser?.LastName}
            </p>
          </div>
        </td>
        <td key={index} className="p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3 min-w-[100px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
              {dateFormat3(request?.RequestTime)}
            </p>
          </div>
        </td>

        <td key={index} className="p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3 min-w-[200px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
              {request?.Description}
            </p>
          </div>
        </td>
        <td className="p-4 border-b border-blue-gray-50 ">
          <p className="  min-w-[150px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
            {formatPriceVND(request?.ProposedPrice)}
          </p>
        </td>
        <td className="p-4 border-b border-blue-gray-50 ">
          <p className="  min-w-[150px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
            {request?.NegotiatedPrice != 0 && request?.NegotiatedPrice
              ? formatPriceVND(request?.NegotiatedPrice)
              : "Đang thoả thuận"}
          </p>
        </td>
        <td className="p-4 border-b border-blue-gray-50 min-w-[200px]">
          <Status
            text={getRequestProductStatusText(request.Status)}
            color={getRequestProductStatusColor(request.Status)}
          />
        </td>
        <td className=" min-w-[200px] p-4 border-b border-blue-gray-50 ">
          <div className="flex gap-3 items-center">
            {request.Status != RequestProductStatus.Cancel &&
              request.Status != RequestProductStatus.Reject &&
              request.Status != RequestProductStatus.Pending && (
                <ButtonIcon
                  onClick={() => {
                    setOpenModalWork(true);
                    setIdWork(request.ProductRequestID);
                    setImages(request.Images);
                    setMoneyCheckout(
                      request?.NegotiatedPrice -
                        Math.floor(
                          (Number(request?.NegotiatedPrice) * 50) / 100
                        )
                    );
                    setMoneyDatcoc(
                      Math.floor((Number(request?.NegotiatedPrice) * 50) / 100)
                    );
                    setIsDatcoc(
                      request.DepositAmount &&
                        request.DepositAmount > 0 &&
                        request.DepositAmount < request?.NegotiatedPrice
                    );
                    setIsThanhToan(  request.DepositAmount &&
                      request.DepositAmount > 0 &&
                      request.DepositAmount >= request?.NegotiatedPrice)
                  }}
                  svg={"/view.svg"}
                  tooltip="Xem công việc"
                />
              )}
            <ButtonIcon
              onClick={() => {
                handleOpenModal();
                setIdMess(request.ProductRequestID);
                messStore?.setIdRoom?.(request.ProductRequestID);
              }}
              svg={"/mess.svg"}
              tooltip="Trao đổi"
            />

            {request.Status == RequestProductStatus.Pending && (
              <ButtonIcon
                onClick={() => handleReject(request?.ProductRequestID)}
                svg={"/reject.svg"}
                tooltip="Hủy yêu cầu"
              />
            )}
            <ButtonIcon
              onClick={() => {
                setOpenImage(true);
                setIdImage(request.ProductRequestID);
              }}
              svg={"/image.svg"}
              tooltip="Xem ảnh minh họa"
            />
          </div>
        </td>
      </tr>
    ));
  // mark
  const query = useSearchParams();
  const idNoty = query.get("id");
  const finalList = [...reversedList];
  const index = finalList.findIndex((i: any) => i.ProductRequestID == idNoty);
  if (index >= 0) {
    const item = finalList[index];
    finalList.splice(index, 1);
    finalList.unshift(item);
  }

  return (
    <div className="nc-CartPage">
      <ModalMessage
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        idRequest={idMess}
      />
      <main className="  ">
        {(listRequest as any)?.length > 0 ? (
          <div className="flex  bg-white">
            <div className="px-0">
              <table className="w-full min-w-full table-auto text-left">
                <thead>
                  <tr>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        ID
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Người tạo
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Thời gian tạo
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Mô tả
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Giá mong muốn
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Giá chính thức
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Trạng Thái
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
            Chưa có yêu cầu nào
          </div>
        )}
      </main>
      <NcModal
        isOpenProp={openWork}
        onCloseModal={() => {
          setOpenModalWork(false);
          setIdWork("");
          setImages("");
        }}
        renderContent={() => (
          <ListWorkOfRequest
            payment={payment}
            setPayment={setPayment}
            handleCheckout={handleCheckout}
            isDatcoc={isDatcoc}
            moneyCheckout={moneyCheckout}
            isThanhToan={isThanhToan}
            isCustomer={true}
            images={images}
            callback={() => {
              getListRequest();
              setOpenModalWork(false);
              setIdWork("");
            }}
            idRequest={idWork}
            moneyDatcoc={moneyDatcoc}
            handleReject={handleReject}
          />
        )}
        modalTitle="Danh sách công việc"
      />

      <NcModal
        isOpenProp={openImage}
        onCloseModal={() => {
          setOpenImage(false);
          setIdImage(null);
        }}
        renderContent={() => <ListImageRequest  id={idImage} />}
        modalTitle="Hình ảnh minh họa"
      />
    </div>
  );
};

export default Myrequest;
