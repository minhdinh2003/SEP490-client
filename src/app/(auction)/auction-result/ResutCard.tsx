"use client";

import { dateFormat3, formatPriceVND, getUrlImage } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ResultCard = ({ auction }: any) => {
  const router = useRouter();
  let countdown: any;
  const [timeLeft, setTimeLeft] = useState<any>([]);
  const [isEnd, setIsEnd] = useState(false);
  const AuctionEndTime = auction?.Auction?.AuctionEndTime;
  const AuctionStartTime = auction?.Auction?.AuctionStartTime;
  useEffect(() => {
    // let countdown;
    const endTime = new Date(AuctionEndTime).getTime();
    const endTimeWithAddedHours = endTime + 24 * 60 * 60 * 1000;
    countdown = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTimeWithAddedHours - now;
      let dis1 = distance;

      if (distance > 0) {
        const days = Math.floor(dis1 / (1000 * 60 * 60 * 24));
        dis1 %= 1000 * 60 * 60 * 24;
        const hours = Math.floor(dis1 / (1000 * 60 * 60));
        dis1 %= 1000 * 60 * 60;
        const minutes = Math.floor(dis1 / (1000 * 60));
        dis1 %= 1000 * 60;
        const seconds = Math.floor(dis1 / 1000);

        setTimeLeft([
          { value: days, unit: "Ngày" },
          { value: hours, unit: "Giờ" },
          { value: minutes, unit: "Phút" },
          { value: seconds, unit: "Giây" },
        ]);
      } else {
       
          setIsEnd(true);
        

        clearInterval(countdown);
        // setTimeLeft("Auction ended");
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [AuctionEndTime, AuctionStartTime]);
console.log(isEnd)
  return (
    <div>
      <div
        key={auction.id}
        className="flex flex-col md:flex-row items-center mb-8 p-4 border rounded-lg "
      >
        <img
          src={getUrlImage(auction.Auction.ImageUrl)?.mainImage}
          alt={auction.Auction.Title}
          className="w-40 h-40 object-cover rounded-md"
        />
        <div className="md:ml-4 mt-4 md:mt-0 flex-1">
          <h3 className="text-xl font-bold">
            {auction.Auction.Title || auction.Auction.Name}
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            <strong> Người tạo : </strong>
            {auction?.Auction?.CreatedBy?.substring(10)}
          </p>

          <p className="text-sm text-gray-600 mt-2">
            <strong> Thời gian bắt đầu :</strong>{" "}
            {dateFormat3(auction.Auction.AuctionStartTime)}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong> Thời gian kết thúc :</strong>{" "}
            {dateFormat3(auction.Auction.AuctionEndTime)}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong> Giá khởi điểm :</strong> {auction.Auction.Price}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong> Bước giá:</strong> {auction.Auction.Increment}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong> Người chiến thắng:</strong> {auction.FullName}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Giá cuối:</strong>{" "}
            {formatPriceVND(auction?.WinningBidAmount)}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Số tiền cần thanh toán còn lại:</strong>{" "}
            {formatPriceVND(
              Number(auction?.WinningBidAmount) -
                Number(Math.floor((auction.Auction.Price * 10) / 100))
            )}
          </p>
        </div>
        <div className="md:ml-auto mt-4 md:mt-0 flex flex-col items-center justify-end">
          {auction?.Status == 1 && (
            <div className="flex items-center text-gray-500">
              <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
                Đã thanh toán
              </span>
            </div>
          )}
         {
            !isEnd && auction?.Status !=1 &&  <div
            style={{
              borderRadius: 3,
            }}
            className={` -bottom-2 left-0 right-0 bg-white p-1 shadow mx-5 text-[#000]  $
            } transition-all duration-500 p-2 `}
          >
            <p className="text-center text-gray-600">
            Thời gian thanh toán còn lại
            </p>
             <div className="flex justify-between items-center">
                {timeLeft?.map((time: any, index: any) => (
                  <div key={index} className="text-center">
                    <span className="block text-lg font-semibold  text-gray-600">
                      {time.value}
                    </span>
                    <span className="block text-xs text-gray-600">
                      {time.unit}
                    </span>
                  </div>
                ))}
              </div>
              </div>
         }
 
          {(auction?.Status == 0  && !isEnd)&& (
            <button
              onClick={() =>
                router.push(`/auction-checkout/${auction?.AuctionItemID}`)
              }
              className=" bg-red-700 text-white py-2 px-4 rounded-full hover:bg-red-600 mt-4"
            >
              Thanh toán ngay
            </button>
          )}
          {
            auction?.Status == 0  && isEnd && <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
            Quá hạn thanh toán
          </span>
          }
        </div>
      </div>
    </div>
  );
};
export default ResultCard;
