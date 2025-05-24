"use client";
import WithHydration from "@/HOC/withHydration";
import { Editor } from "@tinymce/tinymce-react"; // Sử dụng TinyMCE làm editor
import http from "@/http/http";
import { handleErrorHttp } from "@/utils/handleError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import UploadService from "@/http/uploadService";

const UploadPromotion = ({ editItem, callback = () => {} }: any) => {
  const originPromotion = {
    name: "",
    content: "",
    description: "",
    startDate: "",
    endDate: "",
    type: "EVENT", // Mặc định là EVENT
    discountType: "PERCENTAGE", // Mặc định là PERCENTAGE
    discountValue: 0,
    minUseRequest: 0,
    minUseAmount: 0,
    voucherUsed: 0, 
    voucherQuantity: 0,
    image: [],
  };

  const [formData, setFormData] = useState<any>(originPromotion);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    if (editItem) {
      setFormData({
        ...editItem,
        startDate: formatDate(editItem.startDate),
        endDate: formatDate(editItem.endDate),
      });
    }
  }, [editItem]);

  // Format ngày tháng từ Date object sang string
  const formatDate = (date: string | Date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split("T")[0];
  };

  // Validate form
  const validateForm = () => {
    let valid = true;
    let newErrors: any = {};

    // Kiểm tra tên chương trình khuyến mãi
    if (!formData.name) {
      newErrors.name = "Tên chương trình khuyến mãi là bắt buộc";
      valid = false;
    }

    // Lấy ngày hiện tại (chỉ tính ngày, không tính giờ)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Kiểm tra ngày bắt đầu
    if (!formData.startDate) {
      newErrors.startDate = "Ngày bắt đầu là bắt buộc";
      valid = false;
    } else {
      const startDate = new Date(formData.startDate);
      startDate.setHours(0, 0, 0, 0);
      if (startDate < today) {
        newErrors.startDate = "Ngày bắt đầu phải từ hôm nay trở đi";
        valid = false;
      }
    }

    // Kiểm tra ngày kết thúc
    if (!formData.endDate) {
      newErrors.endDate = "Ngày kết thúc là bắt buộc";
      valid = false;
    } else {
      const endDate = new Date(formData.endDate);
      endDate.setHours(0, 0, 0, 0);
      const startDate = new Date(formData.startDate);
      startDate.setHours(0, 0, 0, 0);
      if (endDate <= startDate) {
        newErrors.endDate = "Ngày kết thúc phải lớn hơn ngày bắt đầu ít nhất 1 ngày";
        valid = false;
      }
      if (endDate < today) {
        newErrors.endDate = "Ngày kết thúc không được là ngày quá khứ";
        valid = false;
      }
    }

    // Kiểm tra minUseRequest
    if (
      formData.type == "MAINTENANCE" &&
      formData.minUseRequest !== null &&
      formData.minUseRequest <= 0
    ) {
      newErrors.minUseRequest = "Số lần sử dụng tối thiểu phải lớn hơn 0";
      valid = false;
    }

    if (
      formData.type == "DISCOUNT" &&
      formData.minUseAmount !== null &&
      formData.minUseAmount <= 0
    ) {
      newErrors.minUseAmount = "Giá mua tối thiểu phải lớn hơn 0";
      valid = false;
    }

    // Kiểm tra discountValue
    if (formData.type !== "EVENT" && formData.discountValue <= 0) {
      newErrors.discountValue = "Giá trị giảm giá phải lớn hơn 0";
      valid = false;
    }

    // Cập nhật trạng thái lỗi
    setErrors(newErrors);
    return valid;
  };
  // Xử lý lưu dữ liệu
  const handleSaveData = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Ép thời gian về 0h cho startDate và endDate
    const startDate = new Date(formData.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(formData.endDate);
    endDate.setHours(0, 0, 0, 0);

    const body = {
      ...formData,
      startDate,
      endDate,
      image: listImage,
      discountValue: parseInt(formData.discountValue),
      minUseAmount: parseInt(formData.minUseAmount),
      voucherQuantity: parseInt(formData.voucherQuantity),
      voucherUsed: parseInt(formData.voucherUsed),
      minUseRequest: parseInt(formData.minUseRequest),
    };

    try {
      if (!editItem) {
        await http.post("promotion", body);
        setFormData(originPromotion);
        setListImage([]);
        toast.success("Thêm chương trình khuyến mãi thành công");
        // router.push("/promotions");
      } else {
        await http.put(`Promotion/${editItem.id}`, body);
        toast.success("Cập nhật chương trình khuyến mãi thành công");
        callback();
      }
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };

  // Cập nhật giá trị form
  const handleChange = (key: string) => (e: any) => {
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
  };

  // Cập nhật nội dung editor
  const handleEditorChange = (content: string) => {
    setFormData({ ...formData, content });
  };
  const [listImage, setListImage] = useState<any>([]);
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

  return (
    <div className="py-10">
      <form onSubmit={handleSaveData}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Phần thông tin cơ bản */}
          <div className="p-4 border border-gray-200 rounded">
            <div className="mb-4">
              <label className="block text-gray-700">Tên chương trình</label>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange("name")}
                placeholder="Nhập tên chương trình"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
              {errors.name && (
                <span className="text-red-500">{errors.name}</span>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Mô tả (tùy chọn)</label>
              <textarea
                value={formData.description}
                onChange={handleChange("description")}
                placeholder="Nhập mô tả chi tiết"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Ngày bắt đầu</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={handleChange("startDate")}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
              {errors.startDate && (
                <span className="text-red-500">{errors.startDate}</span>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Ngày kết thúc</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={handleChange("endDate")}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
              {errors.endDate && (
                <span className="text-red-500">{errors.endDate}</span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Loại chương trình</label>
              <select
                value={formData.type}
                onChange={handleChange("type")}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              >
                <option value="EVENT">Thay dầu/rửa xe</option>
                <option value="DISCOUNT">Giảm giá khi mua hàng</option>
                {/* <option value="MAINTENANCE">Giảm giá khi sửa chữa</option> */}
              </select>
            </div>
            {formData.type === "DISCOUNT" && (
              <div>
                {" "}
                <div className="mb-4">
                  <label className="block text-gray-700">Loại giảm giá</label>
                  <select
                    value={formData.discountType}
                    onChange={handleChange("discountType")}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                  >
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="AMOUNT">Số tiền cố định</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Giá trị giảm giá
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={handleChange("discountValue")}
                    placeholder="Nhập giá trị giảm giá"
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Giá mua tối thiểu
                  </label>
                  <input
                    type="number"
                    value={formData.minUseAmount || 0}
                    onChange={handleChange("minUseAmount")}
                    placeholder="Nhập giá tối thiểu"
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                  />
                  {errors.minUseAmount && (
                    <span className="text-red-500">{errors.minUseAmount}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Số lượng voucher
                  </label>
                  <input
                    type="number"
                    value={formData.voucherQuantity || 0}
                    onChange={handleChange("voucherQuantity")}
                    placeholder="Nhập số lượng voucher"
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                  />
                  {errors.voucherQuantity && (
                    <span className="text-red-500">{errors.voucherQuantity}</span>
                  )}
                </div>
              </div>
            )}
            {formData.type === "MAINTENANCE" && (
              <div>
                {" "}
                <div className="mb-4">
                  <label className="block text-gray-700">Loại giảm giá</label>
                  <select
                    value={formData.discountType}
                    onChange={handleChange("discountType")}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                  >
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="AMOUNT">Số tiền cố định</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Giá trị giảm giá
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={handleChange("discountValue")}
                    placeholder="Nhập giá trị giảm giá"
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Số lần(lần sửa tối thiểu để nhận voucher)
                  </label>
                  <input
                    type="number"
                    value={formData.minUseRequest || 0}
                    onChange={handleChange("minUseRequest")}
                    placeholder="Nhập số lượt sử dụng tối đa"
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                  />
                  {errors.minUseRequest && (
                    <span className="text-red-500">{errors.minUseRequest}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Số lượng voucher
                  </label>
                  <input
                    type="number"
                    value={formData.voucherQuantity || 0}
                    onChange={handleChange("voucherQuantity")}
                    placeholder="Nhập số lượng voucher"
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                  />
                  {errors.voucherQuantity && (
                    <span className="text-red-500">{errors.voucherQuantity}</span>
                  )}
                </div>
              </div>
            )}

            <label className="mb-4 block text-center cursor-pointer bg-gray-50">
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

          {/* Phần nội dung HTML */}
          <div className="p-4 border border-gray-200 rounded">
            <div className="mb-4">
              <label className="block text-gray-700">Nội dung</label>
              <Editor
                apiKey="pokwuzsem6sm1zdg2yktr6ubrbgee32yutfj7xh88zp0lpie"
                value={formData.content}
                onEditorChange={handleEditorChange}
                init={{
                  readonly: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help",
                }}
                initialValue=""
              />
            </div>
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

        {/* Nút lưu */}
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Thêm
          </button>
        </div>
      </form>
    </div>
  );
};

export default WithHydration(UploadPromotion);
