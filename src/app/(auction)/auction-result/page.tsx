"use client";
import http from "@/http/http";
import useAuthStore from "@/store/useAuthStore";
import { handleErrorHttp } from "@/utils/handleError";
import { dateFormat3, formatPriceVND, getUrlImage } from "@/utils/helpers";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ResultCard from "./ResutCard";
// import { FaBroadcastTower } from 'react-icons/fa';

const AuctionListResult = () => {
  const userStore: any = useAuthStore() as any;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [list, setList] = useState<any>([]);
  const user: any = userStore?.user;

  const getAuList = async () => {
    try {
      const res: any = await http.get(`Auction/ResultByUserID?userID=${user?.UserID}&status=-1`);
      const data = res?.payload.Data?.Data?.slice()
      setList(
        data?.filter(
          (i: any) => i.WinnerUserID == user?.UserID
        )
      );
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  useEffect(() => {
    getAuList();
  }, [user?.UserID]);

  return (
    <div className="container mx-auto px-4 py-8">
      {list?.map((auction: any) => (
        
       <ResultCard auction={auction} />
      ))}
    </div>
  );
};

export default AuctionListResult;
