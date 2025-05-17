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
import OrderService from "@/http/orderService";
import { ServiceResponse } from "@/type/service.response";
import useCheckoutStore from "@/store/useCheckoutStorage";
import Input from "@/shared/Input/Input";

const Myrequest = ({ idRequest, callback = () => { } }: any) => {
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
  const [totalPages, setTotalPages] = useState(1);
  const userStore: any = useAuthStore();
  //   const { data: listRequest } = useGetData("Policy/owner", [reget]);
  const [listRequest, setListRequest] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1); // State phân trang
  const [searchKeyword, setSearchKeyword] = useState(""); // State tìm kiếm
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
  const getListRequest = async (page: number = 1) => {
    try {
      const param: IPagingParam = {
        pageSize: 5,
        pageNumber: page,
        conditions: [
          {
            key: "any",
            condition: "raw",
            value: {
              userId: userStore.user.id,
              type: {
                not: "EMPLOYEE_TASK",
              },
              description: {
                contains: searchKeyword,
              }
            },
          }
        ],
        searchKey: "",
        searchFields: [],
        includeReferences: {
          user: true,
          TaskDetail: true,
        },
        sortOrder: "updatedAt desc",
      };
      const res = await RequestService.getPaging<ServiceResponse>(param);
      setListRequest(res.data.data);

      setTotalPages(Math.floor(res.data?.totalCount / 5) + 1);

      console.log(totalPages);
    } catch (error: any) { }
  };
  useEffect(() => {
    getListRequest();
  }, [searchKeyword]);

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
    callback = () => { },
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
  };
  const [orders, setOrders] = useState<any[]>([]);
  const fetchOrders = async () => {
    try {
      const res = await OrderService.getAll<ServiceResponse>();
      setOrders(res.data || []);
    } catch (error: any) {
      toast.error("Không thể lấy danh sách đơn hàng");
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
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
                    setOpenModalWork(false); // Đảm bảo đóng modal trước
                    setTimeout(() => {
                      setIdWork(request.id);
                      setImages(request.Images);
                      setMoneyCheckout(
                        request?.NegotiatedPrice -
                        Math.floor((Number(request?.NegotiatedPrice) * 50) / 100)
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
                      setOpenModalWork(true); // Mở lại modal với props mới
                    }, 100); // Đợi modal đóng xong
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
            {request.status == RequestStatus.COMPLETED && !orders.some(
                (order: any) =>
                  order.requestId === request.id && order.isPay === true,
              ) && (
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
      <div className="flex justify-between items-center mb-4">
        {/* Tìm kiếm */}
        <div className="flex items-center w-[400px]">
          <Input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm kiếm theo mô tả"
            className="w-[600px]"
          />
          {/* <ButtonPrimary
            onClick={() => {
              setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
              getListRequest(1, searchKeyword);
            }}
            className="px-5 py-2 ml-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors whitespace-nowrap"
          >
            Tìm kiếm
          </ButtonPrimary> */}
        </div>
      </div>
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
      {/* Phân trang */}
      <div className="flex items-center justify-center mt-6 space-x-4">
        <button
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
              getListRequest(currentPage - 1);
            }
          }}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
        >
          Trước
        </button>

        <span className="text-sm font-medium text-gray-700">
          Trang {currentPage}/{totalPages}
        </span>

        <button
          onClick={() => {
            setCurrentPage(currentPage + 1);
            getListRequest(currentPage + 1);
          }}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
        >
          Sau
        </button>
      </div>
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
            setIsModalOpen={setIsModalOpen}
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
