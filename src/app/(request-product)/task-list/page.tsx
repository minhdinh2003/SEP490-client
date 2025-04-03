"use client";
import NcModal from "@/shared/NcModal/NcModal";
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
import { ButtonIcon } from "@/shared/Button/CustomButton";
import CreateWork from "../component/CreateJob";
import useMessageStore from "@/store/useMessStore";
import ModalMessage from "@/components/ModalMessage";
import { useSearchParams } from "next/navigation";
import RequestService from "@/http/requestService";
import { ServiceResponse } from "@/type/service.response";
import { IPagingParam } from "@/contains/paging";
import TaskDetailService from "@/http/taskDetailService";
import WorkDetail from "../component/WorkDetail";

const RequestList = () => {
  const [openPrice, setOpenPrice] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [idPrice, setIdPrice] = useState("");
  const [isDatcoc, setIsDatcoc] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openWork, setOpenModalWork] = useState(false);
  const [idWork, setIdWork] = useState("");
  const [images, setImages] = useState("");
  const userStore: any = useAuthStore();
  const [listRequest, setListRequest] = useState<any>([]);
  const [currentId, setCurrentId] = useState("");
  const [openWorkDetail, setOpenWorkDetail] = useState(false);
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
        conditions: [
          {
            key: "assignedTo",
            condition: "equal",
            value: userStore.user.id
          }
        ],
        searchKey: "",
        searchFields: [],
        includeReferences: {
          assignee: true,
        },
        sortOrder: "createdAt desc",
      };
      const res = await TaskDetailService.getPaging<ServiceResponse>(param);
      setListRequest(res.data.data);
    } catch (error: any) {}
  };
  useEffect(() => {
    getListRequest();
  }, []);

  const reset = () => {
    setOpenWorkDetail(false);
  };

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
              {request.title}
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

        <td className="p-4 border-b border-blue-gray-50 min-w-[150px]">
          <Status
            text={getRequestProductStatusText(request.status)}
            color={getRequestProductStatusColor(request.status)}
          />
        </td>
        <td className=" min-w-[200px] p-4 border-b border-blue-gray-50 flex ">
          <div className=" flex items-center gap-3">

            <ButtonIcon
              onClick={() => {
                setOpenWorkDetail(true);
                setIdWork(request.id);
                setImages(request.Images);
              }}
              svg={"/view.svg"}
              tooltip="Xem công việc"
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
                        Tiêu đề
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
            Chưa có task nào
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
            }}
            idRequest={currentId}
          />
        )}
        modalTitle="Tạo công việc"
      />
      <NcModal
        isOpenProp={openWorkDetail}
        onCloseModal={() => {
          reset();
        }}
        renderContent={() => (
          <WorkDetail
            isDatcoc={isDatcoc}
            callback={() => {
              reset();
              getListRequest();
            }}
            idWork={idWork}
            isCustomer={false}
          />
        )}
        modalTitle={"Chi tiết công việc"}
      />
    </div>
  );
};

export default RequestList;
