"use client";
import http from "@/http/http";
import Status from "@/shared/Status/Status";
import useAuthStore from "@/store/useAuthStore";
import { handleErrorHttp } from "@/utils/handleError";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import "swiper/swiper-bundle.min.css";
import "swiper/css";
import "swiper/css/navigation";

import CoverflowSlider from "@/components/slider/SliderImage";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Select from "@/shared/Select/Select";
import {
  getUrlImage,
  getWorkStatusColor,
  getWorkStatusText,
  uploadImagesToFirebase,
} from "@/utils/helpers";
import Image from "next/image";

const WorkDetail = ({
  idRequest,
  callback = () => {},
  images,
  isCustomer,
  moneyCheckout,
  handleCheckout,
  moneyDatcoc,
  isDatcoc,
  payment,
  setPayment,
  idWork,
}: any) => {
  const optionWork = [
    {
      title: "Đang tiến hành",
      value: 1,
    },
    {
      title: "Đã có sản phẩm",
      value: 2,
    },
  ];
  const [status, setStatus] = useState();
  const [initStatus, setInitStatus] = useState();
  const [reget, setReget] = useState(1);
  const [listImage, setListImage] = useState<string[]>([]);
  const userStore: any = useAuthStore();
  const [work, setWork] = useState<any>([]);
  function renderTableRow(label: any, value: any) {
    return (
      <tr style={{ backgroundColor: "white" }}>
        <th
          className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r w-1/4 border-t border-l"
          style={{ fontWeight: "bold !important" }}
        >
          {label}
        </th>
        <td
          style={{ backgroundColor: "white" }}
          className="px-6 py-3 text-sm text-gray-900 border-t border-r"
        >
          {value}
        </td>
      </tr>
    );
  }
  const getWorkDetail = async () => {
    try {
      const res = await http.get(`productRequest/work/${idWork}`);
      setWork(res.payload.Data);
      setListImage(getUrlImage(res?.payload?.Data?.Images).listImage);
      setStatus(res.payload?.Data?.Status);
      setInitStatus(res.payload?.Data?.Status);
    } catch (error: any) {
      console.log(error);
      handleErrorHttp(error?.payload);
    }
  };

  useEffect(() => {
    if (idWork) {
      getWorkDetail();
    }
  }, [idWork]);

  const handleChangeFile = async (e: any) => {
    const listUrl: string[] = (await uploadImagesToFirebase(
      e.target.files
    )) as string[];
    if (listUrl?.length > 0) {
      setListImage([...listImage, ...listUrl]);
    }
  };

  const handleDeleteImage = (index: number) => {
    const newListImage: string[] = [...listImage!];
    newListImage.splice(index, 1);
    setListImage(newListImage);
  };

  const onChangeStatusWork = async (
    status: any,
    id: any,
    isMess?: boolean,
    mess?: string
  ) => {
    try {
      await http.put(
        `productRequest/work/status?status=${status}&workID=${id}`,
        {}
      );
      getWorkDetail();
      if (isMess && mess) {
        toast.success(mess);
      }
    } catch (error: any) {
      console.log(error);
      handleErrorHttp(error?.payload);
    }
  };

  console.log(listImage);
  const hadnleUpdateImage = async () => {
    const initBody = {
      CreatedBy: "string",
      CreatedDate: "2024-08-21T16:10:11.294Z",
      ModifiedBy: "string",
      ModifiedDate: "2024-08-21T16:10:11.294Z",
      WorkID: 0,
      ProductRequestID: 0,
      CreatorUserID: 0,
      Title: "",
      Description: "",
      WorkUrl: "string",
      Status: 0,
      ExpectedDate: "2024-08-21T16:10:11.294Z",
      Images: "string",
    };
    try {
      if (status == 2 && listImage.length == 0) {
        toast.error("Vui lòng thêm ảnh");
        return;
      }
      if (status == 2) {
        await http.post(`ProductRequest/updateWork`, {
          ...initBody,
          ProductRequestID: idRequest,
          ...work,
          Images: listImage.join("*"),
        });
      }
      await onChangeStatusWork(work.Status == 4 ? 2 : status, work.WorkID);
      toast.success("Đã cập nhật");
      callback();
    } catch (error: any) {
      console.log(error);
      handleErrorHttp(error?.payload);
    }
  };

  return (
    <div className="nc-CartPage relative">
      <main className="py-5 pb-2">
        {work ? (
          <div className="flex flex-col gap-5 ">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody>
                {renderTableRow("Tiêu đề", work?.Title)}
                {renderTableRow("Mô tả", work?.Description)}
                {renderTableRow(
                  "Trạng thái",
                  <div className="w-[400px]">
                    {!isCustomer && (work.Status == 1 || work.Status == 2) ? (
                      <Select
                        disabled={!isDatcoc}
                        onChange={(e: any) => {
                          const value = e.target.value;
                          if (value == 1) {
                            setListImage([]);
                          }
                          setStatus(e.target.value);
                        }}
                        value={status}
                      >
                        {optionWork.map((i: any) => (
                          <option key={i.value} value={i.value}>
                            {i.title}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Status
                        text={getWorkStatusText(work.Status)}
                        color={getWorkStatusColor(work.Status)}
                      />
                    )}
                  </div>
                )}
              </tbody>
            </table>

            {((status != 1 && status != 3) || work.Status == 4) &&
              !isCustomer &&
              isDatcoc && (
                <div className="flex flex-col ">
                  <div className="rounded-full w-[160px] h-[100px]">
                    <label
                      htmlFor="input-file"
                      className="py-1 rounded-full flex items-center justify-center cursor-pointer bg-black text-[white]"
                    >
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
                          fill="#000"
                        />
                      </svg>

                      <span className="mt-1 text-xs inline-block ml-2 ">
                        Thêm ảnh
                      </span>
                    </label>
                    <input
                      onChange={handleChangeFile}
                      type="file"
                      className="opacity-0 cursor-pointer"
                      multiple
                      id="input-file"
                    />
                  </div>
                  <div className="mt-1 flex  flex-wrap gap-4 relative ">
                    {listImage?.map((src: any, index: any) => (
                      <div
                        key={index}
                        style={{
                          width: "calc(50% - 40px)",
                        }}
                        className="relative flex items-center justify-between border border-gray-300 p-2 rounded "
                      >
                        <img
                          src={src}
                          className="w-14 h-14 object-cover rounded"
                          alt="Product"
                        />
                        <div className="flex-1 ml-4">
                          <p className="text-sm">Image {index + 1}</p>
                          <p className="text-xs text-gray-500">
                            {(src.size || 100 + Math.random() * 1000).toFixed(
                              2
                            )}{" "}
                            KB
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
              )}

            {!isCustomer && (status == 2 || work.Status == 2) && isDatcoc && (
              <div className="mt-5 w-full flex justify-end">
                <ButtonPrimary onClick={hadnleUpdateImage}>Lưu</ButtonPrimary>
              </div>
            )}

            {((isCustomer && work.Status != 1) || work.Status == 3) && (
              <div className="mt-4">
                <h3 className="font-semibold text-lg mb-5">
                  Danh sách hình ảnh{" "}
                </h3>
                <CoverflowSlider
                  images={listImage || []}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center text-[gray] pt-[100px]">
            Chưa có công việc nào
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkDetail;
