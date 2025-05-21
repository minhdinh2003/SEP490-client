"use client";

import WithHydration from "@/HOC/withHydration";
import { Route } from "@/routers/types";
import useAuthStore from "@/store/useAuthStore";
import { formatAddress } from "@/utils/helpers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FC } from "react";

export interface CommonLayoutProps {
  children?: React.ReactNode;
}

const pages: {
  name: string;
  link: Route;
  hide?: boolean;
}[] = [
  {
    name: "Thông tin tài khoản",
    link: "/account",
  },

  {
    name: "Đơn hàng của tôi",
    link: "/account-order",
  },
  {
    name: "Đơn hàng được đặt",
    link: "/order-me",
    hide: true,
  },
  {
    name: "Lịch sử giao dịch",
    link: "/account-history",
  },
  {
    name: "Danh sách voucher",
    link: "/account-voucher",
  },
  {
    name: "Đổi mật khẩu",
    link: "/account-password",
  },
];

const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const userStorage: any = useAuthStore();
  const auth: any = useAuthStore();
  const IsCreator = auth?.IsCreator as boolean;
  return (
    <div className="nc-AccountCommonLayout container">
      <div className="mt-14 sm:mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-3xl xl:text-4xl font-semibold">Tài khoản</h2>
            <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-base sm:text-lg">
              <span className="text-slate-900 dark:text-slate-200 font-semibold">
                {userStorage?.user?.fullName}
                ,
              </span>{" "}
              {userStorage?.user?.email} ·
              {formatAddress(userStorage?.user?.addressLine1)}
            </span>
          </div>
          <hr className="mt-10 border-slate-200 dark:border-slate-700"></hr>

          <div className="flex space-x-8 md:space-x-14 overflow-x-auto hiddenScrollbar">
            {pages
              .filter((i: any) => {
                if (i.hide && !IsCreator) {
                  return false;
                }
                return true;
              })
              .map((item, index) => {
                return (
                  <Link
                    key={index}
                    href={item.link}
                    className={`block py-5 md:py-8 border-b-2 flex-shrink-0 text-sm sm:text-base ${
                      pathname === item.link
                        ? "border-primary-500 font-medium text-slate-900 dark:text-slate-200"
                        : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
          </div>
          <hr className="border-slate-200 dark:border-slate-700"></hr>
        </div>
      </div>
      <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
        {children}
      </div>
    </div>
  );
};

export default WithHydration(CommonLayout);
