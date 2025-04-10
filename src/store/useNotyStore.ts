import { create } from "zustand";
import { persist } from "zustand/middleware";

const useNotyStore = create(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (notification: any) =>
        set((state: any) => ({
          notifications: !state.notifications.find(
            (i: any) => i.NotificationID == notification.NotificationID
          )
            ? [notification, ...state.notifications]
            : [...state.notifications],
        })),
      setNotification: (notification: any) =>
        set((state: any) => ({
          notifications: [...notification],
        })),
    }),

    {
      name: "notifications-storage sale",
    }
  )
);

export default useNotyStore;
