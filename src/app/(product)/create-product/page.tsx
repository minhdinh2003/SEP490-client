"use client";
import WithHydration from "@/HOC/withHydration";
import { useGetData } from "@/hooks/useGetData";
import http from "@/http/http";
import { handleErrorHttp } from "@/utils/handleError";
import { dateFormat2, uploadImagesToFirebase } from "@/utils/helpers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UploadProduct = ({ editItem, callback = () => {} }: any) => {
  const originProduct = {
    ProductID: 0,
    Name: "",
    Description: "",
    Price: "",
    Stock: "",
    Title: "",
    Background: "",
    Status: 0,
    Images: "",
    ProductDetail: {
      ProductDetailID: 0,
      Publisher: "abc",
      Pages: 100,
      Dimensions: "",
      PublishDate: "",
      ProductID: 0,
    },
    Tags: [],
    Categories: "",
    Materials: "",
  };

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
  console.log(errors);
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
      initDataEdit.Categories =
        dataDetail?.ProductCategories?.length > 0
          ? dataDetail?.ProductCategories[0]?.CategoryID
          : "";
      initDataEdit.Materials =
        dataDetail?.ProductMaterials?.length > 0
          ? dataDetail?.ProductMaterials[0]?.MaterialID
          : "";
      setListImage(dataDetail?.Images?.split("*"));
      setFormData({
        ...initDataEdit,
        ProductDetail: {
          ...initDataEdit.ProductDetail,
          PublishDate: dateFormat2(initDataEdit?.ProductDetail?.PublishDate),
        },
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
    if (!formData.Materials) {
      newErrors.Materials = "Chất liệu sản phẩm là bắt buộc";
      valid = false;
    }
    if (!formData.Price || formData.Price <= 0) {
      newErrors.Price = "Giá phải là số dương và bắt buộc";
      valid = false;
    }
    if (!formData.Stock || formData.Stock <= 0) {
      newErrors.Stock = "Số lượng phải là số dương và bắt buộc";
      valid = false;
    }
    if (!formData.ProductDetail.PublishDate) {
      newErrors.PublishDate = "Ngày xuất bản là bắt buộc";
      valid = false;
    } else if (new Date(formData.ProductDetail.PublishDate) > new Date()) {
      newErrors.PublishDate = "Ngày xuất bản không thể ở tương lai";
      valid = false;
    }
    if (listImage.length === 0) {
      newErrors.Images = "Phải có ít nhất một ảnh";
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
      Images: listImage.join("*"),
      ProductDetail: {
        ...formData.ProductDetail,
        Pages: 100,
        Publisher: "abc",
      },
    };
    const catePost = listCategory?.filter(
      (i: any) => i.CategoryID == body.Categories
    );
    const matePost = listMaterials?.filter(
      (i: any) => i.MaterialID == body.Materials
    );
    body.Categories = catePost;
    body.Materials = matePost;
    body.Tags = listTag?.filter((i: any) => i.checked);

    try {
      if (!editItem) {
        await http.post("Product", body);
        toast.success("Tạo sản phẩm thành công, đang chờ được xác nhận");
        router.push("/my-product");
      } else {
        await http.put("Product", body);
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
    <div className="py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-4 border border-gray-200 rounded">
          <div
            style={{
              borderWidth: 3,
            }}
            className="border-dashed border-blue-300 rounded-lg mb-4"
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
        <div className="p-4 border rounded">
          <form onSubmit={handleSaveData}>
            <div className="mb-4">
              <label className="block text-gray-700">Tên sản phẩm</label>
              <input
                type="text"
                value={formData.Name}
                onChange={changeData("Name")}
                placeholder="Tên sản phẩm"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
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
                className="w-full mt-1 p-2 border border-gray-300 rounded"
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
            <div className="mb-4">
              <label className="block text-gray-700">Chất liệu sản phẩm</label>
              <select
                value={formData.Materials}
                onChange={changeData("Materials")}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                name="Materials"
              >
                <option disabled value="">
                  Chọn chất liệu sản phẩm
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
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Giá</label>
              <input
                type="number"
                placeholder="Giá"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                name="Price"
                value={formData.Price}
                onChange={changeData("Price")}
              />
              {errors.Price && (
                <span className="text-red-500">{errors.Price}</span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Mô tả</label>
              <textarea
                placeholder="Mô tả"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                name="Description"
                value={formData.Description}
                onChange={changeData("Description")}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Số lượng</label>
              <input
                placeholder="Số lượng"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                name="Stock"
                value={formData.Stock}
                onChange={changeData("Stock")}
              />
              {errors.Stock && (
                <span className="text-red-500">{errors.Stock}</span>
              )}
            </div>
            {/* <div className="mb-4">
              <label className="block text-gray-700">Số trang</label>
              <input
                placeholder="Số trang"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                name="Pages"
                value={formData.ProductDetail.Pages}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ProductDetail: {
                      ...formData.ProductDetail,
                      Pages: e.target.value,
                    },
                  })
                }
              />
              {errors.Pages && (
                <span className="text-red-500">{errors.Pages}</span>
              )}
            </div> */}
            {/* <div className="mb-4">
              <label className="block text-gray-700">Nhà xuất bản</label>
              <input
                placeholder="Nhà xuất bản"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                name="Publisher"
                value={formData.ProductDetail.Publisher}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ProductDetail: {
                      ...formData.ProductDetail,
                      Publisher: e.target.value,
                    },
                  })
                }
              />
              {errors.Publisher && (
                <span className="text-red-500">{errors.Publisher}</span>
              )}
            </div> */}
            <div className="mb-4">
              <label className="block text-gray-700">Ngày xuất bản</label>
              <input
                type="date"
                placeholder="Ngày xuất bản"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                name="PublishDate"
                value={formData.ProductDetail.PublishDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ProductDetail: {
                      ...formData.ProductDetail,
                      PublishDate: e.target.value,
                    },
                  })
                }
              />
              {errors.PublishDate && (
                <span className="text-red-500">{errors.PublishDate}</span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Tags</label>
              <div className="flex gap-2 flex-wrap my-2 border border-gray-200 rounded p-5">
                {renderListTag()}
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={(e) => handleSaveData(e)}
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {!editItem ? "Đăng sản phẩm" : "Sửa sản phẩm"}
        </button>
      </div>
    </div>
  );
};

export default WithHydration(UploadProduct);
