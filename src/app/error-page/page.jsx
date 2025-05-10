import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import React from "react";
import I404Png from "@/images/404.png";
import NcImage from "@/shared/NcImage/NcImage";
import Image from "next/image";

const ErrorPayment = () => (
  <div className="nc-Page404">
    <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-5">
      {/* HEADER */}
      <header className="text-center max-w-2xl mx-auto space-y-2">
       <div className="flex justify-center">
       <Image width={200} height={200} src={"/err.png"} alt="not-found" />
       </div>
        <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
          {`THANH TOÁN THẤT BẠI`}{" "}
        </span>
        <div className="pt-8">
          <ButtonPrimary href="/">Về trang chủ</ButtonPrimary>
        </div>
      </header>
    </div>
  </div>
);

export default ErrorPayment;
