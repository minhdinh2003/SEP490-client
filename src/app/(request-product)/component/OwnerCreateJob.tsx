"use client";
import { useEffect, useState } from "react";
import http from "@/http/http";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Select from "react-select";
import { handleErrorHttp } from "@/utils/handleError";
import toast from "react-hot-toast";
import { IPagingParam } from "@/contains/paging";
import { ServiceResponse } from "@/type/service.response";
import UserService from "@/http/userService";
import TaskDetailService from "@/http/taskDetailService";
import useAuthStore from "@/store/useAuthStore";
import NcModal from "@/shared/NcModal/NcModal";
import AddCustomer from "../owner-request/AddCustomer";
import RequestService from "@/http/requestService";

const OwnerCreateJob = ({ editItem, callback = () => {}, idRequest }: any) => {
  const initialData = {
    requestId: 0,
    assignedTo: 0,
    title: "",
    description: "",
    status: "PENDING",
    deadline: "",
    price: 0,
    userId: -1,
  };
  const [formData, setFormData] = useState<any>(initialData);
  const [errors, setErrors] = useState<any>({});
  const { user, logout } = useAuthStore() as any;
  useEffect(() => {
    if (editItem) {
      setFormData({
        ...editItem,
      });
    }
  }, [editItem]);

  const validateForm = () => {
    let valid = true;
    let newErrors: any = {};
    formData.assignedTo = user.id;
    if (!formData.title) {
      newErrors.title = "Tiêu đề là bắt buộc";
      valid = false;
    }
    if (!formData.description) {
      newErrors.description = "Mô tả là bắt buộc";
      valid = false;
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = "Chưa chọn nhân viên";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSaveData = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    const body = { ...formData };

    try {
      delete body.assignedTo;
      body.type = "EMPLOYEE_TASK";
      var response = await RequestService.post<ServiceResponse>("", {
        images: [],
        reasonReject: "",
        isUserConfirm: false,
        userId: user.id,
        price: 0,
        description: "",
        type: "EMPLOYEE_TASK",
      });
      if (!response.success) {
        toast.error("Có lỗi xảy ra");
        return;
      }
      delete body.userId;
      delete body.type;
      await TaskDetailService.post("", {
        ...body,
        requestId: response.data,
        deadline: new Date(body.deadline),
        assignedTo: parseInt(formData.assignedTo),
        price: parseInt(formData.price),
      });
      toast.success("Tạo task thành công");
      setFormData(initialData);
      callback();
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  const changeData = (key: any) => (e: any) => {
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
  };
  const [customers, setCustomers] = useState<any[]>([]);
  const [openAdd, setOpenAddCustomer] = useState(false);
  const getCustomers = async () => {
    try {
      const param: IPagingParam = {
        pageSize: 1000,
        pageNumber: 1,
        conditions: [
          {
            key: "role",
            condition: "equal",
            value: "USER",
          },
        ],
        searchKey: "",
        searchFields: [],
        includeReferences: {},
        sortOrder: "createdAt desc",
      };
      const res = await UserService.getPaging<ServiceResponse>(param);

      setCustomers(res.data.data || []);
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);
  // Format dữ liệu cho react-select
  const customerOptions = customers.map((customer) => ({
    value: customer.id,
    label: customer.fullName,
  }));

  // Xử lý khi chọn khách hàng
  const handleCustomerChange = (selectedOption: any) => {
    setSelectedCustomer(selectedOption);
    setFormData({ ...formData, userId: selectedOption?.value });
  };
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  return (
    <div className="nc-CartPage">
      <main className="">
        <div className="grid grid-cols-1 w-[500px]">
          <form className="grid grid-cols-1 gap-4">
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Tiêu đề
              </span>
              <Input
                value={formData.Title}
                onChange={changeData("title")}
                placeholder="Tiêu đề"
                className="mt-1"
                name="title"
              />
              {errors.title && (
                <span className="text-red-500">{errors.title}</span>
              )}
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Chọn Khách hàng
              </span>
              <div className="flex mt-2">
                <Select
                  options={customerOptions} // Danh sách khách hàng
                  value={selectedCustomer} // Giá trị đã chọn
                  onChange={handleCustomerChange} // Xử lý khi chọn
                  placeholder="-- Chọn khách hàng --"
                  isSearchable // Cho phép tìm kiếm
                  className="w-full"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenAddCustomer(true);
                  }}
                  className="ml-auto bg-white text-black px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition duration-300"
                >
                  Thêm
                </button>
              </div>

              {errors.userId && (
                <span className="text-red-500">{errors.userId}</span>
              )}
            </label>
            {/* <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Chi phí phát sinh nếu có
              </span>
              <Input
                value={formData.price}
                onChange={changeData("price")}
                className="mt-1"
                name="Title"
                type="number"
              />
              {errors.price && (
                <span className="text-red-500">{errors.price}</span>
              )}
            </label> */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Mô tả
              </span>
              <Input
                value={formData.description}
                onChange={changeData("description")}
                placeholder="Mô tả"
                className="mt-1 h-28"
                name="description"
              />
              {errors.description && (
                <span className="text-red-500">{errors.description}</span>
              )}
            </label>

            <ButtonPrimary onClick={(e) => handleSaveData(e)} type="submit">
              {!editItem ? "Tạo công việc" : "Sửa yêu cầu"}
            </ButtonPrimary>
          </form>
        </div>
      </main>
      <NcModal
        isOpenProp={openAdd}
        onCloseModal={() => {
          setOpenAddCustomer(false);
          // setIdImage(null);
        }}
        renderContent={() => (
          <AddCustomer
            callback={() => {
              setOpenAddCustomer(false);
              getCustomers();
            }}
          />
        )}
        modalTitle="Thêm người dùng"
      />
    </div>
  );
};

export default OwnerCreateJob;
