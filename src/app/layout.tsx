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
const roboto = Roboto({
  weight: ['400', '700','500'],
  // style: ['normal', 'italic'],
  subsets: ['vietnamese'],
  // display: 'swap',
})

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
    http
      .get("User/notification")
      .then((res: any) => {
        setNotification(res.payload.Data);
      })
      .catch(() => {});
  }, [user]);
  const pathname = usePathname();
  const listNotFootter = ["/auction-detail"];
  const isNotFooter = listNotFootter.some((path) => pathname.startsWith(path));
  // Noti

  const connectSocket = () => {
    const userID = user.UserID;
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
          const data = JSON.parse(message?.RawData || {});
          if (
            message.Type == "Customer_SendMessage_Request" ||
            message.Type == "Creator_SendMessage_Request"
          ) {
            messStore?.addMessageFromNoty({
              ...message,
              Content: data.Message,
            });
          }

          if (
            !notifications.find(
              (i: any) => i.NotificationID == message.NotificationID
            )
          ) {
            addNotification(message);
          }
          socket.on("bidUpdate", (message: any) => {});
        });
      })
      .catch((error) => {
        console.error("Error registering user:", error);
      });
  };
  useEffect(() => {
    if (user && user.UserID) {
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
