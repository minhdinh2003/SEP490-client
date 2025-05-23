"use client";
import useAuthStore from "@/store/useAuthStore";
import { handleErrorHttp } from "@/utils/handleError";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "swiper/css";
import "swiper/css/navigation";
import RequestService from "@/http/requestService";
import CoverflowSlider from "@/components/slider/SliderImage";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Select from "@/shared/Select/Select";
import {
  getUrlImage,
  getWorkStatusColor,
  getWorkStatusText,
  WorkStatus,
} from "@/utils/helpers";
import Image from "next/image";

import { ServiceResponse } from "@/type/service.response";
import { IPagingParam } from "@/contains/paging";
import TaskDetailService from "@/http/taskDetailService";
import UploadService from "@/http/uploadService";
import UserService from "@/http/userService";
import TextArea from "antd/es/input/TextArea";
import { Input } from "antd";

const WorkDetail = ({
  callback = () => { },
  images,
  isCustomer,
  idWork,
}: any) => {
  const optionWork = [
    {
      title: "Đang chờ xử lý",
      value: "PENDING",
    },
    {
      title: "Đang thực hiện",
      value: "IN_PROGRESS",
    },
    {
      title: "Đã hoàn thành",
      value: "COMPLETED",
    },
    {
      title: "Đã hủy",
      value: "CANCELLED",
    },
  ];
  const [status, setStatus] = useState();
  const [initStatus, setInitStatus] = useState();
  const [listImage, setListImage] = useState<string[]>([]);
  const userStore: any = useAuthStore();
  const isEmployee = userStore.user.role == "EMPLOYEE";
  const isOwner = userStore.user.role == "OWNER";
  const [work, setWork] = useState<any>([]);
  const [items, setItems] = useState<any[]>([]);
  const [request, setRequest] = useState<any>(null);
  const [idRequest, setIdRequest] = useState<any>(null);
  const handleItemChange = (index: number, isChecked: boolean) => {
    const updatedItems = [...items];
    updatedItems[index].isDone = isChecked;
    setItems(updatedItems);
  };
  function renderTableRow(label: any, value: any) {
    return (
      <tr style={{ backgroundColor: "white" }}>
        <th
          className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r w-1/4 border-t border-l"
          style={{ fontWeight: "bold !important" }}
        >
          {label}
        </th>
        <td
          style={{ backgroundColor: "white" }}
          className="px-6 py-3 text-sm text-gray-900 border-t border-r"
        >
          {value}
        </td>
      </tr>
    );
  }
  const getWorkDetail = async () => {
    try {
      const res = await TaskDetailService.getById<ServiceResponse>(idWork);
      setWork(res.data);
      setListImage(getUrlImage(res?.data?.images).listImage);
      setStatus(res.data?.status);
      setInitStatus(res.data?.status);
      setIdRequest(res.data?.requestId);
    } catch (error: any) {
      console.log(error);
      handleErrorHttp(error?.payload);
    }
  };

  const getRequestById = async () => {
    try {
      const res = await RequestService.getById<ServiceResponse>(idRequest);
      setRequest(res.data);
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (idWork) {
      getWorkDetail();
    }
  }, [idWork]);
  useEffect(() => {
    if (idRequest) {
      getRequestById();
    }
  }, [idRequest]);

  const handleChangeFile = async (e: any) => {
    const files = e.target.files;
    const listUrl: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const response = await UploadService.upload(file);
        listUrl.push(response.data.fileUrl); // Thêm URL vào mảng
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        // Xử lý lỗi nếu cần
      }
    }
    if (listUrl?.length > 0) {
      setListImage([...listImage, ...listUrl]);
    }
  };

  const handleDeleteImage = (index: number) => {
    const newListImage: string[] = [...listImage!];
    newListImage.splice(index, 1);
    setListImage(newListImage);
  };

  const updateData = async () => {
    try {
      let data: any = {
        description: work.description,
        title: work.title,
        status: status,
        images: listImage,
        comments: work.comments,
        price: work.price,
        address: work.address,
        items: work.items,
        incidentalCosts: work.incidentalCosts,
      };
      if (work.assignedTo) {
        data.assignee = {
          connect: { id: work.assignedTo },
        };
      }
      var result = await TaskDetailService.updateById(work.id, data);
      toast.success("Đã cập nhật");
      callback();
    } catch (error: any) {
      console.log(error);
      handleErrorHttp(error?.payload);
    }
  };

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
  const handleItemChangeTask = (index: number, isChecked: boolean) => {
    const updatedItems = [...work.items];
    updatedItems[index].isDone = isChecked;
    setWork({ ...work, items: updatedItems });
  };
  useEffect(() => {
    getListEmployee();
  }, []);
  return (
    <div className="nc-CartPage relative">
      <main className="py-5 pb-2">
        {work ? (
          <div className="flex flex-col gap-5 ">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody>
                {renderTableRow(
                  "Mô tả",
                  <TextArea
                    className="outline-none rounded border border-gray-400 leading-normal resize-none w-full h-16 py-2 px-3 font-medium placeholder-gray-700"
                    name="body"
                    placeholder="Nhập mô tả "
                    required
                    value={work?.description}
                    onChange={(e: any) =>
                      setWork({ ...work, description: e.target.value })
                    }
                    disabled={
                      work.status == WorkStatus.Done ||
                      work.status == WorkStatus.Reject ||
                      isCustomer ||
                      isEmployee
                    }
                  ></TextArea>
                )}
                {renderTableRow(
                  "Nhân viên",
                  <div className="w-[400px]">
                    <Select
                      onChange={(e) => {
                        setWork({
                          ...work,
                          assignedTo: parseInt(e.target.value),
                        });
                      }}
                      value={work?.assignedTo || ""}
                      disabled={
                        isCustomer ||
                        isEmployee ||
                        work.status == WorkStatus.Done ||
                        work.status == WorkStatus.Reject
                      }
                    >
                      {/* Placeholder option */}
                      <option value="">-- Chọn nhân viên --</option>

                      {/* List of employees */}
                      {employees.map((employee: any) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.fullName}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
                {renderTableRow(
                  "Danh sách công việc",
                  <div className="w-[400px]">
                    <div className="block">
                      {work?.items?.length > 0 ? (
                        work.items.map((item: any, index: number) => (
                          <div key={index} className="flex items-center mb-2">
                            {/* Checkbox */}
                            <input
                              disabled={
                                work.status == WorkStatus.Done ||
                                work.status == WorkStatus.Reject
                              }
                              type="checkbox"
                              checked={item.isDone}
                              onChange={(e) =>
                                handleItemChangeTask(index, e.target.checked)
                              }
                              className="mr-2"
                            />
                            {/* Tiêu đề công việc */}
                            <span>{item.title}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500">
                          Không có công việc
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {renderTableRow(
                  "Chi phí công việc",
                  <div className="w-[400px]">
                    <Input
                      onChange={(e) => {
                        setWork({
                          ...work,
                          price: parseInt(e.target.value),
                        });
                      }}
                      type="number"
                      value={work?.price || 0}
                      disabled={
                        isCustomer ||
                        isEmployee ||
                        work.status == WorkStatus.Done ||
                        work.status == WorkStatus.Reject
                      }
                    ></Input>
                  </div>
                )}
                {renderTableRow(
                  "Chi phí phát sinh",
                  <div className="w-[400px]">
                    <Input
                      onChange={(e) => {
                        setWork({
                          ...work,
                          incidentalCosts: parseInt(e.target.value),
                        });
                      }}
                      type="number"
                      value={work?.incidentalCosts || 0}
                      disabled={
                        isCustomer ||
                        isEmployee ||
                        work.status == WorkStatus.Done ||
                        work.status == WorkStatus.Reject
                      }
                    ></Input>
                  </div>
                )}
                {renderTableRow(
                  "Trạng thái",
                  <div className="w-[400px]">
                    <Select
                      onChange={(e: any) => {
                        setStatus(e.target.value);
                      }}
                      value={status}
                      disabled={
                        isCustomer ||
                        work.status == WorkStatus.Done ||
                        work.status == WorkStatus.Reject
                      }
                    >
                      {optionWork.map((i: any) => (
                        <option key={i.value} value={i.value}>
                          {i.title}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
                {request?.repairType === "AT_HOME" &&
                  renderTableRow(
                    "Địa chỉ",
                    <TextArea
                      className="outline-none rounded border border-gray-400 leading-normal resize-none w-full h-16 py-2 px-3 font-medium placeholder-gray-700"
                      name="body"
                      required
                      value={request?.address}
                      disabled={
                        work.status == WorkStatus.Done ||
                        work.status == WorkStatus.Reject
                      }
                    ></TextArea>
                  )}
              </tbody>
            </table>

            {!(
              work.status == WorkStatus.Done || work.status == WorkStatus.Reject
            ) &&
              !isCustomer && (
                <div className="flex flex-col ">
                  <div className="rounded-full w-[160px] h-[100px]">
                    <label
                      htmlFor="input-file"
                      className="py-1 rounded-full flex items-center justify-center cursor-pointer bg-black text-[white]"
                    >
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="#000"
                        />
                      </svg>

                      <span className="mt-1 text-xs inline-block ml-2 ">
                        Thêm ảnh
                      </span>
                    </label>
                    <input
                      onChange={handleChangeFile}
                      type="file"
                      className="opacity-0 cursor-pointer"
                      multiple
                      id="input-file"
                    />
                  </div>
                  <div className="mt-1 flex  flex-wrap gap-4 relative ">
                    {listImage?.map((src: any, index: any) => (
                      <div
                        key={index}
                        style={{
                          width: "calc(50% - 40px)",
                        }}
                        className="relative flex items-center justify-between border border-gray-300 p-2 rounded "
                      >
                        <img
                          src={src}
                          className="w-14 h-14 object-cover rounded"
                          alt="Product"
                        />
                        <div className="flex-1 ml-4">
                          <p className="text-sm">Image {index + 1}</p>
                          <p className="text-xs text-gray-500">
                            {(src.size || 100 + Math.random() * 1000).toFixed(
                              2
                            )}{" "}
                            KB
                          </p>
                        </div>
                        <Image
                          className="cursor-pointer"
                          onClick={() => handleDeleteImage(index)}
                          src="/delete1.svg"
                          alt=""
                          width={20}
                          height={20}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {!isCustomer &&
              (isOwner ||
                (isEmployee && work.assignedTo == userStore?.user.id)) &&
              (status == 2 ||
                !(
                  work.status == WorkStatus.Done ||
                  work.status == WorkStatus.Reject
                )) && (
                <div className="mt-5 w-full flex justify-end">
                  <ButtonPrimary onClick={updateData}>Lưu</ButtonPrimary>
                </div>
              )}

            {((isCustomer && work.Status != 1) ||
              work.status == WorkStatus.Done) && (
                <div className="mt-4">
                  <h3 className="font-semibold text-lg mb-5">
                    Danh sách hình ảnh{" "}
                  </h3>
                  {!listImage?.length ? (
                    <div>Danh sách ảnh trống</div>
                  ) : (
                    <CoverflowSlider images={listImage || []} />
                  )}
                </div>
              )}
          </div>
        ) : (
          <div className="flex justify-center items-center text-[gray] pt-[100px]">
            Chưa có công việc nào
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkDetail;