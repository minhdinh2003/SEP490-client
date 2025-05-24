import React, { useState, useEffect, useRef } from "react";
import { IoMdChatbubbles } from "react-icons/io"; // Biểu tượng chat
import { IPagingParam } from "@/contains/paging";
import chatService from "@/http/chatService";
import { ServiceResponse } from "@/type/service.response";
import useAuthStore from "@/store/useAuthStore";
import { eventEmitter } from "@/utils/eventEmitter";

const CustomerChat = () => {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng box chat
  const [messages, setMessages] = useState<any[]>([]); // Danh sách tin nhắn
  const [unreadCount, setUnreadCount] = useState(0); // Số lượng tin nhắn chưa đọc
  const [inputMessage, setInputMessage] = useState(""); // Nội dung tin nhắn nhập vào
  const userStorage: any = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref để cuộn xuống

  // Fetch tin nhắn từ server
  const fetchMessages = async () => {
    try {
      const param: IPagingParam = {
        pageSize: 1000,
        pageNumber: 1,
        conditions: [
          {
            key: "any",
            condition: "raw",
            value: {
              AND: [
                { isNormal: true },
                {
                  OR: [
                    { senderId: userStorage?.user?.id },
                    { receiveId: userStorage?.user?.id },
                  ],
                },
              ],
            },
          },
        ],
        searchKey: "",
        searchFields: [],
        includeReferences: {
          sender: true,
        },
      };
      const res = await chatService.getPaging<ServiceResponse>(param);
      const data = res?.data.data || [];

      // Lọc tin nhắn chưa đọc
      const unreadMessages = data.filter((msg: any) => !msg.isRead);
      setUnreadCount(unreadMessages.length);

      // Lưu danh sách tin nhắn vào state
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Mark all messages as read
  const markAsRead = async () => {
    try {
      await chatService.post("/markAsRead", {
        receiveId: userStorage?.user?.id,
      }); // Đánh dấu tất cả tin nhắn là đã đọc
      setUnreadCount(0); // Reset số lượng tin nhắn chưa đọc
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Xử lý gửi tin nhắn
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      const newMessage = {
        message: inputMessage, // Nội dung tin nhắn
        isRead: false, // Tin nhắn chưa đọc
        senderId: userStorage?.user?.id,
        requestId: -1,
        isNormal: true,
        receiveId: -1,
      };

      // Gửi tin nhắn lên server
      await chatService.post("/sendMessageToOwner", newMessage);

      // Cập nhật danh sách tin nhắn trong state
      setMessages((prev) => [
        ...prev,
        {
          ...newMessage,
          createdAt: new Date().toISOString(), // Thời gian gửi tin nhắn
        },
      ]);

      // Xóa nội dung trong ô nhập liệu
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Load tin nhắn khi component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Cuộn xuống dưới khi có tin nhắn mới hoặc mở box chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Đóng chat khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const chatBox = document.querySelector(".chat-box");
      const chatIcon = document.querySelector(".chat-icon");

      if (
        isOpen &&
        chatBox &&
        !chatBox.contains(event.target as Node) &&
        !(chatIcon && chatIcon.contains(event.target as Node))
      ) {
        setIsOpen(false); // Đóng chat nếu click ra ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Xử lý khi click vào biểu tượng chat
  const handleChatIconClick = () => {
    setIsOpen(!isOpen); // Toggle trạng thái mở/đóng box chat
    if (!isOpen) {
      markAsRead(); // Đánh dấu tin nhắn là đã đọc khi mở box chat
    }
  };
  useEffect(() => {
    const handleMessage = async (data: any) => {
      const senderId = data.senderId;

      // Fetch tin nhắn mới cho người gửi (nếu cần)
      try {
        await fetchMessages(); // Gọi fetchMessages mà không cần tham số senderId
      } catch (error) {
        console.error("Error fetching messages:", error);
      }

      // Cập nhật số lượng tin nhắn chưa đọc
      setUnreadCount((prevCount) => prevCount + 1);

      // Scroll xuống cuối sau khi nhận tin nhắn mới
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // Delay nhẹ để đảm bảo DOM đã được cập nhật
    };

    eventEmitter.on("newChatOwner", handleMessage);

    return () => {
      eventEmitter.off("newChatOwner", handleMessage);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Icon */}
      <div
        className="relative cursor-pointer bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all chat-icon"
        onClick={handleChatIconClick}
      >
        <IoMdChatbubbles className="text-3xl text-blue-500" />
        {unreadCount > 0 && (
          <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {unreadCount}
          </div>
        )}
      </div>

      {/* Box Chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl overflow-hidden chat-box">
          {/* Header */}
          <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
            <span>Hỗ trợ mua sản phẩm</span>
            <button
              className="text-white hover:text-gray-200"
              onClick={() => setIsOpen(false)}
            >
              X
            </button>
          </div>

          {/* Messages List */}
          <div className="h-80 overflow-y-auto p-4">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    msg.senderId === userStorage?.user?.id
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block max-w-[70%] p-2 rounded-lg ${
                      msg.senderId === userStorage?.user?.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {msg.message}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.senderId === userStorage?.user?.id
                        ? "text-right text-gray-500"
                        : "text-left text-gray-500"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Không có tin nhắn</p>
            )}
            {/* Phần tử tham chiếu để cuộn xuống */}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input Field */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                onClick={handleSendMessage}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerChat;
