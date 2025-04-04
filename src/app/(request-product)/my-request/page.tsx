"use client";
import ModalMessage from "@/components/ModalMessage";
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
  RequestStatus,
} from "@/utils/helpers";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ListImageRequest } from "./ListImageRequest";
import ListWorkOfRequest from "../component/ListWork";
import { IPagingParam } from "@/contains/paging";
import RequestService from "@/http/requestService";
import { ServiceResponse } from "@/type/service.response";
import useCheckoutStore from "@/store/useCheckoutStorage";

const Myrequest = ({ idRequest, callback = () => {} }: any) => {
  const messStore: any = useMessageStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moneyCheckout, setMoneyCheckout] = useState(0);
  const [moneyDatcoc, setMoneyDatcoc] = useState(0);
  const [isDatcoc, setIsDatcoc] = useState(false);
  const [isThanhToan, setIsThanhToan] = useState(false);
  const checkoutStore = useCheckoutStore();
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
  const router = useRouter();
  // image
  const [openImage, setOpenImage] = useState(false);
  const [idImage, setIdImage] = useState(null);

  const userStore: any = useAuthStore();
  //   const { data: listRequest } = useGetData("Policy/owner", [reget]);
  const [listRequest, setListRequest] = useState<any>([]);

  // const handleDelete = async (id: any) => {
  //   try {
  //     const res = await http.delete("ProductRequest/request?id=" + id);
  //     if (res?.payload?.Success) {
  //       toast.success("Đã xóa");
  //       getListRequest();
  //     }
  //   } catch (error: any) {
  //     handleErrorHttp(error?.payload);
  //   }
  // };

  //
  const getListRequest = async () => {
    try {
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
            key: "type",
            condition: "different",
            value: "EMPLOYEE_TASK"
          }
        ],
        searchKey: "",
        searchFields: [],
        includeReferences: {
          user: true,
          TaskDetail: true
        },
        sortOrder: "updatedAt desc",
      };
      const res = await RequestService.getPaging<ServiceResponse>(param);
      setListRequest(res.data.data);
    } catch (error: any) {}
  };
  useEffect(() => {
    getListRequest();
  }, []);

  const reversedList = (listRequest as any)?.slice();

  // REJECct
  const handleReject = async (id: any) => {
    try {
      // await http.put(`productRequest/cancel?requestID=${id}`, {});
      await RequestService.updateStatus(id, {
        status: RequestStatus.CANCELLED,
      });
      toast.success("Đã hủy yêu cầu");
      getListRequest();
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  const handleConfirm = async (id: any) => {
    var res = await RequestService.put(`/confirm/${id}`);
    toast.success("Confirm giá thành công");
    getListRequest();
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
        userStore?.getInfoUser();
        if (isThanhToan) {
          router.push("/account-order?tab=2");
        }
      }
      setPayment("");
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  const getPriceArisen = (task: any) => {
    const priceArisen = task?.TaskDetail?.reduce(
      (acc: number, taskDetail: any) => acc + taskDetail.price,
      0
    );
    return priceArisen;
  }
  const renderListTable = () =>
    finalList?.map((request: any, index: number) => (
      <tr
        key={index}
        className={`${request?.id == idNoty ? "bg-green-200" : ""}`}
      >
        <td key={index} className="p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3 min-w-[30px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
              {request.id}
            </p>
          </div>
        </td>
        <td key={index} className="p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3 min-w-[100px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
              {request?.user?.fullName}
            </p>
          </div>
        </td>
        <td key={index} className="p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3 min-w-[100px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
              {dateFormat3(request?.createdAt)}
            </p>
          </div>
        </td>

        <td key={index} className="p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3 min-w-[200px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
              {request?.description}
            </p>
          </div>
        </td>
        <td key={index} className="p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3 min-w-[200px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
              {request.repairType == "IN_SHOP"
                ? "Sửa tại cửa hàng"
                : "Sửa tại nhà"}
            </p>
          </div>
        </td>
        <td className="p-4 border-b border-blue-gray-50 ">
          <p className="  min-w-[150px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
            {formatPriceVND(request?.price)}
          </p>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <p className="  min-w-[100px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
            {formatPriceVND(getPriceArisen(request))}
          </p>
        </td>
        <td className="p-4 border-b border-blue-gray-50 min-w-[200px]">
          <Status
            text={
              request.status == RequestStatus.APPROVED && !request.isUserConfirm
                ? "Người dùng xác nhận giá"
                : getRequestProductStatusText(request.status)
            }
            color={getRequestProductStatusColor(request.status)}
          />
        </td>
        <td className=" min-w-[200px] p-4 border-b border-blue-gray-50 ">
          <div className="flex gap-3 items-center">
            {request.status == RequestStatus.APPROVED &&
              !request.isUserConfirm && (
                <ButtonIcon
                  onClick={() => {
                    handleConfirm(request?.id);
                  }}
                  svg={"/accept.svg"}
                  tooltip="Xác nhận giá"
                />
              )}
            {request.status !== RequestStatus.REJECTED &&
              request.status !== RequestStatus.PENDING &&
              request.isUserConfirm && (
                <ButtonIcon
                  onClick={() => {
                    setOpenModalWork(true);
                    setIdWork(request.id);
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
                    setIsThanhToan(
                      request.DepositAmount &&
                        request.DepositAmount > 0 &&
                        request.DepositAmount >= request?.NegotiatedPrice
                    );
                  }}
                  svg={"/view.svg"}
                  tooltip="Xem công việc"
                />
              )}
            <ButtonIcon
              onClick={() => {
                handleOpenModal();
                setIdMess(request.id);
                messStore?.setIdRoom?.(request.id);
              }}
              svg={"/mess.svg"}
              tooltip="Trao đổi"
            />

            {request.status == RequestStatus.PENDING && (
              <ButtonIcon
                onClick={() => handleReject(request?.id)}
                svg={"/reject.svg"}
                tooltip="Hủy yêu cầu"
              />
            )}
            {request.status == RequestStatus.APPROVED &&
              request.isUserConfirm && (
                <ButtonIcon
                  onClick={() => {
                    setOpenImage(true);
                    setIdImage(request.id);
                  }}
                  svg={"/image.svg"}
                  tooltip="Xem ảnh minh họa"
                />
              )}
            {request.status == RequestStatus.COMPLETED && !request.isPay && (
              <ButtonIcon
                onClick={() => {
                  (checkoutStore as any).setRequestCheckout([
                    {
                      ProductID: request.id,
                      Quantity: 1,
                      Price: parseInt(request.price) + getPriceArisen(request),
                      Images: request.imageRepairs,
                    },
                  ]);
                  router.push("/checkout?fromRequest=true");
                }}
                svg={"/pay.svg"}
                tooltip="Thanh toán"
              />
            )}
          </div>
        </td>
      </tr>
    ));
  // mark
  const query = useSearchParams();
  const idNoty = query.get("id");
  const finalList = [...reversedList];
  const index = finalList.findIndex((i: any) => i.id == idNoty);
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
                        Hình thức sửa
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Giá thỏa thuận
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Chi phí phát sinh
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
        renderContent={() => <ListImageRequest id={idImage} />}
        modalTitle="Hình ảnh minh họa"
      />
    </div>
  );
};

export default Myrequest;
