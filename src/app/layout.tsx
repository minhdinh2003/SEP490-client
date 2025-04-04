"use client";
import SiteHeader from "@/app/SiteHeader";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.css";
import http from "@/http/http";
import ToastProvider from "@/provider/ToastProvider";
import Footer from "@/shared/Footer/Footer";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import useMessageStore from "@/store/useMessStore";
import useNotyStore from "@/store/useNotyStore";
import "@/styles/index.scss";
import { Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
import "rc-slider/assets/index.css";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import CommonClient from "./CommonClient";
import "./globals.scss";
import { Raleway, Roboto } from "next/font/google";
import UserService from "@/http/userService";
import { IPagingParam } from "@/contains/paging";
const roboto = Roboto({
  weight: ["400", "700", "500"],
  // style: ['normal', 'italic'],
  subsets: ["vietnamese"],
  // display: 'swap',
});

export let socket: any;
export const connectionID = uuidv4();

// const poppins = Poppins({
//   subsets: ["latin"],
//   display: "swap",
//   weight: ["300", "400", "500", "600", "700"],
// });

function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const userStore = useAuthStore() as any;
  const messStore = useMessageStore() as any;
  const idRoom = messStore?.idRoom;

  const user: any = userStore?.user;
  const { getListCart } = useCartStore();
  const notyStore: any = useNotyStore();
  const { addNotification, notifications, setNotification } = notyStore;

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");
    if (isLogin === "true") {
      userStore.getInfoUser();
      getListCart();
    }
  }, []);
  useEffect(() => {
    const param: IPagingParam = {
      pageSize: 1000,
      pageNumber: 1,
      conditions: [
        {
          key: "receiveId",
          condition: "equal",
          value: userStore?.user?.id,
        },
      ],
      searchKey: "",
      searchFields: [],
      includeReferences: {},
    };
    var res = UserService.post("/notification", param)
      .then((res: any) => {
        setNotification(res.data.data);
      })
      .catch(() => {});
  }, [user]);
  const pathname = usePathname();
  const listNotFootter = ["/auction-detail"];
  const isNotFooter = listNotFootter.some((path) => pathname.startsWith(path));
  // Noti

  const connectSocket = () => {
    const userID = user.id;
    const url = `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/${userID}/register?connectionId=${connectionID}`;
    const authToken = process.env.NEXT_PUBLIC_SOCKET_TOKEN!;
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
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);
        socket.on("connect", () => {
          console.log("Connected to server");
          socket.emit("register", userID, connectionID);
        });
        // nhận thông báo từ ng dùng
        socket.on("message", (message: any) => {
          //NotificationID
          const data = JSON.parse(message?.rawData || {});
          if (
            message.type == "PRODUCT_OWNER_CHAT_REQUEST" ||
            message.type == "USER_CHAT_REQUEST"
          ) {
            messStore?.addMessageFromNoty({
              ...message,
              message: data.message,
            });
          }

          if (
            !notifications.find(
              (i: any) => i.id == message.id
            )
          ) {
            addNotification(message);
          }
        });
      })
      .catch((error) => {
        console.error("Error registering user:", error);
      });
  };
  useEffect(() => {
    if (user && user.id) {
      connectSocket();
    }
    return () => {
      socket?.disconnect();
    };
  }, [user]);
  return (
    <html lang="en" dir="" className={roboto.className}>
      <body
        className={`bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200`}
      >
        <ToastContainer />
        <SiteHeader />
        <ToastProvider>{children}</ToastProvider>
        <CommonClient />
        {!isNotFooter && <Footer />}
      </body>
    </html>
  );
}
export default RootLayout;
