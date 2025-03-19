// pages/index.js

"use client";
import http from "@/http/http";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import { handleErrorHttp } from "@/utils/handleError";
import { uploadImagesToFirebase } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CreateWoodenBookRequest = ({ editItem, callback = () => {} }:any) => {
  const [listImage, setListImage] = useState<any>([]);
 const handleChangeFile = async (e: any) => {
    const listUrl: any = await uploadImagesToFirebase(e.target.files);
    if (listUrl?.length > 0) {
      setListImage([...listImage, ...listUrl]);
    }
  };

  const handleDeleteImage = (index: any) => {
    const newListImage = [...listImage];
    newListImage.splice(index, 1);
    setListImage(newListImage);
  };

  const initialData = {
    CreatorUserID: "",
    Description: "",
    ProposedPrice: "",
    ImagesClient:""
  };

  const [formData, setFormData] = useState<any>(initialData);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();
  const {id} = useParams()

  useEffect(() => {
    if (editItem) {
      
      setFormData({
        ...editItem,
      });
    }
  }, [editItem]);

  const validateForm = () => {
    let valid = true;
    let newErrors:any = {};

    if (!formData.Description) {
      newErrors.Description = "Mô tả là bắt buộc";
      valid = false;
    }
    if (!formData.ProposedPrice || formData.ProposedPrice <= 0) {
      newErrors.ProposedPrice = "Giá khởi điểm phải là số dương và bắt buộc";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSaveData = async (e:any) => {
    e.preventDefault();
    if (!validateForm()) return;

    const body = { ...formData, ImagesClient: listImage.join("*") };

    try {
      if (!editItem) {
        await http.post("productRequest", {...body,CreatorUserID:id});
        toast.success("Tạo yêu cầu thành công");
        setListImage([])
        setFormData(initialData);
        // router.push("/request-list");
      } else {
        await http.put("productRequest", body);
        toast.success("Đã sửa");
        callback();
      }
    } catch (error:any) {
      handleErrorHttp(error?.payload);
    }
  };

  const changeData = (key:any) => (e:any) => {
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="nc-CartPage ">
      <main className="py-5">
        {!editItem && (
          <div className="mb-12 sm:mb-16">
            <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Tạo yêu cầu sản phẩm
            </h2>
            
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
        <div
            style={{
              borderWidth: 3,
            }}
            className="border-dashed border-blue-300 rounded-lg mb-4 mr-10"
          >
            <label className="block text-center cursor-pointer bg-gray-50">
              <div className="flex flex-col justify-center items-center gap-10 p-7">
                <Image src="/image1.svg" alt="" width={100} height={100} />
                <span className="text-gray-700 flex justify-center items-center gap-2">
                  <Image src="/up1.svg" alt="" width={20} height={20} /> Thêm
                  ảnh từ thiết bị
                </span>
              </div>
              <input
                type="file"
                multiple
                onChange={handleChangeFile}
                className="hidden"
              />
            </label>
          </div>
          <form className="grid grid-cols-1 gap-4 -mt-2">
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Mô tả
              </span>
              <Input
                value={formData.Description}
                onChange={changeData("Description")}
                placeholder="Mô tả"
                className="mt-1 h-[100px]"
                name="Description"
                
              />
              {errors.Description && (
                <span className="text-red-500">{errors.Description}</span>
              )}
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Giá mong muốn
              </span>
              <Input
                type="number"
                placeholder="Giá"
                className="mt-1"
                name="ProposedPrice"
                value={formData.ProposedPrice}
                onChange={changeData("ProposedPrice")}
              />
              {errors.ProposedPrice && (
                <span className="text-red-500">{errors.ProposedPrice}</span>
              )}
            </label>
            <ButtonPrimary onClick={(e) => handleSaveData(e)} type="submit">
              {!editItem ? "Tạo yêu cầu" : "Sửa yêu cầu"}
            </ButtonPrimary>
          </form>

          <div className="space-y-4">
            {listImage?.map((src: any, index: any) => (
              <div
                key={index}
                className="relative flex items-center justify-between border border-gray-300 p-2 rounded"
              >
                <img
                  src={src}
                  className="w-14 h-14 object-cover rounded"
                  alt="Product"
                />
                <div className="flex-1 ml-4">
                  <p className="text-sm">Image {index + 1}</p>
                  <p className="text-xs text-gray-500">
                    {((src.size || (100 + Math.random() * 1000))).toFixed(2)} KB
                    </p>
                </div>
                <Image
                  className="cursor-pointer"
                  onClick={() => handleDeleteImage(index)}
                  src="/delete1.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
export default CreateWoodenBookRequest;