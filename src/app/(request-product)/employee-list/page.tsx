"use client";
import NcModal from "@/shared/NcModal/NcModal";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
import WorkDetail from "../component/WorkDetail";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import OwnerCreateJob from "../component/OwnerCreateJob";
import Input from "@/shared/Input/Input";
import UserService from "@/http/userService";
import Button from "@/shared/Button/Button";
import Select from "@/shared/Select/Select";
import { handleErrorHttp } from "@/utils/handleError";
import { title } from "process";

const RequestList = () => {
  const [isDatcoc, setIsDatcoc] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idWork, setIdWork] = useState("");
  const [images, setImages] = useState("");
  const userStore: any = useAuthStore();
  const [listRequest, setListRequest] = useState<any>([]);
  const [currentId, setCurrentId] = useState("");
  const [openWorkDetail, setOpenWorkDetail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination and Search States
  const [searchKey, setSearchKey] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const messStore: any = useMessageStore();
  const [idMess, setIdMess] = useState("");

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIdMess("");
    messStore?.setMessages([]);
    messStore?.setIdRoom?.(null);
  };

  const getListRequest = async (page: number = 1) => {
    let values: any = {
      assignedTo: {
        not: null,
      },
      assignee: {
        role: "EMPLOYEE",
      },
      title: {
        contains: searchKey,
      },
    };
    if (selectedUser) {
      values = {
        assignedTo: parseInt(selectedUser),
        title: {
          contains: searchKey,
        },
      };
    }
    try {
      const param: IPagingParam = {
        pageSize: 5,
        pageNumber: page,
        conditions: [
          {
            key: "any",
            condition: "raw",
            value: values,
          },
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
      setCurrentPage(page);
      setTotalPages(Math.ceil(res.data.totalCount / 5));
    } catch (error: any) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getListRequest();
  }, [selectedUser]);

  const reset = () => {
    setOpenWorkDetail(false);
  };

  const handleSearch = async () => {
    getListRequest(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  const renderListTable = () =>
    listRequest?.map((request: any, index: number) => (
      <tr key={index}>
        <td className="p-4 border-b border-blue-gray-50">{request.id}</td>
        <td className="p-4 border-b border-blue-gray-50">{request.title}</td>
        <td className="p-4 border-b border-blue-gray-50">
          {dateFormat3(request?.createdAt)}
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          {request?.description}
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <Status
            text={getRequestProductStatusText(request.status)}
            color={getRequestProductStatusColor(request.status)}
          />
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <ButtonIcon
            onClick={() => {
              setOpenWorkDetail(true);
              setIdWork(request.id);
              setImages(request.Images);
            }}
            svg={"/view.svg"}
            tooltip="Xem công việc"
          />
        </td>
      </tr>
    ));
  const [employees, setEmployees] = useState([]);
  const getListEmployee = async () => {
    try {
      const param: IPagingParam = {
        pageSize: 1000,
        pageNumber: 1,
        conditions: [
          {
            key: "role",
            condition: "equal",
            value: "EMPLOYEE",
          },
        ],
        searchKey: "",
        searchFields: [],
        includeReferences: {},
        sortOrder: "createdAt desc",
      };
      const res = await UserService.getPaging<ServiceResponse>(param);

      setEmployees(res.data.data || []);
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  useEffect(() => {
    getListEmployee();
  }, []);

  return (
    <div className="nc-CartPage">
      <ModalMessage
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        idRequest={idMess}
      />

      <main className="w-full">
        <div className="flex items-center justify-between mb-4">
          {/* Input Search */}
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
            {/* Combobox for User Selection */}
            <Select
              className="w-[200px]"
              value={selectedUser || ""}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="" disabled>
                Chọn nhân viên
              </option>
              {employees?.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.fullName}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {listRequest.length > 0 ? (
          <div className="flex bg-white w-full">
            <div className="px-0 w-full">
              <table className="w-full min-w-full table-auto text-left">
                <thead>
                  <tr>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      ID
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      Tiêu đề
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      Thời gian tạo
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      Mô tả
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      Trạng thái
                    </th>
                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      Hành động
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

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => getListRequest(currentPage - 1)}
            className="px-3 py-1 bg-gray-200 rounded-l disabled:bg-gray-100"
          >
            Trước
          </button>
          <span className="px-3 py-1 bg-gray-200">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => getListRequest(currentPage + 1)}
            className="px-3 py-1 bg-gray-200 rounded-r disabled:bg-gray-100"
          >
            Sau
          </button>
        </div>
      </main>
      <NcModal
        isOpenProp={openModal}
        onCloseModal={() => setOpenModal(false)}
        customClass="abc"
        renderContent={() => (
          <OwnerCreateJob
            callback={() => {
              setOpenModal(false);
              setCurrentId("");
              getListRequest();
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
