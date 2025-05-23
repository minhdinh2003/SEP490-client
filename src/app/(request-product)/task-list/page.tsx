"use client";
import NcModal from "@/shared/NcModal/NcModal";
import { useEffect, useState } from "react";
import Status from "@/shared/Status/Status";
import useAuthStore from "@/store/useAuthStore";
import {
  dateFormat3,
  getRequestProductStatusColor,
  getRequestProductStatusText,
} from "@/utils/helpers";
import { ButtonIcon } from "@/shared/Button/CustomButton";
import useMessageStore from "@/store/useMessStore";
import ModalMessage from "@/components/ModalMessage";
import { useSearchParams } from "next/navigation";
import { ServiceResponse } from "@/type/service.response";
import { IPagingParam } from "@/contains/paging";
import TaskDetailService from "@/http/taskDetailService";
import RequestService from "@/http/requestService"; // Thêm dòng này
import WorkDetail from "../component/WorkDetail";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import OwnerCreateJob from "../component/OwnerCreateJob";
import Input from "@/shared/Input/Input";

const TaskList = () => {
  const [isDatcoc, setIsDatcoc] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idWork, setIdWork] = useState("");
  const [images, setImages] = useState("");
  const userStore: any = useAuthStore();
  const [listTask, setListTask] = useState<any>([]);
  const [listRequest, setListRequest] = useState<any[]>([]); // Thêm state này
  const [currentId, setCurrentId] = useState("");
  const [openWorkDetail, setOpenWorkDetail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const messStore: any = useMessageStore();
  const [idMess, setIdMess] = useState("");

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIdMess("");
    messStore?.setMessages([]);
    messStore?.setIdRoom?.(null);
  };

  const getListTask = async (page: number = 1) => {
    try {
      const param: IPagingParam = {
        pageSize: 5,
        pageNumber: page,
        conditions: [
          {
            key: "assignedTo",
            condition: "equal",
            value: userStore.user.id,
          },
          {
            key: "any",
            condition: "raw",
            value: {
              assignedTo: userStore.user.id,
              title: {
                contains: searchKey,
              }
            }
          }
        ],
        searchKey: "",
        searchFields: [],
        includeReferences: {
          assignee: true,
        },
        sortOrder: "createdAt desc status desc",
      };
      const res = await TaskDetailService.getPaging<ServiceResponse>(param);
      setListTask(res.data.data);
      setCurrentPage(page);
      setTotalPages(Math.ceil(res.data.totalCount / 5));
    } catch (error: any) {}
  };

  // Lấy danh sách request tương ứng với từng task
  useEffect(() => {
    const fetchRequests = async () => {
      if (!listTask || listTask.length === 0) {
        setListRequest([]);
        return;
      }
      const requests = await Promise.all(
        listTask.map(async (task: any) => {
          if (!task.requestId) return null;
          try {
            const res = await RequestService.getById<ServiceResponse>(task.requestId);
            return res.data;
          } catch {
            return null;
          }
        })
      );
      setListRequest(requests);
    };
    fetchRequests();
  }, [listTask]);

  useEffect(() => {
    getListTask();
  }, []);

  const reset = () => {
    setOpenWorkDetail(false);
  };
  const handleSearch = async () => {
    getListTask(1);
  };

  // Render table, lấy request theo index
  const renderListTable = () =>
    finalList?.map((task: any, index: number) => {
      const request = listRequest[index];
      return (
        <tr
          key={index}
          className={`${task?.id == idNoty ? "bg-green-200" : ""}`}
        >
          <td key={index} className="p-4 border-b border-blue-gray-50">
            <div className="flex items-center gap-3 min-w-[30px]">
              <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
                {request?.id || ""}
              </p>
            </div>
          </td>
          <td key={index} className="p-4 border-b border-blue-gray-50">
            <div className="flex items-center gap-3 min-w-[100px]">
              <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
                {request?.description || ""}
              </p>
            </div>
          </td>
          <td key={index} className="p-4 border-b border-blue-gray-50">
            <div className="flex items-center gap-3 min-w-[100px]">
              <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
                {task.title}
              </p>
            </div>
          </td>
          <td key={index} className="p-4 border-b border-blue-gray-50">
            <div className="flex items-center gap-3 min-w-[100px]">
              <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
                {dateFormat3(task?.createdAt)}
              </p>
            </div>
          </td>
          <td key={index} className="p-4 border-b border-blue-gray-50">
            <div className="flex items-center gap-3 min-w-[200px]">
              <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
                {request?.address || ""}
              </p>
            </div>
          </td>
          <td key={index} className="p-4 border-b border-blue-gray-50">
            <div className="flex items-center gap-3 min-w-[200px]">
              <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 ">
                {task?.description}
              </p>
            </div>
          </td>
          <td className="p-4 border-b border-blue-gray-50 min-w-[150px]">
            <Status
              text={getRequestProductStatusText(task.status)}
              color={getRequestProductStatusColor(task.status)}
            />
          </td>
          <td className=" min-w-[200px] p-4 border-b border-blue-gray-50 flex ">
            <div className=" flex items-center gap-3">
              <ButtonIcon
                onClick={() => {
                  setOpenWorkDetail(true);
                  setIdWork(task.id);
                  setImages(task.Images);
                }}
                svg={"/view.svg"}
                tooltip="Xem công việc"
              />
            </div>
          </td>
        </tr>
      );
    });

  // mark
  const query = useSearchParams();
  const idNoty = query.get("id");
  const finalList = [...listTask];
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
        idTask={idMess}
      />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 w-[400px]">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="w-[250px]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
        <ButtonPrimary
          onClick={() => {
            handleOpenModal();
          }}
        >
          Tạo task
        </ButtonPrimary>
      </div>

      <main className="w-full  ">
        {(finalList as any)?.length > 0 ? (
          <div className="flex  bg-white w-full">
            <div className="px-0 w-full">
              <table className="w-full min-w-full table-auto text-left">
                <thead>
                  <tr>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 ">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        ID Yêu Cầu
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Yêu cầu
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Công việc sửa chữa
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Thời gian tạo
                      </p>
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                        Địa chỉ
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
      <div className="flex justify-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => getListTask(currentPage - 1)}
          className="px-3 py-1 bg-gray-200 rounded-l disabled:bg-gray-100"
        >
          Trước
        </button>
        <span className="px-3 py-1 bg-gray-200">
          {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => getListTask(currentPage + 1)}
          className="px-3 py-1 bg-gray-200 rounded-r disabled:bg-gray-100"
        >
          Sau
        </button>
      </div>
      <NcModal
        isOpenProp={openModal}
        onCloseModal={() => setOpenModal(false)}
        customClass="abc"
        renderContent={() => (
          <OwnerCreateJob
            callback={() => {
              setOpenModal(false);
              setCurrentId("");
              getListTask();
            }}
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
              getListTask();
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

export default TaskList;