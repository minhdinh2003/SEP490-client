"use client";

import http from "@/http/http";
import { handleErrorHttp } from "@/utils/handleError";
import { useEffect, useState } from "react";
import { NumberOutlined } from "@ant-design/icons";
import {
  dateFormat,
  formatPriceVND,
  getUrlImage,
  getWorkStatusColor,
  getWorkStatusText,
  uploadImagesToFirebase,
} from "@/utils/helpers";
import Status from "@/shared/Status/Status";
import NcModal from "@/shared/NcModal/NcModal";
import WorkDetail from "./WorkDetail";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import toast from "react-hot-toast";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ShippingAddress from "@/app/checkout/ShippingAddress";
import Radio from "@/shared/Radio/Radio";
import { Modal } from "antd";
import Image from "next/image";
import CoverflowSlider from "@/components/slider/SliderImage";

const ListWorkOfRequest = ({
  idRequest,
  isCustomer,
  payment,
  setPayment,
  handleCheckout,
  moneyCheckout,
  moneyDatcoc,
  handleReject,
  callback = () => {},
}: any) => {
  const [openModal, setOpenModal] = useState(false);
  const [AddressId, setAddressId] = useState(null);
  const [listImage, setListImage] = useState<string[]>([]);

  const [listWork, setListWork] = useState([]);
  const [title, setTitle] = useState("");
  const [openWorkDetail, setOpenWorkDetail] = useState(false);
  const [idWork, setIdWork] = useState(null);
  const [openAddess, setOpenAddress] = useState(false);
  const [mode, setMode] = useState("");

  const [isThanhToan, setIsThanhToan] = useState(false);
  const [isDatcoc, setIsDatcoc] = useState(false);

  const getDetailProductRequest = async () => {
    const res = await http.get(`ProductRequest/${idRequest}`);
    const request = res.payload.Data;
    setListImage(getUrlImage(request?.Images)?.listImage);

    setIsThanhToan(
      request.DepositAmount &&
        request.DepositAmount > 0 &&
        request.DepositAmount >= request?.NegotiatedPrice
    );
    setIsDatcoc(
      request.DepositAmount &&
        request.DepositAmount > 0 &&
        request.DepositAmount < request?.NegotiatedPrice
    );
  };

  useEffect(() => {
    if (idRequest) {
      getDetailProductRequest();
    }
  }, [idRequest]);

  const getListWork = async () => {
    try {
      const res = await http.get(
        `productRequest/work?productRequestID=${idRequest}`
      );

      setListWork(res.payload.Data || []);
    } catch (error: any) {
      console.log(error);
      handleErrorHttp(error?.payload);
    }
  };
  const NumberIcon = ({ number }: any) => {
    return (
      <div className="bg-blue-500 text-white font-bold rounded-full w-4 h-4 flex items-center justify-center">
        {number}
      </div>
    );
  };
  const renderContenRegister = () => {
    return (
      <div>
        <h4 className="font-semibold">Chọn phương thức thanh toán</h4>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center my-3">
            <Radio
              className="mr-1"
              onChange={(v: any) => setPayment(v)}
              defauttValue={payment}
              name="role"
              id={"0"}
            />
            Thanh toán PayOS
          </div>
          <div className="flex items-center my-3">
            <Radio
              className="mr-1"
              defauttValue={payment}
              onChange={(v: any) => setPayment(v)}
              name="role"
              id={"1"}
            />
            Thanh toán bằng Coin
          </div>
        </div>
        {mode == "dc" && (
          <p className="my-3 text-gray-600 text-sm">
            Bạn phải thanh toán 50% giá khởi điểm để đặt cọc
          </p>
        )}
        {mode == "dc" ? (
          <p className="my-3 text-gray-600 text-sm">
            Số tiền thanh toán là {formatPriceVND(moneyCheckout)}
          </p>
        ) : (
          <p className="my-3 text-gray-600 text-sm">
            Số tiền thanh toán còn lại là {formatPriceVND(moneyCheckout)}
          </p>
        )}
        <ButtonPrimary
          disabled={payment != "0" && payment != "1"}
          onClick={(e: any) => {
            e.preventDefault();
            mode == "dc"
              ? handleCheckout(
                  idRequest,
                  100,
                  false,
                  moneyDatcoc,
                  undefined,
                  () => {
                    setOpenModal(false);
                    getListWork();
                    getDetailProductRequest();
                  }
                )
              : handleCheckout(
                  idRequest,
                  100,
                  true,
                  moneyCheckout,
                  AddressId,
                  () => {
                    setOpenAddress(false);
                    setOpenModal(false);
                    callback();
                  },
                  true
                );
          }}
        >
          {mode == "tt" ? "Thanh toán" : "Đặt cọc"}
        </ButtonPrimary>
      </div>
    );
  };
  const Card = ({
    title,
    description,
    status,
    dueDate,
    number,
    idWork,
  }: any) => {
    return (
      <div
        onClick={() => {
          setOpenWorkDetail(true);
          setIdWork(idWork);
          setTitle(title);
        }}
        className="bg-white shadow-lg rounded-lg p-6 max-w-xs cursor-pointer"
      >
        <div className="flex items-center mb-4">
          <div className="bg-blue-500 text-white rounded-full p-1">
            <NumberIcon number={number} />
          </div>
          <h2 className="ml-4 text-lg font-bold">{title}</h2>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <span
            className={`text-xs font-semibold ${
              status === "Completed" ? "text-green-500" : "text-yellow-500"
            }`}
          >
            <Status
              text={getWorkStatusText(status)}
              color={getWorkStatusColor(status)}
            />
          </span>
          <span className="text-xs text-gray-500"> {dateFormat(dueDate)}</span>
        </div>
      </div>
    );
  };
  useEffect(() => {
    if (idRequest) {
      getListWork();
    }
  }, [idRequest]);

  // list work
  const renderListWork = () => {
    return listWork.map((task: any, index) => (
      <Card
        key={index}
        number={index + 1}
        title={task.Title}
        description={task.Description}
        status={task.Status}
        dueDate={task.ExpectedDate}
        idWork={task.WorkID}
      />
    ));
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
      //   getWorkDetail();
      if (isMess && mess) {
        toast.success(mess);
      }
    } catch (error: any) {
      console.log(error);
      handleErrorHttp(error?.payload);
    }
  };

  const reset = () => {
    setOpenWorkDetail(false);
    setIdWork(null);
    setTitle("");
  };
  const handleDeleteImage = (index: number) => {
    const newListImage: string[] = [...listImage!];
    newListImage.splice(index, 1);
    setListImage(newListImage);
  };
  const handleChangeFile = async (e: any) => {
    const listUrl: string[] = (await uploadImagesToFirebase(
      e.target.files
    )) as string[];
    if (listUrl?.length > 0) {
      setListImage([...listImage, ...listUrl]);
    }
  };

  const handleUpdayeImage = async () => {
    try {
      if (listImage.length === 0) {
        toast.error("Vui lòng thêm ảnh");
        return;
      }
      const res = await http.put("ProductRequest/creator/productRequest", {
        Images: listImage.join("*"),
        ProductRequestID: idRequest,
      });
      toast.success("Đã cập nhật");
    } catch (error) {}
  };
  const canPay =
    listWork?.filter((i: any) => i?.Status == 2)?.length == listWork?.length;
  return listWork.length > 0 ? (
    <div>
      <div className="ml-10">
        <span className="font-bold">Trạng thái : </span>
        {isThanhToan ? (
          <Status text={"Đã thanh toán"} color={"blue"} />
        ) : isDatcoc ? (
          <Status text={"Đã đặt cọc"} color={"blue"} />
        ) : (
          <Status text={"Chưa đặt cọc"} color={"gray"} />
        )}
        {isCustomer && !isDatcoc && !isThanhToan && (
          <div className="text-gray-600 my-3">
            Hãy đặt cọc ngay để nhà sáng tạo tiến hành làm{" "}
          </div>
        )}
        {isCustomer && !isThanhToan &&  (
          <div className="text-gray-600 my-3">
            Khi tất cả các công việc ở trạng thái{" "}
            <strong>Đã có sản phẩm</strong>  và có ảnh sản phẩm cuối cùng bạn mới có thể tiến hành thanh toán{" "}
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 p-10 gap-10 max-h-96 overflow-auto">
        {renderListWork()}
      </div>
      {canPay && !isCustomer && (
        <div className="flex flex-col ">
          {!isThanhToan && (
            <div className="my-5 text-gray-500">
              Tất cả công việc đã xong, hãy cập nhật ảnh sản phẩm
            </div>
          )}
          <div className="rounded-full w-[160px] h-[100px]">
            {!isThanhToan && (
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
            )}
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
          {!isThanhToan && (
            <div className="flex justify-end">
              <ButtonPrimary
                className="my-5"
                onClick={() => handleUpdayeImage()}
              >
                Lưu
              </ButtonPrimary>
            </div>
          )}
        </div>
      )}

      {(((canPay || isThanhToan) && isCustomer && listImage.length > 0) ||
        ((canPay || isThanhToan) && !isCustomer && isThanhToan && listImage.length > 0)) && (
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-5">
            Danh sách hình ảnh sản phẩm{" "}
          </h3>
          <CoverflowSlider images={listImage || []} />
        </div>
      )}
      <NcModal
        isOpenProp={openWorkDetail}
        onCloseModal={() => {
          reset();
        }}
        renderContent={() => (
          <WorkDetail
            isDatcoc={isDatcoc}
            callback={() => {
              reset();
              getListWork();
            }}
            idWork={idWork}
            isCustomer={isCustomer}
          />
        )}
        modalTitle={title}
      />
      <div
        style={{
          marginBottom: -50,
        }}
      >
        {isCustomer && !isThanhToan && (
          <div className="mt-5 w-full flex justify-end gap-3">
            <ButtonSecondary
              onClick={async () => {
                Modal.confirm({
                  onOk: async () => {
                    await handleReject(idRequest);
                    callback();
                  },
                  centered: true,
                  title: "Bạn có chắc muốn hủy đơn hàng? ",
                  okText: "Có",
                  cancelText: "Không",
                  okButtonProps: {
                    style: {
                      backgroundColor: "red",
                      borderColor: "red",
                      color: "white",
                    },
                  },
                });
              }}
            >
              Hủy đơn
            </ButtonSecondary>
            {!isDatcoc ? (
              <ButtonPrimary
                onClick={
                  () => {
                    setOpenModal(true);
                    setMode("dc");
                  }
                  // handleCheckout(idRequest, work?.WorkID, false, moneyDatcoc)
                }
              >
                Đặt cọc
              </ButtonPrimary>
            ) : !isThanhToan ? (
              <>
                <ButtonPrimary
                  disabled={!canPay || listImage.length === 0}
                  onClick={() => setOpenAddress(true)}
                >
                  Thanh toán
                </ButtonPrimary>
              </>
            ) : (
              ""
            )}
          </div>
        )}
      </div>

      <NcModal
        isOpenProp={openAddess}
        onCloseModal={() => {
          setOpenAddress(false);
        }}
        renderContent={() => (
          <div className="py-16">
            <ShippingAddress
              AddressId={AddressId}
              setAddressId={setAddressId}
            />
            <div className="flex justify-end mt-10">
              <ButtonPrimary
                disabled={!AddressId}
                onClick={() => {
                  setOpenModal(true);
                  setMode("tt");
                }}
              >
                Thanh toán
              </ButtonPrimary>
            </div>
          </div>
        )}
        modalTitle="Chọn địa chỉ giao hàng"
      />
      <NcModal
        isOpenProp={openModal}
        onCloseModal={() => setOpenModal(false)}
        renderContent={() => renderContenRegister()}
        modalTitle="Thanh toán"
      />
    </div>
  ) : (
    <div className="p-10 text-center">Chưa có công việc nào</div>
  );
};
export default ListWorkOfRequest;
