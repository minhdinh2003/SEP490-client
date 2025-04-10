import http from "@/http/http";
import NcModal from "@/shared/NcModal/NcModal";
import { formatAddress, formatPriceVND, shortTxt } from "@/utils/helpers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const renderListTable = (listUser = []) =>
  listUser?.map((product: any, index: number) => (
    <tr key={index}>
      <td key={index} className="p-4 border-b border-blue-gray-50">
        <div className="flex items-center gap-3 min-w-[300px]">
          <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
            {product?.User?.FirstName + " " + product?.User?.LastName}
          </p>
        </div>
      </td>
      <td className="p-4 border-b border-blue-gray-50 ">
        <p className="  min-w-[200px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
          {product?.User?.Email}
        </p>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <p className="  min-w-[100px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
          {product?.User?.Phone}
        </p>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <p className="   min-w-[100px] block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
          {product?.User?.Gender == 0 ? "Nam" : "Nữ"}
        </p>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <p className=" block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
          {formatAddress(product?.User?.Address)}
        </p>
      </td>

      <td className="p-4 border-b border-blue-gray-50"></td>
    </tr>
  ));
export const compareDate = (AuctionStartTime: any, AuctionEndTime: any) => {
  const startTime = new Date(AuctionStartTime);
  const endTime = new Date(AuctionEndTime);
  const now = new Date();
  if (startTime <= now && now < endTime) {
    return "live";
  } else if (now >= endTime) {
    return "end";
  }
  return "comming";
};
export const IncomingStatus = (
  <div className="flex items-center text-gray-500">
    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
      Sắp diễn ra
    </span>
  </div>
);
export const EndStatus = (
  <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
    Đã kết thúc
  </span>
);
export const LiveStatus = (
  <div className="flex items-center text-gray-500">
    <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
      Đang diễn ra
    </span>
  </div>
);
export const ButtonIcon = ({
  text,
  onClick,
  svg,
  color,
  hoverColor,
  tooltip,
  disabled,
  className = "",
  txt,
}: any) => {
  return (
    <div
      style={{}}
      onClick={onClick}
      className={` bg-white  ${className} flex items-center gap-2 border`}
    >
      <Image
        className="cursor-pointer"
        alt=""
        width={15}
        height={15}
        src={svg}
      />
      <p className="text-gray-500 text-sm"> {txt}</p>
    </div>
  );
};
const ListUserRegisrer = ({ id }: any) => {
  const [list, setList] = useState([]);
  const getList = async () => {
    try {
      const res = await http.post("Auction/paging/registor", {
        PageSize: 1000,
        PageNumber: 1,
        Filter: `AuctionItemID = ${id}`,
        SortOrder: "ModifiedDate desc",
        SearchKey: "",
      });
      setList(res.payload.Data?.Data);
    } catch (error) {}
  };
  useEffect(() => {
    if (id) {
      getList();
    }
  }, [id]);
  return (
    <>
      <div className="w-full">
        <main>
          {(list as any)?.length > 0 ? (
            <div className="flex  bg-white">
              <div className="px-0 w-full">
                <table className="w-full min-w-full table-auto text-left">
                  <thead>
                    <tr>
                      <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                          Họ tên
                        </p>
                      </th>
                      <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                          Email
                        </p>
                      </th>
                      <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                          Số điện thoại
                        </p>
                      </th>
                      <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                          Giới tính
                        </p>
                      </th>
                      <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                          Địa chỉ
                        </p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>{renderListTable(list)}</tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center text-[gray] pt-[100px]">
              Chưa có người đăng ký bào
            </div>
          )}
        </main>
      </div>
    </>
  );
};
const AuctionCard = ({
  image,
  title,
  type,
  currentBid,
  auction,
  moneyDaugia,
  register = () => {},
}: any) => {
  const router = useRouter();
  let countdown: any;
  let countdown2: any;

  const [timeLeft, setTimeLeft] = useState<any>([]);
  const [timeIncoming, setTimeIncoming] = useState<any>([]);

  const [hover, setHover] = useState(false);
  const AuctionStartTime = auction?.AuctionStartTime;
  const AuctionEndTime = auction?.AuctionEndTime;
  const [status, setStatus] = useState(
    compareDate(AuctionStartTime, AuctionEndTime)
  );
  const [isEnd, setIsEnd] = useState(false);
  const end = isEnd || status === "end";
  const [openModal, setOpenModal] = useState(false);
  const [listUser, setListUser] = useState([]);
  const [currentId, setCurrentId] = useState([]);

  ///
  useEffect(() => {
    // let countdown;
    const endTime = new Date(AuctionEndTime).getTime();

    countdown = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;
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
        if (status === "live") {
          setIsEnd(true);
        }

        clearInterval(countdown);
        // setTimeLeft("Auction ended");
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [AuctionEndTime, AuctionStartTime, status]);

  ///
  useEffect(() => {
    // let countdown;
    const endTime = new Date(AuctionStartTime).getTime();

    countdown2 = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;
      let dis1 = distance;

      if (distance > 0) {
        const days = Math.floor(dis1 / (1000 * 60 * 60 * 24));
        dis1 %= 1000 * 60 * 60 * 24;
        const hours = Math.floor(dis1 / (1000 * 60 * 60));
        dis1 %= 1000 * 60 * 60;
        const minutes = Math.floor(dis1 / (1000 * 60));
        dis1 %= 1000 * 60;
        const seconds = Math.floor(dis1 / 1000);

        setTimeIncoming([
          { value: days, unit: "Ngày" },
          { value: hours, unit: "Giờ" },
          { value: minutes, unit: "Phút" },
          { value: seconds, unit: "Giây" },
        ]);
      } else {
        if (status === "comming") {
          setStatus("live");
        }
        clearInterval(countdown2);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [AuctionStartTime, status]);
  const time = status === "comming" ? timeIncoming : timeLeft;

  const getStatus = () => {
    if (isEnd) {
      return EndStatus;
    }
    if (status === "comming") {
      return IncomingStatus;
    }
    if (status === "live") {
      return LiveStatus;
    }
    return EndStatus;
  };

  // Table user

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/auction-detail/${auction?.AuctionItemID}`);
      }}
      // onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="bg-white shadow rounded-sm overflow-hidden cursor-pointer relative"
    >
      <div className="relative">
        <img
          style={{
            transform: hover ? "scale(1.04)" : "scale(1)",
            transition: "all",
            transitionDuration: "0.7s",
          }}
          src={image}
          alt={title}
          className="w-full h-60 object-cover object-center"
        />

        <div
          style={{
            borderRadius: 3,
          }}
          className={`absolute -bottom-2 left-0 right-0 bg-white p-1 shadow mx-5 text-[#000]  ${
            hover ? "opacity-0" : "opacity-100"
          } transition-all duration-500 `}
        >
          <p className="text-center text-gray-600">
            {end
              ? "Đấu giá kết thúc"
              : status === "comming"
              ? "Thời gian chờ diễn ra"
              : "Thời gian đấu giá"}
          </p>

          {!isEnd && (
            <div className="flex justify-between items-center">
              {time?.map((time: any, index: any) => (
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
          )}
        </div>
      </div>

      <div className="p-4 pb-0 flex flex-col justify-center items-center text-gray-600">
        <div className="flex justify-center my-2">{getStatus()}</div>
        <h3 className="text-lg font-semibold">{shortTxt(20, title)}</h3>
        <p className="text-gray-600">{"Đây là đấu giá kín"}</p>
        <p className="text-blue-500 font-bold">
          <span className="text-gray-600 font-normal">Giá khởi điểm : </span>
          {formatPriceVND(auction.Price)}
        </p>
      </div>
      {auction?.isRegisted && (
        <p className="text-center text-sm text-green-500 mb-2">
          Đã đăng kí đấu giá
        </p>
      )}
      <div className="flex justify-center gap-3 pb-4 mt-4">
        {!auction?.isMine && !auction?.isRegisted && status == "comming" && (
          <ButtonIcon
          txt={"Đăng ký đấu giá"}
            onClick={(e: any) => {
              e.stopPropagation();
              register(
                auction?.AuctionItemID,
                Math.floor((auction?.Price * 10) / 100)
              );
            }}
            svg="coin3.svg"
            tooltip="Đăng ký đấu giá"
            className=" bg-white text-white p-2 rounded-full shadow-xl"
          ></ButtonIcon>
        )}
        {auction?.isMine && (
          <ButtonIcon
          txt={"Danh sách đăng ký"}
            onClick={(e: any) => {
              e.stopPropagation();
              setOpenModal(true);
              setCurrentId(auction?.AuctionItemID);
            }}
            svg="user-list.svg"
            tooltip="Danh sách người đăng ký"
            className=" bg-white text-white p-2 rounded-full shadow-xl"
          ></ButtonIcon>
        )}
      </div>
      <NcModal
        isOpenProp={openModal}
        onCloseModal={() => {
          setOpenModal(false);
          setCurrentId(auction?.AuctionItemID);
          setListUser([]);
        }}
        renderContent={() => <ListUserRegisrer id={currentId} />}
        modalTitle="Danh sách người đăng kí đấu giá"
      />
    </div>
  );
};

const ListAu = ({ auctions, register, moneyDaugia }: any) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {auctions.map((auction: any, index: any) => (
          <AuctionCard
            register={register}
            auction={auction}
            key={index}
            moneyDaugia={moneyDaugia}
            {...auction}
          />
        ))}
      </div>
    </div>
  );
};

export default ListAu;
