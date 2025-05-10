"use client";
import Label from "@/components/Label/Label";
import http from "@/http/http";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Province from "@/shared/Province/Province";
import Select from "@/shared/Select/Select";
import useAuthStore from "@/store/useAuthStore";
import { handleErrorHttp } from "@/utils/handleError";
import { dateFormat2 } from "@/utils/helpers";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UploadService from "@/http/uploadService";
import { parse } from "date-fns";

const AccountPage = () => {
  const [province, setProvin] = useState({
    province: "",
    district: "",
    ward: "",
  });
  const userStorage: any = useAuthStore();
  const { createdAt, createdBy, modifiedAt, modifiedBy, role, ...other } =
    userStorage?.user! as any;

  const [dataUser, setDataUser] = useState({ ...other });
  useEffect(() => {
    setDataUser({ ...other });
    setProvin({
      province: userStorage?.user?.province,
      district: userStorage?.user?.district,
      ward: userStorage?.user?.ward,
    });
  }, []);
  const updateUser = async (e: any) => {
    e.preventDefault();
    try {
      const body = { ...dataUser };
      body.role = role;
      body.createdAt = createdAt;
      body.createdBy = createdBy;
      body.province = province.province;
      body.district = province.district;
      body.ward = province.ward;
      const res = await http.put(`user/${body.id}`, body);
      if (res?.payload?.success) {
        toast.success("Cập nhật thành công");
        userStorage.getInfoUser(body);
      }
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  // Change dAta
  const onChangeData = (key: string) => (e: any) => {
    const value = e.target.value;
    setDataUser({ ...dataUser, [key]: value });
  };

  // Change AVATAR
  const onChangeAvatar = async (e: any) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    const response = await UploadService.upload(file);
    setDataUser({
      ...dataUser,
      profilePictureURL: response.data.fileUrl,
    });
  };
  return (
    <div className={`nc-AccountPage `}>
      <div className="space-y-10 sm:space-y-12">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Thông tin tài khoản
        </h2>
        <div className="flex flex-col md:flex-row">
          <div className="flex items-start flex-shrink-0">
            {/* AVATAR */}
            <div className="relative flex overflow-hidden rounded-full">
              <Image
                src={dataUser?.profilePictureUR || "/avt.svg"}
                alt=""
                width={128}
                height={128}
                className="z-0 object-cover w-32 h-32 rounded-full"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black cursor-pointer bg-opacity-60 text-neutral-50">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="mt-1 text-xs">Đổi ảnh</span>
              </div>
              <input
                onChange={onChangeAvatar}
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex-grow max-w-3xl mt-10 space-y-6 md:mt-0 md:pl-16">
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
                  disabled
                  className="!rounded-l-none"
                  placeholder="example@email.com"
                  value={dataUser?.email}
                />
              </div>
            </div>

            {/* ---- */}
            <div className="max-w-lg">
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
            {/* ---- */}
            <div>
              <div className="flex -mt-5">
                <Province
                  className="mt-6"
                  bold
                  state={province}
                  setStateData={setProvin}
                />
              </div>
            </div>
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

            {/* ---- */}
            <div>
              <Label>Giới tính</Label>
              <Select
                onChange={onChangeData("gender")}
                value={dataUser?.gender}
                className="mt-1.5"
              >
                <option value={"MALE"}>Nam</option>
                <option value={"FEMAIL"}>Nữ</option>
                <option value={"OTHER"}>Khác</option>
              </Select>
            </div>

            {/* ---- */}
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
            {/* ---- */}

            <div className="pt-2">
              <ButtonPrimary onClick={updateUser}>
                Cập nhật tài khoản
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
