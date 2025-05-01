"use client";

import Label from "@/components/Label/Label";
import React, { FC, useEffect, useState } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Input from "@/shared/Input/Input";
import Radio from "@/shared/Radio/Radio";
import Select from "@/shared/Select/Select";
import http from "@/http/http";
import { handleErrorHttp } from "@/utils/handleError";
import toast from "react-hot-toast";
import NcModal from "@/shared/NcModal/NcModal";
import ListAddress from "./ListAddress";
import Province from "@/shared/Province/Province";
import { formatAddress } from "@/utils/helpers";
import WithHydration from "@/HOC/withHydration";
import useAuthStore from "@/store/useAuthStore";
import { useParams, useRouter } from "next/navigation";

interface Props {
  isActive?: boolean;
  onCloseActive?: () => void;
  onOpenActive?: () => void;
  setAddressId: any;
}

const ShippingAddress: FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
  setAddressId,
}) => {
  const router = useRouter();
  const [listAddress, setListAddres] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalSelectAddress, setOpenModalSelectAddress] = useState(false);
  const userStore:any = useAuthStore()
  const user: any = userStore?.user;
  const [province, setProvin] = useState({
    province: user.province,
    district: user.district,
    ward: user.ward
  });
  const getAddressString = () => {
    const addressParts = [user?.province, user?.district, user?.ward, user?.addressLine1];
    const filteredAddress = addressParts.filter(part => part);
    return filteredAddress.join(", ");
  };
  const [dataPostAddress, setDataPostAddress] = useState({
    AddressID: 0,
    FirstName: "",
    LastName: "",
    StreedAddress: "",
    Country: "string",
    ZipCode: "",
  });
  // const getListAddress = async () => {
  //   try {
  //     const res = await http.get("Address/all");
  //     if (res.payload.Success) {
  //       const data = res.payload.Data;
  //       const finalData = res.payload.Data?.filter ( (i : any) =>i?.UserID == userStore?.user?.UserID )
  //       setListAddres(finalData);
  //       if (finalData.length > 0) {
  //         const fist = finalData[0]?.AddressID;
  //         setAddressId(fist + "");
  //       }
  //     }
  //   } catch (error) {}
  // };
  // useEffect(() => {
  //   getListAddress();
  // }, []);

  // change Input
  const onChangeInput = (key: string) => (e: any) => {
    const value = e.target.value;
    setDataPostAddress({ ...dataPostAddress, [key]: value });
  };

  // Save Address
  const handleSaveAdress = async () => {
    try {
      const body = { ...dataPostAddress };
      const provinceString = JSON.stringify(province);
      body.StreedAddress =
        provinceString + "***" + dataPostAddress.StreedAddress;
      const res = await http.post("Address", body);
      if (res.payload.Success) {
        toast.success("Đã lưu địa chỉ");
        setOpenModal(false);
        setDataPostAddress({
          ...dataPostAddress,
          StreedAddress: "",
          FirstName: "",
          LastName: "",
        });
        // getListAddress();
      }
    } catch (error: any) {
      handleErrorHttp(error.payload);
    }
  };
  const renderFormAddress = () => (
    <div className={` px-6 py-7 space-y-4 sm:space-y-6`}>
      {/* ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
        <div>
          <Label>Họ và tên đệm</Label>
          <Input
            onChange={onChangeInput("FirstName")}
            value={dataPostAddress.FirstName}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Tên</Label>
          <Input
            onChange={onChangeInput("LastName")}
            value={dataPostAddress.LastName}
            className="mt-1.5"
          />
        </div>
      </div>
      <div className="sm:flex space-y-4 sm:space-y-0 sm:space-x-3">
        <div className="flex-1 -mt-5">
          <Province
            className="mt-5"
            state={province}
            setStateData={setProvin}
          />
        </div>
      </div>
      {/* ============ */}
      <div className="sm:flex space-y-4 sm:space-y-0 sm:space-x-3">
        <div className="flex-1">
          <Label>Địa chỉ cụ thể</Label>
          <Input
            value={dataPostAddress.StreedAddress}
            className="mt-1.5"
            type={"text"}
            onChange={onChangeInput("StreedAddress")}
          />
        </div>
      </div>
      <div className="sm:flex space-y-4 sm:space-y-0 sm:space-x-3">
        <div className="flex-1">
          <Label>Số điện thoại</Label>
          <Input
            value={dataPostAddress.ZipCode}
            className="mt-1.5"
            type={"text"}
            onChange={onChangeInput("ZipCode")}
          />
        </div>
      </div>
      {/* ============ */}
      <div className="flex flex-col sm:flex-row pt-6">
        <ButtonPrimary
          className="sm:!px-7 shadow-none"
          onClick={() => handleSaveAdress()}
        >
          Lưu
        </ButtonPrimary>
        <ButtonSecondary
          className="mt-3 sm:mt-0 sm:ml-3"
          onClick={() => setOpenModal(false)}
        >
          Đóng
        </ButtonSecondary>
      </div>
    </div>
  );
  const renderShippingAddress = () => {
    return (
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl ">
        <div className="p-6 flex flex-col sm:flex-row items-start">
          <span className="hidden sm:block">
            <svg
              className="w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.1401 15.0701V13.11C12.1401 10.59 14.1801 8.54004 16.7101 8.54004H18.6701"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.62012 8.55005H7.58014C10.1001 8.55005 12.1501 10.59 12.1501 13.12V13.7701V17.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.14008 6.75L5.34009 8.55L7.14008 10.35"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.8601 6.75L18.6601 8.55L16.8601 10.35"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <div className="sm:ml-8">
            <h3 className=" text-slate-700 dark:text-slate-300 flex ">
              <span className="uppercase">Địa chỉ giao hàng</span>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="w-5 h-5 ml-3 text-slate-900 dark:text-slate-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </h3>
            <div className="font-semibold mt-1 text-sm">
              <span className="">
                {!getAddressString() ? (
                  <span className="text-[gray] italic font-thin text-xs">
                    {" "}
                    Chưa có địa chỉ giao hàng nào , vui lòng chọn địa chỉ
                  </span>
                ) : (
                  getAddressString()
                )}
              </span>
            </div>
          </div>
          <button
            className="py-2 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 mt-5 sm:mt-0 sm:ml-auto text-sm font-medium rounded-lg"
            onClick={() => router.push("/account")}
          >
            Cập nhật địa chỉ
          </button>
          {/* <button
            className="py-2 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 mt-5 sm:mt-0 sm:ml-auto text-sm font-medium rounded-lg"
            // onClick={onOpenActive}
            onClick={() => setOpenModal(true)}
          >
            Thêm
          </button> */}
        </div>

        {/* {openModal && (
          <NcModal
            isOpenProp={openModal}
            onCloseModal={() => setOpenModal(false)}
            renderContent={() => renderFormAddress()}
            modalTitle="Thêm địa chỉ"
          />
        )}

        {openModalSelectAddress && (
          <NcModal
            isOpenProp={openModalSelectAddress}
            onCloseModal={() => setOpenModalSelectAddress(false)}
            renderContent={() => (
              <ListAddress
                getListAddress={getListAddress}
                defaultChecked={AddressId}
                setAddressId={setAddressId}
                list={listAddress}
              />
            )}
            modalTitle="Chọn địa chỉ giao hàng"
          />
        )} */}
      </div>
    );
  };
  return renderShippingAddress();
};

export default WithHydration(ShippingAddress);
