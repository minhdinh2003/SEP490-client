"use client";
import WithHydration from "@/HOC/withHydration";
import http from "@/http/http";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import NcModal from "@/shared/NcModal/NcModal";
import Radio from "@/shared/Radio/Radio";
import useAuthStore from "@/store/useAuthStore";
import { handleErrorHttp } from "@/utils/handleError";
import { dateFormat3, formatPriceVND, getUrlImage } from "@/utils/helpers";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ListAu from "./ListAuction";
import TabAu from "./TabListAu";
// import { FaBroadcastTower } from 'react-icons/fa';

const AuctionList = () => {
  const userStore: any = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);

  const searchParams = useSearchParams();
  const paySuccess = searchParams.get("paySuccess");
  const router = useRouter();
  const [moneyDaugia,setMoneuDauGia] = useState(0)
  const [dataRegister, setDataRegister] = useState({
    AuctionItemID: 1007,
    DepositAmount: 1000000,
    BankCode: "",
    Lang: "vn",
    PaymentMethod: "0", // 0: bankonline , 1: Coin
    Email: userStore?.user?.Email,
  });
  useEffect(() => {
    setDataRegister({
      ...dataRegister,
      Email: userStore?.user?.Email,
    });
  }, [userStore?.user?.Email]);
  const [openModal, setOpenModal] = useState(false);
  const [list, setList] = useState<any>([]);
  const getAuList = async () => {
    try {
      const res: any = await http.post("/Auction/paging", {
        PageSize: 1000,
        PageNumber: 1,
        Filter: " IsConfirmed = true ",
        SortOrder: " ModifiedDate desc ",
        SearchKey: "",
      });
      setList(res?.payload.Data?.Data);
      console.log(res);
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  useEffect(() => {
    getAuList();
  }, []);

  const compareDate = (AuctionStartTime: any, AuctionEndTime: any) => {
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

  // register
  const registerAuth = async () => {
    try {
      const res = await http.post("Auction/register", {...dataRegister,DepositAmount:moneyDaugia});
      if (dataRegister.PaymentMethod == "0") {
        const url = res.payload.Data;
        if (typeof window !== "undefined") {
          window.location.href = url;
        }
      } else {
        toast.success("Đăng ký thành công");
        getAuList();
        setOpenModal(false);
        userStore?.getInfoUser()
      }
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  // COntent register
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

  //
  let listComming = list.filter((i: any) => {
    return compareDate(i.AuctionStartTime, i.AuctionEndTime) == "comming";
  });
  let listLive = list.filter((i: any) => {
    return compareDate(i.AuctionStartTime, i.AuctionEndTime) == "live";
  });
  let listEnd = list.filter((i: any) => {
    return compareDate(i.AuctionStartTime, i.AuctionEndTime) == "end";
  });
  const finalList = activeTab == 0 ? listComming : activeTab == 1 ? listLive : listEnd;
  const auctions = finalList.map((item: any) => {
    return {
      image: getUrlImage(item?.ImageUrl).mainImage,
      title: item.Title || item.Name,
      isRegisted: item?.Registers?.find(
        (i: any) => i.Email == ((userStore as any)?.user as any)?.Email
      ),
      isMine:item?.UserID == userStore?.user?.UserID,
      ...item,
    };
  });
  return (
    <>
    <TabAu activeTab={activeTab} setActiveTab={setActiveTab} />
      <ListAu
        register={(id:any,money:any) => {
          setOpenModal(true);
          setDataRegister({
            ...dataRegister,
            AuctionItemID: id,
          });
          setMoneuDauGia(money)
        }}
        auctions={auctions}
        moneyDaugia={moneyDaugia}
      />
      <NcModal
        isOpenProp={openModal}
        onCloseModal={() => setOpenModal(false)}
        renderContent={() => renderContenRegister()}
        modalTitle="Đăng kí đấu giá"
      />
    </>
   
  );
};

export default WithHydration(AuctionList);
