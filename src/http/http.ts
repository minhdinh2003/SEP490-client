import { LoginResType, ResponData } from "@/type/ResponseType";
import { redirect, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import useAuthStore from "@/store/useAuthStore";

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};
type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};
const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

// Create a function to handle unauthorized access
const handleUnauthorized = () => {
  // const router = useRouter();
  const { logout } = useAuthStore.getState() as any;

  // Call the logout function from the auth store
  logout();

  localStorage.removeItem("isLogin");
  localStorage.removeItem("token");
  Cookies.remove("token", { path: "/" });

  // Redirect to login page
  // router.push("/login");
};

let clientLogoutRequest: null | Promise<any> = null;
export const isClient = () => typeof window !== "undefined";

// const BASE_URL = "http://localhost:5155/api";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const request = async <Response extends ResponData>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  if (isClient()) {
    const sessionToken = localStorage.getItem("token");
    if (sessionToken) {
      baseHeaders.Authorization = `Bearer ${sessionToken}`;
    }
  }
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

  const baseUrl = options?.baseUrl === undefined ? BASE_URL : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  let data: any = null;

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        ...baseHeaders,
        ...options?.headers,
      } as any,
      body,
      method,
      cache: "no-cache",
    });

    if (res.status === 401) {
      // Handle 401 Unauthorized error
      console.log("Unauthorized: Please check your credentials");
      // You might want to redirect to a login page or refresh the token

      // Call the function to handle unauthorized access
      handleUnauthorized();
      // Redirect to login page
      // if (typeof window !== "undefined") {
      //   window.location.href = "/login";
      // }
      return null;
    }

    const payload: Response = await res.json();

    data = {
      status: res.status,
      payload,
    };

    // Interceptor là nời chúng ta xử lý request và response trước khi trả về cho phía component
    if (!res.ok) {
      throw new HttpError(data);
    }
    if (!payload?.Success) {
      const statusCode = payload.StatusCode;
      switch (statusCode) {
        case ENTITY_ERROR_STATUS: {
        }
        case AUTHENTICATION_ERROR_STATUS: {
          console.debug("error 401");
        }
        default: {
          throw new HttpError(data);
        }
      }
    }
  } catch (error) {}
  return data;
};

// HTTP METHOD
const http = {
  get<Response extends ResponData>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response extends ResponData>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response extends ResponData>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response extends ResponData>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
