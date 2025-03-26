"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { dateFormat, dateFormat4, formatPriceVND } from "@/utils/helpers";
import useAuthStore from "@/store/useAuthStore";
import {
  ButtonIcon,
  compareDate,
  EndStatus,
  IncomingStatus,
  LiveStatus,
} from "../../auction-list/ListAuction";
import { InputNumber, Button, Row, Col , } from "antd";
import { SendOutlined  } from '@ant-design/icons';


import { ButtonIcon as ButtonIcon1 } from "@/shared/Button/CustomButton";
import NcModal from "@/shared/NcModal/NcModal";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { handleErrorHttp } from "@/utils/handleError";
import http from "@/http/http";
import Radio from "@/shared/Radio/Radio";
import { toast } from "react-toastify";
const Sidebar = ({ isOpen, toggleSidebar, listBid = [] }: any) => {
  useEffect(() => {
    const chatContainer: any = document.getElementById("bid-container");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [listBid?.length, isOpen]);

  const userStore: any = useAuthStore();
  return (
    <div
      className={`   pb-2 w-[300px] fixed top-20 right-0 bg-white shadow-lg transition-transform transform ${
        !isOpen ? "translate-x-full" : "translate-x-0 "
      } z-10`}
    >
      <div className="p-4">
        <div className="flex justify-between">
          <p className="font-bold">Danh sách đấu giá</p>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700"
          >
            X
          </button>
        </div>
        <hr className="mt-5" />
        <div
          style={{
            height: "calc(100vh - 130px) ",
          }}
          className="  pb-10 overflow-auto "
          id={"bid-container"}
        >
          {listBid?.map((bid: any) => (
            <div key={bid.id} className="p-2 border rounded-lg mt-5">
              <p className="font-bold text-red-600">
                {formatPriceVND(bid?.BidAmount)}
              </p>
              {bid.UserID == userStore?.user?.UserID ? (
                <p>
                  <span className="font-semibold"></span> Bạn đã đặt tiền đấu
                  giá
                </p>
              ) : (
                <p>
                  <span className="font-semibold"></span> Có người đã đặt tiền
                  đấu giá
                </p>
              )}

              <p>
                <span className="text-xs text-gray-500">
                  {dateFormat4(bid?.BidDateTime)}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AuctionPage = ({
  images,
  detail,
  bidAmount,
  isEnd,
  timeLeft,
  handleBid,
  listBid,
  getDetail,
}: any) => {
  const userStorage: any = useAuthStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isRegisted = detail?.Registers?.find(
    (i: any) => i.Email == userStorage?.user?.Email
  );
  const [dataRegister, setDataRegister] = useState({
    AuctionItemID: 1007,
    DepositAmount: 1000000,
    BankCode: "",
    Lang: "vn",
    PaymentMethod: "0", // 0: bankonline , 1: Coin
    Email: userStorage?.user?.Email,
  });
  const [openModal, setOpenModal] = useState(false);
  const [moneyDaugia, setMoneuDauGia] = useState(0);

  const [activeTab, setActiveTab] = useState("description");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  function renderTableRow(label: any, value: any) {
    return (
      <tr style={{ backgroundColor: "white" }}>
        <th
          className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r w-1/4"
          style={{ fontWeight: "bold !important" }}
        >
          {label}
        </th>
        <td
          style={{ backgroundColor: "white" }}
          className="px-6 py-3 text-sm text-gray-900"
        >
          {value}
        </td>
      </tr>
    );
  }
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const getStatus = () => {
    if (status === "comming") {
      return IncomingStatus;
    }
    if (status === "live") {
      return LiveStatus;
    }
    return EndStatus;
  };
  const isMine = detail?.UserID == userStorage?.user?.UserID;

  const status = compareDate(detail?.AuctionStartTime, detail?.AuctionEndTime);
  const registerAuth = async () => {
    try {
      const res = await http.post("Auction/register", {
        ...dataRegister,
        DepositAmount: moneyDaugia,
      });
      if (dataRegister.PaymentMethod == "0") {
        const url = res.payload.Data;
        if (typeof window !== "undefined") {
          window.location.href = url;
        }
      } else {
        toast.success("Đăng ký thành công");
        // getAuList();
        getDetail();
        setOpenModal(false);
        userStorage?.getInfoUser();
      }
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  useEffect(() => {
    if (status === "live") {
      setSidebarOpen(true);
    }
  }, [status]);
  const renderContenRegister = () => {
    return (
      <div>
        <h4 className="font-semibold">Chọn phương thức thanh toán</h4>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center my-3">
            <Radio
              className="mr-1"
              onChange={(v: any) =>
                setDataRegister({ ...dataRegister, PaymentMethod: v })
              }
              defauttValue={dataRegister.PaymentMethod}
              name="role"
              id={"0"}
            />
            Thanh toán PayOS
          </div>
          <div className="flex items-center my-3">
            <Radio
              className="mr-1"
              defauttValue={dataRegister.PaymentMethod}
              onChange={(v: any) =>
                setDataRegister({ ...dataRegister, PaymentMethod: v })
              }
              name="role"
              id={"1"}
            />
            Thanh toán bằng Coin
          </div>
        </div>
        <p className="my-3 text-gray-600 text-sm">
          Bạn phải thanh toán 10% giá khởi điểm để đăng ký
        </p>
        <p className="my-3 text-gray-600 text-sm">
          Số tiền phải trả để đăng kí là {formatPriceVND(moneyDaugia)}
        </p>
        <ButtonPrimary
          onClick={(e: any) => {
            e.preventDefault();
            registerAuth();
          }}
        >
          Đăng ký
        </ButtonPrimary>
      </div>
    );
  };

  const [nhan, setNhan] = useState(1);
  return (
    <div className="px-32 py-8 relative">
      <Sidebar
        listBid={listBid}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="text-sm text-gray-500 mb-2">
        <a href="#" className="hover:underline">
          Đấu giá
        </a>{" "}
        /
        <a href="#" className="hover:underline">
          {" "}
          Sản phẩm
        </a>{" "}
      </div>
      <h1 className="text-3xl font-bold mb-2">{detail?.Name}</h1>
      <hr className="border-slate-200 dark:border-slate-700 mb-10 mt-5" />

      <div className="flex flex-wrap md:flex-nowrap">
        <div className="md:w-[45%] mb-6 md:mb-0">
          <div className="relative">
            <img
              src={images?.length && images[currentImageIndex]}
              alt={`Product Image `}
              className="w-full h-[600px] object-cover shadow rounded-lg"
            />
          </div>
          <div className="flex mt-4 overflow-x-auto space-x-2">
            {images.map((url: any, index: any) => (
              <img
                key={index}
                src={url}
                alt={`Thumbnail ${index}`}
                className={`w-16 h-16 object-cover cursor-pointer rounded ${
                  currentImageIndex === index
                    ? "border-2 border-blue-500"
                    : "opacity-70"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
        <div className="md:w-[55%] md:pl-8">
          <p className="text-gray-600 mb-4">{detail?.Description}</p>
          <h2 className="text-xl font-semibold mb-4">
            Đây là cuộc đấu giá kín
          </h2>
          <div className="mb-4 flex justify-between items-center ">
            <div>{isEnd ? EndStatus : getStatus()}</div>
            <ButtonIcon1 onClick={() => toggleSidebar()} svg="/mess.svg" />
          </div>
          {status === "live" && !isEnd && (
            <div className=" p-4 rounded-lg mb-4 shadow">
              <div className="flex justify-between mb-2">
                <div className="text-center flex flex-col items-center">
                  <span className="block text-2xl font-bold">
                    {timeLeft.months}
                  </span>{" "}
                  Tháng
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold">
                    {timeLeft.weeks}
                  </span>{" "}
                  Tuần
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold">
                    {timeLeft.days}
                  </span>{" "}
                  Ngày
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold">
                    {timeLeft.hours}
                  </span>{" "}
                  Giờ
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold">
                    {timeLeft.minutes}
                  </span>{" "}
                  Phút
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold">
                    {timeLeft.seconds}
                  </span>{" "}
                  Giây
                </div>
              </div>
            </div>
          )}

          <p className="mb-4 text-gray-600">
            Đây là phiên đấu giá kín. Trong loại đấu giá này, tất cả người đấu
            giá đồng thời đưa ra các mức giá và danh tính người tham gia sẽ được
            bảo mật. Người trả giá cao nhất sẽ giành chiến thắng
          </p>
          <p className="mb-4">
            Giá khởi điểm là :{" "}
            <span className="font-semibold">
              {formatPriceVND(detail.Price)}
            </span>
            .
          </p>
          <p className="mb-4">
            Giá hiện tại :{" "}
            <span className="font-semibold">
              {formatPriceVND(bidAmount)}
            </span>
            .
          </p>
          <p className="mt-4">
            Bước giá: <strong>{formatPriceVND(detail.Increment)}</strong>
          </p>
          {!isEnd &&
            status === "live" &&
            detail?.UserID != userStorage?.user?.UserID &&
            isRegisted && (
              <>
              <div className="mt-4 font-bold">
                  Đấu giá
                </div>
              <div className="flex items-center mb-4 mt-4 p-4 py-6 shadow relative">
                
                <div
                  className={`flex items-center gap-2 ${
                    isSidebarOpen ? "text-sm" : "text-md"
                  } font-semibold`}
                >
                  <div
                    className={`${
                      !isSidebarOpen ? "w-[120px]" : "w-[100px]"
                    } border border-gray-300 px-5 py-2 rounded-full flex items-center justify-center relative`}
                  >
                    <div style={{
                      fontSize:10
                    }} className="absolute -top-2 left-4 font-normal text-gray-600 text-xs bg-white">
                      Giá hiện tại
                    </div>
                    {bidAmount}
                  </div>
                  +
                  <div
                    className={`${
                      !isSidebarOpen ? "w-[120px]" : "w-[100px]"
                    } border border-gray-300 px-5 py-2 rounded-full flex items-center justify-center relative`}
                  >
                    <div style={{
                      fontSize:10
                    }} className="absolute -top-2 left-4 font-normal text-gray-600 text-xs bg-white">
                      Bước giá
                    </div>
                    {detail.Increment}
                  </div>
                  x
                  <div className=" w-[120px] border border-gray-300 px-2 py-1  rounded-full flex items-center justify-between">
                    <div
                      aria-disabled="true"
                      onClick={() => {
                        if (nhan <= 1) {
                          return;
                        }
                        setNhan(nhan - 1);
                      }}
                      className="w-7 h-7 p-1 bg-gray-600 rounded-full flex justify-center items-center cursor-pointer font-bold text-green-600"
                    >
                      {" "}
                      -{" "}
                    </div>
                    <div>{nhan}</div>
                    <div
                      onClick={() => setNhan(nhan + 1)}
                      className="w-7 h-7 p-1 bg-gray-600 rounded-full flex justify-center items-center cursor-pointer font-bold text-green-600"
                    >
                      {" "}
                      +{" "}
                    </div>
                  </div>
                  =
                  <div
                    className={`${
                      !isSidebarOpen ? "w-[120px]" : "w-[100px]"
                    } border border-gray-300 px-5 py-2 rounded-full flex items-center justify-center relative`}
                  >
                    <div style={{
                      fontSize:10
                    }} className="absolute -top-2 left-4 font-normal text-gray-600 text-xs bg-white">
                      Giá cuối
                    </div>
                    {bidAmount + nhan * detail?.Increment}
                  </div>
                  <button
                    onClick={() => {
                      handleBid(bidAmount + nhan * detail?.Increment);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                   <SendOutlined />
                  </button>
                </div>
              </div>
              </>
            )}

          <p className="mt-4">
            Danh mục: <strong>{detail?.Categories[0]?.Name}</strong>
          </p>
          <p className="mt-4">
            Chất liệu gỗ: <strong>{detail?.Materials[0]?.Name}</strong>
          </p>
          <p className="mt-4">
            Tags:{" "}
            <strong>{detail?.Tags?.map((i: any) => i.Name)?.join(", ")}</strong>
          </p>
          {status === "comming" && !isMine && (
            <div className="w-[150px] mt-5 flex justify-center items-center cursor-pointer">
              {!isRegisted ? (
                <ButtonIcon
                  onClick={() => {
                    setOpenModal(true);
                    setDataRegister({
                      ...dataRegister,
                      AuctionItemID: detail.AuctionItemID,
                    });
                    setMoneuDauGia(Math.floor((detail?.Price * 10) / 100));
                  }}
                  txt={"Đăng ký đấu giá"}
                  svg="/coin3.svg"
                  tooltip="Đăng ký đấu giá"
                  className=" bg-white text-white p-2 rounded-full shadow-xl"
                ></ButtonIcon>
              ) : (
                <div className="text-green-500 -ml-2">Đã đăng ký đấu giá</div>
              )}
            </div>
          )}
        </div>
        <div className={`${isSidebarOpen ? "w-[250px]" : "w-0"}`}></div>
      </div>

      <div className=" py-8">
        {/* Existing content */}

        <div className="flex mt-8 space-x-2">
          <button
            className={`flex-1 p-4 text-center font-semibold hover:bg-blue-500 hover:text-white ${
              activeTab === "description"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Thông tin về sản phẩm
          </button>

          <button
            className={`flex-1 p-4 text-center font-semibold hover:bg-blue-500 hover:text-white ${
              activeTab === "auctionResults"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("auctionResults")}
          >
            Kết quả đấu giá
          </button>
          <div className={`${isSidebarOpen ? "w-[200px]" : "w-0"}`}></div>
        </div>

        <div className="p-4 bg-gray-100 mt-4 rounded shadow">
          {activeTab === "description" && (
            <>
              <div className="p-4 border rounded shadow overflow-y-auto">
                <h2 className="text-xl font-bold">Thông tin sản phẩm</h2>
                <div className="flex">
                  <table className="flex-1 divide-y divide-gray-200">
                    <tbody>
                      {renderTableRow(
                        "Tên sản phẩm",
                        detail?.Title || detail?.Name
                      )}
                      {renderTableRow("Mô tả", detail?.Description)}
                      {renderTableRow(
                        "Danh mục sản phẩm",
                        detail?.Categories[0]?.Name
                      )}
                      {renderTableRow(
                        "Chất liệu gỗ",
                        detail?.Materials[0]?.Name
                      )}
                      {renderTableRow(
                        "Ngày xuất bản",
                        dateFormat(detail?.PublishDate)
                      )}
                      {renderTableRow(
                        "Tags",
                        detail?.Tags?.map((i: any) => i.Name)?.join(", ")
                      )}
                    </tbody>
                  </table>
                  <div
                    className={`${isSidebarOpen ? "w-[180px]" : "w-0"}`}
                  ></div>
                </div>
              </div>

              <div className="p-4 border rounded shadow overflow-y-auto mt-10">
                <h2 className="text-xl font-bold">Thông tin đấu giá</h2>
                <div className="flex ">
                  <table className="flex-1  divide-y divide-gray-200">
                    <tbody>
                      {renderTableRow(
                        "Người đăng",
                        detail?.User?.FirstName + " " + detail?.User?.LastName
                      )}
                      {renderTableRow(
                        "Giá khởi điểm",
                        formatPriceVND(detail.Price)
                      )}
                      {renderTableRow(
                        "Bước giá",
                        formatPriceVND(detail.Increment)
                      )}
                      {renderTableRow(
                        "Thời gian bắt đầu",
                        dateFormat4(detail?.AuctionStartTime)
                      )}
                      {renderTableRow(
                        "Thời gian kết thúc",
                        dateFormat4(detail?.AuctionEndTime)
                      )}
                    </tbody>
                  </table>
                  <div
                    className={`${isSidebarOpen ? "w-[180px]" : "w-0"}`}
                  ></div>
                </div>
              </div>
            </>
          )}

          {activeTab === "auctionHistory" && (
            <div className=" h-[600px] overflow-auto">
              {listBid?.map((bid: any) => (
                <div key={bid.id} className="p-2 border rounded-lg mt-5">
                  <p className="font-bold text-red-600">
                    {formatPriceVND(bid?.BidAmount)}
                  </p>
                  <p>
                    <span className="font-semibold"></span> Có người đã đặt tiền
                    đấu giá
                  </p>
                  <p>
                    <span className="text-xs text-gray-500">
                      {dateFormat4(bid?.BidDateTime)}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
          {activeTab === "auctionResults" && (
            <div>
              <div className="flex">
                <table className="flex-1 divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá cuối
                      </th>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {formatPriceVND(
                          detail?.AuctionResult?.WinningBidAmount
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className={`${isSidebarOpen ? "w-[190px]" : "w-0"}`}></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <NcModal
        isOpenProp={openModal}
        onCloseModal={() => setOpenModal(false)}
        renderContent={() => renderContenRegister()}
        modalTitle="Đăng kí đấu giá"
      />
    </div>
  );
};

export default AuctionPage;
