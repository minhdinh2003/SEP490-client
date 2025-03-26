'use client'
import React, { useEffect, useState } from "react";
import ButtonClose from "@/shared/ButtonClose/ButtonClose";

export interface AlertProps {
  containerClassName?: string;
  type?: "default" | "warning" | "info" | "success" | "error";
  children?: React.ReactNode;
  delay?: number;
}

export const Alert: React.FC<AlertProps> = ({
  children = "Alert Text",
  containerClassName = "",
  type = "default",
  delay = 1000,
}) => {
  const [visiable,setVisiable] = useState(false)
  let classes = "";
  let title = "";
  switch (type) {
    case "default":
      classes += " text-black bg-neutral-900";
      break;
    case "info":
      classes += " bg-status-infoBg text-status-info";
      title = "Thông báo";
      break;
    case "success":
      classes += " bg-[green]";
      title = "Thành công";
      break;
    case "error":
      classes += "bg-red-500 text-[white]";
      title = "Lỗi";
      break;
    case "warning":
      classes += " bg-status-warningBg text-status-warning";
      title = "Cảnh báo";
      break;
    default:
      break;
  }


  return (
  <div
    className={`  w-full fade transition-all min-w-[350px]  border-t-4  rounded-b px-4 py-3 shadow-md ${classes}`}
    role="alert"
  >
    <div className="flex">
      <div className="py-1">
        <svg
          className="fill-current h-6 w-6 text-white mr-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
        </svg>
      </div>
      <div>
        <p className="font-bold">{title}</p>
        <p className="text-sm">{children}</p>
      </div>
    </div>
  </div>
  );
};
