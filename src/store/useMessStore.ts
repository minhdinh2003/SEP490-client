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
          const data = JSON.parse(message?.RawData || {});
          if (
            message.Type == "Customer_SendMessage_Request" ||
            message.Type == "Creator_SendMessage_Request"
          ) {
            if (data.ProductRequestID == state?.idRoom) {
              set((state: any) => ({
                messages: [...state.messages, { ...message, Content: data.Message }],
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
    }),
    {
      name: "messages-storage",
    }
  )
);

export default useMessageStore;
