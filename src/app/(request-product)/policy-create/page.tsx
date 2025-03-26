"use client";
import { useGetData } from "@/hooks/useGetData";
import http from "@/http/http";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import { handleErrorHttp } from "@/utils/handleError";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UploadPolicy = ({ editItem, callback = () => {} }: any) => {
  const originPolicy = {
    PolicyID: 0,
    Title: "",
    Description: "",
    Price: 123,
    CategoryIDs: "",
  };

  const [listCategory, setListCategory] = useState<any>([]);
  useGetData("Category/all", [], setListCategory);
  const [formData, setFormData] = useState<any>(originPolicy);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    if (editItem) {
      setFormData({
        ...editItem,
        CategoryIDs: editItem?.CategoryIDs,
      });
    }
  }, [editItem]);

  const validateForm = () => {
    let valid = true;
    let newErrors: any = {};

    if (!formData.Title) {
      newErrors.Title = "Tiêu đề là bắt buộc";
      valid = false;
    }
    if (!formData.Description) {
      newErrors.Description = "Mô tả là bắt buộc";
      valid = false;
    }
  
    if (formData.CategoryIDs.trim().length === 0) {
      newErrors.CategoryIDs = "Danh mục là bắt buộc";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSaveData = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    const body = { ...formData };

    try {
      if (!editItem) {
        await http.post("productRequest/policy", body);
        toast.success("Tạo chính sách thành công");
        setFormData(originPolicy)
        router.push("/policy-list");
      } else {
        await http.put("productRequest/policy", body);
        toast.success("Đã sửa");
      }
      callback();
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  const changeData = (key: string) => (e: any) => {
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
  };

  const handleCategoryChange = (id: any) => {
    let categories = formData.CategoryIDs.split(";").filter((cat: any) => cat);
    const index = categories.indexOf(id.toString());

    if (index >= 0) {
        console.log("ok")
      categories.splice(index, 1);
    } else {
      categories.push(id);
    }

    setFormData({ ...formData, CategoryIDs: categories.join(";") });
  };
  console.log(formData.CategoryIDs)

  const renderListCategory = () => {
    return listCategory?.map((category: any) => (
      <div
        key={category.CategoryID}
        onClick={() => handleCategoryChange(category.CategoryID)}
        className={`hover:bg-[#1F2937] hover:text-white transition-all flex justify-center items-center rounded-full p-2 text-xs font-semibold cursor-pointer ${
          formData.CategoryIDs.split(";").includes(category.CategoryID.toString())
            ? "text-[white] bg-[#1F2937]"
            : "border border-[#1F2937] text-[#1F2937]"
        }`}
      >
        {category?.Name}
      </div>
    ));
  };

  return (
    <div className="nc-CartPage">
      <main className="">
        {!editItem && (
          <div className="mb-12 sm:mb-16">
            <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Đăng chính sách
            </h2>
            <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400">
              <Link href={"/"} className="">
                Trang chủ
              </Link>
              <span className="text-xs mx-1 sm:mx-1.5">/</span>
              <span className="text-xs mx-1 sm:mx-1.5">/</span>
              <span className="">Đăng chính sách</span>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <form className="grid grid-cols-1 gap-4">
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Tiêu đề
              </span>
              <Input
                value={formData.Title}
                onChange={changeData("Title")}
                placeholder="Tiêu đề"
                className="mt-1"
                name="Title"
              />
              {errors.Title && <span className="text-red-500">{errors.Title}</span>}
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Mô tả
              </span>
              <Input
                value={formData.Description}
                onChange={changeData("Description")}
                placeholder="Mô tả"
                className="mt-1 w-[100px]"
                name="Description"
              />
              {errors.Description && (
                <span className="text-red-500">{errors.Description}</span>
              )}
            </label>
            {/* <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Giá
              </span>
              <Input
                type="number"
                placeholder="Giá"
                className="mt-1"
                name="Price"
                value={formData.Price}
                onChange={changeData("Price")}
              />
              {errors.Price && <span className="text-red-500">{errors.Price}</span>}
            </label> */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Danh mục
              </span>
              <div className="flex gap-2 flex-wrap my-2">
                {renderListCategory()}
              </div>
              {errors.CategoryIDs && (
                <span className="text-red-500">{errors.CategoryIDs}</span>
              )}
            </label>
            <ButtonPrimary onClick={(e) => handleSaveData(e)} type="submit">
              {!editItem ? "Đăng chính sách" : "Sửa chính sách"}
            </ButtonPrimary>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UploadPolicy;
