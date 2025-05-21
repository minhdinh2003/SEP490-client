"use client";
import Label from "@/components/Label/Label";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Province from "@/shared/Province/Province";
import Select from "@/shared/Select/Select";
import useAuthStore from "@/store/useAuthStore";
import { handleErrorHttp } from "@/utils/handleError";
import { dateFormat2 } from "@/utils/helpers";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { parse } from "date-fns";
import UserService from "@/http/userService";
import { ServiceResponse } from "@/type/service.response";

const AddCustomer = ({callback = () => {}}: any) => {
  const [province, setProvin] = useState({
    province: "",
    district: "",
    ward: "",
  });
  const userStorage: any = useAuthStore();
  const { fullName } = userStorage?.user! as any;

  const [dataUser, setDataUser] = useState({
    role: "USER",
    createdAt: new Date(),
    createdBy: fullName,
    province: "",
    district: "",
    ward: "",
    phoneNumber: "",
    fullName: "",
    email: "",
    dateOfBirth: new Date(),
    addressLine1: "",
    gender: "MALE",
  });

  const addUser = async (e: any) => {
    if (!dataUser.email) {
        toast.error("Email trống");
        return;
    }
    if (!dataUser.fullName) {
        toast.error("Họ và tên trống");
        return;
    }
    e.preventDefault();
    try {
      const body = { ...dataUser };
      body.province = province.province;
      body.district = province.district;
      body.ward = province.ward;
      var res =  await UserService.post<ServiceResponse>("", body);
      if (!res.success){
        toast.error(res.message);
        return;
      }
      toast.success("Thêm người dùng thành công");
      callback();
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  const onChangeData = (key: string) => (e: any) => {
    const value = e.target.value;
    setDataUser({ ...dataUser, [key]: value });
  };

  return (
    <div className="nc-AccountPage">
      <div className="space-y-10 sm:space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cột trái */}
          <div className="space-y-6">
            <div>
              <Label>Họ và tên đệm</Label>
              <Input
                onChange={onChangeData("fullName")}
                value={dataUser?.fullName}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Email</Label>
              <div className="mt-1.5 flex">
                <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <i className="text-2xl las la-envelope"></i>
                </span>
                <Input
                  className="!rounded-l-none"
                  placeholder="example@email.com"
                  value={dataUser?.email}
                  onChange={(e) => setDataUser({ ...dataUser, ["email"]: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Ngày sinh</Label>
              <div className="mt-1.5 flex">
                <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <i className="text-2xl las la-calendar"></i>
                </span>
                <Input
                  onChange={(e) => {
                    const dateValue = e.target.value;
                    if (!dateValue) {
                      return;
                    }
                    const parsedDate = parse(
                      dateValue,
                      "yyyy-MM-dd",
                      new Date()
                    );
                    if (isNaN(parsedDate.getTime())) {
                      console.error("Invalid date:", dateValue);
                      return;
                    }
                    setDataUser({ ...dataUser, ["dateOfBirth"]: parsedDate });
                  }}
                  className="!rounded-l-none"
                  type="date"
                  defaultValue="1990-07-22"
                  value={dateFormat2(dataUser?.dateOfBirth)}
                />
              </div>
            </div>

            <div>
              <Label>Giới tính</Label>
              <Select
                onChange={onChangeData("gender")}
                value={dataUser?.gender}
                className="mt-1.5"
              >
                <option value={"MALE"}>Nam</option>
                <option value={"FEMALE"}>Nữ</option>
                <option value={"OTHER"}>Khác</option>
              </Select>
            </div>
          </div>

          {/* Cột phải */}
          <div className="space-y-6">
            <div>
              <Label>Địa chỉ cụ thể</Label>
              <div className="mt-1.5 flex">
                <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <i className="text-2xl las la-map-signs"></i>
                </span>
                <Input
                  onChange={onChangeData("addressLine1")}
                  className="!rounded-l-none"
                  value={dataUser?.addressLine1}
                />
              </div>
            </div>

            <div>
              <div className="mt-1.5">
                <Province
                  className="mt-6"
                  bold
                  state={province}
                  setStateData={setProvin}
                />
              </div>
            </div>

            <div>
              <Label>Số điện thoại</Label>
              <div className="mt-1.5 flex">
                <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <i className="text-2xl las la-phone-volume"></i>
                </span>
                <Input
                  onChange={onChangeData("phoneNumber")}
                  className="!rounded-l-none"
                  value={dataUser?.phoneNumber}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-end space-x-4">
          <ButtonPrimary onClick={addUser}>Thêm</ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
