import { current } from "@reduxjs/toolkit";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useMessageStore = create(
  persist(
    (set,get) => ({
      messages: [],
      idRoom: null,
      addMessage: (message: any) =>
        set((state: any) => ({
          messages: [...state.messages, message],
        })),
        addMessageFromNoty: (message: any) => {
          const state:any = get();
          const data = JSON.parse(message?.rawData || {});
          if (
            message.type == "PRODUCT_OWNER_CHAT_REQUEST" ||
            message.type == "USER_CHAT_REQUEST"
          ) {
            if (data.requestId == state?.idRoom) {
              set((state: any) => ({
                messages: [...state.messages, { ...message, message: data.message }],
              }));
            }
          }
        },
      setMessages: (messages: any[]) =>
        set(() => ({
          messages: [...messages],
        })),
      setIdRoom: (id: any[]) =>
        set(() => ({
          idRoom: id,
        })),
      deleteMessage: (messageID: any) =>
        set((state: any) => ({
          messages: state.messages.filter(
            (message: any) => message.messageID !== messageID
          ),
        })),
        markAsRead: (roomId: string) =>
          set((state: any) => ({
            unreadCounts: { ...state.unreadCounts, [roomId]: 0 },
          })),
  
        // Cập nhật số lượng tin nhắn chưa đọc
        updateUnreadCount: (count: number) =>
          set((state: any) => ({
            unreadCounts: { ...state.unreadCounts },
          })), 
    }),
    {
      name: "messages-storage",
    }
  )
);

export default useMessageStore;
