"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import http from "@/http/http";
import toast from "react-hot-toast";
import { handleErrorHttp } from "@/utils/handleError";
import useAuthStore from "@/store/useAuthStore";

const AccountForm = () => {
  const initialFormState = {
    AccountNumber: "",
    BankName: "",
    BankNumber: "",
    FullName: "",
    Money: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();
  const userStore:any = useAuthStore()
  
  const validateForm = () => {
    let valid = true;
    let newErrors: any = {};

    // Kiểm tra định dạng số tài khoản ngân hàng (ví dụ: phải là 10-12 chữ số)
    const accountNumberRegex = /^\d{10,12}$/;

    if (!formData.AccountNumber.trim()) {
      
    } else if (!accountNumberRegex.test(formData.AccountNumber.trim())) {
      newErrors.AccountNumber = "Số tài khoản không hợp lệ (phải là 10-12 chữ số)";
      valid = false;
    }

    if (!formData.BankName.trim()) {
      newErrors.BankName = "Tên ngân hàng là bắt buộc";
      valid = false;
    }
    if (!formData.BankNumber.trim()) {
      newErrors.BankNumber = "Số tài khoản ngân hàng là bắt buộc";
      valid = false;
    }
    if (!formData.FullName.trim()) {
      newErrors.FullName = "Họ tên là bắt buộc";
      valid = false;
    }
    if (Number(formData.Money)  <= 0) {
      newErrors.Money = "Số tiền phải lớn hơn 0";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSaveData = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await http.post("User/withdrawmoney", formData);
      if (res.status === 200) {
        toast.success("Đã rút tiền, kiểm tra mail của bạn");
        setFormData(initialFormState)
        userStore?.getInfoUser()
      }
    } catch (error: any) {
      handleErrorHttp(error);
    }
  };

  const changeData = (key: string) => (e: any) => {
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className=" w-1/2">
      <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold mb-5 ">Thông tin tài khoản ngân hàng</h2>
      <form onSubmit={handleSaveData} className="grid grid-cols-1 gap-6">
      <label className="block">
          <span className="text-gray-700">Tên ngân hàng</span>
          <input
            type="text"
            value={formData.BankName}
            onChange={changeData("BankName")}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
          {errors.BankName && (
            <span className="text-red-500">{errors.BankName}</span>
          )}
        </label>
        <label className="block">
          <span className="text-gray-700">Số tài khoản</span>
          <input
            type="text"
            value={formData.BankNumber}
            onChange={changeData("BankNumber")}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
          {errors.BankNumber && (
            <span className="text-red-500">{errors.BankNumber}</span>
          )}
        </label>
        <label className="block">
          <span className="text-gray-700">Họ tên</span>
          <input
            type="text"
            value={formData.FullName}
            onChange={changeData("FullName")}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
          {errors.FullName && (
            <span className="text-red-500">{errors.FullName}</span>
          )}
        </label>
        <label className="block">
          <span className="text-gray-700">Số tiền</span>
          <input
            type="number"
            value={formData.Money}
            onChange={changeData("Money")}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
          {errors.Money && (
            <span className="text-red-500">{errors.Money}</span>
          )}
        </label>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Xác nhận
        </button>
      </form>
    </div>
  );
};

export default AccountForm;
