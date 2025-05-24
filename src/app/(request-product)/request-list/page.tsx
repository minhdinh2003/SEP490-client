"use client";
import NcModal from "@/shared/NcModal/NcModal";
import { useGetData } from "@/hooks/useGetData";
import http from "@/http/http";
import { handleErrorHttp } from "@/utils/handleError";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import Status from "@/shared/Status/Status";
import useAuthStore from "@/store/useAuthStore";
import OrderService from "@/http/orderService";
import {
  dateFormat2,
  dateFormat3,
  dateFormat4,
  formatPriceVND,
  getRequestProductStatusColor,
  getRequestProductStatusText,
  RequestProductStatus,
  RequestStatus,
} from "@/utils/helpers";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { ActionButton, ButtonIcon } from "@/shared/Button/CustomButton";
import CreateWork from "../component/CreateJob";
import useMessageStore from "@/store/useMessStore";
import ModalMessage from "@/components/ModalMessage";
import { useSearchParams } from "next/navigation";
import Input from "@/shared/Input/Input";
import { ListImageRequest } from "../my-request/ListImageRequest";
import ListWorkOfRequest from "../component/ListWork";
import RequestService from "@/http/requestService";
import UserService from "@/http/userService";
import { ServiceResponse } from "@/type/service.response";
import { IPagingParam } from "@/contains/paging";

