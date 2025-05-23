"use client";
import http from "@/http/http";
import { Alert } from "@/shared/Alert/Alert";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Province from "@/shared/Province/Province";
import Select from "@/shared/Select/Select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import useAuthStore from "@/store/useAuthStore";

export interface SignUpDataForm {
  email: string;
  password: string;
  confirmPassword: string;
}
export type SignUpDataPost = Omit<SignUpDataForm, "ConfirmPassword">;

const validate = (data: any) => {
  let errors: any = {};

  // Email validation
  if (!data.email) {
    errors.email = "Email không được để trống";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email không hợp lệ";
  }

  // Password validation
  if (!data.password) {
    errors.password = "Mật khẩu không được để trống";
  } else {
    const password = data.password;

    if (password.length < 8) {
      errors.password = "Mật khẩu có ít nhất 8 kí tự";
    } else {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!hasUpperCase) {
        errors.password = "Mật khẩu phải chứa ít nhất một chữ hoa";
      } else if (!hasLowerCase) {
        errors.password = "Mật khẩu phải chứa ít nhất một chữ thường";
      } else if (!hasNumber) {
        errors.password = "Mật khẩu phải chứa ít nhất một số";
      } else if (!hasSpecialChar) {
        errors.password = "Mật khẩu phải chứa ít nhất một ký tự đặc biệt";
      }
    }
  }

  // Confirm Password validation
  if (!data.confirmPassword) {
    errors.confirmPassword = "Xác nhận mật khẩu không được để trống";
  } else if (data.confirmPassword !== data.password) {
    errors.confirmPassword = "Mật khẩu không khớp";
  }

  return errors;
};
const PageSignUp = () => {
  const { getInfoUser, isLogin } = useAuthStore() as any;

  const [data, setData] = useState<SignUpDataForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [txtErrServer, settxtErrServer] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // Thêm state này
  const router = useRouter();
  const [province, setProvin] = useState({
    province: "",
    district: "",
    ward: "",
  });

  const onChange = (
    key: keyof SignUpDataForm,
    value: SignUpDataForm[keyof SignUpDataForm]
  ) => {
    setData({ ...data, [key]: value });
  };

  const handleSigup = async () => {
    const newErrors = validate({ ...data, ...province });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const body = {
      email: data.email,
      password: data.password,
    };

    try {
      const signUpres = await http.post<any>("auth/register", body);
      setIsSuccess(true); // Đăng ký thành công
      settxtErrServer(""); // Xóa lỗi cũ nếu có
      // Không tự động đăng nhập nữa, chỉ hiển thị thông báo
      // Nếu vẫn muốn đăng nhập tự động, giữ lại đoạn code cũ ở đây
    } catch (error) {
      settxtErrServer("Đăng ký thất bại");
    }
  };

  return (
    <div className={`nc-PageSignUp `} data-nc-id="PageSignUp">
      <div className=" mb-24 lg:mb-32">
        <h2 className="my-4 mt-10 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Đăng ký
        </h2>

        <div className="max-w-xl mx-auto space-y-6">
          {txtErrServer && <Alert type="error">{txtErrServer}</Alert>}
          {isSuccess && (
            <Alert type="success">
              Bạn đã đăng ký thành công, vui lòng vào email để xác nhận.
            </Alert>
          )}
          {!isSuccess && (
            <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="block col-span-1 md:col-span-2">
                <span className="text-neutral-800 dark:text-neutral-200">
                  Email
                </span>
                <Input
                  type="email"
                  className="mt-1"
                  value={data.email}
                  onChange={(e) => onChange("email", e.target.value)}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </label>

              <label className="block">
                <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                  Mật khẩu
                </span>
                <Input
                  value={data.password}
                  onChange={(e) => onChange("password", e.target.value)}
                  type="password"
                  className="mt-1"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </label>
              <label className="block">
                <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                  Xác nhận mật khẩu
                </span>
                <Input
                  value={data.confirmPassword}
                  onChange={(e) => onChange("confirmPassword", e.target.value)}
                  type="password"
                  className="mt-1"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </label>

              <div className="block col-span-1 md:col-span-2 justify-center flex">
                <ButtonPrimary
                  onClick={(e: any) => {
                    e.preventDefault();
                    handleSigup();
                  }}
                >
                  Đăng ký
                </ButtonPrimary>
              </div>
            </form>
          )}

          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Bạn đã có tài khoản? {` `}
            <Link className="text-green-600" href="/login">
              Đăng nhập
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
