"use client";

import { Popover, Transition } from "@/app/headlessui";
import { avatarImgs } from "@/contains/fakeData";
import { Fragment } from "react";
import Avatar from "@/shared/Avatar/Avatar";
import SwitchDarkMode2 from "@/shared/SwitchDarkMode/SwitchDarkMode2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOutAction } from "@/actions/Actions";
import useAuthStore from "@/store/useAuthStore";
import useNotyStore from "@/store/useNotyStore";
import { dateFormat3, renderMessage } from "@/utils/helpers";
import { handleErrorHttp } from "@/utils/handleError";
import http from "@/http/http";

export default function NotyDropdown() {
  const router = useRouter();
  const { user } = useAuthStore() as any;
  const { notifications ,setNotification} = useNotyStore() as any;
  //
  const renderListNoty = (close:any) => {
    if (notifications?.length === 0) {
      return (
        <div>
          <div className="h-[100px] text-center">Ko có thông báo nào</div>
        </div>
      );
    }
    return notifications.map((noty: any,index:number) => {
      const { message, path } = renderMessage(noty) as any;
      const date = noty.CreatedDate;
      return (
        <>
          <div onClick={( ) => {
            router.push(path);
            close()
          }} className="flex items-center space-x-3 hover:bg-gray-400 cursor-pointer p-4">
            <div className="flex-grow">
              <p className="text-md mt-0.5">{message}</p>
              <div className="text-right text-xs mt-1">{dateFormat3(date)}</div>
            </div>
          </div>

         {
          index<notifications.length - 1 &&  <div  className="w-full border-b border-neutral-200 dark:border-neutral-700" />
         }
        </>
      );
    });
  };
  const countNoty = notifications?.filter((i: any) => !i.IsViewed)?.length;
  const viewdNoty = async() => {
    try {
      await http.put("User/notification/view",notifications.map((i:any) => i.NotificationID));
      setNotification(notifications.map((i:any) => ({...i,IsViewed:true})))
    } catch (error:any) {
      handleErrorHttp(error?.payload)
    }
  }
  return (
    <div  className="AvatarDropdown ">
      <Popover  className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
            onClick={viewdNoty}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none flex items-center justify-center`}
            >
              <img  src="/noty4.svg" className="w-7 h-7" />
              {countNoty > 0 && (
                <div className=" w-5 h-5  flex items-center justify-center bg-primary-500 absolute top-[4px] right-1.5 rounded-full text-[10px] leading-none text-white font-medium">
                  <span className="mt-[1px]">{countNoty}</span>
                </div>
              )}
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-[400px]  mt-3.5 -right-10 sm:right-0 sm:px-0">
                <div className="overflow-hidden  shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid grid-cols-1 bg-white dark:bg-neutral-800 max-h-[500px] overflow-auto chat-box ">
                    {renderListNoty(close)}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
