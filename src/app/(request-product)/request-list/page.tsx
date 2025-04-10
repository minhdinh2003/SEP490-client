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
} from "@/utils/helpers";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { ActionButton, ButtonIcon } from "@/shared/Button/CustomButton";
import CreateWork from "../component/CreateJob";
import ListWork from "../component/WorkDetail";
import useMessageStore from "@/store/useMessStore";
import ModalMessage from "@/components/ModalMessage";
import { useSearchParams } from "next/navigation";
import Input from "@/shared/Input/Input";
import { ListImageRequest } from "../my-request/ListImageRequest";
import ListWorkOfRequest from "../component/ListWork";

const RequestList = () => {
  const [openPrice, setOpenPrice] = useState(false);
  const [pricce, setPrice] = useState("");
  const [idPrice, setIdPrice] = useState("");
  const [isDatcoc, setIsDatcoc] = useState(false);
  const [openImage,setOpenImage] = useState(false);
  const [idImage,setIdImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openWork, setOpenModalWork] = useState(false);
  const [idWork, setIdWork] = useState("");
  const [reget, setReget] = useState(1);
  const [images, setImages] = useState("");
  const [listCategory, setListCategory] = useState<any>([]);
  useGetData("Category/all", [], setListCategory);
  const userStore: any = useAuthStore();
  //   const { data: listRequest } = useGetData("Policy/owner", [reget]);
  const [listRequest, setListRequest] = useState<any>([]);
  const [currentPolicy, setCurrentPolicy] = useState<any>(null);
  const [currentId, setCurrentId] = useState("");

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

  //
  const getListRequest = async () => {
    try {
      const res = await http.post("productRequest/paging", {
        PageSize: 1000,
        PageNumber: 1,
        Filter: ` CreatorUserID  = ${userStore?.user?.UserID}  `,
        SortOrder: " ModifiedDate desc ",
        SearchKey: "",
      });
      setListRequest(res.payload.Data.Data);
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

  // REJECct
  const handleReject = async (id: any) => {
    try {
      await http.put(`productRequest/reject?requestID=${id}`, {});
      toast.success("Đã từ chối");
      getListRequest();
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
      await http.put(
        `productRequest/accept?requestID=${idPrice}&price=${pricce}`,
        {}
      );
      toast.success("Đã xác nhận");
      getListRequest();
      setOpenPrice(false);
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
          <p className=" min-w-[150px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
            {formatPriceVND(request?.ProposedPrice)}
          </p>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <p className="  min-w-[150px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
            {request?.NegotiatedPrice != 0 && request?.NegotiatedPrice
              ? formatPriceVND(request?.NegotiatedPrice)
              : "Đang thoả thuận"}
          </p>
        </td>
        <td className="p-4 border-b border-blue-gray-50 min-w-[150px]">
          <Status
            text={getRequestProductStatusText(request.Status)}
            color={getRequestProductStatusColor(request.Status)}
          />
        </td>
        <td className=" min-w-[200px] p-4 border-b border-blue-gray-50 flex ">
          <div className=" flex items-center gap-3">
            {request.Status == 0 && (
              <div className="flex gap-3 ">
                <ButtonIcon
                  onClick={() => {
                    setOpenPrice(true);
                    setIdPrice(request?.ProductRequestID);
                  }}
                  svg={"/accept.svg"}
                  tooltip="Xác nhận"
                />
                <ButtonIcon
                  onClick={() => handleReject(request?.ProductRequestID)}
                  svg={"/reject.svg"}
                  tooltip="Từ chối"
                />
              </div>
            )}
            {request.Status == RequestProductStatus.Approved && (
              <div className="flex items-center gap-3">
                <ButtonIcon
                  onClick={() => {
                    setOpenModal(true);
                    setCurrentId(request.ProductRequestID);
                  }}
                  svg={"/create.svg"}
                  tooltip="Tạo công việc"
                />
              </div>
            )}
            {request.Status != RequestProductStatus.Cancel &&
              request.Status != RequestProductStatus.Reject &&
              request.Status != RequestProductStatus.Pending && (
                <ButtonIcon
                  onClick={() => {
                    setOpenModalWork(true);
                    setIdWork(request.ProductRequestID);
                    setImages(request.Images);
                    setIsDatcoc(
                      request.DepositAmount &&
                        request.DepositAmount > 0 &&
                        request.DepositAmount < request?.NegotiatedPrice
                    );
                  }}
                  svg={"/view.svg"}
                  tooltip="Xem  công việc"
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
              <ButtonIcon
                onClick={() => {
                  setOpenImage(true);
                  setIdImage(request.ProductRequestID)
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
  const finalList = [...listRequest];
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
        isOpenProp={openModal}
        onCloseModal={() => setOpenModal(false)}
        renderContent={() => (
          <CreateWork
            callback={() => {
              setOpenModal(false);
              setCurrentId("");
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
            <div className="mt-3">
              <ButtonPrimary onClick={() => handleApprove()}>
                Xác nhận
              </ButtonPrimary>
            </div>
          </div>
        )}
        modalTitle="Nhập giá"
      />
      <NcModal
        isOpenProp={openImage}
        onCloseModal={() => {
          setOpenImage(false);
          setIdImage(null);
        }}
        renderContent={() => (
          <ListImageRequest
          
          id= {idImage}
          />
        )}
        modalTitle="Hình ảnh minh họa"
      />
    </div>
  );
};

export default RequestList;
