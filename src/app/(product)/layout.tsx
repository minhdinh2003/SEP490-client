"use client";

import { Route } from "@/routers/types";
import useAuthStore from "@/store/useAuthStore";
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
}[] = [
  {
    name: "Tạo đợt khuyến mại",
    link: "/create-product",
  },
  // {
  //   name: "Danh sách khuyến mại",
  //   link: "/my-product",
  // },
 
];

const LayoutProduct: FC<CommonLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const userStorage: any = useAuthStore();

  return (
    <div className="nc-AccountCommonLayout container">
      <div className="mt-14 sm:mt-20">
        <div className="mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-3xl xl:text-4xl font-semibold">Quản lý khuyến mại</h2>
          </div>
          <hr className="mt-10 border-slate-200 dark:border-slate-700"></hr>

          <div className="flex space-x-8 md:space-x-14 overflow-x-auto hiddenScrollbar">

          </div>
          <hr className="border-slate-200 dark:border-slate-700"></hr>
        </div>
      </div>
      <div className="">
        {children}
      </div>
    </div>
  );
};

export default LayoutProduct;
