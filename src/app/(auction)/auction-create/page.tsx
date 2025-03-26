"use client";
import WithHydration from "@/HOC/withHydration";
import { useGetData } from "@/hooks/useGetData";
import http from "@/http/http";
import { ButtonIcon } from "@/shared/Button/CustomButton";
import { handleErrorHttp } from "@/utils/handleError";
import { dateFormat2, uploadImagesToFirebase } from "@/utils/helpers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UploadAuction = ({ editItem, callback = () => {} }: any) => {
  const originProduct = {
    ProductID: 0,
    Name: "",
    Description: "",
    Price: "",
    Stock: 1,
    Title: "",
    Background: "",
    Status: 0,
    Images: "",
    ProductDetailID: 0,
    Publisher: "",
    Pages: 10,
    Dimensions: "",
    PublishDate: "",

    Tags: [],
    TagIDs: "",
    Categories: "",
    Increment: "",
    AuctionStartTime: "",
    AuctionEndTime: "",
    Materials: "",
    CategoryIDs: "",
    MaterialIDs: "",
  };

  const [step, setStep] = useState(1);
  const [listTag, setListTag] = useState([]);
  const [dataDetail, setDataDetail] = useState<any>([]);
  const { data: listCategory } = useGetData("Category/all");
  const { data: listMaterials } = useGetData("Material/all");
  useGetData("Tag/all", [], setListTag);
  const { data } = useGetData(
    "Product/" + editItem?.ProductID,
    [editItem?.ProductID],
    setDataDetail
  );

  const [listImage, setListImage] = useState<any>([]);
  const [formData, setFormData] = useState<any>(originProduct);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    if (editItem) {
      if (editItem?.Tags) {
        const listTagID = editItem?.Tags?.map((item: any) => item?.Tag?.TagID);
        setListTag((listPrev) => {
          const newList = [...listPrev];
          newList.forEach((listItem: any) => {
            const index = listTagID?.indexOf(listItem?.TagID);
            if (index >= 0) {
              listItem.checked = true;
            }
          });
          return newList;
        });
      }
      const initDataEdit = {
        ...editItem,
      };
      const cate =
        dataDetail?.ProductCategories?.length > 0
          ? dataDetail?.ProductCategories[0]?.CategoryID
          : "";
      const mate = (initDataEdit.Materials =
        dataDetail?.ProductMaterials?.length > 0
          ? dataDetail?.ProductMaterials[0]?.MaterialID
          : "");
      initDataEdit.Categories =
        dataDetail?.ProductCategories?.length > 0
          ? dataDetail?.ProductCategories[0]?.CategoryID
          : "";
      initDataEdit.Materials =
        dataDetail?.ProductMaterials?.length > 0
          ? dataDetail?.ProductMaterials[0]?.MaterialID
          : "";
      setListImage(dataDetail?.ImageUrl?.split("*"));
      setFormData({
        ...initDataEdit,

        PublishDate: dateFormat2(initDataEdit?.PublishDate),
        CategoryIDs: cate,
        MaterialIDs: mate,
      });
    }
  }, [editItem, dataDetail, listTag.length]);

  const validateForm = () => {
    let valid = true;
    let newErrors: any = {};

    if (!formData.Name) {
      newErrors.Name = "Tên sản phẩm là bắt buộc";
      valid = false;
    }
    if (!formData.Categories) {
      newErrors.Categories = "Danh mục sản phẩm là bắt buộc";
      valid = false;
    }
    // if (!formData.Materials) {
    //   newErrors.Materials = "Chất liệu gỗ là bắt buộc";
    //   valid = false;
    // }
    if (!formData.Stock || formData.Stock <= 0) {
      newErrors.Stock = "Số lượng phải là số dương và bắt buộc";
      valid = false;
    }
    if (!formData.Pages || formData.Pages <= 0) {
      newErrors.Pages = "Số trang phải là số dương và bắt buộc";
      valid = false;
    }

    if (!formData.PublishDate) {
      newErrors.PublishDate = "Ngày xuất bản là bắt buộc";
      valid = false;
    } else if (new Date(formData.PublishDate) > new Date()) {
      newErrors.PublishDate = "Ngày xuất bản không thể ở tương lai";
      valid = false;
    }
    if (listImage.length === 0) {
      newErrors.ImageUrl = "Phải có ít nhất một ảnh";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  console.log(errors);
  const validateStep2 = () => {
    let valid = true;
    let newErrors: any = {};

    const now = new Date();

    if (!formData.Price || formData.Price <= 0) {
      newErrors.Price = "Giá phải là số dương và bắt buộc";
      valid = false;
    }

    if (!formData.Increment || formData.Increment <= 0) {
      newErrors.Increment = "Bước giá phải là số dương và bắt buộc";
      valid = false;
    }

    if (!formData.AuctionStartTime) {
      newErrors.AuctionStartTime = "Thời gian bắt đầu là bắt buộc";
      valid = false;
    } else if (new Date(formData.AuctionStartTime) < now) {
      newErrors.AuctionStartTime =
        "Thời gian bắt đầu không được là thời gian quá khứ";
      valid = false;
    }

    if (!formData.AuctionEndTime) {
      newErrors.AuctionEndTime = "Thời gian kết thúc là bắt buộc";
      valid = false;
    } else if (
      new Date(formData.AuctionEndTime) <= new Date(formData.AuctionStartTime)
    ) {
      newErrors.AuctionEndTime =
        "Thời gian kết thúc phải lớn hơn thời gian bắt đầu";
      valid = false;
    }

    setErrors({ ...errors, ...newErrors });
    return valid;
  };

  const handleSaveData = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    const body = { ...formData, ImageUrl: listImage.join("*") };
    const catePost = listCategory?.filter(
      (i: any) => i.CategoryID == body.Categories
    );
    const materialPost = listMaterials?.filter(
      (i: any) => i.MaterialID == body.Materials
    );
    const tagList = listTag
      ?.filter((i: any) => i.checked)
      .map((i: any) => i.TagID);

    body.Categories = catePost;
    body.Materials = materialPost;
    body.Tags = listTag?.filter((i: any) => i.checked);
    body.TagIDs = tagList.join(";");

    body.CategoryIDs = (catePost[0] as any)?.CategoryID + "";
    body.MaterialIDs = (materialPost[0] as any)?.MaterialID + "";

    try {
      if (!editItem) {
        await http.post("Auction", body);
        toast.success("Tạo sản phẩm thành công, đang chờ được xác nhận");
        router.push("/my-auction");
      } else {
        await http.put("Auction", body);
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

  const handleCheckedTag = (id: any) => {
    const list = [...listTag] as any;
    const index = listTag.findIndex((i: any) => i.TagID == id);
    if (index >= 0) {
      list[index].checked = !list[index].checked;
      setListTag(list);
    }
  };

  const renderListTag = () => {
    return listTag?.map((tag: any) => (
      <div
        key={tag.TagID}
        onClick={() => handleCheckedTag(tag.TagID)}
        className={`cursor-pointer px-4 py-1 rounded text-sm font-medium border ${
          tag.checked
            ? "bg-blue-500 text-white"
            : "bg-white text-gray-800 border-gray-200"
        } flex items-center`}
      >
        {tag?.Name}
      </div>
    ));
  };

  return (
    <div className="">
      <h1 className="mb-5 text-2xl font-bold">
        {step == 1
          ? "Bước 1 : Thêm thông tin sản phẩm"
          : "Bước 2 : Thêm thông tin đấu giá "}
      </h1>
      {step == 1 ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="p-4 border border-gray-200 rounded">
            <div
              style={{
                borderWidth: 3,
              }}
              className="mb-4 border-blue-300 border-dashed rounded-lg"
            >
              <label className="block text-center cursor-pointer bg-gray-50">
                <div className="flex flex-col items-center justify-center gap-10 p-7">
                  <Image src="/image1.svg" alt="" width={100} height={100} />
                  <span className="flex items-center justify-center gap-2 text-gray-700">
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
            <div className="space-y-4">
              {listImage?.map((src: any, index: any) => (
                <div
                  key={index}
                  className="relative flex items-center justify-between p-2 border border-gray-300 rounded"
                >
                  <img
                    src={src}
                    className="object-cover rounded w-14 h-14"
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
          <div className="p-4 border rounded">
            <form onSubmit={handleSaveData}>
              <div className="mb-4">
                <label className="block text-gray-700">Tên sản phẩm</label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={changeData("Name")}
                  placeholder="Tên sản phẩm"
                  className="w-full p-2 mt-1 border border-gray-300 rounded"
                  name="Name"
                />
                {errors.Name && (
                  <span className="text-red-500">{errors.Name}</span>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Danh mục sản phẩm</label>
                <select
                  value={formData.Categories}
                  onChange={changeData("Categories")}
                  className="w-full p-2 mt-1 border border-gray-300 rounded"
                  name="Categories"
                >
                  <option disabled value="">
                    Chọn danh mục sản phẩm
                  </option>
                  {listCategory?.map((item: any) => (
                    <option key={item?.CategoryID} value={item?.CategoryID}>
                      {item?.Name}
                    </option>
                  ))}
                </select>
                {errors.Categories && (
                  <span className="text-red-500">{errors.Categories}</span>
                )}
              </div>
              {/* <div className="mb-4">
                <label className="block text-gray-700">Chất liệu gỗ</label>
                <select
                  value={formData.Materials}
                  onChange={changeData("Materials")}
                  className="w-full p-2 mt-1 border border-gray-300 rounded"
                  name="Materials"
                >
                  <option disabled value="">
                    Chọn chất liệu gỗ
                  </option>
                  {listMaterials?.map((item: any) => (
                    <option key={item?.MaterialID} value={item?.MaterialID}>
                      {item?.Name}
                    </option>
                  ))}
                </select>
                {errors.Materials && (
                  <span className="text-red-500">{errors.Materials}</span>
                )}
              </div> */}
              <div className="mb-4">
                <label className="block text-gray-700">Mô tả</label>
                <textarea
                  placeholder="Mô tả"
                  className="w-full p-2 mt-1 border border-gray-300 rounded"
                  name="Description"
                  value={formData.Description}
                  onChange={changeData("Description")}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Ngày xuất bản</label>
                <input
                  type="date"
                  placeholder="Ngày xuất bản"
                  className="w-full p-2 mt-1 border border-gray-300 rounded"
                  name="PublishDate"
                  value={formData.PublishDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,

                      PublishDate: e.target.value,
                    })
                  }
                />
                {errors.PublishDate && (
                  <span className="text-red-500">{errors.PublishDate}</span>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Tags</label>
                <div className="flex flex-wrap gap-2 p-5 my-2 border border-gray-200 rounded">
                  {renderListTag()}
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="w-1/2">
          <div className="mb-4">
            <label className="block text-gray-700">Giá khởi điểm</label>
            <input
              type="number"
              value={formData.Price}
              onChange={changeData("Price")}
              placeholder="Giá khởi điểm"
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              name="Price"
            />
            {errors.Price && (
              <span className="text-red-500">{errors.Price}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Bước giá</label>
            <input
              type="number"
              value={formData.Increment}
              onChange={changeData("Increment")}
              placeholder="Bước giá"
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              name="Increment"
            />
            {errors.Increment && (
              <span className="text-red-500">{errors.Increment}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Thời gian bắt đầu</label>
            <input
              type="datetime-local"
              placeholder="Thời gian bắt đầu"
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              name="AuctionStartTime"
              value={formData.AuctionStartTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  AuctionStartTime: e.target.value,
                })
              }
            />
            {errors.AuctionStartTime && (
              <span className="text-red-500">{errors.AuctionStartTime}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Thời gian kết thúc</label>
            <input
              type="datetime-local"
              placeholder="Thời gian kết thúc"
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              name="AuctionEndTime"
              value={formData.AuctionEndTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  AuctionEndTime: e.target.value,
                })
              }
            />
            {errors.AuctionEndTime && (
              <span className="text-red-500">{errors.AuctionEndTime}</span>
            )}
          </div>
        </div>
      )}
      <div
        className={`flex items-center justify-between ${
          step == 2 ? "w-1/2" : ""
        }  `}
      >
        {step == 2 ? (
          <button
            onClick={(e) => {
              if (validateStep2()) {
                handleSaveData(e);
              }
            }}
            className="px-4 py-2 text-white bg-black cursor-pointer rounded-2xl hover:opacity-70"
          >
            Thêm sản phẩm đấu giá
          </button>
        ) : (
          <div></div>
        )}
        <div className={`mt-4 flex justify-end gap-2 `}>
          <ButtonIcon
            className={`${step == 1 ? "opacity-40 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (step == 1) {
                return;
              }
              setStep(1);
            }}
            svg="/left2.svg"
          />
          <ButtonIcon
            className={`${step == 2 ? "opacity-40 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (validateForm()) {
                setStep(2);
              }
            }}
            svg="/right2.svg"
          />
        </div>
      </div>
    </div>
  );
};

export default WithHydration(UploadAuction);
