"use client";
import WithHydration from "@/HOC/withHydration";
import http from "@/http/http";
import useAuthStore from "@/store/useAuthStore";
import useMessageStore from "@/store/useMessStore";
import React, { useEffect, useState } from "react";
import ChatService from "@/http/chatService";
import { IPagingParam } from "@/contains/paging";
import { ServiceResponse } from "@/type/service.response";

const ModalMessage = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  idRequest,
}: any) => {
  const [newMessage, setNewMessage] = useState("");
  const messStore: any = useMessageStore();
  const userStore: any = useAuthStore();
  let listMessage = messStore?.messages || [];
  listMessage = listMessage.map((i: any) => ({
    ...i,
    isMine: i.isMine !== true ? i.senderId == userStore?.user?.id : true,
  }));
  useEffect(() => {
    if (idRequest) {
      getMess();
    }
  }, [idRequest]);
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await ChatService.post("", {
          requestId: idRequest,
          message: newMessage,
          senderId: userStore?.user?.id,
        });

        messStore?.addMessage({
          message: newMessage,
          isMine: true,
        });
        setNewMessage("");
      } catch (error) {}
    }
  };

  const getMess = async () => {
    try {
      const param: IPagingParam = {
        pageSize: 1000,
        pageNumber: 1,
        conditions: [
          {
            key: "requestId",
            condition: "equal",
            value: idRequest,
          },
          {
            key: "isNormal",
            condition: "equal",
            value: false,
          }
        ],
        searchKey: "",
        searchFields: [],
        includeReferences: {
          sender: true,
        },
      };
      const res = await ChatService.getPaging<ServiceResponse>(param);
      messStore?.setMessages(res.data.data);
    } catch (error) {}
  };
  useEffect(() => {
    const chatContainer: any = document.getElementById("request-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [listMessage?.length]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-1/2 rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">Trao đổi về sản phẩm</h2>

          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✖
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-96" id={"request-container"}>
          {listMessage.map((message: any, index: number) => (
            <div
              key={index}
              className={`flex mb-4 ${
                message.isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg max-w-[350px] ${
                  message.isMine
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p>{message.message}</p>
              </div>
              {/* <p className="text-xs text-gray-500">{dateFormat3(message.CreatedDate)}</p> */}
            </div>
          ))}
        </div>
        <div className="border-t p-4 flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
            placeholder="Nhập tin nhắn..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white p-2 rounded-r-lg"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithHydration(ModalMessage);
