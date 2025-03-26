"use client";
import http from "@/http/http";
import { handleErrorHttp } from "@/utils/handleError";
import {
  dateFormat4,
  formatAddress,
  formatPriceVND,
  getUrlImage,
} from "@/utils/helpers";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  compareDate,
  EndStatus,
  IncomingStatus,
  LiveStatus,
} from "../../auction-list/ListAuction";
function renderTableRow1 (label: any, value: any) {return 1}
const ViewAuction = () => {
  function renderTableRow (label: any, value: any)  {
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
  };
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const [detail, setDetail] = useState<any>();
  const [winner, setWinner] = useState<any>();

  const getInfo = async (id: any) => {
    try {
      const res = await http.get(`User/${id}`);
      setWinner(res.payload.Data);
    } catch (error: any) {
      handleErrorHttp(error);
    }
  };

  const getDetail = async () => {
    try {
      const res: any = await http.get(`Auction/${id}`);
      setDetail(res?.payload.Data);
      if (res?.payload?.Data?.AuctionResult?.WinnerUserID) {
        await getInfo(res?.payload?.Data?.AuctionResult?.WinnerUserID);
      }
    } catch (error: any) {
      handleErrorHttp(error);
    }
  };

  useEffect(() => {
    if (id) {
      getDetail();
    }
  }, [id]);

  const status = compareDate(detail?.AuctionStartTime, detail?.AuctionEndTime);

  const getStatus = () => {
    if (status === "comming") {
      return IncomingStatus;
    }
    if (status === "live") {
      return LiveStatus;
    }
    return EndStatus;
  };

  if (!detail) {
    return <div>Loading...</div>;
  }

  const images = getUrlImage(detail?.ImageUrl).listImage || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-10">Chi tiết đấu giá</h1>
      <div className="flex gap-10">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <div className="relative">
            <img
              src={images.length ? images[currentImageIndex] : ""}
              alt={`Product Image ${currentImageIndex}`}
              className="w-full h-[600px] object-cover shadow rounded-lg"
            />
          </div>
          <div className="flex mt-4 overflow-x-auto space-x-2">
            {images.map((url, index) => (
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
        <div className="md:w-1/2">
          <div className="p-4 border rounded shadow overflow-y-auto">
            <h2 className="text-xl font-bold">Thông tin sản phẩm</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <tbody>
                {renderTableRow("Tên sản phẩm", detail?.Title || detail?.Name)}
                {renderTableRow("Mô tả", detail?.Description)}
                {renderTableRow(
                  "Danh mục sản phẩm",
                  detail?.Categories[0]?.Name
                )}
                {renderTableRow("Chất liệu gỗ", detail?.Materials[0]?.Name)}
                {renderTableRow("Ngày xuất bản", detail?.PublishDate)}
                {renderTableRow(
                  "Tags",
                  detail?.Tags?.map((i: any) => i.Name)?.join(", ")
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border rounded shadow overflow-y-auto mt-10">
            <h2 className="text-xl font-bold">Thông tin đấu giá</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <tbody>
                {renderTableRow(
                  "Người đăng",
                  detail?.User?.FirstName + " " + detail?.User?.LastName
                )}
                {renderTableRow("Giá khởi điểm", formatPriceVND(detail.Price))}
                {renderTableRow("Bước giá", formatPriceVND(detail.Increment))}
                {renderTableRow(
                  "Thời gian bắt đầu",
                  dateFormat4(detail?.AuctionStartTime)
                )}
                {renderTableRow(
                  "Thời gian kết thúc",
                  dateFormat4(detail?.AuctionEndTime)
                )}
                {renderTableRow("Trạng thái", getStatus())}
                {renderTableRow(
                  "Giá cuối",
                  detail?.AuctionResult?.WinningBidAmount
                    ? formatPriceVND(detail?.AuctionResult?.WinningBidAmount)
                    : ""
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border rounded shadow overflow-y-auto mt-10">
            <h2 className="text-xl font-bold">Thông tin người thắng cuộc</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <tbody>
                {renderTableRow(
                  "Họ tên",
                  (winner?.FirstName || "") + " " + (winner?.LastName || "")
                )}
                {renderTableRow("Email", winner?.Email)}
                {renderTableRow("Số điện thoại", winner?.Phone)}
                {renderTableRow("Địa chỉ", formatAddress(winner?.Address))}
                {renderTableRow(
                  "Giới tính",
                  winner ? (winner?.Gender == 0 ? "Nam" : "Nữ") : ""
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAuction;
