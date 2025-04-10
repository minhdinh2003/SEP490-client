"use client";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import FieldError from "@/shared/Error/FieldError";
import Input from "@/shared/Input/Input";
import useAuthStore from "@/store/useAuthStore";
import { EMPTY_FORM_STATE } from "@/utils/handleError";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert } from "@/shared/Alert/Alert";
import http from "@/http/http";
import Cookies from "js-cookie";

export interface LoginData {
  email: string;
  password: string;
}

const PageLogin = () => {
  const router = useRouter();
  const { getInfoUser, isLogin } = useAuthStore() as any;
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [messErr, setMessErr] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setMessErr("Email và mật khẩu không được để trống");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessErr("Email không hợp lệ");
      return false;
    }

    if (formData.password.length < 6) {
      setMessErr("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    setMessErr("");
    return true;
  };

  const onsubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const loginRes = await http.post<any>("auth/login", {
        email: formData.email,
        password: formData.password,
      });
      // const response = await fetch("/api/users/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      // });
      const payloadLogin = loginRes.payload;

      localStorage.setItem("token", payloadLogin.data.token);
      Cookies.set("token", payloadLogin.data.token, {
        expires: 30,
        path: "/",
      });
      router.push("/");
      localStorage.setItem("isLogin", "true");
      await getInfoUser(null);

      setLoading(false);
      router.push("/");
    } catch (error) {
      setLoading(false);
      setMessErr("Sai emal hoặc mật khẩu");
    }
  };

  useEffect(() => {
    if (isLogin) {
      router.push("/");
    }
  }, [isLogin, router]);

  return (
    <div className={`nc-PageLogin`} data-nc-id="PageLogin">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Đăng nhập
        </h2>

        <div className="max-w-md mx-auto space-y-6">
          <form className="grid grid-cols-1 gap-6">
            {messErr && <Alert type="error">{messErr}</Alert>}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email
              </span>
              <Input
                value={formData.email}
                onChange={(e: any) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                type="email"
                placeholder="example@example.com"
                className="mt-1"
                name="email"
              />
              {/* <FieldError formState={{ errors: { email: messErr } }} name="email" /> */}
            </label>
            <label className="block">
              <span className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
                Mật khẩu
                <Link href="/forgot-pass" className="text-sm text-green-600">
                  Quên mật khẩu?
                </Link>
              </span>
              <Input
                value={formData.password}
                onChange={(e: any) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                name="password"
                type="password"
                className="mt-1"
              />
              {/* <FieldError formState={{ errors: { password: messErr } }} name="password" /> */}
            </label>
            <ButtonPrimary
              onClick={(e: any) => {
                e.preventDefault();
                onsubmit();
              }}
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </ButtonPrimary>
          </form>

          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Bạn chưa có tài khoản? {` `}
            <Link className="text-green-600" href="/signup">
              Tạo tài khoản mới
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
