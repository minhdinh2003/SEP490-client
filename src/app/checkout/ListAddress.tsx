"use client";

import Label from "@/components/Label/Label";
import http from "@/http/http";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Input from "@/shared/Input/Input";
import NcModal from "@/shared/NcModal/NcModal";
import Province from "@/shared/Province/Province";
import Radio from "@/shared/Radio/Radio";
import { handleErrorHttp } from "@/utils/handleError";
import { formatAddress, getAddress } from "@/utils/helpers";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

const ListAddress = (props: any) => {
  const [province, setProvin] = useState({
    province: "",
    district: "",
    ward: "",
  });
  const { list, defaultChecked, setAddressId, getListAddress } = props;
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [dataPostAddress, setDataPostAddress] = useState({
    AddressID: 0,
    FirstName: "",
    LastName: "",
    StreedAddress: "",
    Country: "string",
    ZipCode: "",
  });
  if (list?.length === 0)
    return (
      <div className="flex justify-center items-center h-[300px] ">
        Chưa có địa chỉ nào
      </div>
    );
  const handleChange = (value: any) => {
    setAddressId(value);
  };
  const onChangeInput = (key: string) => (e: any) => {
    const value = e.target.value;
    setDataPostAddress({ ...dataPostAddress, [key]: value });
  };
  // Save Edit
  const handleSaveAdress = async () => {
    try {
      const body = { ...dataPostAddress };
      const provinceString = JSON.stringify(province);
      body.StreedAddress =
        provinceString + "***" + dataPostAddress.StreedAddress;
      const res = await http.put("Address", body);
      if (res.payload.Success) {
        toast.success("Đã sửa địa chỉ");
        setOpenModalEdit(false);
        setDataPostAddress({
          ...dataPostAddress,
          StreedAddress: "",
          FirstName: "",
          LastName: "",
        });
        getListAddress();
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
          <Label >Họ và tên đệm</Label>
          <Input
            onChange={onChangeInput("FirstName")}
            value={dataPostAddress.FirstName}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label >Tên</Label>
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
          <Label >Địa chỉ cụ thể</Label>
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
          <Label >Số điện thoại</Label>
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
          onClick={() => setOpenModalEdit(false)}
        >
          Đóng
        </ButtonSecondary>
      </div>
    </div>
  );
  // DELETE ADDRESS
  const deleteAddress = async (id: any) => {
    4;
    try {
      const res = await http.delete("Address?id=" + id);
      if (res.payload.Success) {
        toast.success("Đã xóa địa chỉ ");
      }
      if (defaultChecked == id) {
        setAddressId("");
      }
      getListAddress();
    } catch (error: any) {
      handleErrorHttp(error.payload);
    }
  };
  return (
    <div className="nc-CheckoutPage">
      <main className="">
        <form>
          {list.map((item: any,index:number) => (
            <div key={index} className="flex justify-between items-center">
              <div className="mt-4 flex gap-2">
                <Radio
                  defaultChecked={defaultChecked}
                  defauttValue={defaultChecked}
                  name="address"
                  id={item.AddressID + ""}
                  onChange={handleChange}
                />
                <div>
                  <span className="font-semibold">
                    {item?.FirstName + " " + item?.LastName}
                  </span>{" "}
                  ,{" " + formatAddress(item?.StreedAddress)}
                </div>
              </div>
              <div className="flex justify-center gap-2">
                <Image
                onClick={() => {
                    setOpenModalEdit(true)
                    setDataPostAddress({
                      ...item,
                      StreedAddress:getAddress(item?.StreedAddress).address
                    })
                    setProvin(getAddress(item?.StreedAddress).province)
                }}
                  className="cursor-pointer"
                  alt=""
                  width={20}
                  height={20}
                  src={"/edit.svg"}
                />
                <Image
                  onClick={() => deleteAddress(item.AddressID)}
                  className="cursor-pointer"
                  alt=""
                  width={20}
                  height={20}
                  src={"/delete.svg"}
                />
              </div>
            </div>
          ))}
        </form>
      </main>
      
      {openModalEdit && (
          <NcModal
            isOpenProp={openModalEdit}
            onCloseModal={() => setOpenModalEdit(false)}
            renderContent={() => renderFormAddress()}
            modalTitle="Sửa địa chỉ"
          />
        )}
    </div>
  );
};

export default ListAddress;
