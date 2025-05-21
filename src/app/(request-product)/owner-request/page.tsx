// pages/index.js

"use client";
import http from "@/http/http";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import { handleErrorHttp } from "@/utils/handleError";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "@/store/useAuthStore";
import UploadService from "@/http/uploadService";
import Select from "react-select";
import UserService from "@/http/userService";
import { ServiceResponse } from "@/type/service.response";
import { IPagingParam } from "@/contains/paging";
import NcModal from "@/shared/NcModal/NcModal";
import AddCustomer from "./AddCustomer";
const CreateWoodenBookRequest = ({ editItem, callback = () => { } }: any) => {
  const [listImage, setListImage] = useState<any>([]);
  const userStore: any = useAuthStore();
  const handleChangeFile = async (e: any) => {
    const files = e.target.files;
    const listUrl: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const response = await UploadService.upload(file);
        listUrl.push(response.data.fileUrl); // Thêm URL vào mảng
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        // Xử lý lỗi nếu cần
      }
    }
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
    userId: "",
    description: "",
    price: "0",
    images: "",
    type: "car",
    reasonReject: "",
    repairType: "IN_SHOP",
  };

  const [formData, setFormData] = useState<any>(initialData);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (editItem) {
      setFormData({
        ...editItem,
      });
    }
  }, [editItem]);

  const validateForm = () => {
    let valid = true;
    let newErrors: any = {};

    if (!formData.description) {
      newErrors.description = "Mô tả là bắt buộc";
      valid = false;
    }
    if (!formData.userId) {
      newErrors.userId = "Thông tin khác hàng là bắt buộc";
      valid = false;
    }
    if (!formData.repairType) {
      newErrors.repairType = "Phương thức sửa chữa là bắt buộc"; // Validation cho phương thức sửa chữa
      valid = false;
    }
    if (!formData.type) {
      newErrors.type = "Loại sản phẩm là bắt buộc"; // Validation cho Type
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSaveData = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    const body = {
      ...formData,
      images: listImage,
      reasonReject: "",
      isUserConfirm: true,
      userId: parseInt(formData.userId),
    };

    try {
      if (!editItem) {
        await http.post("request", { ...body });
        toast.success("Tạo yêu cầu thành công");
        setListImage([]);
        setFormData(initialData);
        setSelectedCustomer(null);
      } else {
        await http.put("productRequest", body);
        toast.success("Đã sửa");
        callback();
      }
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  const changeData = (key: any) => (e: any) => {
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
  };
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [openAdd, setOpenAddCustomer] = useState(false);

  const getCustomers = async () => {
    try {
      const param: IPagingParam = {
        pageSize: 1000,
        pageNumber: 1,
        conditions: [
          {
            key: "role",
            condition: "equal",
            value: "USER",
          },
        ],
        searchKey: "",
        searchFields: [],
        includeReferences: {},
        sortOrder: "createdAt desc",
      };
      const res = await UserService.getPaging<ServiceResponse>(param);

      setCustomers(res.data.data || []);
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);
  // Format dữ liệu cho react-select
  const customerOptions = customers.map((customer) => ({
    value: customer.id,
    label: customer.fullName,
  }));

  // Xử lý khi chọn khách hàng
  const handleCustomerChange = (selectedOption: any) => {
    setSelectedCustomer(selectedOption);
    setFormData({ ...formData, userId: selectedOption?.value });
  };

  return (
    <div className="nc-CartPage ">
      <main className="py-5">
        {!editItem && (
          <div className="mb-12 sm:mb-16">
            <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Tạo yêu cầu sửa chữa
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
                Chọn Khách hàng
              </span>
              <div className="flex mt-2">
                <Select
                  options={customerOptions} // Danh sách khách hàng
                  value={selectedCustomer} // Giá trị đã chọn
                  onChange={handleCustomerChange} // Xử lý khi chọn
                  placeholder="-- Chọn khách hàng --"
                  isSearchable // Cho phép tìm kiếm
                  className="w-full"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenAddCustomer(true);
                  }}
                  className="ml-auto bg-white text-black px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition duration-300"
                >
                  Thêm
                </button>
              </div>

              {errors.userId && (
                <span className="text-red-500">{errors.userId}</span>
              )}
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Mô tả
              </span>
              <Input
                value={formData.description}
                onChange={changeData("description")}
                placeholder="Mô tả"
                className="mt-1 h-[100px]"
                name="description"
              />
              {errors.description && (
                <span className="text-red-500">{errors.description}</span>
              )}
            </label>
            {/* <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Giá thỏa thuận
              </span>
              <Input
                type="number"
                placeholder="Giá"
                className="mt-1"
                name="ProposedPrice"
                value={formData.price}
                onChange={changeData("price")}
              />
              {errors.price && (
                <span className="text-red-500">{errors.price}</span>
              )}
            </label> */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Phương thức sửa chữa
              </span>
              <select
                value={formData.repairType}
                onChange={changeData("repairType")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="AT_HOME">Sửa ở nhà</option>
                <option value="IN_SHOP">Đem đến cửa hàng</option>
              </select>
              {errors.repairType && (
                <span className="text-red-500">{errors.repairType}</span>
              )}
            </label>
            {formData.repairType === "AT_HOME" && (
              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                  Địa chỉ sửa chữa
                </span>
                <Input
                  value={formData.address || ""}
                  onChange={changeData("address")}
                  placeholder="Nhập địa chỉ sửa chữa"
                  className="mt-1"
                  name="address"
                />
                {errors.address && (
                  <span className="text-red-500">{errors.address}</span>
                )}
              </label>
            )}

            {/* Combobox for Type */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Loại sản phẩm
              </span>
              <select
                value={formData.type}
                onChange={changeData("type")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="car">Xe</option>
                <option value="part">Linh kiện</option>
              </select>
              {errors.type && (
                <span className="text-red-500">{errors.type}</span>
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
                    {(src.size || 100 + Math.random() * 1000).toFixed(2)} KB
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
      <NcModal
        isOpenProp={openAdd}
        onCloseModal={() => {
          setOpenAddCustomer(false);
          // setIdImage(null);
        }}
        renderContent={() => (
          <AddCustomer
            callback={() => {
              setOpenAddCustomer(false);
              getCustomers();
            }}
          />
        )}
        modalTitle="Thêm người dùng"
      />
    </div>
  );
};
export default CreateWoodenBookRequest;