const RequestList = () => {
  const [openPrice, setOpenPrice] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [reasonReject, setReasonReject] = useState("");
  const [idPrice, setIdPrice] = useState("");
  const [isDatcoc, setIsDatcoc] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [idImage, setIdImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openWork, setOpenModalWork] = useState(false);
  const [idWork, setIdWork] = useState("");
  const [reget, setReget] = useState(1);
  const [images, setImages] = useState("");
  const userStore: any = useAuthStore();
  const [listRequest, setListRequest] = useState<any>([]);
  const [currentId, setCurrentId] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // State phân trang
  const [searchKeyword, setSearchKeyword] = useState(""); // State tìm kiếm
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const messStore: any = useMessageStore();
  const [idMess, setIdMess] = useState("");

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIdMess("");
    messStore?.setMessages([]);
    messStore?.setIdRoom?.(null);
  };
  const [confirmPayModal, setConfirmPayModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const handleConfirmPay = () => {
    if (selectedRequest) {
      handleCreateOrder(selectedRequest);
      setConfirmPayModal(false);
      setSelectedRequest(null);
    }
  };
  const [totalPages, setTotalPages] = useState(1);
  const getListRequest = async (page: number = 1, keyword: string = "") => {
    try {
      const param: IPagingParam = {
        pageSize: 5,
        pageNumber: page,
        conditions: [
          {
            key: "any",
            condition: "raw",
            value: {
              AND: [
                {
                  type: {
                    not: "EMPLOYEE_TASK",
                  },
                },
                {
                  id: {
                    not: -1,
                  },
                },
                {
                  OR: [
                    {
                      updatedBy: {
                        contains: searchKeyword,
                      },
                    },
                    {
                      user: {
                        phoneNumber: {
                          contains: searchKeyword,
                        },
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
        searchKey: "",
        searchFields: [],
        includeReferences: {
          user: true,
          TaskDetail: true,
        },
        sortOrder: "createdAt desc",
      };
      const res = await RequestService.getPaging<ServiceResponse>(param);
      setListRequest(res.data.data);
      setTotalPages(Math.floor(res.data?.totalCount / 5) + 1);
    } catch (error: any) { }
  };
  useEffect(() => {
    getListRequest(currentPage, searchKeyword);
  }, [currentPage, searchKeyword]);

  // REJECT
  const handleReject = async (id: any) => {
    try {
      await RequestService.updateStatus(id, {
        status: "REJECTED",
        comment: reasonReject,
      });
      toast.success("Đã từ chối");
      getListRequest();
      setOpenReject(false);
      setReasonReject("");
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
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
  // Approve
  const handleApprove = async () => {
    try {
      await RequestService.updateStatus(idPrice, {
        status: "APPROVED",
        comment: "",
      });
      toast.success("Đã xác nhận");
      getListRequest();
      setOpenPrice(false);
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  //create order 

  const handleCreateOrder = async (request: any) => {
    try {
      // Lấy thông tin user từ userId
      const userRes = await UserService.getById<ServiceResponse>(request.userId);
      const user = userRes.data;

      const body = {
        requestId: Number(request.id), // Đảm bảo là số nguyên
        fullName: user.fullName,
        address: request.address || "",
        phoneNumber: user.phoneNumber,
        paymentMethod: 1, // hoặc giá trị phù hợp
        isPay: true
      };

      const res = await OrderService.post<ServiceResponse>(
        "/createOrderRepair?status=SHIPPED",
        body
      );

      if (!res.success) {
        toast.error(res.devMessage);
        return;
      }

      toast.success("Tạo đơn hàng thành công");
      getListRequest();
      // window.location.reload();
    } catch (error: any) {
      toast.error("Có lỗi xảy ra khi tạo đơn hàng");
    }
  };
  const getPriceArisen = (task: any) => {
    const priceArisen = task?.TaskDetail?.reduce(
      (acc: number, taskDetail: any) => acc + taskDetail.incidentalCosts,
      0
    );
    return priceArisen;
  };
  const renderListTable = () =>
    finalList?.map((request: any, index: number) => (
      <tr
        key={index}
        className={`${request?.id == idNoty ? "bg-green-200" : ""}`}
      >
        <td key={index} className="p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3 min-w-[90px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
              {request?.createdBy}
            </p>
          </div>
        </td>
        <td key={index} className="p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3 min-w-[40px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
              {request?.user.phoneNumber || ""}
            </p>
          </div>
        </td>
        <td key={index} className="p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3 min-w-[80px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
              {dateFormat2(request?.createdAt)}
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
          <div className="flex items-center gap-3 min-w-[100px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
              {request.repairType == "IN_SHOP"
                ? "Sửa tại cửa hàng"
                : "Sửa tại nhà"}
            </p>
          </div>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <p className="  min-w-[100px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
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
            text={getRequestProductStatusText(request.status)}
            color={getRequestProductStatusColor(request.status)}
          />
        </td>
        <td className=" min-w-[300px] p-4 border-b border-blue-gray-50 flex ">
          <div className=" flex items-center gap-3">
            {request.status == RequestStatus.PENDING && (
              <div className="flex gap-3 ">
                <ButtonIcon
                  onClick={() => {
                    setOpenPrice(true);
                    setIdPrice(request?.id);
                  }}
                  svg={"/accept.svg"}
                  tooltip="Xác nhận"
                />
                <ButtonIcon
                  onClick={() => {
                    setCurrentId(request.id);
                    setOpenReject(true);
                  }}
                  svg={"/reject.svg"}
                  tooltip="Từ chối"
                />
              </div>
            )}
            {request.status != RequestStatus.REJECTED &&
              request.status != RequestStatus.COMPLETED &&
              request.status != RequestStatus.CANCELLED && (
                <div className="flex items-center gap-3">
                  <ButtonIcon
                    onClick={() => {
                      setOpenModal(true);
                      setCurrentId(request.id);
                    }}
                    svg={"/create.svg"}
                    tooltip="Tạo công việc"
                  />
                </div>
              )}
            {request.status != RequestStatus.CANCELLED &&
              request.status != RequestStatus.REJECTED && (
                <ButtonIcon
                  onClick={() => {
                    setOpenModalWork(true);
                    setIdWork(request.id);
                    setImages(request.images);
                  }}
                  svg={"/view.svg"}
                  tooltip="Xem  công việc"
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

            <ButtonIcon
              onClick={() => {
                setOpenImage(true);
                setIdImage(request.id);
              }}
              svg={"/image.svg"}
              tooltip="Xem sản phẩm cần sửa"
            />
            {request.status === RequestStatus.COMPLETED &&
              !orders.some(
                (order: any) =>
                  order.requestId === request.id && order.isPay === true,
              ) && (
                <ButtonIcon
                  onClick={() => {
                    setSelectedRequest(request);
                    setConfirmPayModal(true);
                  }}
                  svg={"/pay.svg"}
                  tooltip="Đã Thanh toán"
                />
              )}

          </div>
        </td>
      </tr>
    ));

  // mark
  const query = useSearchParams();
  const idNoty = query.get("id");
  const finalList = [...listRequest];
  const index = finalList.findIndex((i: any) => i.id == idNoty);
  if (index >= 0) {
    const item = finalList[index];
    finalList.splice(index, 1);
    finalList.unshift(item);
  }

  const createWorkComponent = useMemo(() => (
    <CreateWork
      callback={() => {
        setOpenModal(false);
        setCurrentId("");
        getListRequest();
      }}
      idRequest={currentId}
    />
  ), [openModal, currentId]);

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
            placeholder="Tìm kiếm theo người tạo hoặc số điện thoại"
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
        {(finalList as any)?.length > 0 ? (
          <div className="w-full bg-white">
            <div className="px-0 w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[1200px] table-auto text-left">
                  <thead>
                    <tr>
                      <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                          Người tạo
                        </p>
                      </th>
                      <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                          SĐT
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
              getListRequest(currentPage - 1, searchKeyword);
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
            getListRequest(currentPage + 1, searchKeyword);
          }}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
        >
          Sau
        </button>
      </div>
      <NcModal
        isOpenProp={openModal}
        onCloseModal={() => setOpenModal(false)}
        customClass="abc"
        renderContent={() => createWorkComponent}
        modalTitle="Tạo công việc"
      />

      <NcModal
        isOpenProp={openWork}
        onCloseModal={() => {
          setOpenModalWork(false);
          setIdWork("");
          setImages("");
        }}
        renderContent={() => (
          <ListWorkOfRequest
            isDatcoc={isDatcoc}
            images={images}
            callback={() => {
              getListRequest();
              setOpenModalWork(false);
              setIdWork("");
            }}
            idRequest={idWork}
          />
        )}
        modalTitle="Danh sách công việc"
      />

      <NcModal
        isOpenProp={confirmPayModal}
        onCloseModal={() => {
          setConfirmPayModal(false);
          setSelectedRequest(null);
        }}
        customClass="abc"
        renderContent={() => (
          <div>
            <div className="mt-3 flex items-center justify-center gap-3">
              <ButtonPrimary onClick={handleConfirmPay}>Xác nhận</ButtonPrimary>
              <ButtonPrimary
                className="bg-gray-300 text-gray-700"
                onClick={() => {
                  setConfirmPayModal(false);
                  setSelectedRequest(null);
                  // window.location.reload();
                }}
              >
                Hủy
              </ButtonPrimary>
            </div>
          </div>
        )}
        modalTitle="Xác nhận thanh toán"
      />
      <NcModal
        isOpenProp={openPrice}
        onCloseModal={() => {
          setOpenPrice(false);
        }}
        customClass="abc"
        renderContent={() => (
          <div>
            {/* <div className="font-semibold mb-2">Chấp Nhận Yêu Cầu</div> */}
            {/* <div className="w-[400px]">
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
              />
            </div> */}
            <div className="mt-3 flex items-center justify-center">
              <ButtonPrimary onClick={() => handleApprove()}>
                Xác nhận
              </ButtonPrimary>
            </div>
          </div>
        )}
        modalTitle="Đồng ý yêu cầu"
      />
      <NcModal
        isOpenProp={openReject}
        onCloseModal={() => {
          setOpenReject(false);
          setReasonReject("");
        }}
        customClass="abc"
        renderContent={() => (
          <div>
            <div className="font-semibold mb-2">Nhập lý do từ chối</div>
            <div className="w-[400px]">
              <textarea
                className="w-full p-2 mt-1 border border-gray-300 rounded"
                value={reasonReject}
                onChange={(e) => setReasonReject(e.target.value)}
              />
            </div>
            <div className="mt-3 flex items-center justify-center">
              <ButtonPrimary onClick={() => handleReject(currentId)}>
                Xác nhận
              </ButtonPrimary>
            </div>
          </div>
        )}
        modalTitle="Nhập lý do từ chối"
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

export default RequestList;