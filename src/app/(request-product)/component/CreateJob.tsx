// pages/index.tsx

"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import http from "@/http/http";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Select from "@/shared/Select/Select"; // Giả sử bạn có một component Select
import { handleErrorHttp } from "@/utils/handleError";
import toast from "react-hot-toast";

const CreateWork = ({ editItem, callback = () => {} ,idRequest}: any) => {
  const initialData = {
    ProductRequestID: 0,
    Title: "",
    Description: "",
    Status: 0,
    ExpectedDate:""
  };

  const [formData, setFormData] = useState<any>(initialData);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();
  const { id } = useParams();

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

    if (!formData.Title) {
      newErrors.Title = "Tiêu đề là bắt buộc";
      valid = false;
    }
    if (!formData.Description) {
      newErrors.Description = "Mô tả là bắt buộc";
      valid = false;
    }
    if (!formData.ExpectedDate) {
      newErrors.ExpectedDate = "Ngày dự kiến hoàn thành là bắt buộc";
      valid = false;
    }else if (new Date(formData.ExpectedDate) < new Date()) {
      newErrors.ExpectedDate = "Ngày dự kiến hoàn thành không thể ở quá khứ";
      valid = false;
    }
    

    setErrors(newErrors);
    return valid;
  };

  const handleSaveData = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    const body = { ...formData };

    try {
      if (!editItem) {
        await http.post("ProductRequest/work", {...body,ProductRequestID:idRequest});
        toast.success("Tạo công việc thành công");
        setFormData(initialData);
        callback()
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

  const handleStatusChange = (e: any) => {
    setFormData({ ...formData, Status: e.target.value });
  };

  return (
    <div className="nc-CartPage">
      <main className="">
        
        <div className="grid grid-cols-2 gap-4">
          <form className="grid grid-cols-1 gap-4">
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Tiêu đề
              </span>
              <Input
                value={formData.Title}
                onChange={changeData("Title")}
                placeholder="Tiêu đề"
                className="mt-1"
                name="Title"
              />
              {errors.Title && (
                <span className="text-red-500">{errors.Title}</span>
              )}
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Ngày dự kiến hoàn thành
              </span>
              <Input
                value={formData.ExpectedDate}
                onChange={changeData("ExpectedDate")}
                className="mt-1"
                name="Title"
                type="date"
              />
              {errors.ExpectedDate && (
                <span className="text-red-500">{errors.ExpectedDate}</span>
              )}
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Mô tả
              </span>
              <Input
                
                value={formData.Description}
                onChange={changeData("Description")}
                placeholder="Mô tả"
                className="mt-1 h-28"
                name="Description"
              />
              {errors.Description && (
                <span className="text-red-500">{errors.Description}</span>
              )}
            </label>
          
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
