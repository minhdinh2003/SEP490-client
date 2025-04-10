"use client";
import http from "@/http/http";
import rightImgDemo from "@/images/rightLargeImg.png";
import rightLargeImgDark from "@/images/rightLargeImgDark.png";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import NcImage from "@/shared/NcImage/NcImage";
import { handleErrorHttp } from "@/utils/handleError";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export interface CoinDataForn {
  coin: number;
}
const RechargeCoin = () => {
  const [formData, setFormData] = useState<any>({
    NumberCoint: "",
    Lang: "vn",
    BankCode: "",
  });
  //   const [formState,action] = useFormState(CreateProductAction,EMPTY_FORM_STATE)

  const onSubmit = (e: any) => {
    e.preventDefault();
  };

  // on Change Data
  const changeData = (key: string) => (e: any) => {
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
  };

  // SAVE
  const saveCoin = async(e:any) => {
    e.preventDefault()
    if(Number(formData.NumberCoint) % 10000 !==0){
       toast.error("Số tiền phải là bội số của 10.000 VND");
       return;
    }
   try {
     const res = await http.post("Payment/depositCoin",formData);
     if(res.payload.Success){
      const url = res.payload?.Data;
      if(typeof window !== 'undefined'){
        window.location.href = url;

      }
     }
   } catch (error:any) {
     handleErrorHttp(error?.payload)
   }
  }
  return (
    <div className="nc-CartPage">
      <main className="">
        <div className="mb-12 sm:mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
            Nạp coin
          </h2>
          <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400">
            <Link href={"/"} className="">
              Trang chủ
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <Link href={"/collection"} className="">
              Sản phẩm
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <span className="">Giỏ hàng</span>
          </div>
        </div>
        <div className="flex justify-between gap-20 items-center">
          <div className="w-3/5 ">
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6">
              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                  Số tiền muốn nạp
                </span>
                <Input
                  placeholder="Nhập số tiền"
                  className="mt-1"
                  name="coin"
                  value={formData.NumberCoint}
                  onChange={changeData("NumberCoint")}
                />
              </label>
              <p className="italic text-[gray] text-sm">
                Số tiền phải là bội số của 10.000 VND
              </p>
              <ButtonPrimary onClick={(e) => saveCoin(e)} >Xác nhận</ButtonPrimary>
            </form>
          </div>
          <div className="relative flex-1 max-w-xl lg:max-w-none">
            <NcImage
              alt=""
              containerClassName="block dark:hidden"
              src={rightImgDemo}
              sizes="(max-width: 768px) 100vw, 50vw"
              className=""
            />
            <NcImage
              alt=""
              containerClassName="hidden dark:block"
              src={rightLargeImgDark}
              sizes="(max-width: 768px) 100vw, 50vw"
              className=""
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RechargeCoin;
