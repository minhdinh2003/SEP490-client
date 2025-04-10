"use client";
import NcModal from "@/shared/NcModal/NcModal";
import { useGetData } from "@/hooks/useGetData";
import http from "@/http/http";
import { handleErrorHttp } from "@/utils/handleError";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Status from "@/shared/Status/Status";
import UploadPolicy from "../policy-create/page";
import useAuthStore from "@/store/useAuthStore";
import React from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { ButtonIcon } from "@/shared/Button/CustomButton";
import { CardPolicy } from "./CardPolicy";



const MyPolicies = () => {
  const [reget, setReget] = useState(1);
  const [listCategory, setListCategory] = useState<any>([]);
  const [openAdd,setOpenAdd] = useState(false)
  useGetData("Category/all", [], setListCategory);
  const userStore: any = useAuthStore();
  //   const { data: listPolicies } = useGetData("Policy/owner", [reget]);
  const [listPolicies, setListPolicies] = useState<any>([]);
  const [currentPolicy, setCurrentPolicy] = useState<any>(null);

  const handleDelete = async (id: any) => {
    try {
      const res = await http.delete("ProductRequest/policy?id=" + id);
      if (res?.payload?.Success) {
        toast.success("Đã xóa");
        getListPoli();
      }
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  //
  const getListPoli = async () => {
    try {
      const res = await http.post("productRequest/policies/users", [
        userStore.user.UserID,
      ]);
      setListPolicies(res.payload.Data);
    } catch (error: any) {
      // handleErrorHttp(error?.payload)
    }
  };
  useEffect(() => {
    getListPoli();
  }, []);

  const getCategoryName = (categories: any) => {
    const arrCate = categories?.split(";");
    if (arrCate?.length === 0) {
      return "";
    }
    return listCategory
      ?.filter((i: any) => arrCate?.includes(i?.CategoryID?.toString()))
      .map((i: any) => i.Name)
      .join(" / ");
  };

  const reversedList = (listPolicies as any)?.slice().reverse();

  const renderListTable = () =>
    reversedList?.map((policy: any, index: number) => (
      <tr key={index}>
        <td key={index} className="p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3 min-w-[300px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
              {policy?.Title}
            </p>
          </div>
        </td>
        <td key={index} className="p-4 border-b border-blue-gray-50">
          <div className="flex items-center gap-3 min-w-[300px]">
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
              {policy?.Description}
            </p>
          </div>
        </td>
        <td className="p-4 border-b border-blue-gray-50 ">
          <p className="  min-w-[200px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
            {policy?.Price}
          </p>
        </td>
        <td className="p-4 border-b border-blue-gray-50">
          <p className="  min-w-[100px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
            {getCategoryName(policy?.CategoryIDs)}
          </p>
        </td>
        <td className=" min-w-[200px] p-4 border-b border-blue-gray-50">
          <div className="flex gap-3">
            <Image
              onClick={() => {
                setCurrentPolicy(policy);
              }}
              className="cursor-pointer"
              alt=""
              width={20}
              height={20}
              src={"/edit.svg"}
            />
            <Image
              onClick={() => handleDelete(policy?.ProductPolicyID)}
              className="cursor-pointer"
              alt=""
              width={20}
              height={20}
              src={"/delete.svg"}
            />
          </div>
        </td>
      </tr>
    ));
  const policy: any = listPolicies?.length > 0 ? listPolicies[0] : {};
  return (
    <div className="nc-CartPage">
      <main className="">
        {(listPolicies as any)?.length > 0 ? (
          <CardPolicy
          isEdit={true}
            cate={getCategoryName(policy?.CategoryIDs)}
            title={policy?.Title}
            des={policy?.Description}
            onDelete={() => {
              handleDelete(policy?.ProductPolicyID);
            }}
            onEdit={() => {
              setCurrentPolicy(policy);
            }}
          />
        ) : (
          <div className="flex flex-col gap-3 justify-center items-center text-[gray] pt-[100px]">
            Chưa có chính sách nào
           <p> Bạn phải tạo chính sách sản phẩm để người dùng có thể tạo yêu cầu sản phẩm từ bạn</p>
            <ButtonPrimary onClick={() => {
              setOpenAdd(true)
            }}>Tạo chính sách</ButtonPrimary>
          </div>
        )}
      </main>
      {currentPolicy && (
        <NcModal
          isOpenProp={currentPolicy}
          onCloseModal={() => setCurrentPolicy(null)}
          renderContent={() => (
            <UploadPolicy
              callback={() => {
                getListPoli();
                setCurrentPolicy(null);
              }}
              editItem={currentPolicy}
            />
          )}
          modalTitle="Sửa chính sách"
        />
      )}
      <NcModal
          isOpenProp={openAdd}
          onCloseModal={() => setOpenAdd(false)}
          renderContent={() => (
            <UploadPolicy
              callback={() => {
                setOpenAdd(false)
                getListPoli();
                
              }}
            />
          )}
          modalTitle="Thêm chính sách"
        />
    </div>
  );
};

export default MyPolicies;
