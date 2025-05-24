import React, { useState, useEffect, useRef } from "react";
import { IoMdChatbubbles } from "react-icons/io";
import { IPagingParam } from "@/contains/paging";
import chatService from "@/http/chatService";
import { ServiceResponse } from "@/type/service.response";
import useAuthStore from "@/store/useAuthStore";
import { eventEmitter } from "@/utils/eventEmitter";

const OwnerChat = () => {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng box chat
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null); // Khách hàng đang chat
  const [messages, setMessages] = useState<any[]>([]); // Tin nhắn của cuộc trò chuyện hiện tại
  const [customers, setCustomers] = useState<any[]>([]); // Danh sách khách hàng đã chat
  const [searchQuery, setSearchQuery] = useState(""); // Tìm kiếm khách hàng
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const chatRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Ẩn chat interface
      }
    };

    // Thêm event listener khi mở chat
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup listener khi component unmount hoặc khi đóng chat
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Fetch danh sách khách hàng đã chat
  const fetchCustomers = async () => {
  try {
    const param: IPagingParam = {
      pageSize: 1000,
      pageNumber: 1,
      conditions: [],
      searchKey: "",
      searchFields: [],
      includeReferences: {
        sender: true,
      },
    };
    const res = await chatService.getPaging<ServiceResponse>(param);
    // Lọc chỉ lấy chat có requestId === -1
    const data = (res?.data.data || []).filter((msg: any) => msg.requestId === -1);

    // Nhóm tin nhắn theo customerId
    const groupedByCustomer = data.reduce((acc: { [key: string]: any[] }, msg: any) => {
      const userId = userStorage?.user?.id;

      if (msg.receiveId !== userId) {
        acc[msg.receiveId] = acc[msg.receiveId] || [];
        acc[msg.receiveId].push(msg);
      }
      if (msg.senderId !== userId) {
        acc[msg.senderId] = acc[msg.senderId] || [];
        acc[msg.senderId].push(msg);
      }
      return acc;
    }, {});

    const customerList = Object.keys(groupedByCustomer).map((customerId) => ({
      id: customerId,
      messages: groupedByCustomer[customerId],
      unreadCount: groupedByCustomer[customerId].filter(
        (msg: any) => !msg.isRead
      ).length,
      user: groupedByCustomer[customerId][0].sender,
    }));
    setCustomers(customerList);

    const unreadCountsMap = customerList.reduce(
      (acc, customer) => ({ ...acc, [customer.id]: customer.unreadCount }),
      {}
    );
    setUnreadCounts(unreadCountsMap);
  } catch (error) {
    console.error("Error fetching customers:", error);
  }
};
  const userStorage: any = useAuthStore();
  // Fetch tin nhắn của khách hàng được chọn
  const fetchMessages = async (customerId: string, ismark: boolean = true) => {
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
              { requestId: -1 }, // Thêm điều kiện này
              {
                OR: [
                  {
                    senderId: Number(customerId),
                    receiveId: userStorage?.user?.id,
                  },
                  {
                    receiveId: Number(customerId),
                    senderId: userStorage?.user?.id,
                  },
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
    if (ismark) {
      markAsRead(customerId);
    }
    setMessages(data);
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 100);
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

  // Mark all messages as read for a specific customer
  const markAsRead = async (customerId: string) => {
    try {
      await chatService.post("/markAsRead", { receiveId: customerId });
      setUnreadCounts((prev) => ({ ...prev, [customerId]: 0 }));
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Load danh sách khách hàng khi component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Xử lý khi chọn khách hàng
  const handleCustomerClick = (customer: any) => {
    setSelectedCustomer(customer);
    fetchMessages(customer?.user?.id);

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // Xử lý gửi tin nhắn mới
  const handleSendMessage = async (message: string) => {
    if (!selectedCustomer || !message.trim()) return;

    try {
      const newMessage = {
        // receiveId: userStorage?.user?.id, // Người nhận tin nhắn
        message: message, // Nội dung tin nhắn
        isRead: false, // Tin nhắn chưa đọc
        senderId: userStorage?.user?.id,
        requestId: -1,
        isNormal: true,
        receiveId: Number(selectedCustomer?.user.id),
      };
      await chatService.post("/sendMessageToUser", newMessage);
      // Cập nhật danh sách tin nhắn
      setMessages((prev) => [
        ...prev,
        {
          ...newMessage,
          createdAt: new Date().toISOString(),
        },
      ]);

      // Scroll xuống cuối sau khi thêm tin nhắn
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      }, 100); // Delay nhẹ để đảm bảo DOM đã được cập nhật
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const handleMessage = async (data: any) => {
      const senderId = data.senderId;
      if (customers.length === 0) {
        fetchCustomers();
        return;
      }
      // Fetch tin nhắn mới cho người gửi
      await fetchMessages(senderId, false);

      // Cập nhật số lượng tin nhắn chưa đọc
      setUnreadCounts((prevCounts) => ({
        ...prevCounts,
        [senderId]: (prevCounts[senderId] || 0) + 1, // Tăng số lượng tin nhắn chưa đọc
      }));
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      }, 100); // Delay nhẹ để đảm bảo DOM đã được cập nhật
    };

    eventEmitter.on("newChatUser", handleMessage);

    return () => {
      eventEmitter.off("newChatUser", handleMessage);
    };
  }, []);
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {" "}
      {/* Thêm z-index */}
      {/* Chat Icon */}
      <div
        className="relative cursor-pointer bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoMdChatbubbles className="text-3xl text-blue-500" />
        {Object.values(unreadCounts).some((count) => count > 0) && (
          <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {Object.values(unreadCounts).reduce((sum, count) => sum + count, 0)}
          </div>
        )}
      </div>
      {/* Chat Interface */}
      {isOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-10 right-4 w-[800px] h-[650px] bg-white rounded-lg shadow-xl overflow-hidden flex z-50" // Tăng kích thước và thêm z-index
        >
          {/* Sidebar */}
          <div className="w-2/4 border-r border-gray-200 p-4 overflow-y-auto">
            {" "}
            {/* Tăng kích thước sidebar */}
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="space-y-2">
              {customers
                .filter((customer) =>
                  customer.user.fullName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((customer) => (
                  <div
                    key={customer.id}
                    className={`relative flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                      selectedCustomer?.user?.id === customer.id
                        ? "bg-blue-100"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleCustomerClick(customer)}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 opacity-50"></div>
                        <img
                          src={customer.user.profilePictureURL || "/avt.svg"}
                          alt={customer.user.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </div>
                      {/* Số lượng tin nhắn chưa đọc */}
                      {unreadCounts[customer.id] > 0 && (
                        <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {unreadCounts[customer.id]}
                        </div>
                      )}
                    </div>

                    {/* Thông tin khách hàng */}
                    <div>
                      <p className="font-medium">{customer.user.fullName}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Chat Box */}
          <div className="w-3/4">
            {" "}
            {/* Tăng kích thước chat box */}
            {/* Header */}
            <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
              {selectedCustomer ? (
                <>
                  <div className="flex items-center gap-2">
                    <img
                          src={selectedCustomer?.user.profilePictureURL || "/avt.svg"}
                          alt={selectedCustomer?.user.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                    <span>{selectedCustomer?.user.fullName}</span>
                  </div>
                  <button
                    className="text-white hover:text-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    X
                  </button>
                </>
              ) : (
                <span>Chọn khách hàng để bắt đầu chat</span>
              )}
            </div>
            {/* Messages List */}
            <div
              className="h-[500px] overflow-y-auto p-4"
              ref={chatContainerRef}
            >
              {" "}
              {/* Tăng chiều cao danh sách tin nhắn */}
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      msg.senderId == selectedCustomer?.user?.id
                        ? "text-left"
                        : "text-right"
                    }`}
                  >
                    <div
                      className={`inline-block max-w-[70%] p-2 rounded-lg ${
                        msg.senderId == selectedCustomer?.user?.id
                          ? "bg-gray-200 text-black"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {msg.message}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        msg.senderId == selectedCustomer?.user?.id
                          ? "text-left text-gray-500"
                          : "text-right text-gray-500"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Không có tin nhắn</p>
              )}
            </div>
            {/* Input Field */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  id="chatInput" // Thêm id để dễ dàng truy cập
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    const input = document.getElementById(
                      "chatInput"
                    ) as HTMLInputElement; // Truy cập bằng id
                    if (input) {
                      handleSendMessage(input.value);
                      input.value = "";
                    }
                  }}
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerChat;