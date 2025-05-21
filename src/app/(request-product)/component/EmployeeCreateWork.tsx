"use client";
import { useEffect, useState } from "react";
import http from "@/http/http";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import { handleErrorHttp } from "@/utils/handleError";
import toast from "react-hot-toast";
import { IPagingParam } from "@/contains/paging";
import { ServiceResponse } from "@/type/service.response";
import UserService from "@/http/userService";
import TaskDetailService from "@/http/taskDetailService";
import useAuthStore from "@/store/useAuthStore";
import taskTemplateService from "@/http/taskTemplateService";
import Select from "react-select";

const EmployeeCreateWork = ({
  editItem,
  callback = () => {},
  idRequest,
}: any) => {
  const userStore: any = useAuthStore();
  const initialData = {
    requestId: 0,
    assignedTo: 0,
    title: "",
    description: "",
    status: "PENDING",
    deadline: "",
    price: 0,
    address: "",
    items: []
  };
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState<any>(initialData);
  const [errors, setErrors] = useState<any>({});
  const [showCustomTitleInput, setShowCustomTitleInput] = useState(false); // Trạng thái hiển thị input

  // Danh sách công việc mẫu
  const [taskTemplates, setTaskTemplates] = useState<any[]>([]);
  useEffect(() => {
    const fetchTaskTemplates = async () => {
      try {
        const response = await taskTemplateService.getAll<ServiceResponse>(); // API endpoint
        const templates = response.data.map((item: any) => ({
          value: item.title,
          label: item.title,
          price: item.price || 0
        }));
        setTaskTemplates(templates);
      } catch (error) {
        console.error("Error fetching task templates:", error);
      } finally {
      }
    };

    fetchTaskTemplates();
  }, []);
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

    if (!formData.title) {
      newErrors.title = "Tiêu đề là bắt buộc";
      valid = false;
    }
    if (!formData.description) {
      newErrors.description = "Mô tả là bắt buộc";
      valid = false;
    }
    if (!formData.deadline) {
      newErrors.deadline = "Ngày hoàn thành là bắt buộc";
      valid = false;
    } else if (new Date(formData.deadline) < new Date()) {
      newErrors.deadline = "Ngày hoàn thành không thể ở quá khứ";
      valid = false;
    }
    formData.assignedTo = userStore.user.id;
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
      if (!editItem) {
        await TaskDetailService.post("", {
          ...body,
          requestId: idRequest,
          deadline: new Date(body.deadline),
          assignedTo: parseInt(formData.assignedTo),
          price: parseInt(body.price),
        });
        toast.success("Tạo task thành công");
        setFormData(initialData);
        callback();
      } else {
        await http.put("productRequest", body);
        toast.success("Đã sửa");
        callback();
      }
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  // Hàm thay đổi dữ liệu form và reset lỗi cho trường cụ thể
  const changeData = (key: string) => (e: any) => {
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });

    // Reset lỗi cho trường dữ liệu cụ thể
    if (errors[key]) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        [key]: undefined,
      }));
    }
  };

  const handleTitleChange = (selectedValue: any) => {
    if (selectedValue && selectedValue === "Khác") {
      setShowCustomTitleInput(true); // Hiển thị input nếu chọn "Khác"
      setFormData({ ...formData, title: "" }); // Xóa giá trị title hiện tại
    } else {
      setShowCustomTitleInput(false); // Ẩn input nếu chọn giá trị khác
      setFormData({ ...formData, title: selectedValue }); // Cập nhật title từ combo box
    }

    // Reset lỗi cho trường tiêu đề
    if (errors.title) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        title: undefined,
      }));
    }
  };
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...(formData.items || []), { title: "", isDone: false }],
    });
  };

  const updateItem = (index: number, value: string) => {
    const updatedItems = [...(formData.items || [])];
    updatedItems[index].title = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const removeItem = (index: number) => {
    const updatedItems = (formData.items || []).filter(
      (_: any, i: number) => i !== index
    );
    setFormData({ ...formData, items: updatedItems });
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

  useEffect(() => {
    getListEmployee();
  }, []);

  return (
    <div className="nc-CartPage">
      <main className="">
        <div className="grid grid-cols-1 w-[500px]">
          <form className="grid grid-cols-1 gap-4">
            {/* Tiêu đề */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Tiêu đề
              </span>
              <Select
                value={taskTemplates.find(
                  (option) => option.value === formData.title
                )}
                onChange={(e: any) => {
                  handleTitleChange(e.value);
                  setFormData({ ...formData, price: e.price });
                }}
                className="mt-1"
                options={taskTemplates}
                placeholder="-- Chọn công việc --"
                isSearchable
              />
              {showCustomTitleInput && (
                <Input
                  value={formData.title}
                  onChange={changeData("title")}
                  placeholder="Nhập tiêu đề khác"
                  className="mt-2"
                />
              )}
              {errors.title && (
                <span className="text-red-500">{errors.title}</span>
              )}
            </label>
            {/* Chi phí */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Chi phí phát sinh nếu có
              </span>
              <Input
                value={formData.price}
                onChange={changeData("price")}
                className="mt-1"
                name="price"
                type="number"
              />
              {errors.price && (
                <span className="text-red-500">{errors.price}</span>
              )}
            </label>

            {/* Hạn hoàn thành */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Hạn hoàn thành
              </span>
              <Input
                value={formData.deadline}
                onChange={changeData("deadline")}
                className="mt-1"
                name="deadline"
                type="date"
              />
              {errors.deadline && (
                <span className="text-red-500">{errors.deadline}</span>
              )}
            </label>

            {/* Địa chỉ */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Địa chỉ
              </span>
              <Input
                value={formData.address}
                onChange={changeData("address")}
                placeholder="Nhập địa chỉ"
                className="mt-1"
                name="address"
              />
              {errors.address && (
                <span className="text-red-500">{errors.address}</span>
              )}
            </label>

            {/* Mô tả */}
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
            <div className="block">
              <span className="text-neutral-800 dark:text-neutral-200 block font-medium mb-2">
                Danh sách công việc
              </span>
              {formData?.items?.length > 0 ? (
                formData.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center mb-2">
                    <span className="w-4 text-gray-500 mr-2">{index + 1}.</span>
                    <Input
                      value={item.title}
                      onChange={(e) => updateItem(index, e.target.value)}
                      className="mr-2 flex-1"
                    />
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Không có công việc</p>
              )}
              <div
                onClick={addItem}
                className="w-[150px] font-normal  mt-4 cursor-pointer bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition-colors"
              >
                Thêm công việc
              </div>
            </div>

            {/* Nút lưu */}
            <ButtonPrimary onClick={(e) => handleSaveData(e)} type="submit">
              {!editItem ? "Tạo công việc" : "Sửa yêu cầu"}
            </ButtonPrimary>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EmployeeCreateWork;
