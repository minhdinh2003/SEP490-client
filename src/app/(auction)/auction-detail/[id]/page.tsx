"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import http from "@/http/http";
import { handleErrorHttp } from "@/utils/handleError";
import { useParams, useRouter } from "next/navigation";
import { dateFormat4, formatPriceVND, getUrlImage } from "@/utils/helpers";
import { connectionID, socket } from "@/app/layout";
import useAuthStore from "@/store/useAuthStore";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";
import Winner from "@/shared/Winner/Winner";
import WinnerText from "@/shared/Winner/WinnerText";
import AuctionDetail from "./AuctionDetail";
import { toast } from "react-toastify";
import "react-notifications/lib/notifications.css";

const AuctionPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [winner, setWinner] = useState("");
  const [finalPrice, setFinalPrice] = useState("");

  const [isEnd, setIsEnd] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [detail, setDetail] = useState<any>();
  const router = useRouter();
  const { id } = useParams();
  const userStore = useAuthStore() as any;
  const userID = userStore?.user?.UserID;
  let countdown: any;
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    // let countdown;

    if (detail?.AuctionEndTime) {
      const endTime = new Date(detail?.AuctionEndTime).getTime();

      countdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance > 0) {
          const months = Math.floor(distance / (1000 * 60 * 60 * 24 * 30));
          const weeks = Math.floor(
            (distance % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24 * 7)
          );
          const days = Math.floor(
            (distance % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24)
          );
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setTimeLeft({ months, weeks, days, hours, minutes, seconds });
        } else {
          setIsEnd(true);
          clearInterval(countdown);
          // setTimeLeft("Auction ended");
        }
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [detail?.AuctionEndTime]);

  const handleBid = async (amount:any) => {
    try {
      await http.post("Auction/placeBid", {
        CreatedBy: userStore?.user?.FirstName + " " + userStore?.user?.LastName,
        CreatedDate: "2024-07-07T10:19:41.560Z",
        ModifiedBy:
          userStore?.user?.FirstName + " " + userStore?.user?.LastName,
        ModifiedDate: "2024-07-07T10:19:41.560Z",
        AuctionItemID: id,
        BidAmount: amount,
      });
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  // get Detail
  const getDetail = async () => {
    try {
      const res: any = await http.get(`Auction/${id}`);
      setDetail(res?.payload.Data);
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  useEffect(() => {
    getDetail();
  }, [id]);

  //

  useEffect(() => {
    if (isEnd && detail?.AuctionResult) {
    
      setFinalPrice(detail?.AuctionResult?.WinningBidAmount);
      setWinner(detail?.AuctionResult?.Email);
    } else {
      setTimeout(() => {
        http
          .get(`Auction/${id}`)
          .then((res: any) => {
            const data = res?.payload.Data;
            
            setFinalPrice(data?.AuctionResult?.WinningBidAmount);
            setWinner(data?.AuctionResult?.Email);
          })
          .catch(() => {});
      }, 500);
    }
  }, [isEnd, detail]);

  const [listBid, setListBid] = useState<any>([]);
  const getListBid = async () => {
    try {
      const res: any = await http.get(`Auction/placeBid?auctionID=${id}`);
      setListBid(res?.payload.Data?.Data?.reverse());
      console.log(res?.payload?.Data?.Data);
    } catch (error: any) {
      handleErrorHttp(error?.payload);
    }
  };
  useEffect(() => {
    if (id) {
      getListBid();
    }
  }, [id]);

  // Get BId

  useEffect(() => {
    if (detail?.AuctionEndTime) {
      const endTime = new Date(detail?.AuctionEndTime).getTime();

      const now = new Date().getTime();
      const distance = endTime - now;
      if (distance <= 0) {
        setIsEnd(true);
      }
    }
  }, [detail]);

  useEffect(() => {
    // const chatContainer: any = document.getElementById("bid-container");
    // chatContainer.scrollTop = chatContainer.scrollHeight;
    if (listBid?.length > 0) {
      const lastBid = listBid[listBid?.length - 1];
      setBidAmount(lastBid?.BidAmount);
    } else {
      setBidAmount( detail?.Price);
    }
  }, [listBid?.length, detail]);
  useEffect(() => {
    if (userID && id) {
      const connectionID = uuidv4();
      // register user
      const url = `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/${userID}/register?connectionId=${connectionID}`;
      const authToken = process.env.NEXT_PUBLIC_SOCKET_TOKEN!

      fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-AUTH-TOKEN": authToken,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response;
        })
        .then((data) => {
          const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);

          socket.on("connect", () => {
            socket.emit("register", userID, connectionID);
            socket.emit("joinAuction", id, userID, connectionID);
            // socket.emit('leaveAuction');
          });
          socket.on("bidUpdate", (message) => {
            setListBid((prev: any) => {
              const newList = [...prev];
              if (
                !newList.find(
                  (i) => i?.NotificationID == message?.NotificationID
                )
              ) {
                const data = JSON.parse(message?.RawData);
                newList.push({
                  NotificationID: message.NotificationID,
                  BidAmount: data?.BidAmount,
                  BidDateTime: message?.CreatedDate,
                  FullName: message?.SenderName,
                });
              }
              return newList;
            });
          });
        })
        .catch((error) => {
          console.error("Error registering user:", error);
        });
    }
  }, [userID, id]);

  if (!detail) return null;
  return (
    <>
      <AuctionDetail
        listBid={listBid}
        handleBid={handleBid}
        timeLeft={timeLeft}
        isEnd={isEnd}
        bidAmount={bidAmount}
        detail={detail}
        images={getUrlImage(detail?.ImageUrl)?.listImage}
        getDetail={getDetail}
      />
      {isEnd && winner == userStore?.user?.Email && <Winner />}
    </>
  );
};

export default AuctionPage;
