"use client"
import React, { useState } from "react";
import Input from "@/shared/Input/Input";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Link from "next/link";
import http, { HttpError } from "@/http/http";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const PageForgotPass = () => {
  const [step, setStep] = useState(1); // Bước hiện tại: 1 (email) hoặc 2 (OTP + password)
  const [email, setEmail] = useState(""); // Lưu email đã nhập
  const [otp, setOtp] = useState(""); // Lưu OTP
  const [newPassword, setNewPassword] = useState(""); // Lưu mật khẩu mới
  const router = useRouter();
  // Hàm xử lý gửi OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Gọi API để gửi OTP
      await http.post("/auth/forgotPassword", {
        email: email
      })
      // Giả sử API trả về success
      setStep(2); // Chuyển sang bước 2
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  // Hàm xử lý xác nhận OTP và đổi mật khẩu
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Gọi API để xác nhận OTP và đổi mật khẩu
      var data = await http.post("/auth/resetPassword", {
        email: email,
        Otp: otp,
        newPassword: newPassword
      })
      if (data.payload.success){
        setEmail("");
        setOtp("");
        setNewPassword("");
        router.push("/login")
      }else {
        toast.error("Lỗi OTP")
      }
      console.log(data);
      
    } catch (error) {
      console.error("Error confirming OTP:", error);
      alert("Failed to confirm OTP. Please try again.");
    }
  };

  return (
    <div className="container mb-24 lg:mb-32">
      <header className="text-center max-w-2xl mx-auto -mb-14 sm:mb-16 lg:mb-20">
        <h2 className="mt-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Forgot password
        </h2>
        <span className="block text-sm mt-4 text-neutral-700 sm:text-base dark:text-neutral-200">
          Welcome to our Community
        </span>
      </header>

      <div className="max-w-md mx-auto space-y-6">
        {/* Step 1: Nhập email */}
        {step === 1 && (
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSendOtp}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address
              </span>
              <Input
                type="email"
                placeholder="example@example.com"
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <ButtonPrimary type="submit">Continue</ButtonPrimary>
          </form>
        )}

        {/* Step 2: Nhập OTP và mật khẩu mới */}
        {step === 2 && (
          <form className="grid grid-cols-1 gap-6" onSubmit={handleConfirm}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                OTP
              </span>
              <Input
                type="text"
                placeholder="Enter OTP"
                className="mt-1"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                New Password
              </span>
              <Input
                type="password"
                placeholder="Enter new password"
                className="mt-1"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </label>
            <div className="flex justify-between items-center">
              <button
                type="button"
                className="text-green-600 underline"
                onClick={() => setStep(1)} // Quay lại bước 1
              >
                Back to email
              </button>
              <ButtonPrimary type="submit">Confirm</ButtonPrimary>
            </div>
          </form>
        )}

        {/* Liên kết đăng nhập/đăng ký */}
        <span className="block text-center text-neutral-700 dark:text-neutral-300">
          Go back for {` `}
          <Link href="/login" className="text-green-600">
            Sign in
          </Link>
          {` / `}
          <Link href="/signup" className="text-green-600">
            Sign up
          </Link>
        </span>
      </div>
    </div>
  );
};

export default PageForgotPass;