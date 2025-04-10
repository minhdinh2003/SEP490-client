"use server";

import { LoginData } from "@/app/login/page";
import {
  FormState,
  fromErrorToFormState,
  toFormState,
} from "@/utils/handleError";
import { ZodError, date, z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import http from "@/http/http";
import { LoginResType } from "@/type/ResponseType";
import { SignUpDataForm } from "@/app/signup/page";
import { ChangePassWordForm } from "@/app/(accounts)/account-password/page";
const txtBlank = (prefix: string) => prefix + " không được để trống";
const createProduct = z.object({
  name: z.string().trim().min(1, "Tên sản phẩm không được để trống").max(191),
  price: z.string().trim().min(1, "Giá sản phẩm không được để trống").max(191),
  description: z
    .string()
    .trim()
    .min(1, "Mô tả sản phẩm không được để trống")
    .max(191),
});

export const CreateProductAction = async (
  formState: FormState,
  formData: any
) => {
  try {
    const data = createProduct.parse({
      name: formData.name,
      price: formData.price,
      description: formData.description,
    });
  } catch (error) {
    return fromErrorToFormState(error);
  }
  return toFormState("SUCCESS", "Message created");
};

// Login Action
const loginData = z.object({
  email: z.string().trim().min(1, "Email không được để trống"),
  // .email("Email không hợp lệ")
  password: z.string().min(6, "Mật khẩu có ít nhất 6 kí tự"),
});
export const LoginAction = async (
  formState: FormState,
  formData: LoginData
) => {
  let error: any = null;
  let payloadLogin: LoginResType;
  try {
    loginData.parse({
      email: formData.email,
      password: formData.password,
    });

    // Call Api Login
    const loginRes = await http.post<LoginResType>("auth/login", {
      email: formData.email,
      password: formData.password,
    });
    payloadLogin = loginRes.payload;
    cookies().set("token", payloadLogin.data.token, {
      httpOnly: true,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });
  } catch (err: any) {
    error = err;
    return fromErrorToFormState(error);
  }
  return toFormState("SUCCESS", "success", {
    token: payloadLogin.data.token,
  });
};

// SignUp Action
const signupData = z
  .object({
    Email: z
      .string()
      .trim()
      .min(1, "Email không được để trống")
      .email("Email không hợp lệ"),
    Password: z.string().min(6,"Mật khẩu có ít nhất 6 kí tự"),
    ConfirmPassword: z.string().min(6, "Mật khẩu có ít nhất 6 kí tự"),
    FirstName: z.string().trim().min(1, txtBlank("Họ và tên đệm")),
    LastName: z.string().trim().min(1, txtBlank("Tên")),
    Gender: z.string().trim().min(1, txtBlank("Giới tính")),
    Birthday: z.string().trim().min(1, txtBlank("Ngày sinh")),
  })
  .superRefine(({ ConfirmPassword, Password }, ctx) => {
    if (ConfirmPassword !== Password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["ConfirmPassword"],
      });
    }
  });
export const SignUpAction = async (
  formState: FormState,
  formData: SignUpDataForm
) => {
  let error: any = null;
  try {
    signupData.parse({
      Email: formData.Email,
      FirstName: formData.FirstName,
      LastName: formData.LastName,
      Gender: String(formData.Gender),
      Birthday: formData.Birthday ? "1" : "",
      Password: formData.Password,
      ConfirmPassword: formData.ConfirmPassword,
    });

    // Call Api Signup
    const { ConfirmPassword, ...restData } = formData;
    const dataPost = {
      ...restData,
      UserName: formData.Email,
      BirthDay: new Date(formData.Birthday),
    };
    const signUpres = await http.post<any>("Account/register", dataPost);
    // redirect("/login")
  } catch (err: any) {
    error = err;
    return fromErrorToFormState(error);
  }
  if (error) {
    return fromErrorToFormState(error);
  } else {
    redirect("/login");

    return toFormState("SUCCESS", "success", { token: "signUpres" });
  }
};

// ChangePass Action
const changePassData = z
  .object({
    Password: z.string().trim().min(6, "Mật khẩu ít nhất 6 ký tự"),
    PasswordNew: z.string().trim().min(6, "Mật khẩu ít nhất 6 ký tự"),
    ConfirmPassWord: z.string().trim().min(6, "Mật khẩu ít nhất 6 ký tự"),
  })
  .superRefine(({ ConfirmPassWord, PasswordNew }, ctx) => {
    if (ConfirmPassWord !== PasswordNew) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["ConfirmPassWord"],
      });
    }
  });
export const ChangPasswordAction = async (
  formState: FormState,
  formData: ChangePassWordForm
) => {
  try {
    changePassData.parse({
      Password: formData.Password,
      PasswordNew: formData.PasswordNew,
      ConfirmPassWord: formData.ConfirmPassWord,
    });

    // Call Api Signup
    const { ConfirmPassWord, ...restData } = formData;
    await http.post<any>("Account/change-password", restData);
  } catch (error: any) {
    console.log(error);
    return fromErrorToFormState(error);
  }
  return toFormState("SUCCESS", "success");
};

// log out
export const LogOutAction = async () => {
  cookies().set("token", "", {
    maxAge: 0,
  });
  console.log("da set");
};
