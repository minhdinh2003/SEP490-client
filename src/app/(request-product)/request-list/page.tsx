"use client";
import NcModal from "@/shared/NcModal/NcModal";
import { useGetData } from "@/hooks/useGetData";
import http from "@/http/http";
import { handleErrorHttp } from "@/utils/handleError";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Status from "@/shared/Status/Status";
import useAuthStore from "@/store/useAuthStore";
import {
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
import { ServiceResponse } from "@/type/service.response";
import { IPagingParam } from "@/contains/paging";
import { get } from "js-cookie";

const RequestList = () => {
  const [openPrice, setOpenPrice] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [pricce, setPrice] = useState("");
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
  const [currentPolicy, setCurrentPolicy] = useState<any>(null);
  const [currentId, setCurrentId] = useState("");


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

  const getListRequest = async () => {
    try {
      const param: IPagingParam = {
        pageSize: 1000,
        pageNumber: 1,
        conditions: [{
          key: "type",
          condition: "different",
          value: "EMPLOYEE_TASK"
        }],
        searchKey: "",
        searchFields: [],
        includeReferences: {
          user: true,
          TaskDetail: true
        },
        sortOrder: "createdAt desc",
      };
      const res = await RequestService.getPaging<ServiceResponse>(param);
      setListRequest(res.data.data);
    } catch (error: any) {}
  };
  useEffect(() => {
    getListRequest();
  }, []);

  // REJECct
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

  // Approve
  const handleApprove = async () => {
    if (isNaN(Number(pricce)) || Number(pricce) <= 0) {
      toast.error("Giá không hợp lệ");
      return;
    }

    try {
      await RequestService.updateStatus(idPrice, {
        status: "APPROVED",
        comment: "",
        price: pricce,
      });
      toast.success("Đã xác nhận");
      getListRequest();
      setOpenPrice(false);
      setPrice("");
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
              {request?.user.fullName}
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
        <td className="p-4 border-b border-blue-gray-50 min-w-[150px]">
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
            { request.status != RequestStatus.REJECTED
            && request.status != RequestStatus.COMPLETED
            && request.status != RequestStatus.CANCELLED
            &&
             (
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
  return (
    <div className="nc-CartPage">
      <ModalMessage
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        idRequest={idMess}
      />
      <main className="  ">
        {(finalList as any)?.length > 0 ? (
          <div className="flex  bg-white">
            <div className="px-0">
              <table className="w-full min-w-full table-auto text-left">
                <thead>
                  <tr>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 ">
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
        isOpenProp={openModal}
        onCloseModal={() => setOpenModal(false)}
        customClass="abc"
        renderContent={() => (
          <CreateWork
            callback={() => {
              setOpenModal(false);
              setCurrentId("");
              getListRequest();
            }}
            idRequest={currentId}
          />
        )}
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
        isOpenProp={openPrice}
        onCloseModal={() => {
          setOpenPrice(false);
        }}
        customClass="abc"
        renderContent={() => (
          <div>
            <div className="font-semibold mb-2">Giá thỏa thuận</div>
            <div className="w-[400px]">
              <Input
                value={pricce}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
              />
            </div>
            <div className="mt-3 flex items-center justify-center">
              <ButtonPrimary onClick={() => handleApprove()}>
                Xác nhận
              </ButtonPrimary>
            </div>
          </div>
        )}
        modalTitle="Nhập giá"
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
