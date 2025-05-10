"use client";
import Label from "@/components/Label/Label";
import React, { useState } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import { Alert } from "@/shared/Alert/Alert";
import http from "@/http/http";
import toast from "react-hot-toast";

export interface ChangePassWordForm {
  password: string;
  newPassword: string;
  confirmPassWord: string;
}

const validate = (data: any) => {
  let errors: any = {};

  if (!data.password) {
    errors.password = "Mật khẩu hiện tại không được để trống";
  } else if (data.password.length < 6) {
    errors.password = "Mật khẩu có ít nhất 6 kí tự";
  }

  if (!data.newPassword) {
    errors.newPassword = "Mật khẩu mới không được để trống";
  } else if (data.newPassword.length < 6) {
    errors.newPassword = "Mật khẩu mới có ít nhất 6 kí tự";
  }

  if (!data.confirmPassWord) {
    errors.confirmPassWord = "Xác nhận mật khẩu không được để trống";
  } else if (data.confirmPassWord !== data.newPassword) {
    errors.confirmPassWord = "Mật khẩu không khớp";
  }

  return errors;
};

const AccountPass = () => {
  const [data, setData] = useState<ChangePassWordForm>({
    password: "",
    newPassword: "",
    confirmPassWord: ""
  });
  const [errors, setErrors] = useState<any>({});
  const [txtErrServer, settxtErrServer] = useState("");

  const onChange = (
    key: keyof ChangePassWordForm,
    value: ChangePassWordForm[keyof ChangePassWordForm]
  ) => {
    setData({ ...data, [key]: value });
  };

  // SUBMIT
  const handleSubmit = async () => {
    const newErrors = validate(data);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Call API to change password here
      // await changePasswordApi(data); // Thay thế bằng hàm gọi API của bạn
      await http.post<any>("auth/change-password", data);
      setErrors({});
      toast.success("Đổi mật khẩu thành công");
    } catch (error) {
      settxtErrServer("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* HEADING */}
      <h2 className="text-2xl sm:text-3xl font-semibold">Thay đổi mật khẩu</h2>
      <div className="max-w-xl space-y-6">
        <div>
          <Label>Mật khẩu hiện tại</Label>
          <Input value={data.password} onChange={(e) => onChange("password", e.target.value)} type="password" className="mt-1.5" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>
        <div>
          <Label>Mật khẩu mới</Label>
          <Input value={data.newPassword} onChange={(e) => onChange("newPassword", e.target.value)} type="password" className="mt-1.5" />
          {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
        </div>
        <div>
          <Label>Xác nhận mật khẩu mới</Label>
          <Input value={data.confirmPassWord} onChange={(e) => onChange("confirmPassWord", e.target.value)} type="password" className="mt-1.5" />
          {errors.confirmPassWord && <p className="text-red-500 text-sm">{errors.confirmPassWord}</p>}
        </div>
        <div className="pt-2">
          <ButtonPrimary onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>Cập nhật</ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default AccountPass;
