"use client";
import { useEffect, useState } from "react";
import http from "@/http/http";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Select from "@/shared/Select/Select"; // Giả sử bạn có một component Select
import { handleErrorHttp } from "@/utils/handleError";
import toast from "react-hot-toast";
import { IPagingParam } from "@/contains/paging";
import { ServiceResponse } from "@/type/service.response";
import UserService from "@/http/userService";
import TaskDetailService from "@/http/taskDetailService";

const CreateWork = ({ editItem, callback = () => {}, idRequest }: any) => {
  const initialData = {
    requestId: 0,
    assignedTo: 0,
    title: "",
    description: "",
    status: "PENDING",
    deadline: "",
    price: 0,
    address: ""
  };
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState<any>(initialData);
  const [errors, setErrors] = useState<any>({});
  const [showCustomTitleInput, setShowCustomTitleInput] = useState(false); // Trạng thái hiển thị input

  // Danh sách công việc mẫu
  const predefinedTitles = [
    { value: "Kiểm tra xe (Tại nhà)", label: "Kiểm tra xe (Tại nhà)" },
    { value: "Kiểm tra xe (Gara)", label: "Kiểm tra xe (Gara)" },
    { value: "Báo giá sửa chữa", label: "Báo giá sửa chữa" },
    { value: "Tiến hành sửa chữa", label: "Tiến hành sửa chữa" },
    { value: "Kiểm tra sau sửa chữa", label: "Kiểm tra sau sửa chữa" },
    { value: "hanh toán chi phí", label: "Thanh toán chi phí" },
    { value: "Giao xe cho khách hàng", label: "Giao xe cho khách hàng" },
    { value: "Khác", label: "Khác" }, // Tùy chọn "Khác"
  ];

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

  const changeData = (key: any) => (e: any) => {
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
  };

  const handleTitleChange = (selectedValue: string) => {
    if (selectedValue === "Khác") {
      setShowCustomTitleInput(true); // Hiển thị input nếu chọn "Khác"
      setFormData({ ...formData, title: "" }); // Xóa giá trị title hiện tại
    } else {
      setShowCustomTitleInput(false); // Ẩn input nếu chọn giá trị khác
      setFormData({ ...formData, title: selectedValue }); // Cập nhật title từ combo box
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
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="mt-1"
              >
                <option value="">-- Chọn công việc --</option>
                {predefinedTitles.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
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

            {/* Nhân viên */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Nhân viên
              </span>
              <Select onChange={changeData("assignedTo")}>
                <option value="">-- Chọn nhân viên --</option>
                {employees.map((employee: any) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName}
                  </option>
                ))}
              </Select>
              {errors.assignedTo && (
                <span className="text-red-500">{errors.assignedTo}</span>
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

export default CreateWork;
